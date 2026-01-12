# Screeps Multi-Agent

基于 kimi-cli 的 Screeps 游戏多 AI Agent 框架。支持多个 Agent 使用不同模型并行运行。

## 功能特点

- **多 Agent 并行**: 支持多个 Agent 同时运行，每个使用不同的 AI 模型
- **动态数据获取**: 所有游戏数据（房间、建筑、位置等）在运行时动态获取，无硬编码
- **定时推理**: 默认每 30 秒自动收集游戏状态并进行 AI 推理
- **信号监控**: 设置自定义监控条件，当满足条件时触发记录或立即推理
- **推理控制**: 支持取消当前推理并立即开始新的推理

## 安装

```bash
cd agents/screeps-agent
pip install -e .
```

## 快速开始

### 1. 配置

编辑 `config.yaml`：

```yaml
server:
  server_url: "http://localhost:21025"
  cli_port: 21026

runner:
  inference_interval: 30.0

# 每个 Agent 只需配置账户和模型
agents:
  - name: "kimi"
    username: "kimi"
    password: "kimi123"
    model: "kimi-latest"
  
  - name: "claude"
    username: "claude"
    password: "claude123"
    model: "claude-sonnet-4-20250514"
  
  - name: "gpt"
    username: "gpt"
    password: "gpt123"
    model: "gpt-4o"
  
  - name: "gemini"
    username: "gemini"
    password: "gemini123"
    model: "gemini-2.5-pro"
```

### 2. 运行

```bash
# 运行所有 Agent
screeps-agent -c config.yaml -v

# 只运行特定 Agent
screeps-agent -c config.yaml --agent kimi -v

# 单次运行（测试）
screeps-agent -c config.yaml --once
```

## 配置说明

### 仅需配置

- **服务器连接信息**: URL 和端口
- **每个 Agent**: 账户名、密码、模型名

### 自动获取（无需配置）

- 玩家拥有的房间列表
- 房间内所有对象（Creep、Spawn、Source 等）
- 对象位置和属性
- 控制器等级和进度
- 能量状态

## 命令行参数

```
screeps-agent [-c CONFIG] [--server URL] [--interval SECONDS] [--agent NAME] [--once] [-v]

Options:
  -c, --config    配置文件路径 (默认: config.yaml)
  --server        服务器 URL (覆盖配置)
  --interval      推理间隔秒数 (覆盖配置)
  --agent         只运行指定名称的 Agent
  --once          每个 Agent 只运行一次推理
  -v, --verbose   详细输出
```

## 编程接口

```python
import asyncio
from screeps_agent.config import load_config
from screeps_agent.multi_agent import MultiAgentManager

async def main():
    config = load_config("config.yaml")
    manager = MultiAgentManager(config)
    
    # 启动所有 Agent
    await manager.start_all()
    
    # 获取状态
    for status in manager.get_all_status():
        print(f"{status.name}: {status.owned_rooms}")
    
    # 停止
    await manager.stop_all()

asyncio.run(main())
```

## License

MIT
