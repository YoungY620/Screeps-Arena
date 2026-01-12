"""Signal system for monitoring game state and triggering agent responses."""

from __future__ import annotations

import asyncio
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Any, Callable, Coroutine

from ..screeps_client import GameState


class SignalPriority(Enum):
    """Priority levels for signals."""
    LOW = auto()       # Log only, no immediate action
    NORMAL = auto()    # Include in next scheduled inference
    HIGH = auto()      # Trigger inference soon (within 5s)
    CRITICAL = auto()  # Cancel current inference and restart immediately


@dataclass
class SignalRecord:
    """A record captured when a signal is triggered."""
    
    signal_name: str
    timestamp: float
    tick: int
    condition_met: str
    recorded_data: dict[str, Any]
    priority: SignalPriority


@dataclass
class SignalDefinition:
    """Definition of a signal/monitor."""
    
    name: str
    description: str
    
    # The condition to check - returns True when signal should trigger
    # Can be a simple expression string or a callable
    condition: str | Callable[[GameState], bool]
    
    # What data to record when triggered
    # Can be field names from GameState or a callable
    record_fields: list[str] | Callable[[GameState], dict[str, Any]]
    
    # Priority of this signal
    priority: SignalPriority = SignalPriority.NORMAL
    
    # Whether this signal should only fire once or repeatedly
    one_shot: bool = False
    
    # Cooldown in seconds before the signal can fire again
    cooldown: float = 0.0
    
    # Whether to trigger immediate inference
    immediate_inference: bool = False
    
    # Internal state
    _last_triggered: float = field(default=0.0, repr=False)
    _triggered_count: int = field(default=0, repr=False)
    _is_active: bool = field(default=True, repr=False)


class SignalEvaluator:
    """Evaluates signal conditions against game state."""
    
    def __init__(self):
        # Built-in condition functions available in expressions
        self.builtins = {
            "len": len,
            "min": min,
            "max": max,
            "sum": sum,
            "abs": abs,
            "any": any,
            "all": all,
        }
    
    def evaluate_condition(
        self,
        signal: SignalDefinition,
        state: GameState,
    ) -> bool:
        """Evaluate if the signal condition is met."""
        if callable(signal.condition):
            try:
                return signal.condition(state)
            except Exception:
                return False
        
        # String expression evaluation
        try:
            # Build evaluation context
            context = {
                "state": state,
                "tick": state.tick,
                "creeps": state.creeps,
                "spawns": state.spawns,
                "structures": state.structures,
                "memory": state.memory,
                "creep_count": len(state.creeps),
                "spawn_count": len(state.spawns),
                **self.builtins,
            }
            return bool(eval(signal.condition, {"__builtins__": {}}, context))
        except Exception:
            return False
    
    def record_data(
        self,
        signal: SignalDefinition,
        state: GameState,
    ) -> dict[str, Any]:
        """Record data when signal triggers."""
        if callable(signal.record_fields):
            try:
                return signal.record_fields(state)
            except Exception:
                return {}
        
        # Record specified fields
        recorded = {}
        for field_name in signal.record_fields:
            if hasattr(state, field_name):
                value = getattr(state, field_name)
                # Convert complex objects to string representation
                if isinstance(value, dict):
                    recorded[field_name] = dict(value)
                elif isinstance(value, list):
                    recorded[field_name] = list(value)
                else:
                    recorded[field_name] = value
        return recorded


