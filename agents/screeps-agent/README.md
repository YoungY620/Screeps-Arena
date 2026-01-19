# Screeps Multi-Agent

基于 kimi-cli 的 Screeps 多 AI Agent 框架。支持多个 Agent 使用不同 LLM 并行运行。

## 功能特点

- **多 Agent 并行**: 4 个 Agent 同时运行，各自控制一个房间
- **独立 Workspace**: 每个 Agent 有独立的代码目录 `workspace/<name>/`
- **文件持久化**: Agent 写的代码文件在循环间保留
- **同一 Session**: 每个 Agent 使用同一个 KimiCLI session，保留对话历史
- **JSONL 日志**: 完整记录推理过程和工具调用
- **AI 解说员**: 独立解说员实时分析战况，输出戏剧化解说

## 安装

```bash
cd agents/screeps-agent
uv sync
```

## 快速开始

### 1. 确保 Screeps 服务器运行

```bash
cd ../screeps-env
./start.sh
# 等待几秒确保端口就绪
nc -z localhost 21026 && echo "Server OK"
```

### 2. 配置

编辑 `config.yaml`：

```yaml
server:
  server_url: "http://localhost:21025"
  cli_port: 21026

runner:
  inference_interval: 30.0   # 每 30 秒一轮
  yolo: true                 # 自动确认工具执行

agents:
  - name: "kimi"
    username: "kimi"
    password: "kimi123"
    model: "kimi-k2-turbo-preview"
  
  - name: "claude"
    username: "claude"
    password: "claude123"
    model: "claude-sonnet-4"
  
  - name: "gpt"
    username: "gpt"
    password: "gpt123"
    model: "gpt-4o"
  
  - name: "gemini"
    username: "gemini"
    password: "gemini123"
    model: "gemini-2.5-pro"
```

### 3. 运行

```bash
# === 运行所有 agents + 解说员（推荐）===
# 后台运行
nohup uv run python scripts/run_all_agents.py --commentator > agents.log 2>&1 &
echo "PID: $!"

# 前台运行（调试）
uv run python scripts/run_all_agents.py --commentator

# === 只运行 agents（不含解说员）===
uv run python scripts/run_all_agents.py

# === 只运行解说员（独立模式）===
uv run python scripts/run_commentator.py
```

### 4. 查看状态

```bash
# 查看进程状态
ps aux | grep run_all_agents | grep -v grep

# 查看 agent JSONL 日志（每个 agent 独立日志）
for agent in kimi claude gpt gemini; do
  echo "=== $agent ==="
  tail -3 workspace/$agent/logs.jsonl
done

# 查看解说员输出
cat workspace/commentator/game_commentary.md

# 查看 workspace 代码
cat workspace/kimi/main.js

# 生成报告
uv run python scripts/report.py
```

### 5. 停止

```bash
# 停止所有 agents 和解说员
pkill -f run_all_agents

# 或强制停止
ps aux | grep run_all_agents | grep -v grep | awk '{print $2}' | xargs kill -9
```

## 解说员功能

解说员是一个独立的 AI Agent，专门负责观察战场并生成戏剧性解说。

### 特点

- **自主探索**: 通过 CLI 和 API 主动查询游戏状态
- **日志分析**: 读取所有 agent 的日志了解行为意图
- **人格化解说**: 为每个 AI 赋予独特性格
- **Markdown 输出**: 解说内容保存到 `workspace/commentator/game_commentary.md`

### 配置

在 `config.yaml` 中配置解说员:

```yaml
commentator:
  enabled: true              # 是否启用
  name: "commentator"
  model: "kimi-k2-turbo-preview"
  interval: 60.0             # 解说间隔（秒）
  style: "dramatic"          # 风格: dramatic/humorous/analytical
```

### 查看解说

```bash
# 实时查看解说
cat workspace/commentator/game_commentary.md

# 持续监控新内容
tail -f workspace/commentator/game_commentary.md
```

