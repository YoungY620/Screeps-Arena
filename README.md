# Local Screeps AI Arena

本地 Screeps 私服 + 多 AI Agent 对战框架。

## ⚠️ 环境要求

**Apple Silicon Mac 用户必读**：Screeps 私服需要特定的运行环境。

| 依赖 | 版本 | 用途 |
|------|------|------|
| **Node.js 12** | x64 | 服务器运行（通过 Rosetta 2） |
| **Python 2.7** | 2.7.18 | 编译原生依赖 |
| **Rosetta 2** | - | Apple Silicon 运行 x64 程序 |
| **Node.js 20+** | arm64 | Web 客户端（可选） |

```bash
# 一次性安装
softwareupdate --install-rosetta      # Rosetta 2
brew install pyenv && pyenv install 2.7.18  # Python 2.7
nvm install 12                        # Node 12
```

> 详见 [screeps-env/README.md](screeps-env/README.md) 了解为什么需要这些旧版本。

## 项目结构

```
local-screeps/
├── screeps-env/          # Screeps 私服环境
│   ├── server/           # 服务器数据和配置
│   └── *.sh              # 操作脚本
└── agents/
    └── screeps-agent/    # AI Agent 框架
        ├── workspace/    # Agent 代码目录
        └── data/         # JSONL 日志
```

## 快速开始

### 1. 启动服务器

```bash
cd screeps-env
./setup.sh              # 首次安装（需要 Node 12 + Python 2.7）
./start.sh              # 启动服务器
./init-map.sh           # 初始化地图
```

### 2. 添加玩家

```bash
# 添加 4 个 AI 玩家
for user in kimi claude gpt gemini; do
  ./add-agent.sh "$user" "${user}123"
done

# 分配不同房间
./spawn-colony.sh kimi W0N0
./spawn-colony.sh claude W1N0
./spawn-colony.sh gpt W0N1
./spawn-colony.sh gemini W1N1
```

> **注意**: 如果登录 Web 客户端时提示 "Account credentials are invalid"，需重新设置密码：
> ```bash
> for user in kimi claude gpt gemini; do
>   (echo "setPassword('$user', '${user}123')"; sleep 0.5) | nc localhost 21026
> done
> ```

### 3. 启动 AI Agents

```bash
cd agents/screeps-agent
uv sync
mkdir -p workspace/{kimi,claude,gpt,gemini} logs
nohup uv run python scripts/run_all_agents.py > logs/agents.log 2>&1 &
```

### 4. 查看游戏

```bash
cd screeps-env
./start-client.sh
# 浏览器打开 http://localhost:8080/(http://localhost:21025)/
```

## 重置游戏

```bash
# 1. 停止所有服务
cd screeps-env && ./stop.sh
pkill -f run_all_agents

# 2. 重置数据库（必须从模板复制！）
cd screeps-env
cp server/node_modules/@screeps/launcher/init_dist/db.json server/db.json

# 3. 清理 Agent 数据
cd agents/screeps-agent
rm -f data/*.jsonl
rm -rf workspace/*/

# 4. 重新启动
cd screeps-env
./start.sh
sleep 10  # 等待服务器完全启动
./init-map.sh
for user in kimi claude gpt gemini; do
  ./add-agent.sh "$user" "${user}123"
done
./spawn-colony.sh kimi W0N0
./spawn-colony.sh claude W1N0
./spawn-colony.sh gpt W0N1
./spawn-colony.sh gemini W1N1

cd agents/screeps-agent
mkdir -p workspace/{kimi,claude,gpt,gemini} logs
nohup uv run python scripts/run_all_agents.py > logs/agents.log 2>&1 &
```

## 监控

```bash
# 服务器状态
curl -s http://localhost:21025/api/game/time

# Agent 运行状态
ps aux | grep run_all_agents

# Agent 日志
tail -f agents/screeps-agent/logs/agents.log

# JSONL 日志统计
wc -l agents/screeps-agent/data/*.jsonl

# 生成报告
cd agents/screeps-agent && uv run python scripts/report.py

# 查看 Agent 代码
cat agents/screeps-agent/workspace/kimi/main.js
```

## 停止

```bash
# 停止 Agents
pkill -f run_all_agents

# 停止服务器
cd screeps-env && ./stop.sh
```

## 关键配置

### 服务器端口

| 端口 | 用途 |
|------|------|
| 21025 | HTTP API |
| 21026 | CLI |
| 8080 | Web 客户端 |

### Agent 配置

编辑 `agents/screeps-agent/config.yaml`：

```yaml
agents:
  - name: "kimi"
    model: "kimi-k2-turbo-preview"
  - name: "claude"  
    model: "claude-sonnet-4"
  - name: "gpt"
    model: "gpt-4o"
  - name: "gemini"
    model: "gemini-2.5-pro"
```

## 故障排除

### 引擎进程反复崩溃

**现象**：服务器日志显示 `engine_main/processor/runner exited with code 1, restarting...`

**原因**：Node.js 版本不对，架构不匹配

**解决**：
```bash
# 确保用 Node 12 启动
nvm use 12
./start.sh
```

### 存储进程启动失败

```
Error: Could not launch the storage process
```

**解决**: 必须从模板复制数据库，不能直接删除：
```bash
cp server/node_modules/@screeps/launcher/init_dist/db.json server/db.json
```

### CLI 连接失败

服务器监听 IPv6，等待完全启动：
```bash
sleep 10
nc -z localhost 21026 && echo "OK"
```

### Agent 无日志

检查服务器是否运行：
```bash
curl -s http://localhost:21025/api/game/time
```

### 登录失败 "Account credentials are invalid"

重新设置密码：
```bash
for user in kimi claude gpt gemini; do
  (echo "setPassword('$user', '${user}123')"; sleep 0.5) | nc localhost 21026
done
```

## 详细文档

- [Screeps 服务器](screeps-env/README.md)
- [AI Agent 框架](agents/screeps-agent/README.md)
