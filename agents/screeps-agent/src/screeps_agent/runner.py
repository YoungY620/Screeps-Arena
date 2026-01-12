"""Screeps Agent Runner - handles periodic inference and signal-triggered interrupts."""

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum, auto
from pathlib import Path
from typing import Any, Callable, Coroutine

from kimi_cli.app import KimiCLI
from kimi_cli.session import Session
from kimi_cli.wire.types import WireMessage

from .config import AgentAccount, RunnerConfig, ServerConfig
from .monitors.signal import SignalManager, SignalPriority, SignalRecord
from .prompts.base import PromptContext, ScreepsPromptManager
from .screeps_client import AccountConfig, GameState, ScreepsClient


class InferenceState(Enum):
    """Current state of inference."""
    IDLE = auto()
    RUNNING = auto()
    CANCELLING = auto()


@dataclass
class InferenceResult:
    """Result of an inference run."""
    
    completed: bool
    cancelled: bool
    messages: list[WireMessage]
    duration: float
    trigger: str  # "scheduled", "signal:<name>", "manual"
    error: str | None = None


class ScreepsAgentRunner:
    """
    Runner for a single Screeps AI agent.
    
    Handles:
    - Periodic inference every N seconds
    - Signal monitoring and triggered inference
    - Cancellation and restart of inference
    - Dynamic game data fetching (no hardcoded rooms/positions)
    """
    
    def __init__(
        self,
        agent_account: AgentAccount,
        server_config: ServerConfig,
        runner_config: RunnerConfig,
        prompt_manager: ScreepsPromptManager | None = None,
    ):
        self.agent = agent_account
        self.server = server_config
        self.config = runner_config
        self.prompt_manager = prompt_manager or ScreepsPromptManager()
        
        # Create Screeps client for this agent
        self.screeps_client = ScreepsClient(
            server_url=server_config.server_url,
            cli_port=server_config.cli_port,
            account=AccountConfig(
                username=agent_account.username,
                password=agent_account.password,
            ),
        )
        self.signal_manager = SignalManager()
        
        # KimiCLI instance (lazy init)
        self._kimi_cli: KimiCLI | None = None
        self._session: Session | None = None
        
        # State
        self._state = InferenceState.IDLE
        self._current_task: asyncio.Task | None = None
        self._cancel_event = asyncio.Event()
        self._stop_event = asyncio.Event()
        self._last_inference_time = 0.0
        self._last_state: GameState | None = None
        
        # Callbacks
        self._on_inference_start: list[Callable[[], Coroutine[Any, Any, None]]] = []
        self._on_inference_end: list[Callable[[InferenceResult], Coroutine[Any, Any, None]]] = []
        self._on_state_update: list[Callable[[GameState], Coroutine[Any, Any, None]]] = []
    
    @property
    def name(self) -> str:
        return self.agent.name
    
    @property
    def state(self) -> InferenceState:
        return self._state
    
    @property
    def is_running(self) -> bool:
        return self._state == InferenceState.RUNNING
    
    def on_inference_start(self, callback: Callable[[], Coroutine[Any, Any, None]]):
        """Register callback for inference start."""
        self._on_inference_start.append(callback)
    
    def on_inference_end(self, callback: Callable[[InferenceResult], Coroutine[Any, Any, None]]):
        """Register callback for inference end."""
        self._on_inference_end.append(callback)
    
    def on_state_update(self, callback: Callable[[GameState], Coroutine[Any, Any, None]]):
        """Register callback for game state updates."""
        self._on_state_update.append(callback)
    
    async def _get_kimi_cli(self) -> KimiCLI:
        """Get or create KimiCLI instance with the configured model."""
        if self._kimi_cli is None:
            if self._session is None:
                self._session = await Session.create()
            
            self._kimi_cli = await KimiCLI.create(
                self._session,
                yolo=self.config.yolo,
                model_name=self.agent.model,  # Use agent-specific model
            )
            
            # Inject custom tools
            await self._inject_custom_tools()
        
        return self._kimi_cli
    
    async def _inject_custom_tools(self):
        """Inject Screeps-specific tools into the KimiCLI toolset."""
        if self._kimi_cli is None:
            return
        
        from .tools.kimi_tools import create_screeps_tools
        
        toolset = self._kimi_cli.soul.agent.toolset
        tools = create_screeps_tools(
            signal_manager=self.signal_manager,
            screeps_client=self.screeps_client,
        )
        
        for tool in tools:
            toolset.add(tool)
    
    async def _build_context(self, game_state: GameState) -> PromptContext:
        """Build prompt context from dynamically fetched game state."""
        # Format room list
        room_list = ", ".join(game_state.owned_rooms) if game_state.owned_rooms else "No rooms"
        
        context = PromptContext(
            current_time=datetime.now().isoformat(),
            tick=game_state.tick,
            room_name=room_list,
            creep_count=len(game_state.creeps),
            creep_summary=self._format_creeps(game_state),
            spawn_status=self._format_spawns(game_state),
            structure_summary=self._format_structures(game_state),
            memory_snapshot=str(game_state.memory)[:500] if game_state.memory else "{}",
            console_logs="\n".join(game_state.console_logs[-10:]) if game_state.console_logs else "No recent logs",
            active_signals=self.signal_manager.format_active_signals(),
            triggered_signals=self.signal_manager.format_recent_triggers(),
        )
        
        # Extract controller info from dynamically fetched data
        for room_name, room_info in game_state.rooms.items():
            context.controller_level = room_info.get("level", 0)
            progress = room_info.get("progress", 0)
            total = room_info.get("progressTotal", 1)
            context.controller_progress = round(progress / total * 100, 1) if total else 0
            break  # Use first room for now
        
        # Extract energy info from spawns
        total_energy = 0
        total_capacity = 0
        for spawn_data in game_state.spawns.values():
            total_energy += spawn_data.get("store", {}).get("energy", 0)
            total_capacity += spawn_data.get("storeCapacityResource", {}).get("energy", 300)
        context.energy_available = total_energy
        context.energy_capacity = total_capacity
        
        # Add custom fields
        context.custom["agent_name"] = self.agent.name
        context.custom["model"] = self.agent.model or "default"
        context.custom["owned_rooms"] = game_state.owned_rooms
        
        return context
    
    def _format_creeps(self, state: GameState) -> str:
        """Format creep summary."""
        if not state.creeps:
            return "No creeps"
        
        by_role: dict[str, list[dict]] = {}
        for creep in state.creeps.values():
            role = creep.get("memory", {}).get("role", "unknown")
            by_role.setdefault(role, []).append(creep)
        
        lines = []
        for role, creeps in by_role.items():
            lines.append(f"  {role}: {len(creeps)}")
        
        return "\n".join(lines)
    
    def _format_spawns(self, state: GameState) -> str:
        """Format spawn status."""
        if not state.spawns:
            return "No spawns"
        
        lines = []
        for spawn in state.spawns.values():
            name = spawn.get("name", "unknown")
            room = spawn.get("room", "?")
            energy = spawn.get("store", {}).get("energy", 0)
            spawning = spawn.get("spawning")
            if spawning:
                lines.append(f"  {name} ({room}): Spawning, Energy: {energy}")
            else:
                lines.append(f"  {name} ({room}): Idle, Energy: {energy}")
        
        return "\n".join(lines)
    
    def _format_structures(self, state: GameState) -> str:
        """Format structure summary."""
        if not state.structures:
            return "No structures (besides spawns)"
        
        by_type: dict[str, int] = {}
        for struct in state.structures.values():
            stype = struct.get("type", "unknown")
            by_type[stype] = by_type.get(stype, 0) + 1
        
        return ", ".join(f"{t}: {c}" for t, c in sorted(by_type.items()))
    
    async def _run_inference(
        self,
        prompt: str,
        trigger: str,
    ) -> InferenceResult:
        """Run a single inference cycle."""
        start_time = time.time()
        messages: list[WireMessage] = []
        error: str | None = None
        cancelled = False
        
        try:
            self._state = InferenceState.RUNNING
            self._cancel_event.clear()
            
            for cb in self._on_inference_start:
                await cb()
            
            kimi = await self._get_kimi_cli()
            
            async for msg in kimi.run(
                prompt,
                self._cancel_event,
                merge_wire_messages=True,
            ):
                messages.append(msg)
                
                if self._cancel_event.is_set():
                    cancelled = True
                    break
        
        except asyncio.CancelledError:
            cancelled = True
        except Exception as e:
            error = str(e)
        finally:
            self._state = InferenceState.IDLE
        
        duration = time.time() - start_time
        
        result = InferenceResult(
            completed=not cancelled and error is None,
            messages=messages,
            cancelled=cancelled,
            duration=duration,
            trigger=trigger,
            error=error,
        )
        
        for cb in self._on_inference_end:
            await cb(result)
        
        return result
    
    async def cancel_current_inference(self) -> bool:
        """Cancel the currently running inference."""
        if self._state != InferenceState.RUNNING:
            return False
        
        self._state = InferenceState.CANCELLING
        self._cancel_event.set()
        
        if self._current_task and not self._current_task.done():
            try:
                await asyncio.wait_for(self._current_task, timeout=5.0)
            except asyncio.TimeoutError:
                self._current_task.cancel()
        
        return True
    
    async def trigger_immediate_inference(
        self,
        signal_record: SignalRecord | None = None,
    ) -> InferenceResult:
        """Trigger an immediate inference, cancelling any in progress."""
        if self._state == InferenceState.RUNNING:
            await self.cancel_current_inference()
        
        # Get fresh state (dynamically discovers rooms)
        state = await self.screeps_client.get_game_state()
        self._last_state = state
        
        context = await self._build_context(state)
        
        if signal_record:
            signal_def = self.signal_manager.get_signal(signal_record.signal_name)
            signal_data = {
                "signal_name": signal_record.signal_name,
                "signal_description": signal_def.description if signal_def else "",
                "trigger_condition": signal_record.condition_met,
                "current_value": str(signal_record.recorded_data),
                "recorded_data": str(signal_record.recorded_data),
            }
            prompt = self.prompt_manager.render_signal_prompt(context, signal_data)
            trigger = f"signal:{signal_record.signal_name}"
        else:
            prompt = self.prompt_manager.render_turn_prompt(context)
            trigger = "manual"
        
        return await self._run_inference(prompt, trigger)
    
    async def _signal_monitor_loop(self):
        """Background loop that monitors signals."""
        while not self._stop_event.is_set():
            try:
                # Get current game state (dynamic room discovery)
                state = await self.screeps_client.get_game_state()
                self._last_state = state
                
                for cb in self._on_state_update:
                    await cb(state)
                
                # Check signals
                triggered = await self.signal_manager.check_signals(state)
                
                for record in triggered:
                    if record.priority in (SignalPriority.CRITICAL, SignalPriority.HIGH):
                        signal = self.signal_manager.get_signal(record.signal_name)
                        if signal and signal.immediate_inference:
                            await self.cancel_current_inference()
                            if record.priority == SignalPriority.HIGH:
                                await asyncio.sleep(min(
                                    self.config.high_priority_delay,
                                    self.config.inference_interval / 2,
                                ))
                            self._current_task = asyncio.create_task(
                                self.trigger_immediate_inference(record)
                            )
            
            except asyncio.CancelledError:
                break
            except Exception:
                pass
            
            try:
                await asyncio.wait_for(
                    self._stop_event.wait(),
                    timeout=self.config.signal_check_interval,
                )
                break
            except asyncio.TimeoutError:
                pass
    
    async def _scheduled_inference_loop(self):
        """Background loop that runs periodic inference."""
        while not self._stop_event.is_set():
            try:
                time_since_last = time.time() - self._last_inference_time
                wait_time = max(0, self.config.inference_interval - time_since_last)
                
                if wait_time > 0:
                    try:
                        await asyncio.wait_for(
                            self._stop_event.wait(),
                            timeout=wait_time,
                        )
                        break
                    except asyncio.TimeoutError:
                        pass
                
                if self._state == InferenceState.RUNNING:
                    continue
                
                # Get current game state (dynamic room discovery)
                state = await self.screeps_client.get_game_state()
                self._last_state = state
                
                context = await self._build_context(state)
                prompt = self.prompt_manager.render_turn_prompt(context)
                
                self._last_inference_time = time.time()
                self._current_task = asyncio.create_task(
                    self._run_inference(prompt, "scheduled")
                )
                await self._current_task
            
            except asyncio.CancelledError:
                break
            except Exception:
                pass
    
    async def start(self):
        """Start the agent runner."""
        # Connect to Screeps and discover rooms
        await self.screeps_client.connect()
        await self.screeps_client.discover_rooms()
        
        # Initialize KimiCLI
        await self._get_kimi_cli()
        
        self._stop_event.clear()
        
        asyncio.create_task(self._signal_monitor_loop())
        asyncio.create_task(self._scheduled_inference_loop())
    
    async def stop(self):
        """Stop the agent runner."""
        self._stop_event.set()
        await self.cancel_current_inference()
        await self.screeps_client.close()
    
    async def run_once(self) -> InferenceResult:
        """Run a single inference cycle (for testing)."""
        await self.screeps_client.connect()
        
        try:
            await self._get_kimi_cli()
            
            state = await self.screeps_client.get_game_state()
            self._last_state = state
            
            context = await self._build_context(state)
            prompt = self.prompt_manager.render_turn_prompt(context)
            
            return await self._run_inference(prompt, "manual")
        finally:
            await self.screeps_client.close()
