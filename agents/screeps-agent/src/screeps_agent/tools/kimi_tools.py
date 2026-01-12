"""Kimi-CLI compatible tool definitions for Screeps Agent."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Literal, override

from kosong.tooling import CallableTool2, ToolError, ToolOk, ToolReturnValue
from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from ..monitors.signal import SignalManager
    from ..screeps_client import ScreepsClient


# ============================================================
# Monitor Tools
# ============================================================

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


class AddMonitor(CallableTool2[AddMonitorParams]):
    """Tool for adding a game state monitor."""
    
    name: str = "AddMonitor"
    description: str = (
        "Add a monitor to watch for specific game conditions. When the condition "
        "is met, the monitor will trigger and record data. Use this to set up "
        "alerts for important events like low creep count, attacks, or energy thresholds.\n\n"
        "Example conditions:\n"
        "- 'creep_count < 3' - Alert when fewer than 3 creeps\n"
        "- 'tick % 100 == 0' - Periodic checkpoint every 100 ticks\n"
        "- 'any(c.get(\"hits\") < c.get(\"hitsMax\") for c in creeps.values())' - Damaged creep"
    )
    params: type[AddMonitorParams] = AddMonitorParams
    
    def __init__(self, signal_manager: "SignalManager"):
        self._signal_manager = signal_manager
    
    @override
    async def __call__(self, params: AddMonitorParams) -> ToolReturnValue:
        from ..monitors.signal import SignalDefinition, SignalPriority
        
        priority_map = {
            "low": SignalPriority.LOW,
            "normal": SignalPriority.NORMAL,
            "high": SignalPriority.HIGH,
            "critical": SignalPriority.CRITICAL,
        }
        
        # Check if monitor already exists
        if self._signal_manager.get_signal(params.name):
            return ToolError(
                message=f"Monitor '{params.name}' already exists. Remove it first to update."
            )
        
        # Validate the condition expression syntax
        try:
            compile(params.condition, "<signal>", "eval")
        except SyntaxError as e:
            return ToolError(message=f"Invalid condition expression: {e}")
        
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
        
        self._signal_manager.add_signal(signal)
        
        return ToolOk(
            message=f"Monitor '{params.name}' added successfully with {params.priority} priority."
        )


class RemoveMonitorParams(BaseModel):
    """Parameters for removing a monitor."""
    name: str = Field(description="Name of the monitor to remove")


class RemoveMonitor(CallableTool2[RemoveMonitorParams]):
    """Tool for removing a monitor."""
    
    name: str = "RemoveMonitor"
    description: str = "Remove an existing monitor by name."
    params: type[RemoveMonitorParams] = RemoveMonitorParams
    
    def __init__(self, signal_manager: "SignalManager"):
        self._signal_manager = signal_manager
    
    @override
    async def __call__(self, params: RemoveMonitorParams) -> ToolReturnValue:
        if self._signal_manager.remove_signal(params.name):
            return ToolOk(message=f"Monitor '{params.name}' removed.")
        return ToolError(message=f"Monitor '{params.name}' not found.")


class ListMonitorsParams(BaseModel):
    """Parameters for listing monitors."""
    include_inactive: bool = Field(
        default=False,
        description="Whether to include inactive monitors"
    )


class ListMonitors(CallableTool2[ListMonitorsParams]):
    """Tool for listing all monitors."""
    
    name: str = "ListMonitors"
    description: str = "List all active monitors and their configurations."
    params: type[ListMonitorsParams] = ListMonitorsParams
    
    def __init__(self, signal_manager: "SignalManager"):
        self._signal_manager = signal_manager
    
    @override
    async def __call__(self, params: ListMonitorsParams) -> ToolReturnValue:
        import json
        
        if params.include_inactive:
            signals = self._signal_manager.list_signals()
        else:
            signals = self._signal_manager.list_active_signals()
        
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
        
        output = json.dumps(monitors, indent=2)
        return ToolOk(output=output, message=f"Found {len(monitors)} monitor(s).")


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


class GetMonitorRecords(CallableTool2[GetMonitorRecordsParams]):
    """Tool for getting triggered monitor records."""
    
    name: str = "GetMonitorRecords"
    description: str = "Get records of triggered monitors. Use this to see what conditions have been met."
    params: type[GetMonitorRecordsParams] = GetMonitorRecordsParams
    
    def __init__(self, signal_manager: "SignalManager"):
        self._signal_manager = signal_manager
    
    @override
    async def __call__(self, params: GetMonitorRecordsParams) -> ToolReturnValue:
        import json
        
        records = self._signal_manager.get_records(
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
        
        output = json.dumps(formatted_records, indent=2)
        return ToolOk(output=output, message=f"Found {len(formatted_records)} record(s).")


# ============================================================
# Screeps Interaction Tools
# ============================================================

class GetGameStateParams(BaseModel):
    """Parameters for getting game state."""
    rooms: list[str] | None = Field(
        default=None,
        description="Specific rooms to query (None = all configured rooms)"
    )
    include_memory: bool = Field(
        default=False,
        description="Whether to include full memory dump"
    )


class GetGameState(CallableTool2[GetGameStateParams]):
    """Tool for getting current game state."""
    
    name: str = "GetGameState"
    description: str = (
        "Get the current game state including tick number, creeps, spawns, "
        "and structures. All data is dynamically fetched - rooms are auto-discovered."
    )
    params: type[GetGameStateParams] = GetGameStateParams
    
    def __init__(self, screeps_client: "ScreepsClient"):
        self._client = screeps_client
    
    @override
    async def __call__(self, params: GetGameStateParams) -> ToolReturnValue:
        import json
        
        try:
            # Dynamically fetch game state (rooms auto-discovered)
            state = await self._client.get_game_state()
            
            data = {
                "tick": state.tick,
                "username": state.username,
                "owned_rooms": state.owned_rooms,
                "creep_count": len(state.creeps),
                "spawn_count": len(state.spawns),
                "structure_count": len(state.structures),
                "rooms": state.rooms,
                "creeps": {
                    k: {
                        "name": v.get("name"),
                        "room": v.get("room"),
                        "role": v.get("memory", {}).get("role"),
                        "hits": v.get("hits"),
                        "hitsMax": v.get("hitsMax"),
                        "store": v.get("store"),
                        "pos": {"x": v.get("x"), "y": v.get("y")},
                    }
                    for k, v in state.creeps.items()
                },
                "spawns": {
                    k: {
                        "name": v.get("name"),
                        "room": v.get("room"),
                        "energy": v.get("store", {}).get("energy"),
                        "spawning": v.get("spawning"),
                        "pos": {"x": v.get("x"), "y": v.get("y")},
                    }
                    for k, v in state.spawns.items()
                },
                "sources": {
                    k: {
                        "room": v.get("room"),
                        "energy": v.get("energy"),
                        "energyCapacity": v.get("energyCapacity"),
                        "pos": {"x": v.get("x"), "y": v.get("y")},
                    }
                    for k, v in state.sources.items()
                },
            }
            
            if params.include_memory:
                data["memory"] = state.memory
            
            output = json.dumps(data, indent=2)
            return ToolOk(output=output, message=f"Got game state at tick {state.tick}, {len(state.owned_rooms)} room(s)")
        except Exception as e:
            return ToolError(message=f"Failed to get game state: {e}")


class SendConsoleParams(BaseModel):
    """Parameters for sending console command."""
    expression: str = Field(
        description="JavaScript expression to execute in game console"
    )


class SendConsole(CallableTool2[SendConsoleParams]):
    """Tool for sending console commands."""
    
    name: str = "SendConsole"
    description: str = (
        "Send a JavaScript expression to execute in the game console. "
        "This runs immediately in the game context. Use this for quick commands "
        "or debugging."
    )
    params: type[SendConsoleParams] = SendConsoleParams
    
    def __init__(self, screeps_client: "ScreepsClient"):
        self._client = screeps_client
    
    @override
    async def __call__(self, params: SendConsoleParams) -> ToolReturnValue:
        import json
        
        try:
            result = await self._client.send_console(params.expression)
            output = json.dumps(result, indent=2) if result else "Command sent"
            return ToolOk(output=output, message="Console command executed")
        except Exception as e:
            return ToolError(message=f"Failed to send console command: {e}")


class SetMemoryParams(BaseModel):
    """Parameters for setting memory."""
    path: str = Field(
        description="Memory path (e.g., 'creeps.harvester1.targetId')"
    )
    value: Any = Field(
        description="Value to set (will be JSON serialized)"
    )


class SetMemory(CallableTool2[SetMemoryParams]):
    """Tool for setting game memory."""
    
    name: str = "SetMemory"
    description: str = (
        "Set a value in the game's Memory object. Use this to configure "
        "your creeps' behavior or store persistent data."
    )
    params: type[SetMemoryParams] = SetMemoryParams
    
    def __init__(self, screeps_client: "ScreepsClient"):
        self._client = screeps_client
    
    @override
    async def __call__(self, params: SetMemoryParams) -> ToolReturnValue:
        try:
            success = await self._client.set_memory(params.path, params.value)
            if success:
                return ToolOk(message=f"Memory.{params.path} set successfully")
            return ToolError(message="Failed to set memory (API returned failure)")
        except Exception as e:
            return ToolError(message=f"Failed to set memory: {e}")


class UploadCodeParams(BaseModel):
    """Parameters for uploading code."""
    code: str = Field(
        description="JavaScript code to upload as main.js"
    )
    branch: str = Field(
        default="default",
        description="Branch to upload to"
    )


class UploadCode(CallableTool2[UploadCodeParams]):
    """Tool for uploading code to Screeps."""
    
    name: str = "UploadCode"
    description: str = (
        "Upload new code to your Screeps colony. The code will be active "
        "starting from the next tick. This replaces the main.js module."
    )
    params: type[UploadCodeParams] = UploadCodeParams
    
    def __init__(self, screeps_client: "ScreepsClient"):
        self._client = screeps_client
    
    @override
    async def __call__(self, params: UploadCodeParams) -> ToolReturnValue:
        try:
            success = await self._client.upload_code(params.code, params.branch)
            if success:
                return ToolOk(message=f"Code uploaded to branch '{params.branch}'")
            return ToolError(message="Failed to upload code (API returned failure)")
        except Exception as e:
            return ToolError(message=f"Failed to upload code: {e}")


def create_screeps_tools(
    signal_manager: "SignalManager",
    screeps_client: "ScreepsClient",
) -> list[CallableTool2]:
    """Create all Screeps-related tools."""
    return [
        # Monitor tools
        AddMonitor(signal_manager),
        RemoveMonitor(signal_manager),
        ListMonitors(signal_manager),
        GetMonitorRecords(signal_manager),
        # Screeps interaction tools (rooms auto-discovered)
        GetGameState(screeps_client),
        SendConsole(screeps_client),
        SetMemory(screeps_client),
        UploadCode(screeps_client),
    ]
