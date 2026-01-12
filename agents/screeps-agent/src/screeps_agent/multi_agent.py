"""Multi-Agent Manager - runs multiple agents in parallel."""

from __future__ import annotations

import asyncio
from dataclasses import dataclass
from datetime import datetime
from typing import Any, Callable, Coroutine

from .config import MultiAgentConfig, ServerConfig
from .monitors.signal import SignalDefinition, SignalPriority
from .prompts.base import PromptTemplate, ScreepsPromptManager
from .runner import InferenceResult, ScreepsAgentRunner


@dataclass
class AgentStatus:
    """Status of a single agent."""
    
    name: str
    model: str | None
    is_running: bool
    last_inference_time: float
    last_inference_duration: float
    last_inference_trigger: str
    owned_rooms: list[str]
    creep_count: int
    error: str | None = None


class MultiAgentManager:
    """
    Manages multiple Screeps agents running in parallel.
    
    Each agent:
    - Has its own account credentials
    - Uses its own configured model
    - Dynamically discovers its owned rooms
    - Runs independent inference loops
    """
    
    def __init__(self, config: MultiAgentConfig):
        self.config = config
        self._runners: dict[str, ScreepsAgentRunner] = {}
        self._tasks: dict[str, asyncio.Task] = {}
        self._stop_event = asyncio.Event()
        
        # Shared prompt manager (can be customized per agent if needed)
        self._prompt_manager = self._create_prompt_manager()
        
        # Callbacks
        self._on_agent_inference_start: list[Callable[[str], Coroutine[Any, Any, None]]] = []
        self._on_agent_inference_end: list[Callable[[str, InferenceResult], Coroutine[Any, Any, None]]] = []
    
    def _create_prompt_manager(self) -> ScreepsPromptManager:
        """Create prompt manager with optional custom templates."""
        manager = ScreepsPromptManager()
        
        if self.config.system_prompt:
            manager.system_template = PromptTemplate(
                self.config.system_prompt,
                name="custom_system",
            )
        
        if self.config.turn_prompt_template:
            manager.turn_template = PromptTemplate(
                self.config.turn_prompt_template,
                name="custom_turn",
            )
        
        return manager
    
    def _setup_initial_monitors(self, runner: ScreepsAgentRunner):
        """Set up initial monitors from config."""
        priority_map = {
            "low": SignalPriority.LOW,
            "normal": SignalPriority.NORMAL,
            "high": SignalPriority.HIGH,
            "critical": SignalPriority.CRITICAL,
        }
        
        for monitor in self.config.initial_monitors:
            signal_def = SignalDefinition(
                name=monitor["name"],
                description=monitor.get("description", ""),
                condition=monitor["condition"],
                record_fields=monitor.get("record_fields", ["tick", "creeps"]),
                priority=priority_map.get(monitor.get("priority", "normal"), SignalPriority.NORMAL),
                one_shot=monitor.get("one_shot", False),
                cooldown=monitor.get("cooldown", 0.0),
                immediate_inference=monitor.get("immediate_inference", False),
            )
            runner.signal_manager.add_signal(signal_def)
    
    async def _create_runner(self, agent_account) -> ScreepsAgentRunner:
        """Create a runner for a single agent."""
        runner = ScreepsAgentRunner(
            agent_account=agent_account,
            server_config=self.config.server,
            runner_config=self.config.runner,
            prompt_manager=self._prompt_manager,
        )
        
        # Set up initial monitors
        self._setup_initial_monitors(runner)
        
        # Register callbacks
        agent_name = agent_account.name
        
        async def on_start():
            for cb in self._on_agent_inference_start:
                await cb(agent_name)
        
        async def on_end(result: InferenceResult):
            for cb in self._on_agent_inference_end:
                await cb(agent_name, result)
        
        runner.on_inference_start(on_start)
        runner.on_inference_end(on_end)
        
        return runner
    
    def on_agent_inference_start(self, callback: Callable[[str], Coroutine[Any, Any, None]]):
        """Register callback for when any agent starts inference."""
        self._on_agent_inference_start.append(callback)
    
    def on_agent_inference_end(self, callback: Callable[[str, InferenceResult], Coroutine[Any, Any, None]]):
        """Register callback for when any agent ends inference."""
        self._on_agent_inference_end.append(callback)
    
    async def start_all(self):
        """Start all agents in parallel."""
        print(f"\n{'=' * 60}")
        print(f"🚀 Starting {len(self.config.agents)} agents...")
        print(f"{'=' * 60}\n")
        
        for agent_account in self.config.agents:
            print(f"  [{agent_account.name}] Creating runner (model: {agent_account.model or 'default'})...")
            
            runner = await self._create_runner(agent_account)
            self._runners[agent_account.name] = runner
            
            # Start the runner
            await runner.start()
            print(f"  [{agent_account.name}] ✓ Started, owns rooms: {runner.screeps_client._owned_rooms}")
        
        print(f"\n{'=' * 60}")
        print(f"✅ All agents started")
        print(f"{'=' * 60}\n")
    
    async def stop_all(self):
        """Stop all agents."""
        print(f"\n{'=' * 60}")
        print(f"🛑 Stopping all agents...")
        print(f"{'=' * 60}\n")
        
        self._stop_event.set()
        
        for name, runner in self._runners.items():
            print(f"  [{name}] Stopping...")
            await runner.stop()
            print(f"  [{name}] ✓ Stopped")
        
        self._runners.clear()
        
        print(f"\n{'=' * 60}")
        print(f"✅ All agents stopped")
        print(f"{'=' * 60}\n")
    
    def get_agent_status(self, name: str) -> AgentStatus | None:
        """Get status of a specific agent."""
        runner = self._runners.get(name)
        if not runner:
            return None
        
        last_state = runner._last_state
        
        return AgentStatus(
            name=name,
            model=runner.agent.model,
            is_running=runner.is_running,
            last_inference_time=runner._last_inference_time,
            last_inference_duration=0.0,  # TODO: track this
            last_inference_trigger="",  # TODO: track this
            owned_rooms=last_state.owned_rooms if last_state else [],
            creep_count=len(last_state.creeps) if last_state else 0,
        )
    
    def get_all_status(self) -> list[AgentStatus]:
        """Get status of all agents."""
        return [
            status for name in self._runners
            if (status := self.get_agent_status(name)) is not None
        ]
    
    async def run_forever(self):
        """Run all agents until stopped."""
        await self.start_all()
        
        try:
            await self._stop_event.wait()
        except asyncio.CancelledError:
            pass
        finally:
            await self.stop_all()
    
    async def trigger_agent_inference(self, name: str) -> InferenceResult | None:
        """Manually trigger inference for a specific agent."""
        runner = self._runners.get(name)
        if not runner:
            return None
        return await runner.trigger_immediate_inference()
    
    async def cancel_agent_inference(self, name: str) -> bool:
        """Cancel inference for a specific agent."""
        runner = self._runners.get(name)
        if not runner:
            return False
        return await runner.cancel_current_inference()
