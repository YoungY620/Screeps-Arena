"""
Screeps AI Agent - Simplified implementation.

Each agent:
1. Has a dedicated workspace directory for code files
2. Every N seconds, builds prompt with CLI + workspace instructions
3. Runs LLM inference - uses Shell/WriteFile tools
4. Logs to JSONL file
"""

import asyncio
import json
import socket
import time
import uuid
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import yaml
from kaos.path import KaosPath
from kimi_cli.app import KimiCLI
from kimi_cli.session import Session


# =============================================================================
# Configuration
# =============================================================================

@dataclass
class Config:
    server_url: str = "http://localhost:21025"
    cli_port: int = 21026
    inference_interval: float = 30.0
    yolo: bool = True
    agents: list = None
    
    @classmethod
    def load(cls, path: str = "config.yaml") -> "Config":
        with open(path) as f:
            data = yaml.safe_load(f) or {}
        return cls(
            server_url=data.get("server", {}).get("server_url", "http://localhost:21025"),
            cli_port=data.get("server", {}).get("cli_port", 21026),
            inference_interval=data.get("runner", {}).get("inference_interval", 30.0),
            yolo=data.get("runner", {}).get("yolo", True),
            agents=data.get("agents", []),
        )


# =============================================================================
# CLI Client
# =============================================================================

# Docker container name for Screeps server
DOCKER_CONTAINER = "screeps"


def cli_exec_sync(host: str, port: int, cmd: str, timeout: float = 5.0) -> str:
    """Execute CLI command via docker exec (since CLI only listens on 127.0.0.1 inside container)."""
    import subprocess
    
    # Use node to connect to CLI inside the container
    # Wait for welcome message first, then send command and wait for response
    node_script = f'''
const net = require('net');
const client = new net.Socket();
let output = '';
let welcomeReceived = false;
let cmdSent = false;

client.connect({port}, 'localhost', () => {{}});

client.on('data', (data) => {{
  output += data.toString();
  
  // Wait for welcome message before sending command
  if (!welcomeReceived && output.includes('< ')) {{
    welcomeReceived = true;
    output = '';  // Clear welcome message
    client.write({json.dumps(cmd)} + '\\n');
    cmdSent = true;
  }}
  
  // After command sent, wait for response prompt
  if (cmdSent && output.includes('\\n< ')) {{
    // Remove the trailing prompt
    const lines = output.split('\\n');
    const result = lines.filter(l => !l.startsWith('< ')).join('\\n');
    console.log(result.trim());
    client.destroy();
  }}
}});

client.on('error', (err) => {{
  console.error('CLI Error:', err.message);
  process.exit(1);
}});

client.on('close', () => {{
  process.exit(0);
}});

setTimeout(() => {{
  if (output) {{
    const lines = output.split('\\n');
    const result = lines.filter(l => !l.startsWith('< ')).join('\\n');
    console.log(result.trim());
  }}
  client.destroy();
}}, {int(timeout * 1000)});
'''
    
    try:
        result = subprocess.run(
            ['docker', 'exec', DOCKER_CONTAINER, 'node', '-e', node_script],
            capture_output=True,
            text=True,
            timeout=timeout + 2
        )
        return result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return "CLI timeout"
    except Exception as e:
        return f"CLI error: {e}"


async def cli_exec(host: str, port: int, cmd: str, timeout: float = 5.0) -> str:
    return await asyncio.get_event_loop().run_in_executor(
        None, cli_exec_sync, host, port, cmd, timeout
    )


def parse_json(text: str, default=None):
    for line in text.split("\n"):
        line = line.strip()
        if line.startswith("< "):
            line = line[2:].strip()
        if line.startswith("'") and line.endswith("'"):
            line = line[1:-1]
        if line.startswith("{") or line.startswith("["):
            try:
                return json.loads(line)
            except:
                pass
    return default


# =============================================================================
# Logger
# =============================================================================

class Logger:
    def __init__(self, name: str, workspace: Path):
        # Log to agent's own workspace directory (use absolute path)
        self.path = workspace.absolute() / "logs.jsonl"
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.name = name
    
    def log(self, t: str, **kw):
        r = {"ts": datetime.now().isoformat(), "agent": self.name, "type": t}
        r.update({k: v for k, v in kw.items() if v})
        with open(self.path, "a") as f:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")


# =============================================================================
# Prompt
# =============================================================================

