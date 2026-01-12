"""Screeps Server Client - minimal invasive interaction with Screeps environment."""

from __future__ import annotations

import asyncio
import base64
import gzip
import json
import socket
from dataclasses import dataclass, field
from typing import Any, TYPE_CHECKING

import aiohttp

if TYPE_CHECKING:
    from .config import ServerConfig as ConfigServerConfig


def _get_cli_host(server_url: str) -> str:
    """Extract host from server URL."""
    return server_url.replace("http://", "").replace("https://", "").split(":")[0]


@dataclass
class AccountConfig:
    """Single account configuration."""
    
    username: str
    password: str


@dataclass 
class GameState:
    """Current game state snapshot - all data dynamically fetched."""
    
    tick: int = 0
    
    # User info
    user_id: str = ""
    username: str = ""
    
    # Rooms owned by this user (dynamically discovered)
    owned_rooms: list[str] = field(default_factory=list)
    
    # Room data keyed by room name
    rooms: dict[str, dict[str, Any]] = field(default_factory=dict)
    
    # Game objects by room
    creeps: dict[str, dict[str, Any]] = field(default_factory=dict)
    spawns: dict[str, dict[str, Any]] = field(default_factory=dict)
    structures: dict[str, dict[str, Any]] = field(default_factory=dict)
    sources: dict[str, dict[str, Any]] = field(default_factory=dict)
    controllers: dict[str, dict[str, Any]] = field(default_factory=dict)
    
    # Memory
    memory: dict[str, Any] = field(default_factory=dict)
    
    # Console output
    console_logs: list[str] = field(default_factory=list)
    
    # Raw data for detailed access
    raw_objects: dict[str, list[dict[str, Any]]] = field(default_factory=dict)


class ScreepsCLI:
    """Interact with Screeps server via CLI (telnet-like)."""
    
    def __init__(self, host: str = "localhost", port: int = 21026):
        self.host = host
        self.port = port
    
    async def execute(self, command: str, timeout: float = 2.0) -> str:
        """Execute a CLI command and return the result."""
        loop = asyncio.get_event_loop()
        
        def _execute_sync():
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(timeout)
            try:
                sock.connect((self.host, self.port))
                
                # First, consume the welcome message
                welcome = b""
                while True:
                    try:
                        chunk = sock.recv(4096)
                        if not chunk:
                            break
                        welcome += chunk
                        # Welcome message ends with "commands.\n"
                        if b"commands." in welcome:
                            break
                    except socket.timeout:
                        break
                
                # Now send the actual command
                sock.sendall((command + "\n").encode())
                
                # Read the response
                response = b""
                while True:
                    try:
                        chunk = sock.recv(4096)
                        if not chunk:
                            break
                        response += chunk
                        # Response ends with newline and prompt
                        if b"\n< " in response or (b"< " in response and response.endswith(b"\n")):
                            break
                    except socket.timeout:
                        break
                return response.decode(errors="replace")
            finally:
                sock.close()
        
        return await loop.run_in_executor(None, _execute_sync)
    
    def _parse_json_response(self, result: str, default: Any) -> Any:
        """Parse JSON from CLI response."""
        for line in result.split("\n"):
            line = line.strip()
            # Remove leading "< " prompt
            if line.startswith("< "):
                line = line[2:].strip()
            # Handle single-quoted JSON strings (JS outputs 'json' instead of json)
            if line.startswith("'") and line.endswith("'"):
                line = line[1:-1]
            # Handle double-quoted JSON strings
            elif line.startswith('"') and line.endswith('"'):
                line = line[1:-1].replace('\\"', '"')
            # Try to parse if it looks like JSON
            if line.startswith("{") or line.startswith("["):
                try:
                    return json.loads(line)
                except json.JSONDecodeError:
                    continue
        return default
    
    async def get_tick(self) -> int:
        """Get current game tick."""
        result = await self.execute("Game.time")
        for line in result.split("\n"):
            line = line.strip()
            if line.startswith("< "):
                try:
                    return int(line[2:].strip())
                except ValueError:
                    pass
        return 0
    
    async def get_user_info(self, username: str) -> dict[str, Any]:
        """Get user info including ID and owned rooms."""
        # Use .then() because findOne returns a Promise
        cmd = f"storage.db.users.findOne({{username: '{username}'}}).then(u => JSON.stringify(u))"
        result = await self.execute(cmd, timeout=3.0)
        return self._parse_json_response(result, {})
    
    async def get_user_rooms(self, user_id: str) -> list[str]:
        """Get all rooms owned by a user."""
        # Query rooms.objects for controllers owned by this user
        # Use .then() because find returns a Promise
        cmd = f"storage.db['rooms.objects'].find({{type: 'controller', user: '{user_id}'}}).then(r => JSON.stringify(r.map(c => c.room)))"
        result = await self.execute(cmd, timeout=3.0)
        return self._parse_json_response(result, [])
    
    async def get_room_objects(self, room: str) -> list[dict[str, Any]]:
        """Get all objects in a room."""
        # Use .then() because find returns a Promise
        cmd = f"storage.db['rooms.objects'].find({{room: '{room}'}}).then(r => JSON.stringify(r))"
        result = await self.execute(cmd, timeout=5.0)
        return self._parse_json_response(result, [])
    
    async def get_room_terrain(self, room: str) -> dict[str, Any]:
        """Get room terrain data."""
        # Use .then() because findOne returns a Promise
        cmd = f"storage.db['rooms.terrain'].findOne({{room: '{room}'}}).then(t => JSON.stringify(t))"
        result = await self.execute(cmd, timeout=3.0)
        return self._parse_json_response(result, {})


