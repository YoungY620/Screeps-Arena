# Screeps Multi-Agent

基于 kimi-cli 二次开发的 Screeps 游戏多 AI Agent 框架。

## 设计原则

1. **最小配置**: 只配置账户名、密码、模型，其他全部动态获取
2. **多 Agent 并行**: 每个 Agent 独立运行，使用各自的模型
3. **动态数据**: 房间、建筑、位置等全部运行时获取

## 项目结构

```
screeps-agent/
├── pyproject.toml           # 项目配置
├── config.yaml              # 多 Agent 配置（实际使用）
├── config.example.yaml      # 示例配置
├── README.md                # 用户文档
├── AGENTS.md                # 开发者文档
└── src/screeps_agent/
    ├── __init__.py
    ├── main.py              # CLI 入口（支持多 Agent）
    ├── config.py            # 配置管理（MultiAgentConfig）
    ├── multi_agent.py       # 多 Agent 管理器
    ├── runner.py            # 单 Agent 运行器
    ├── screeps_client.py    # Screeps 服务器交互
    ├── prompts/
    │   └── base.py          # 提示词模板系统
    ├── monitors/
    │   └── signal.py        # 信号监控系统
    └── tools/
        └── kimi_tools.py    # kimi-cli 兼容工具
```

## 核心模块

### MultiAgentManager (multi_agent.py)

管理多个 Agent 并行运行：

```python
manager = MultiAgentManager(config)
await manager.start_all()  # 启动所有 Agent
await manager.stop_all()   # 停止所有 Agent
```

### ScreepsAgentRunner (runner.py)

单个 Agent 的运行器：
- 定时推理循环（默认 30s）
- 信号监控循环（默认 1s）
- 支持推理取消/重启

### ScreepsClient (screeps_client.py)

Screeps 服务器交互，**动态获取所有数据**：

```python
client = ScreepsClient(server_url, cli_port, account)
await client.connect()

# 自动发现玩家拥有的房间
rooms = await client.discover_rooms()

# 获取完整游戏状态（自动包含所有房间）
state = await client.get_game_state()
# state.owned_rooms: ['W0N0', 'W1N0', ...]
# state.creeps: {id: {...}, ...}
# state.spawns: {id: {...}, ...}
# state.sources: {id: {...}, ...}
```

## 配置结构

```yaml
# 服务器配置（共享）
server:
  server_url: "http://localhost:21025"
  cli_port: 21026

# 运行配置（共享）
runner:
  inference_interval: 30.0

# Agent 配置（仅账户和模型）
agents:
  - name: "kimi"
    username: "kimi"
    password: "kimi123"
    model: "kimi-latest"  # 使用 kimi 模型
  
  - name: "claude"
    username: "claude"
    password: "claude123"
    model: "claude-sonnet-4-20250514"  # 使用 claude 模型

# 初始监控（共享）
initial_monitors:
  - name: "low_creeps"
    condition: "creep_count < 2"
    priority: "high"
```

## 动态数据获取流程

```
1. Agent 启动
   └─> ScreepsClient.connect()
       └─> API 认证获取 token
       └─> 获取 user_id

2. 发现房间
   └─> ScreepsClient.discover_rooms()
       └─> CLI: 查询 rooms.objects 中 controller.user == user_id
       └─> 返回房间列表 ['W0N0', ...]

3. 获取游戏状态
   └─> ScreepsClient.get_game_state()
       └─> 获取 tick
       └─> 对每个 owned_room:
           └─> CLI: 获取 rooms.objects
           └─> 分类: creeps, spawns, sources, structures
       └─> API: 获取 Memory
       └─> 返回 GameState
```

## 工具（Agent 可用）

所有工具都基于动态数据，不需要硬编码房间：

- `GetGameState`: 获取完整游戏状态（自动发现房间）
- `SendConsole`: 发送控制台命令
- `SetMemory`: 设置游戏内存
- `UploadCode`: 上传代码
- `AddMonitor`: 添加监控信号
- `RemoveMonitor`: 移除监控
- `ListMonitors`: 列出监控
- `GetMonitorRecords`: 获取触发记录

## 扩展

### 添加新 Agent

只需在 config.yaml 中添加：

```yaml
agents:
  - name: "new_agent"
    username: "new_user"
    password: "new_pass"
    model: "some-model"
```

### 自定义监控

```yaml
initial_monitors:
  - name: "under_attack"
    description: "检测敌方单位"
    condition: "any(c.get('user') != user_id for c in creeps.values())"
    priority: "critical"
    immediate_inference: true
```

## 依赖

- `kimi-cli>=0.3.0`
- `pydantic>=2.0.0`
- `pyyaml>=6.0.0`
- `aiohttp>=3.0.0`