PROMPT_TEMPLATE = '''You are "{name}", a Screeps AI agent competing in a PvP arena.

## ULTIMATE GOAL

**DESTROY ALL OPPONENTS AS FAST AS POSSIBLE while defending against their attacks.**

This is a competitive multi-player battle. Other AI agents are actively trying to destroy you. You must:
1. Build strong defenses (walls, ramparts, towers) to survive enemy attacks
2. Develop economy quickly (harvest energy, build extensions, upgrade controller)
3. Create military units (attackers, healers, ranged attackers) to assault enemies
4. Scout enemy bases and exploit weaknesses
5. Balance defense and offense - don't let enemies catch you off-guard

Winning Strategy:
- Early game: Fast economy + basic defense
- Mid game: Towers + military production
- Late game: Coordinated attacks on enemy spawns

## Workspace: {workspace}

This is YOUR directory. Use it to:
- Write JavaScript code files (main.js, etc.)
- Files persist between runs
- Check existing files before starting

## CLI Commands (via Shell tool)

The Screeps CLI runs inside a Docker container named "screeps". Use docker exec with node to query game state:

```bash
# Template - use print() to output results from async operations
docker exec screeps node -e '
const net = require("net");
const c = new net.Socket();
let out = "", ready = false;
c.connect(21026, "localhost");
c.on("data", d => {{
  out += d;
  if (!ready && out.includes("< ")) {{ ready = true; out = ""; c.write("YOUR_COMMAND_HERE\\n"); }}
  if (ready && out.includes("\\n< ")) {{ console.log(out.split("\\n").filter(l=>!l.startsWith("< ")).join("\\n")); c.destroy(); }}
}});
setTimeout(() => process.exit(0), 3000);
'
```

Common commands (replace YOUR_COMMAND_HERE):
- Get tick: `storage.env.get("gameTime").then(t=>print(t))`
- User info: `storage.db.users.findOne({{username: "{username}"}}).then(u=>print(JSON.stringify(u)))`
- Room objects: `storage.db["rooms.objects"].find({{room: "{room}"}}).then(o=>print(JSON.stringify(o)))`
- Find enemies: `storage.db["rooms.objects"].find({{type: "creep"}}).then(o=>print(JSON.stringify(o.filter(c=>c.user!="YOUR_USER_ID"))))`

## Upload Code

1. Write code to workspace:
```
WriteFile: {workspace}/main.js
```

2. Upload from file:
```bash
curl -s -X POST {server_url}/api/user/code -u "{username}:{password}" -H "Content-Type: application/json" -d "$(jq -n --arg code \\"$(cat {workspace}/main.js)\\" '{{branch:\\"default\\",modules:{{main:$code}}}}')"
```

## Screeps Combat Reference

Key structures: Game.spawns, Game.towers, Game.structures
Military body parts:
- ATTACK: 30 damage/tick melee
- RANGED_ATTACK: 10 damage/tick at range 3, mass attack at range 1-3
- HEAL: 12 HP/tick (4 HP at range)
- TOUGH: Cheap HP buffer (with boosts can reduce damage 70%)
- MOVE: Essential for mobility

Defense structures:
- Tower: 600 damage at range 0, decreases with distance
- Rampart: Blocks enemies, protects creeps standing on it
- Wall: Blocks movement

## Status
- Tick: {tick}
- Room: {room}

## Current Task
1. Check workspace for existing code
2. Query game state (your units, enemies, resources)
3. Analyze threats and opportunities
4. Write/update code to improve combat effectiveness
5. Upload and verify

Remember: Other players are trying to kill you RIGHT NOW. Act fast, defend well, attack hard!

What will you do?'''


# =============================================================================
# Agent
# =============================================================================

