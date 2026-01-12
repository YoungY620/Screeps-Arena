"""Prompt template system for Screeps Agent."""

from __future__ import annotations

import string
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Callable


@dataclass
class PromptContext:
    """Context data for prompt rendering."""
    
    # Time info
    current_time: str = ""
    tick: int = 0
    
    # Game state
    room_name: str = ""
    controller_level: int = 0
    controller_progress: float = 0.0
    energy_available: int = 0
    energy_capacity: int = 0
    
    # Creeps
    creep_count: int = 0
    creep_summary: str = ""
    
    # Spawns
    spawn_status: str = ""
    
    # Structures
    structure_summary: str = ""
    
    # Memory
    memory_snapshot: str = ""
    
    # Recent events
    recent_events: str = ""
    console_logs: str = ""
    
    # Signals/Monitors
    active_signals: str = ""
    triggered_signals: str = ""
    
    # Custom fields (user-defined)
    custom: dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary for template substitution."""
        result = {
            "current_time": self.current_time,
            "tick": self.tick,
            "room_name": self.room_name,
            "controller_level": self.controller_level,
            "controller_progress": self.controller_progress,
            "energy_available": self.energy_available,
            "energy_capacity": self.energy_capacity,
            "creep_count": self.creep_count,
            "creep_summary": self.creep_summary,
            "spawn_status": self.spawn_status,
            "structure_summary": self.structure_summary,
            "memory_snapshot": self.memory_snapshot,
            "recent_events": self.recent_events,
            "console_logs": self.console_logs,
            "active_signals": self.active_signals,
            "triggered_signals": self.triggered_signals,
        }
        result.update(self.custom)
        return result


class PromptTemplate:
    """A template that can be rendered with context."""
    
    def __init__(
        self,
        template: str,
        *,
        name: str = "",
        description: str = "",
    ):
        self.template = template
        self.name = name
        self.description = description
        self._compiled = string.Template(template)
    
    def render(self, context: PromptContext | dict[str, Any]) -> str:
        """Render the template with the given context."""
        if isinstance(context, PromptContext):
            context_dict = context.to_dict()
        else:
            context_dict = context
        
        # Use safe_substitute to avoid KeyError for missing keys
        return self._compiled.safe_substitute(context_dict)
    
    @classmethod
    def from_file(cls, path: str, **kwargs) -> "PromptTemplate":
        """Load template from file."""
        with open(path, "r", encoding="utf-8") as f:
            return cls(f.read(), **kwargs)


class DynamicPromptBuilder(ABC):
    """Abstract base for dynamic prompt building."""
    
    @abstractmethod
    def build(self, context: PromptContext) -> str:
        """Build the prompt from context."""
        pass


class CompositePromptBuilder(DynamicPromptBuilder):
    """Compose multiple prompt parts together."""
    
    def __init__(self):
        self.parts: list[tuple[str, DynamicPromptBuilder | PromptTemplate | str]] = []
    
    def add_part(
        self,
        name: str,
        part: DynamicPromptBuilder | PromptTemplate | str,
    ) -> "CompositePromptBuilder":
        """Add a part to the composite prompt."""
        self.parts.append((name, part))
        return self
    
    def build(self, context: PromptContext) -> str:
        """Build all parts and join them."""
        rendered_parts = []
        for name, part in self.parts:
            if isinstance(part, str):
                rendered_parts.append(part)
            elif isinstance(part, PromptTemplate):
                rendered_parts.append(part.render(context))
            else:
                rendered_parts.append(part.build(context))
        return "\n\n".join(rendered_parts)


# Pre-defined prompt templates

SYSTEM_PROMPT_TEMPLATE = PromptTemplate(
    """You are an AI agent controlling a colony in the game Screeps.

## Current Time
${current_time}

## Your Objective
Manage and grow your colony efficiently. You need to:
1. Harvest energy from sources
2. Build and maintain structures
3. Upgrade your room controller
4. Defend against threats
5. Expand when ready

## Available Tools
You have access to tools for:
- Querying game state
- Uploading new code to your colony
- Setting memory values
- Adding monitors to watch for specific conditions

## Important Notes
- Each game tick is a discrete step in the game
- Your code runs every tick automatically
- Use monitors to get alerted when specific conditions occur
- Think strategically about long-term goals

## Your Colony Status
${colony_status}
""",
    name="system",
    description="Main system prompt",
)


TURN_PROMPT_TEMPLATE = PromptTemplate(
    """## Current Game State (Tick ${tick})

### Room: ${room_name}
- Controller Level: ${controller_level} (${controller_progress}% to next)
- Energy: ${energy_available}/${energy_capacity}

### Creeps (${creep_count} total)
${creep_summary}

### Spawns
${spawn_status}

### Structures
${structure_summary}

### Recent Console Output
${console_logs}

### Active Monitors
${active_signals}

### Triggered Signals
${triggered_signals}

Based on the current state, analyze the situation and decide what actions to take.
If monitors have triggered, prioritize addressing those conditions.
""",
    name="turn",
    description="Per-turn status update prompt",
)


SIGNAL_TRIGGERED_PROMPT_TEMPLATE = PromptTemplate(
    """## URGENT: Signal Triggered!

A monitor you set up has detected a condition that requires immediate attention.

### Signal Details
${signal_name}: ${signal_description}

### Trigger Condition
${trigger_condition}

### Current Value
${current_value}

### Recorded Data
${recorded_data}

Please analyze this situation and take appropriate action immediately.
""",
    name="signal_triggered",
    description="Prompt when a signal is triggered",
)


class ScreepsPromptManager:
    """Manages prompts for the Screeps agent."""
    
    def __init__(
        self,
        system_template: PromptTemplate | None = None,
        turn_template: PromptTemplate | None = None,
        signal_template: PromptTemplate | None = None,
    ):
        self.system_template = system_template or SYSTEM_PROMPT_TEMPLATE
        self.turn_template = turn_template or TURN_PROMPT_TEMPLATE
        self.signal_template = signal_template or SIGNAL_TRIGGERED_PROMPT_TEMPLATE
        self._context_providers: list[Callable[[PromptContext], None]] = []
    
    def add_context_provider(self, provider: Callable[[PromptContext], None]):
        """Add a function that enriches the context before rendering."""
        self._context_providers.append(provider)
    
    def _enrich_context(self, context: PromptContext):
        """Apply all context providers."""
        for provider in self._context_providers:
            provider(context)
    
    def render_system_prompt(self, context: PromptContext) -> str:
        """Render the system prompt."""
        self._enrich_context(context)
        return self.system_template.render(context)
    
    def render_turn_prompt(self, context: PromptContext) -> str:
        """Render the per-turn prompt."""
        self._enrich_context(context)
        return self.turn_template.render(context)
    
    def render_signal_prompt(
        self,
        context: PromptContext,
        signal_data: dict[str, Any],
    ) -> str:
        """Render the signal triggered prompt."""
        self._enrich_context(context)
        # Merge signal data into context
        merged_context = context.to_dict()
        merged_context.update(signal_data)
        return self.signal_template.render(merged_context)