## 架构

```
screeps-agent/
├── config.yaml              # 配置文件
├── workspace/               # Agent 工作目录（每个 agent 独立目录）
│   ├── kimi/
│   │   ├── main.js          # Agent 代码
│   │   ├── logs.jsonl       # Agent 日志
│   │   └── skills/          # 学习到的技能
│   ├── claude/
│   ├── gpt/
│   ├── gemini/
│   └── commentator/
│       └── game_commentary.md  # 解说员输出
├── docker/                  # 沙箱容器配置
├── agents.log               # 主进程运行日志（stdout/stderr）
├── scripts/
│   ├── run_all_agents.py    # 入口（支持 --commentator 参数）
│   ├── run_commentator.py   # 独立解说员入口
│   ├── report.py            # 生成报告
│   └── query_logs.py        # 查询日志
└── src/screeps_agent/
    ├── agent.py             # Agent 核心代码
    └── commentator.py       # 解说员代码
```

## Agent 工作流程

每轮循环：

1. 获取当前 tick 和房间信息
2. 构建 prompt（含 workspace 路径、CLI 示例）
3. 运行 LLM 推理
4. Agent 使用 Shell/WriteFile 等工具：
   - 查询游戏状态
   - 写代码到 workspace
   - 通过 curl 上传代码
5. 等待 30 秒，进入下一轮

## Agent 可用工具

KimiCLI 提供的标准工具：

| 工具 | 用途 |
|------|------|
| Shell | 执行命令（nc 连接 CLI、curl 上传代码）|
| WriteFile | 写代码到 workspace |
| ReadFile | 读取文件 |
| Glob | 查找文件 |
| Grep | 搜索内容 |

## CLI 命令格式

Agent 通过 Shell 工具执行 CLI 命令：

```bash
# 必须用 sleep 等待异步结果！
(echo "storage.db.users.findOne({username: 'kimi'}).then(u => JSON.stringify(u))"; sleep 0.5) | nc localhost 21026
```

## 代码上传

Agent 写代码到 workspace，然后用 curl 上传：

```bash
# 1. 写代码（使用 WriteFile 工具）
# workspace/kimi/main.js

# 2. 上传
curl -s -X POST http://localhost:21025/api/user/code \
  -u "kimi:kimi123" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg code \"$(cat workspace/kimi/main.js)\" '{branch:\"default\",modules:{main:$code}}')"
```

## 日志格式

JSONL 格式，每行一个事件：

```json
{"ts": "2026-01-12T18:31:32", "agent": "kimi", "type": "start", "session": "kimi_xxx"}
{"ts": "2026-01-12T18:31:35", "agent": "kimi", "type": "tool", "tool": "Shell", "args": "..."}
{"ts": "2026-01-12T18:31:36", "agent": "kimi", "type": "result", "output": "..."}
{"ts": "2026-01-12T18:31:40", "agent": "kimi", "type": "end", "status": "ok"}
```

## 故障排除

### 连接被拒绝

服务器可能监听 IPv6，代码已处理此情况。如仍失败：

```bash
# 检查端口
nc -z localhost 21026 && echo "OK"
lsof -i :21026  # 查看是 IPv4 还是 IPv6
```

### 日志为空

检查 agent workspace 中的日志：

```bash
# 每个 agent 的日志在自己的 workspace 中
ls -la workspace/*/logs.jsonl

# 查看具体 agent 日志
tail workspace/kimi/logs.jsonl
```

### Agent 无响应

查看详细日志：

```bash
# 查看主进程日志
cat agents.log

# 查看 agent 具体日志
tail -20 workspace/kimi/logs.jsonl

# 检查进程状态
ps aux | grep run_all_agents
```

## 开发

```bash
# 安装开发依赖
uv sync --dev

# 运行测试
uv run pytest

# 格式化
uv run ruff format src/
```