class Agent:
    def __init__(self, name: str, username: str, password: str, model: str,
                 server_url: str, cli_port: int, interval: float, yolo: bool):
        self.name = name
        self.username = username
        self.password = password
        self.model = model
        self.server_url = server_url
        self.cli_port = cli_port
        self.cli_host = server_url.replace("http://", "").replace("https://", "").split(":")[0]
        self.interval = interval
        self.yolo = yolo
        
        # Each agent gets own workspace
        self.workspace = Path("workspace") / name
        self.workspace.mkdir(parents=True, exist_ok=True)
        
        self.logger = Logger(name, self.workspace)
        self._kimi: KimiCLI = None
        self._stop = asyncio.Event()
        self._user_id = None
        self._room = None
    
    async def _init_kimi(self):
        if not self._kimi:
            # Each agent's working directory is their own workspace
            # This ensures agents can only access their own code
            session = await Session.create(work_dir=KaosPath(str(self.workspace.absolute())))
            self._kimi = await KimiCLI.create(session, yolo=self.yolo, model_name=self.model)
    
    async def _get_info(self):
        # Get user ID and room
        r = await cli_exec(self.cli_host, self.cli_port,
            f"storage.db.users.findOne({{username: '{self.username}'}}).then(u => print(JSON.stringify(u)))")
        user = parse_json(r, {})
        self._user_id = user.get("_id", "")
        rooms = user.get("rooms", [])
        if rooms:
            self._room = rooms[0]
    
    async def _get_tick(self) -> int:
        r = await cli_exec(self.cli_host, self.cli_port, 'storage.env.get("gameTime").then(t => print(t))')
        for line in r.split("\n"):
            line = line.strip()
            if line.isdigit():
                return int(line)
        return 0
    
    def _build_prompt(self, tick: int) -> str:
        return PROMPT_TEMPLATE.format(
            name=self.name,
            username=self.username,
            password=self.password,
            server_url=self.server_url,
            cli_port=self.cli_port,
            workspace=self.workspace.absolute(),
            tick=tick,
            room=self._room,
        )
    
    async def _inference(self, prompt: str) -> bool:
        sid = f"{self.name}_{int(time.time())}_{uuid.uuid4().hex[:4]}"
        self.logger.log("start", session=sid, prompt=prompt[:300])
        
        err = None
        try:
            await self._init_kimi()
            cancel = asyncio.Event()
            
            async def watch():
                await self._stop.wait()
                cancel.set()
            w = asyncio.create_task(watch())
            
            try:
                async for msg in self._kimi.run(prompt, cancel, merge_wire_messages=True):
                    self._log_msg(sid, msg)
                    if self._stop.is_set():
                        break
            finally:
                w.cancel()
        except Exception as e:
            err = str(e)
        
        self.logger.log("end", session=sid, status="ok" if not err else "error", error=err)
        return not err
    
    def _log_msg(self, sid: str, msg):
        t = type(msg).__name__
        if t == "TextPart" and hasattr(msg, 'text'):
            self.logger.log("msg", session=sid, role="assistant", content=msg.text[:500])
        elif t == "ToolCall" and hasattr(msg, 'function'):
            n = getattr(msg.function, 'name', '?')
            a = getattr(msg.function, 'arguments', '{}')
            self.logger.log("tool", session=sid, tool=n, args=str(a)[:300])
        elif t == "ToolResult":
            rv = getattr(msg, 'return_value', None)
            out = str(getattr(rv, 'output', ''))[:300] if rv else ""
            self.logger.log("result", session=sid, output=out)
    
    async def run(self):
        print(f"[{self.name}] Starting (workspace: {self.workspace})")
        await self._get_info()
        
        while not self._stop.is_set():
            tick = await self._get_tick()
            prompt = self._build_prompt(tick)
            
            print(f"[{self.name}] Tick {tick}, room {self._room}")
            t0 = time.time()
            ok = await self._inference(prompt)
            print(f"[{self.name}] {'OK' if ok else 'FAIL'} in {time.time()-t0:.1f}s")
            
            try:
                await asyncio.wait_for(self._stop.wait(), self.interval)
                break
            except asyncio.TimeoutError:
                pass
        
        print(f"[{self.name}] Stopped")
    
    def stop(self):
        self._stop.set()


# =============================================================================
# Main
# =============================================================================

async def main():
    cfg = Config.load("config.yaml")
    
    print("=" * 50)
    print("Screeps Multi-Agent")
    print(f"Server: {cfg.server_url}:{cfg.cli_port}")
    print(f"Interval: {cfg.inference_interval}s")
    print(f"Agents: {[a['name'] for a in cfg.agents]}")
    print("=" * 50)
    
    agents = [
        Agent(
            name=a["name"], username=a["username"], password=a["password"],
            model=a.get("model", "kimi-k2-turbo-preview"),
            server_url=cfg.server_url, cli_port=cfg.cli_port,
            interval=cfg.inference_interval, yolo=cfg.yolo,
        )
        for a in cfg.agents
    ]
    
    import signal
    def stop(s, f):
        print("\nStopping...")
        for a in agents:
            a.stop()
    signal.signal(signal.SIGINT, stop)
    signal.signal(signal.SIGTERM, stop)
    
    await asyncio.gather(*[a.run() for a in agents])
    print("Done")


if __name__ == "__main__":
    asyncio.run(main())
