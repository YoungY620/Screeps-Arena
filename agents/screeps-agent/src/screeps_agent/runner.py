"""Screeps Agent Runner - handles periodic inference and signal-triggered interrupts."""

from __future__ import annotations

import asyncio
import json
import time
import uuid
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
from .observability import InferenceLogger, get_logger_for_agent
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
    
    session_id: str  # Unique ID for this inference session
    completed: bool
    cancelled: bool
    messages: list[WireMessage]
    duration: float
    trigger: str  # "scheduled", "signal:<name>", "manual"
    error: str | None = None
    code_uploaded: str | None = None  # Screeps code that was uploaded


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
        
        # Observability - each agent gets its own database
        self.logger = get_logger_for_agent(agent_account.name)
        
        # KimiCLI instance (lazy init)
        self._kimi_cli: KimiCLI | None = None
        self._session: Session | None = None
        
        # State
        self._state = InferenceState.IDLE
        self._current_session_id: str | None = None
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
        game_state: GameState | None = None,
        system_prompt: str | None = None,
    ) -> InferenceResult:
        """Run a single inference cycle with full observability logging."""
        start_time = time.time()
        messages: list[WireMessage] = []
        error: str | None = None
        cancelled = False
        code_uploaded: str | None = None
        
        # Generate unique session ID
        session_id = f"{self.agent.name}_{int(time.time())}_{uuid.uuid4().hex[:8]}"
        self._current_session_id = session_id
        
        # Start logging session
        game_tick = game_state.tick if game_state else None
        game_state_dict = {
            "tick": game_state.tick,
            "owned_rooms": game_state.owned_rooms,
            "creep_count": len(game_state.creeps),
            "spawn_count": len(game_state.spawns),
        } if game_state else None
        
        self.logger.start_session(
            session_id=session_id,
            trigger=trigger,
            game_tick=game_tick,
            system_prompt=system_prompt,
            user_prompt=prompt,
            game_state=game_state_dict,
        )
        
        # Log the user prompt
        self.logger.log_message(session_id, "user", prompt)
        
        try:
            self._state = InferenceState.RUNNING
            self._cancel_event.clear()
            
            for cb in self._on_inference_start:
                await cb()
            
            kimi = await self._get_kimi_cli()
            step_count = 0
            
            async for msg in kimi.run(
                prompt,
                self._cancel_event,
                merge_wire_messages=True,
            ):
                messages.append(msg)
                step_count += 1
                
                # Log the message based on its type
                self._log_wire_message(session_id, msg, step_count)
                
                # Track if code was uploaded
                if hasattr(msg, 'tool_use') and msg.tool_use:
                    for tool in msg.tool_use:
                        if tool.name == "WriteFile" and "screeps" in str(tool.input).lower():
                            code_uploaded = str(tool.input.get("content", ""))[:1000]
                
                if self._cancel_event.is_set():
                    cancelled = True
                    break
        
        except asyncio.CancelledError:
            cancelled = True
        except Exception as e:
            error = str(e)
        finally:
            self._state = InferenceState.IDLE
            self._current_session_id = None
        
        duration = time.time() - start_time
        
        # Extract final response from messages
        final_response = self._extract_final_response(messages)
        
        # End logging session
        status = "cancelled" if cancelled else ("failed" if error else "completed")
        self.logger.end_session(
            session_id=session_id,
            status=status,
            final_response=final_response,
            code_uploaded=code_uploaded,
            error_message=error,
        )
        
        result = InferenceResult(
            session_id=session_id,
            completed=not cancelled and error is None,
            messages=messages,
            cancelled=cancelled,
            duration=duration,
            trigger=trigger,
            error=error,
            code_uploaded=code_uploaded,
        )
        
        for cb in self._on_inference_end:
            await cb(result)
        
        return result
    
    def _log_wire_message(self, session_id: str, msg: WireMessage, step: int) -> None:
        """Log a WireMessage to the observability database."""
        try:
            # Handle thinking/reasoning content
            if hasattr(msg, 'thinking') and msg.thinking:
                for block in msg.thinking:
                    if hasattr(block, 'thinking') and block.thinking:
                        self.logger.log_thinking(session_id, block.thinking)
            
            # Handle text content (assistant message)
            if hasattr(msg, 'content') and msg.content:
                for block in msg.content:
                    if hasattr(block, 'text') and block.text:
                        self.logger.log_message(session_id, "assistant", block.text)
            
            # Handle tool use
            if hasattr(msg, 'tool_use') and msg.tool_use:
                for tool in msg.tool_use:
                    tool_input = {}
                    if hasattr(tool, 'input'):
                        tool_input = tool.input if isinstance(tool.input, dict) else {"raw": str(tool.input)}
                    self.logger.log_tool_call(
                        session_id=session_id,
                        tool_name=tool.name,
                        tool_input=tool_input,
                    )
            
            # Handle tool results
            if hasattr(msg, 'tool_result') and msg.tool_result:
                for result in msg.tool_result:
                    output = ""
                    error = None
                    if hasattr(result, 'content'):
                        if isinstance(result.content, str):
                            output = result.content
                        elif isinstance(result.content, list):
                            output = "\n".join(str(c) for c in result.content)
                    if hasattr(result, 'is_error') and result.is_error:
                        error = output
                        output = None
                    self.logger.log_tool_result(
                        session_id=session_id,
                        tool_name=getattr(result, 'tool_use_id', 'unknown'),
                        output=output,
                        error=error,
                    )
        except Exception:
            # Don't let logging errors break inference
            pass
    
    def _extract_final_response(self, messages: list[WireMessage]) -> str | None:
        """Extract the final text response from messages."""
        for msg in reversed(messages):
            if hasattr(msg, 'content') and msg.content:
                for block in msg.content:
                    if hasattr(block, 'text') and block.text:
                        return block.text[:2000]  # Limit length
        return None
    
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
        
        return await self._run_inference(prompt, trigger, game_state=state)
    
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
                    self._run_inference(prompt, "scheduled", game_state=state)
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
            
            return await self._run_inference(prompt, "manual", game_state=state)
        finally:
            await self.screeps_client.close()
