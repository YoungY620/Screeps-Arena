# Screeps AI Agent

Multi-agent framework for Screeps using KimiCLI.

## Architecture

```
screeps-agent/
├── config.yaml           # Server + agents config
├── data/                 # JSONL logs (per agent)
├── workspace/            # Agent code directories (per agent)
├── logs/                 # Runtime logs
├── scripts/
│   ├── run_all_agents.py # Entry point
│   ├── report.py         # Generate summary report
│   └── query_logs.py     # Query JSONL logs
└── src/screeps_agent/
    └── agent.py          # All code (~350 lines)
```

## Key Components

### agent.py Structure

```python
# CLI Client (lines 55-95)
def cli_exec_sync(host, port, cmd)  # Socket connection, IPv6/IPv4 fallback
async def cli_exec(host, port, cmd) # Async wrapper

# Logger (lines 110-125)
class Logger                         # JSONL logging to data/<agent>.jsonl

# Prompt Template (lines 128-180)
PROMPT_TEMPLATE                      # System prompt with workspace + CLI examples

# Agent Class (lines 185-310)
class Agent:
    __init__()                       # Setup workspace, logger
    _init_kimi()                     # Create KimiCLI session (once, reused)
    _get_info()                      # Fetch user ID and room from CLI
    _get_tick()                      # Get current game tick
    _build_prompt(tick)              # Format prompt template
    _inference(prompt)               # Run LLM, log messages
    run()                            # Main loop

# Entry Point (lines 315-350)
async def main()                     # Load config, create agents, run
```

## Run

```bash
# Background
nohup uv run python scripts/run_all_agents.py > logs/agents.log 2>&1 &

# Stop
pkill -f run_all_agents
```

## Config

```yaml
server:
  server_url: "http://localhost:21025"
  cli_port: 21026

runner:
  inference_interval: 30.0
  yolo: true

agents:
  - name: "kimi"
    username: "kimi"
    password: "kimi123"
    model: "kimi-k2-turbo-preview"
```

## Agent Workflow

1. **Init**: Create workspace dir, KimiCLI session
2. **Loop**:
   - Get tick from CLI
   - Build prompt with workspace path + CLI examples
   - Run LLM inference (same session, history preserved)
   - Agent uses Shell/WriteFile tools
   - Wait 30 seconds

## CLI Commands

All `storage.db` queries return Promises - must use `.then()`:

```bash
# Query (must include sleep for async!)
(echo "storage.db.users.findOne({username: 'kimi'}).then(u => JSON.stringify(u))"; sleep 0.5) | nc localhost 21026

# Room objects
(echo "storage.db['rooms.objects'].find({room: 'W0N0'}).then(o => JSON.stringify(o))"; sleep 0.5) | nc localhost 21026
```

## Code Upload

Agents write to workspace, then upload via curl:

```bash
curl -s -X POST http://localhost:21025/api/user/code \
  -u "user:pass" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg code \"$(cat workspace/kimi/main.js)\" '{branch:\"default\",modules:{main:$code}}')"
```

## Logs

```bash
# Report
uv run python scripts/report.py

# Sample output:
# ## KIMI
# Sessions: 2
# Tool calls: 13
# Tools: {'ReadFile': 3, 'Shell': 8, 'WriteFile': 2}
# Code files: ['main.js']
#   - main.js: 109 lines
```

## Known Issues

### IPv6 Connection

Server listens on IPv6. Code handles this with fallback:
```python
for family in (socket.AF_INET6, socket.AF_INET):
    sock = socket.socket(family, socket.SOCK_STREAM)
    try:
        sock.connect((host, port))
        break
    except:
        sock.close()
```

### Database Reset

Never delete db.json directly! Copy from template:
```bash
cp server/node_modules/@screeps/launcher/init_dist/db.json server/db.json
```

## Screeps API

- Docs: https://docs.screeps.com/api/
- Key objects: Game.spawns, Game.creeps, Memory
- Body parts: WORK, CARRY, MOVE, ATTACK, HEAL, CLAIM
