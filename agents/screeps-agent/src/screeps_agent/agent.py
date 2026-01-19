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
import sys
import time
import uuid
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

import yaml
from kaos.path import KaosPath
from kimi_cli.app import KimiCLI
from kimi_cli.session import Session

# 添加 docker 目录到 path 以导入 sandbox
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "docker"))
from sandbox import start_sandbox_containers, stop_sandbox_containers, configure_sandbox


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
    # 沙箱配置
    sandbox_mode: str = "isolated"  # "isolated" or "shared"
    sandbox_shared_port: int = 2200
    # 解说员配置
    commentator_enabled: bool = False
    commentator_config: dict = None
    
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
            sandbox_mode=data.get("sandbox", {}).get("mode", "isolated"),
            sandbox_shared_port=data.get("sandbox", {}).get("shared_port", 2200),
            commentator_enabled=data.get("commentator", {}).get("enabled", False),
            commentator_config=data.get("commentator", {}),
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
# Skills Scanner
# =============================================================================

def scan_skills(skills_dir: Path) -> list:
    """Scan skills directory and extract metadata from SKILL.md files."""
    skills = []
    
    if not skills_dir.exists():
        return skills
    
    # Scan learned skills directory
    learned_dir = skills_dir / "learned"
    if not learned_dir.exists():
        return skills
    
    for skill_dir in learned_dir.iterdir():
        if not skill_dir.is_dir():
            continue
            
        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue
        
        try:
            # Read YAML frontmatter from SKILL.md
            with open(skill_file, 'r') as f:
                lines = f.readlines()
            
            # Look for frontmatter (between --- markers)
            if len(lines) < 3 or lines[0].strip() != '---':
                continue
            
            frontmatter = {}
            for line in lines[1:]:
                if line.strip() == '---':
                    break
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip().strip('"\' ')
            
            if 'name' in frontmatter and 'description' in frontmatter:
                skills.append({
                    'name': frontmatter['name'],
                    'path': str(skill_dir.absolute()),
                    'description': frontmatter['description']
                })
        except Exception as e:
            # Skip malformed skill files
            print(f"Warning: Failed to parse skill at {skill_file}: {e}")
            continue
    
    return skills


# =============================================================================
# Prompt
# =============================================================================

def build_skills_section(skills_dir: Path) -> str:
    """Dynamically build the skills section of the prompt."""
    skills = scan_skills(skills_dir)
    
    if not skills:
        return """## Skills Directory

No learned skills available yet. The skills directory will be populated as the agent learns from experiences.
"""
    
    skills_root = str(skills_dir.absolute())
    section = f"""## Skills Directory

You have access to a skills directory that contains reusable knowledge and capabilities:

**Skills Root:** `{skills_root}`
- **Name:** skills
- **Description:** Central repository of reusable skills, tools, and knowledge for enhancing agent capabilities

**Learned Skills:**

"""
    
    for idx, skill in enumerate(skills, 1):
        section += f"""{idx}. **{skill['name']}**
   - **Path:** `{skill['path']}`
   - **Description:** {skill['description']}

"""
    
    section += """You can read skill files to gain contextual knowledge about specific tasks, but these are primarily for enhancing your understanding rather than direct execution.
"""
    
    return section


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

{skills_section}

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

## ⚠️ FIRST PRIORITY: Login & Initialize Game

**BEFORE doing anything else, you MUST complete these steps:**

### Step 1: Get Auth Token
```bash
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \\
  -d '{{"email":"{username}@test.com","password":"{password}"}}' \\
  "{server_url}/api/auth/signin" | jq -r '.token')
echo "Token: $TOKEN"
```

### Step 2: Check Your World Status
```bash
STATUS=$(curl -s -H "X-Token: $TOKEN" -H "X-Username: {username}" "{server_url}/api/user/world-status")
echo "Status: $STATUS"
# Returns: {{"ok":1,"status":"normal|lost|empty"}}
# - "normal": You have a spawn, can play normally
# - "empty": No spawn yet, MUST place one first!
# - "lost": All spawns destroyed, need to respawn
```

