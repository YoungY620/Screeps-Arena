"""Tests for ScreepsClient - CLI, API, and code upload/execution."""

import pytest
import asyncio
import time
from screeps_agent.screeps_client import ScreepsClient, ScreepsCLI, ScreepsAPI, AccountConfig


class TestScreepsCLI:
    """Tests for CLI communication."""

    @pytest.mark.asyncio
    async def test_cli_execute_simple(self, cli):
        """Test basic CLI command execution."""
        result = await cli.execute("1 + 1", timeout=3.0)
        assert "2" in result

    @pytest.mark.asyncio
    async def test_cli_get_tick(self, cli):
        """Test getting current game tick."""
        tick = await cli.get_tick()
        assert isinstance(tick, int)
        assert tick >= 0

    @pytest.mark.asyncio
    async def test_cli_get_user_info(self, cli):
        """Test getting user info."""
        user_info = await cli.get_user_info("kimi")
        assert user_info.get("username") == "kimi"
        assert "_id" in user_info
        assert user_info.get("cpu") == 100

    @pytest.mark.asyncio
    async def test_cli_get_user_rooms(self, cli):
        """Test getting user's owned rooms."""
        user_info = await cli.get_user_info("kimi")
        user_id = user_info.get("_id")
        assert user_id is not None
        
        rooms = await cli.get_user_rooms(user_id)
        assert isinstance(rooms, list)
        assert "W0N0" in rooms

    @pytest.mark.asyncio
    async def test_cli_get_room_objects(self, cli):
        """Test getting room objects."""
        objects = await cli.get_room_objects("W0N0")
        assert isinstance(objects, list)
        assert len(objects) > 0
        
        # Should have controller, spawn, sources
        types = {obj.get("type") for obj in objects}
        assert "controller" in types
        assert "spawn" in types
        assert "source" in types


class TestScreepsAPI:
    """Tests for HTTP API communication."""

    @pytest.mark.asyncio
    async def test_api_authenticate(self, kimi_api):
        """Test API authentication."""
        success = await kimi_api.authenticate()
        assert success is True
        # Token should be stored internally
        assert kimi_api._token is not None
        assert len(kimi_api._token) > 0

    @pytest.mark.asyncio
    async def test_api_get_memory(self, kimi_api):
        """Test getting user memory."""
        await kimi_api.authenticate()
        memory = await kimi_api.get_memory()
        # Memory might be empty initially, but should be a dict
        assert isinstance(memory, dict)

    @pytest.mark.asyncio
    async def test_api_set_memory(self, kimi_api):
        """Test setting user memory.
        
        Note: set_memory works by creating a console expression that executes
        on the next game tick, so we just verify the API call succeeds.
        """
        await kimi_api.authenticate()
        
        # Set a test value at a specific path
        test_value = f"test_{int(time.time())}"
        success = await kimi_api.set_memory("apiSetTest", test_value)
        
        # Verify the API call succeeded
        # Note: The value won't be immediately visible in memory as it
        # executes via a console expression on the next tick
        assert success is True


class TestScreepsClient:
    """Tests for the unified ScreepsClient."""

    @pytest.mark.asyncio
    async def test_client_connect(self, kimi_client):
        """Test client connection."""
        connected = await kimi_client.connect()
        assert connected is True

    @pytest.mark.asyncio
    async def test_client_get_game_state(self, kimi_client):
        """Test getting complete game state."""
        await kimi_client.connect()
        state = await kimi_client.get_game_state()
        
        assert state.username == "kimi"
        assert state.user_id is not None
        assert len(state.user_id) > 0
        assert "W0N0" in state.owned_rooms
        assert len(state.spawns) == 1
        assert len(state.sources) == 2
        assert len(state.controllers) == 1