class ScreepsAPI:
    """Interact with Screeps server via HTTP API."""
    
    def __init__(self, server_url: str, account: AccountConfig):
        self.server_url = server_url.rstrip("/")
        self.account = account
        self._token: str | None = None
        self._session: aiohttp.ClientSession | None = None
        self._user_id: str | None = None
    
    async def _get_session(self) -> aiohttp.ClientSession:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession()
        return self._session
    
    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()
    
    async def authenticate(self) -> bool:
        """Authenticate with the server and get a token."""
        session = await self._get_session()
        try:
            async with session.post(
                f"{self.server_url}/api/auth/signin",
                json={
                    "email": self.account.username,
                    "password": self.account.password,
                }
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    self._token = data.get("token")
                    return bool(self._token)
        except aiohttp.ClientError:
            pass
        return False
    
    def _auth_headers(self) -> dict[str, str]:
        if self._token:
            return {"X-Token": self._token}
        return {}
    
    async def get_me(self) -> dict[str, Any]:
        """Get current user info."""
        session = await self._get_session()
        try:
            async with session.get(
                f"{self.server_url}/api/auth/me",
                headers=self._auth_headers(),
            ) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    self._user_id = data.get("_id")
                    return data
        except aiohttp.ClientError:
            pass
        return {}
    
    async def get_memory(self, path: str = "") -> dict[str, Any]:
        """Get user memory at path."""
        session = await self._get_session()
        try:
            params = {"path": path} if path else {}
            async with session.get(
                f"{self.server_url}/api/user/memory",
                params=params,
                headers=self._auth_headers(),
            ) as resp:
                if resp.status == 200:
                    return await resp.json()
        except aiohttp.ClientError:
            pass
        return {}
    
    async def set_memory(self, path: str, value: Any) -> bool:
        """Set user memory at path."""
        session = await self._get_session()
        try:
            async with session.post(
                f"{self.server_url}/api/user/memory",
                json={"path": path, "value": json.dumps(value)},
                headers=self._auth_headers(),
            ) as resp:
                return resp.status == 200
        except aiohttp.ClientError:
            pass
        return False
    
    async def send_console_command(self, expression: str) -> dict[str, Any]:
        """Send a console command."""
        session = await self._get_session()
        try:
            async with session.post(
                f"{self.server_url}/api/user/console",
                json={"expression": expression},
                headers=self._auth_headers(),
            ) as resp:
                if resp.status == 200:
                    return await resp.json()
        except aiohttp.ClientError:
            pass
        return {}
    
    async def upload_code(self, modules: dict[str, str], branch: str = "default") -> bool:
        """Upload code modules."""
        session = await self._get_session()
        try:
            async with session.post(
                f"{self.server_url}/api/user/code",
                json={"branch": branch, "modules": modules},
                headers=self._auth_headers(),
            ) as resp:
                return resp.status == 200
        except aiohttp.ClientError:
            pass
        return False
    
    async def get_room_overview(self, room: str, interval: int = 8) -> dict[str, Any]:
        """Get room overview stats."""
        session = await self._get_session()
        try:
            async with session.get(
                f"{self.server_url}/api/game/room-overview",
                params={"room": room, "interval": interval},
                headers=self._auth_headers(),
            ) as resp:
                if resp.status == 200:
                    return await resp.json()
        except aiohttp.ClientError:
            pass
        return {}


class ScreepsClient:
    """
    Unified client for a single agent interacting with Screeps server.
    All game data (rooms, objects, etc.) is dynamically fetched.
    """
    
    def __init__(self, server_url: str, cli_port: int, account: AccountConfig):
        self.server_url = server_url.rstrip("/")
        self.cli_port = cli_port
        self.account = account
        self.cli = ScreepsCLI(host=_get_cli_host(server_url), port=cli_port)
        self.api = ScreepsAPI(server_url, account)
        self._authenticated = False
        self._user_id: str | None = None
        self._owned_rooms: list[str] | None = None
    
    async def connect(self) -> bool:
        """Connect and authenticate with the server."""
        if await self.api.authenticate():
            self._authenticated = True
            # Get user info
            user_info = await self.api.get_me()
            self._user_id = user_info.get("_id")
            return True
        return False
    
    async def close(self):
        """Close all connections."""
        await self.api.close()
    
    async def discover_rooms(self) -> list[str]:
        """Dynamically discover all rooms owned by this user."""
        if not self._user_id:
            # Try to get user ID via CLI
            user_info = await self.cli.get_user_info(self.account.username)
            self._user_id = user_info.get("_id")
        
        if self._user_id:
            self._owned_rooms = await self.cli.get_user_rooms(self._user_id)
        else:
            self._owned_rooms = []
        
        return self._owned_rooms or []
    
    async def get_game_state(self) -> GameState:
        """
        Get complete game state for this user.
        All data is dynamically fetched - no hardcoded rooms or positions.
        """
        state = GameState()
        state.username = self.account.username
        
        # Get current tick
        state.tick = await self.cli.get_tick()
        
        # Discover owned rooms dynamically
        if self._owned_rooms is None:
            await self.discover_rooms()
        state.owned_rooms = self._owned_rooms or []
        state.user_id = self._user_id or ""
        
        # Fetch data for each owned room
        for room in state.owned_rooms:
            objects = await self.cli.get_room_objects(room)
            state.raw_objects[room] = objects
            
            # Categorize objects
            for obj in objects:
                obj_type = obj.get("type", "")
                obj_id = obj.get("_id", "")
                obj_user = obj.get("user")
                
                # Only include objects owned by this user (or unowned like sources)
                if obj_type == "creep" and obj_user == self._user_id:
                    state.creeps[obj_id] = obj
                elif obj_type == "spawn" and obj_user == self._user_id:
                    state.spawns[obj_id] = obj
                elif obj_type == "controller":
                    state.controllers[obj_id] = obj
                    # Extract room info from controller
                    state.rooms[room] = {
                        "level": obj.get("level", 0),
                        "progress": obj.get("progress", 0),
                        "progressTotal": obj.get("progressTotal", 0),
                        "owner": obj_user,
                    }
                elif obj_type == "source":
                    state.sources[obj_id] = obj
                elif obj_type in ("extension", "tower", "storage", "link", "container", "road", "wall", "rampart"):
                    if obj_user == self._user_id or obj_user is None:
                        state.structures[obj_id] = obj
        
        # Get memory if authenticated
        if self._authenticated:
            memory_data = await self.api.get_memory()
            if "data" in memory_data:
                try:
                    raw = memory_data["data"]
                    if raw.startswith("gz:"):
                        raw = raw[3:]
                        decoded = base64.b64decode(raw)
                        state.memory = json.loads(gzip.decompress(decoded))
                    else:
                        state.memory = json.loads(raw) if raw else {}
                except Exception:
                    pass
        
        return state
    
    async def upload_code(self, code: str | dict[str, str], branch: str = "default") -> bool:
        """Upload code to the server."""
        if not self._authenticated:
            if not await self.api.authenticate():
                return False
            self._authenticated = True
        
        modules = {"main": code} if isinstance(code, str) else code
        return await self.api.upload_code(modules, branch)
    
    async def send_console(self, expression: str) -> dict[str, Any]:
        """Send a console command."""
        if not self._authenticated:
            return {}
        return await self.api.send_console_command(expression)
    
    async def set_memory(self, path: str, value: Any) -> bool:
        """Set memory at path."""
        if not self._authenticated:
            return False
        return await self.api.set_memory(path, value)
