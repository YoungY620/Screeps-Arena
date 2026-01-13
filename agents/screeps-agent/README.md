# Screeps Multi-Agent

基于 kimi-cli 的 Screeps 多 AI Agent 框架。支持多个 Agent 使用不同 LLM 并行运行。

## 功能特点

- **多 Agent 并行**: 4 个 Agent 同时运行，各自控制一个房间
- **独立 Workspace**: 每个 Agent 有独立的代码目录 `workspace/<name>/`
- **文件持久化**: Agent 写的代码文件在循环间保留
- **同一 Session**: 每个 Agent 使用同一个 KimiCLI session，保留对话历史
- **JSONL 日志**: 完整记录推理过程和工具调用

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
# 后台运行
nohup uv run python scripts/run_all_agents.py > logs/agents.log 2>&1 &
echo "PID: $!"

# 前台运行（调试）
uv run python scripts/run_all_agents.py
```

### 4. 查看状态

```bash
# 查看日志
tail -f logs/agents.log

# 查看 JSONL 日志行数
wc -l data/*.jsonl

# 生成报告
uv run python scripts/report.py

# 查看 workspace 代码
cat workspace/kimi/main.js
```

### 5. 停止

```bash
pkill -f run_all_agents
```

## 架构

```
screeps-agent/
├── config.yaml              # 配置文件
├── data/                    # JSONL 日志（每个 agent 一个文件）
│   ├── kimi.jsonl
│   ├── claude.jsonl
│   └── ...
├── workspace/               # Agent 代码目录
│   ├── kimi/main.js
│   ├── claude/main.js
│   └── ...
├── logs/                    # 运行日志
│   └── agents.log
├── scripts/
│   ├── run_all_agents.py    # 入口
│   ├── report.py            # 生成报告
│   └── query_logs.py        # 查询日志
└── src/screeps_agent/
    └── agent.py             # 全部代码 (~350 行)
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

检查日志路径是否正确：

```bash
ls -la data/
# 应该有 kimi.jsonl 等文件
```

### Agent 无响应

查看详细日志：

```bash
cat logs/agents.log
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