### Step 3: If Status is "empty" - Place Your First Spawn!
```bash
# Get available rooms
ROOMS=$(curl -s -H "X-Token: $TOKEN" -H "X-Username: {username}" "{server_url}/api/user/world-start-room")
echo "Available rooms: $ROOMS"

# Pick the first available room (or try others if occupied)
ROOM=$(echo $ROOMS | jq -r '.room[0]')

# Place spawn at center of room (x=25, y=25 is usually safe)
curl -s -X POST -H "X-Token: $TOKEN" -H "X-Username: {username}" \\
  -H "Content-Type: application/json" \\
  -d "{{\"room\":\"$ROOM\",\"x\":25,\"y\":25,\"name\":\"Spawn1\"}}" \\
  "{server_url}/api/game/place-spawn"
# Returns: {{"ok":1}} on success
# If error "invalid room", try next room from the list or different x,y coordinates
```

### Step 4: If Status is "lost" - Respawn
```bash
curl -s -X POST -H "X-Token: $TOKEN" -H "X-Username: {username}" "{server_url}/api/user/respawn"
# Then place spawn using Step 3
```

### Step 5: Verify You Have a Spawn
```bash
# Check your room and spawn
curl -s -H "X-Token: $TOKEN" -H "X-Username: {username}" "{server_url}/api/user/world-status"
# Should return: {{"ok":1,"status":"normal"}}
```

**IMPORTANT:** If status is NOT "normal", you cannot spawn creeps! Fix this first!

## HTTP API Authentication

All API calls require these headers:
- `-H "X-Token: $TOKEN"`
- `-H "X-Username: {username}"`

## Upload Code

1. Write code to workspace:
```
WriteFile: {workspace}/main.js
```

2. Upload from file:
```bash
curl -s -X POST "{server_url}/api/user/code" \\
  -H "X-Token: $TOKEN" -H "X-Username: {username}" \\
  -H "Content-Type: application/json" \\
  -d "$(jq -n --arg code \\"$(cat {workspace}/main.js)\\" '{{branch:\\"default\\",modules:{{main:$code}}}}')"
```

## Screeps Combat Reference

Official Docs: https://docs.screeps.com/index.html
API Reference: https://docs.screeps.com/api/

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
        
        # Each agent gets own workspace (use absolute path)
        self.workspace = Path(__file__).parent.parent.parent / "workspace" / name
        self.workspace.mkdir(parents=True, exist_ok=True)
        
        # Copy skills directory to agent workspace for isolation
        self._setup_skills_directory()
        
        self.logger = Logger(name, self.workspace)
        self._kimi: KimiCLI = None
        self._stop = asyncio.Event()
        self._user_id = None
        self._room = None
    
    def _setup_skills_directory(self):
        """Copy skills directory to agent workspace for isolation."""
        source_skills_dir = Path("/Users/moonshot/dev/local-screeps/self-learn-skills/skills")
        target_skills_dir = self.workspace / "skills"
        
        if not source_skills_dir.exists():
            print(f"[{self.name}] Warning: Source skills directory not found at {source_skills_dir}")
            return
        
        try:
            # Remove existing skills directory if it exists
            if target_skills_dir.exists():
                import shutil
                shutil.rmtree(target_skills_dir)
            
            # Copy the entire skills directory
            import shutil
            shutil.copytree(source_skills_dir, target_skills_dir)
            print(f"[{self.name}] Copied skills directory to {target_skills_dir}")
        except Exception as e:
            print(f"[{self.name}] Error copying skills directory: {e}")
    
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
        # Build dynamic skills section
        skills_dir = self.workspace / "skills"
        skills_section = build_skills_section(skills_dir)
        
        return PROMPT_TEMPLATE.format(
            name=self.name,
            username=self.username,
            password=self.password,
            server_url=self.server_url,
            cli_port=self.cli_port,
            workspace=self.workspace.absolute(),
            tick=tick,
            room=self._room,
            skills_section=skills_section,
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
    print(f"Sandbox: {cfg.sandbox_mode}" + (f" (port {cfg.sandbox_shared_port})" if cfg.sandbox_mode == "shared" else ""))
    print("=" * 50)
    
    # 配置沙箱模式
    agent_names = [a["name"] for a in cfg.agents]
    configure_sandbox(
        mode=cfg.sandbox_mode,
        shared_port=cfg.sandbox_shared_port,
        agents=agent_names,
    )
    
    # 启动沙箱容器
    workspace_root = Path(__file__).parent.parent.parent / "workspace"
    if not start_sandbox_containers(workspace_root):
        print("Failed to start sandbox containers")
        return
    
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
    
    try:
        await asyncio.gather(*[a.run() for a in agents])
    finally:
        # 停止沙箱容器
        stop_sandbox_containers()
    
    print("Done")


if __name__ == "__main__":
    asyncio.run(main())