class SignalManager:
    """Manages signal definitions and monitors game state."""
    
    def __init__(self):
        self._signals: dict[str, SignalDefinition] = {}
        self._records: list[SignalRecord] = []
        self._evaluator = SignalEvaluator()
        self._on_signal_callbacks: list[Callable[[SignalRecord], Coroutine[Any, Any, None]]] = []
        self._pending_immediate: asyncio.Queue[SignalRecord] = asyncio.Queue()
    
    def add_signal(self, signal: SignalDefinition) -> None:
        """Add a signal definition."""
        self._signals[signal.name] = signal
    
    def remove_signal(self, name: str) -> bool:
        """Remove a signal definition."""
        if name in self._signals:
            del self._signals[name]
            return True
        return False
    
    def get_signal(self, name: str) -> SignalDefinition | None:
        """Get a signal by name."""
        return self._signals.get(name)
    
    def list_signals(self) -> list[SignalDefinition]:
        """List all signals."""
        return list(self._signals.values())
    
    def list_active_signals(self) -> list[SignalDefinition]:
        """List active signals."""
        return [s for s in self._signals.values() if s._is_active]
    
    def deactivate_signal(self, name: str) -> bool:
        """Deactivate a signal without removing it."""
        if signal := self._signals.get(name):
            signal._is_active = False
            return True
        return False
    
    def activate_signal(self, name: str) -> bool:
        """Reactivate a signal."""
        if signal := self._signals.get(name):
            signal._is_active = True
            return True
        return False
    
    def on_signal(
        self,
        callback: Callable[[SignalRecord], Coroutine[Any, Any, None]],
    ) -> None:
        """Register a callback for when any signal triggers."""
        self._on_signal_callbacks.append(callback)
    
    async def check_signals(self, state: GameState) -> list[SignalRecord]:
        """Check all signals against current state and return triggered records."""
        triggered = []
        current_time = time.time()
        
        for signal in self._signals.values():
            # Skip inactive signals
            if not signal._is_active:
                continue
            
            # Check cooldown
            if signal.cooldown > 0:
                if current_time - signal._last_triggered < signal.cooldown:
                    continue
            
            # Check one-shot
            if signal.one_shot and signal._triggered_count > 0:
                continue
            
            # Evaluate condition
            if self._evaluator.evaluate_condition(signal, state):
                # Record data
                data = self._evaluator.record_data(signal, state)
                
                record = SignalRecord(
                    signal_name=signal.name,
                    timestamp=current_time,
                    tick=state.tick,
                    condition_met=str(signal.condition) if isinstance(signal.condition, str) else "custom",
                    recorded_data=data,
                    priority=signal.priority,
                )
                
                # Update signal state
                signal._last_triggered = current_time
                signal._triggered_count += 1
                
                # If one-shot, deactivate
                if signal.one_shot:
                    signal._is_active = False
                
                triggered.append(record)
                self._records.append(record)
                
                # If immediate inference requested
                if signal.immediate_inference or signal.priority == SignalPriority.CRITICAL:
                    await self._pending_immediate.put(record)
                
                # Call registered callbacks
                for callback in self._on_signal_callbacks:
                    try:
                        await callback(record)
                    except Exception:
                        pass
        
        return triggered
    
    def get_records(
        self,
        since_time: float | None = None,
        signal_name: str | None = None,
        limit: int = 100,
    ) -> list[SignalRecord]:
        """Get signal records with optional filtering."""
        records = self._records
        
        if since_time is not None:
            records = [r for r in records if r.timestamp >= since_time]
        
        if signal_name is not None:
            records = [r for r in records if r.signal_name == signal_name]
        
        return records[-limit:]
    
    def clear_records(self) -> None:
        """Clear all recorded signals."""
        self._records.clear()
    
    async def get_pending_immediate(self, timeout: float = 0.0) -> SignalRecord | None:
        """Get a pending immediate signal, if any."""
        try:
            if timeout > 0:
                return await asyncio.wait_for(
                    self._pending_immediate.get(),
                    timeout=timeout,
                )
            else:
                return self._pending_immediate.get_nowait()
        except (asyncio.TimeoutError, asyncio.QueueEmpty):
            return None
    
    def has_pending_immediate(self) -> bool:
        """Check if there are pending immediate signals."""
        return not self._pending_immediate.empty()
    
    def format_active_signals(self) -> str:
        """Format active signals for prompt inclusion."""
        active = self.list_active_signals()
        if not active:
            return "No active monitors."
        
        lines = []
        for s in active:
            status = f"[{s.priority.name}]"
            if s.cooldown > 0:
                status += f" (cooldown: {s.cooldown}s)"
            if s.one_shot:
                status += " (one-shot)"
            lines.append(f"- {s.name}: {s.description} {status}")
        
        return "\n".join(lines)
    
    def format_recent_triggers(self, limit: int = 5) -> str:
        """Format recent signal triggers for prompt inclusion."""
        recent = self.get_records(limit=limit)
        if not recent:
            return "No recent signal triggers."
        
        lines = []
        for r in reversed(recent):  # Most recent first
            lines.append(
                f"- [{r.priority.name}] {r.signal_name} at tick {r.tick}: "
                f"{r.condition_met}"
            )
        
        return "\n".join(lines)
