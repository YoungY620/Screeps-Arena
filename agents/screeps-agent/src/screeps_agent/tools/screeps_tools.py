"""Screeps-specific tools for the agent."""

from __future__ import annotations

import json
from typing import Any

from pydantic import BaseModel, Field


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


class SendConsoleParams(BaseModel):
    """Parameters for sending console command."""
    
    expression: str = Field(
        description="JavaScript expression to execute in game console"
    )


class SetMemoryParams(BaseModel):
    """Parameters for setting memory."""
    
    path: str = Field(
        description="Memory path (e.g., 'creeps.harvester1.targetId')"
    )
    value: Any = Field(
        description="Value to set"
    )


class UploadCodeParams(BaseModel):
    """Parameters for uploading code."""
    
    code: str | dict[str, str] = Field(
        description="Code to upload. Either a single string (for main.js) or a dict of module_name -> code"
    )
    branch: str = Field(
        default="default",
        description="Branch to upload to"
    )


class ScreepsToolResult(BaseModel):
    """Result from Screeps tool operations."""
    
    success: bool
    message: str
    data: dict[str, Any] | None = None


def create_screeps_tools(screeps_client):
    """Create Screeps interaction tools bound to a client."""
    
    async def get_game_state(params: GetGameStateParams) -> ScreepsToolResult:
        """Get current game state including creeps, spawns, structures."""
        try:
            rooms = params.rooms or screeps_client.config.rooms
            state = await screeps_client.get_game_state(rooms)
            
            data = {
                "tick": state.tick,
                "creep_count": len(state.creeps),
                "spawn_count": len(state.spawns),
                "structure_count": len(state.structures),
                "creeps": {
                    k: {
                        "name": v.get("name"),
                        "role": v.get("memory", {}).get("role"),
                        "hits": v.get("hits"),
                        "hitsMax": v.get("hitsMax"),
                        "fatigue": v.get("fatigue"),
                        "store": v.get("store"),
                    }
                    for k, v in state.creeps.items()
                },
                "spawns": {
                    k: {
                        "name": v.get("name"),
                        "energy": v.get("store", {}).get("energy"),
                        "spawning": v.get("spawning"),
                    }
                    for k, v in state.spawns.items()
                },
            }
            
            if params.include_memory:
                data["memory"] = state.memory
            
            return ScreepsToolResult(
                success=True,
                message=f"Got game state at tick {state.tick}",
                data=data,
            )
        except Exception as e:
            return ScreepsToolResult(
                success=False,
                message=f"Failed to get game state: {e}",
            )
    
    async def send_console(params: SendConsoleParams) -> ScreepsToolResult:
        """Send a console command to be executed in the game."""
        try:
            result = await screeps_client.send_console(params.expression)
            return ScreepsToolResult(
                success=True,
                message="Console command sent",
                data={"result": result},
            )
        except Exception as e:
            return ScreepsToolResult(
                success=False,
                message=f"Failed to send console command: {e}",
            )
    
    async def set_memory(params: SetMemoryParams) -> ScreepsToolResult:
        """Set a value in the game Memory."""
        try:
            success = await screeps_client.set_memory(params.path, params.value)
            if success:
                return ScreepsToolResult(
                    success=True,
                    message=f"Memory.{params.path} set successfully",
                )
            return ScreepsToolResult(
                success=False,
                message="Failed to set memory (API returned failure)",
            )
        except Exception as e:
            return ScreepsToolResult(
                success=False,
                message=f"Failed to set memory: {e}",
            )
    
    async def upload_code(params: UploadCodeParams) -> ScreepsToolResult:
        """Upload code to the Screeps server."""
        try:
            success = await screeps_client.upload_code(params.code, params.branch)
            if success:
                return ScreepsToolResult(
                    success=True,
                    message=f"Code uploaded to branch '{params.branch}'",
                )
            return ScreepsToolResult(
                success=False,
                message="Failed to upload code (API returned failure)",
            )
        except Exception as e:
            return ScreepsToolResult(
                success=False,
                message=f"Failed to upload code: {e}",
            )
    
    return {
        "get_game_state": get_game_state,
        "send_console": send_console,
        "set_memory": set_memory,
        "upload_code": upload_code,
    }


# Tool descriptions for agent documentation
SCREEPS_TOOL_DESCRIPTIONS = {
    "GetGameState": {
        "description": (
            "Get the current game state including tick number, creeps, spawns, "
            "and structures. Use this to understand what's happening in your colony."
        ),
        "parameters": GetGameStateParams,
    },
    "SendConsole": {
        "description": (
            "Send a JavaScript expression to execute in the game console. "
            "This runs immediately in the game context."
        ),
        "parameters": SendConsoleParams,
    },
    "SetMemory": {
        "description": (
            "Set a value in the game's Memory object. Use this to configure "
            "your creeps' behavior or store persistent data."
        ),
        "parameters": SetMemoryParams,
    },
    "UploadCode": {
        "description": (
            "Upload new code to your Screeps colony. The code will be active "
            "starting from the next tick."
        ),
        "parameters": UploadCodeParams,
    },
}
