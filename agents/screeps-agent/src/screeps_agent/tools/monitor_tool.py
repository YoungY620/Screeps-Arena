"""Monitor Tool - allows the agent to set up monitoring signals."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

from ..monitors.signal import SignalDefinition, SignalManager, SignalPriority


class AddMonitorParams(BaseModel):
    """Parameters for adding a monitor."""
    
    name: str = Field(
        description="Unique name for this monitor"
    )
    description: str = Field(
        description="Human-readable description of what this monitor watches for"
    )
    condition: str = Field(
        description=(
            "Python expression that evaluates to True when the signal should trigger. "
            "Available variables: state, tick, creeps, spawns, structures, memory, "
            "creep_count, spawn_count. "
            "Examples: 'creep_count < 3', 'tick % 100 == 0', "
            "'any(c.get(\"hits\", 0) < c.get(\"hitsMax\", 1) for c in creeps.values())'"
        )
    )
    record_fields: list[str] = Field(
        default=["tick", "creeps", "spawns"],
        description=(
            "Fields to record when signal triggers. "
            "Available: tick, creeps, spawns, structures, memory, console_logs"
        )
    )
    priority: Literal["low", "normal", "high", "critical"] = Field(
        default="normal",
        description=(
            "Signal priority: "
            "low = log only, "
            "normal = include in next scheduled inference, "
            "high = trigger inference within 5s, "
            "critical = cancel current inference and restart immediately"
        )
    )
    one_shot: bool = Field(
        default=False,
        description="If true, signal will only fire once then deactivate"
    )
    cooldown: float = Field(
        default=0.0,
        description="Minimum seconds between signal triggers (0 = no cooldown)"
    )
    immediate_inference: bool = Field(
        default=False,
        description=(
            "If true, immediately trigger a new inference when this signal fires. "
            "If an inference is in progress, it will be cancelled."
        )
    )


class RemoveMonitorParams(BaseModel):
    """Parameters for removing a monitor."""
    
    name: str = Field(description="Name of the monitor to remove")


class ListMonitorsParams(BaseModel):
    """Parameters for listing monitors."""
    
    include_inactive: bool = Field(
        default=False,
        description="Whether to include inactive monitors"
    )


class GetMonitorRecordsParams(BaseModel):
    """Parameters for getting monitor records."""
    
    name: str | None = Field(
        default=None,
        description="Filter by monitor name (None = all monitors)"
    )
    limit: int = Field(
        default=20,
        description="Maximum number of records to return"
    )


class MonitorToolResult(BaseModel):
    """Result from monitor tool operations."""
    
    success: bool
    message: str
    data: dict[str, Any] | None = None


def create_monitor_tool(signal_manager: SignalManager):
    """Create the monitor tool functions bound to a signal manager."""
    
    def add_monitor(params: AddMonitorParams) -> MonitorToolResult:
        """Add a new monitor to watch for specific game conditions."""
        # Map priority string to enum
        priority_map = {
            "low": SignalPriority.LOW,
            "normal": SignalPriority.NORMAL,
            "high": SignalPriority.HIGH,
            "critical": SignalPriority.CRITICAL,
        }
        
        # Check if monitor already exists
        if signal_manager.get_signal(params.name):
            return MonitorToolResult(
                success=False,
                message=f"Monitor '{params.name}' already exists. Remove it first to update."
            )
        
        # Validate the condition expression syntax
        try:
            compile(params.condition, "<signal>", "eval")
        except SyntaxError as e:
            return MonitorToolResult(
                success=False,
                message=f"Invalid condition expression: {e}"
            )
        
        signal = SignalDefinition(
            name=params.name,
            description=params.description,
            condition=params.condition,
            record_fields=params.record_fields,
            priority=priority_map[params.priority],
            one_shot=params.one_shot,
            cooldown=params.cooldown,
            immediate_inference=params.immediate_inference,
        )
        
        signal_manager.add_signal(signal)
        
        return MonitorToolResult(
            success=True,
            message=f"Monitor '{params.name}' added successfully.",
            data={
                "name": params.name,
                "condition": params.condition,
                "priority": params.priority,
                "one_shot": params.one_shot,
                "immediate_inference": params.immediate_inference,
            }
        )
    
    def remove_monitor(params: RemoveMonitorParams) -> MonitorToolResult:
        """Remove a monitor."""
        if signal_manager.remove_signal(params.name):
            return MonitorToolResult(
                success=True,
                message=f"Monitor '{params.name}' removed."
            )
        return MonitorToolResult(
            success=False,
            message=f"Monitor '{params.name}' not found."
        )
    
    def list_monitors(params: ListMonitorsParams) -> MonitorToolResult:
        """List all monitors."""
        if params.include_inactive:
            signals = signal_manager.list_signals()
        else:
            signals = signal_manager.list_active_signals()
        
        monitors = []
        for s in signals:
            monitors.append({
                "name": s.name,
                "description": s.description,
                "condition": s.condition if isinstance(s.condition, str) else "<custom>",
                "priority": s.priority.name.lower(),
                "one_shot": s.one_shot,
                "cooldown": s.cooldown,
                "immediate_inference": s.immediate_inference,
                "is_active": s._is_active,
                "triggered_count": s._triggered_count,
            })
        
        return MonitorToolResult(
            success=True,
            message=f"Found {len(monitors)} monitor(s).",
            data={"monitors": monitors}
        )
    
    def get_monitor_records(params: GetMonitorRecordsParams) -> MonitorToolResult:
        """Get records from triggered monitors."""
        records = signal_manager.get_records(
            signal_name=params.name,
            limit=params.limit,
        )
        
        formatted_records = []
        for r in records:
            formatted_records.append({
                "signal_name": r.signal_name,
                "tick": r.tick,
                "priority": r.priority.name.lower(),
                "condition_met": r.condition_met,
                "recorded_data": r.recorded_data,
            })
        
        return MonitorToolResult(
            success=True,
            message=f"Found {len(formatted_records)} record(s).",
            data={"records": formatted_records}
        )
    
    return {
        "add_monitor": add_monitor,
        "remove_monitor": remove_monitor,
        "list_monitors": list_monitors,
        "get_monitor_records": get_monitor_records,
    }


# Tool descriptions for the agent
MONITOR_TOOL_DESCRIPTIONS = {
    "AddMonitor": {
        "description": (
            "Add a monitor to watch for specific game conditions. When the condition "
            "is met, the monitor will trigger and record data. Use this to set up "
            "alerts for important events like low creep count, attacks, or energy "
            "thresholds."
        ),
        "parameters": AddMonitorParams,
    },
    "RemoveMonitor": {
        "description": "Remove an existing monitor by name.",
        "parameters": RemoveMonitorParams,
    },
    "ListMonitors": {
        "description": "List all active monitors and their configurations.",
        "parameters": ListMonitorsParams,
    },
    "GetMonitorRecords": {
        "description": "Get records of triggered monitors. Use this to see what conditions have been met.",
        "parameters": GetMonitorRecordsParams,
    },
}