class TestCodeUploadAndExecution:
    """Tests for code upload and execution verification.
    
    This is the key test - verifying that code uploaded by the agent
    actually executes on the server.
    """

    @pytest.mark.asyncio
    async def test_upload_simple_code(self, kimi_api):
        """Test uploading simple code that sets memory."""
        await kimi_api.authenticate()
        
        # Upload code that sets a specific memory value
        test_marker = f"test_{int(time.time())}"
        code = {
            "main": f'''
module.exports.loop = function() {{
    if (!Memory.codeTest) {{
        Memory.codeTest = {{
            marker: "{test_marker}",
            executedAt: Game.time,
            executed: true
        }};
        console.log("Test code executed! Marker:", "{test_marker}");
    }}
}};
'''
        }
        
        success = await kimi_api.upload_code(code)
        assert success is True, "Code upload should succeed"

    @pytest.mark.asyncio
    async def test_code_execution_verification(self, kimi_client, cli):
        """Test that uploaded code actually executes.
        
        This test:
        1. Uploads code that writes to Memory
        2. Waits for a few ticks
        3. Verifies the memory was updated by the running code
        """
        await kimi_client.connect()
        
        # Create a unique marker for this test run
        test_marker = f"pytest_{int(time.time())}"
        
        # Upload code that will set Memory.pytest_verification
        code = {
            "main": f'''
module.exports.loop = function() {{
    // Only run once
    if (Memory.pytest_verification && Memory.pytest_verification.marker === "{test_marker}") {{
        return;
    }}
    
    Memory.pytest_verification = {{
        marker: "{test_marker}",
        executedAt: Game.time,
        room: Object.keys(Game.rooms)[0] || "unknown",
        spawns: Object.keys(Game.spawns).length
    }};
    
    console.log("[pytest] Code executed with marker:", "{test_marker}");
}};
'''
        }
        
        # Upload the code
        success = await kimi_client.api.upload_code(code)
        assert success is True, "Code upload should succeed"
        
        # Wait for code to execute (a few ticks)
        # The server runs at ~1 tick per second by default
        await asyncio.sleep(3)
        
        # Check memory to verify code executed
        memory = await kimi_client.api.get_memory()
        
        verification = memory.get("pytest_verification", {})
        assert verification.get("marker") == test_marker, \
            f"Code should have set marker to {test_marker}, got {verification}"
        assert verification.get("executedAt", 0) > 0, \
            "Code should have recorded execution tick"
        assert verification.get("spawns", 0) >= 1, \
            "Code should have found at least 1 spawn"
        
        print(f"\n✅ Code execution verified!")
        print(f"   Marker: {verification.get('marker')}")
        print(f"   Executed at tick: {verification.get('executedAt')}")
        print(f"   Room: {verification.get('room')}")
        print(f"   Spawns found: {verification.get('spawns')}")

    @pytest.mark.asyncio
    async def test_code_with_creep_spawning(self, kimi_client, cli):
        """Test code that attempts to spawn a creep.
        
        This verifies the agent can actually control game entities.
        """
        await kimi_client.connect()
        
        # Use a unique marker with higher precision to avoid conflicts
        test_marker = f"spawner_{int(time.time() * 1000)}"
        # Use unique memory key for this test
        memory_key = f"spawnTest_{test_marker}"
        
        # Upload code that tries to spawn a creep
        code = {
            "main": f'''
module.exports.loop = function() {{
    var memKey = "{memory_key}";
    
    // Track our spawn attempt
    if (!Memory[memKey]) {{
        Memory[memKey] = {{
            marker: "{test_marker}",
            attempts: 0,
            success: false,
            creepName: null
        }};
    }}
    
    // Only try a few times
    if (Memory[memKey].marker !== "{test_marker}" || Memory[memKey].attempts > 5) {{
        return;
    }}
    
    Memory[memKey].attempts++;
    
    // Try to spawn a simple creep
    var spawn = Game.spawns['Spawn1'];
    if (spawn && !spawn.spawning) {{
        var creepName = 'TestCreep_' + Game.time;
        var result = spawn.spawnCreep([MOVE], creepName);
        
        if (result === OK) {{
            Memory[memKey].success = true;
            Memory[memKey].creepName = creepName;
            Memory[memKey].spawnTick = Game.time;
            console.log('[pytest] Spawning creep:', creepName);
        }} else {{
            Memory[memKey].lastError = result;
        }}
    }}
}};
'''
        }
        
        # Upload the code
        success = await kimi_client.api.upload_code(code)
        assert success is True
        
        # Wait for spawn to complete (spawning a MOVE creep takes 3 ticks)
        await asyncio.sleep(8)
        
        # Check if spawn was successful
        memory = await kimi_client.api.get_memory()
        spawn_test = memory.get(memory_key, {})
        
        assert spawn_test.get("marker") == test_marker, "Test marker should match"
        
        # Note: Spawn might fail if energy is low or spawn is busy
        # We just verify the code ran and attempted to spawn
        assert spawn_test.get("attempts", 0) > 0, "Code should have attempted to spawn"
        
        if spawn_test.get("success"):
            print(f"\n✅ Creep spawned successfully!")
            print(f"   Creep name: {spawn_test.get('creepName')}")
            print(f"   Spawn tick: {spawn_test.get('spawnTick')}")
        else:
            print(f"\n⚠️ Spawn attempted but not successful (this is OK)")
            print(f"   Attempts: {spawn_test.get('attempts')}")
            print(f"   Last error code: {spawn_test.get('lastError')}")
            # Error codes: -6 (not enough energy), -3 (name exists), etc.


class TestMultipleAgents:
    """Test that all 4 agents can operate independently."""

    @pytest.mark.asyncio
    async def test_all_agents_accessible(self):
        """Verify all 4 agents can connect and get their game state."""
        agents = [
            ("kimi", "kimi123", "W0N0"),
            ("claude", "claude123", "W1N0"),
            ("gpt", "gpt123", "W0N1"),
            ("gemini", "gemini123", "W1N1"),
        ]
        
        for username, password, expected_room in agents:
            account = AccountConfig(username=username, password=password)
            client = ScreepsClient(
                server_url="http://localhost:21025",
                cli_port=21026,
                account=account,
            )
            
            connected = await client.connect()
            assert connected, f"{username} should connect successfully"
            
            state = await client.get_game_state()
            assert state.username == username
            assert expected_room in state.owned_rooms, \
                f"{username} should own {expected_room}, got {state.owned_rooms}"
            assert len(state.spawns) == 1, f"{username} should have 1 spawn"
            
            print(f"✅ {username}: {state.owned_rooms} - {len(state.spawns)} spawn(s)")
