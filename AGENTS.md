# AGENTS.md - Local Screeps AI Arena

## 项目概述

本地 Screeps 私服 + 多 AI Agent 对战框架。

## 关键环境要求

### Screeps 服务器

| 依赖 | 版本 | 原因 |
|------|------|------|
| **Node.js** | **12.x (x64)** | Screeps 原生依赖需要旧版 Node |
| **Python** | **2.7.x** | node-gyp 3.8.0 使用 Python 2 语法 |
| **Rosetta 2** | - | Apple Silicon 运行 x64 程序 |

**为什么需要 Node 12？**

Screeps 私服依赖 `isolated-vm` 等原生 C++ 模块，编译后的 `.node` 文件必须与运行时 Node.js 架构匹配。
Node 12 只有 x64 版本，在 Apple Silicon 上通过 Rosetta 2 运行。

如果用 arm64 的 Node 20+ 运行服务器，会报错：
```
Error: dlopen(...isolated_vm.node...): mach-o file, but is an incompatible architecture 
(have 'x86_64', need 'arm64')
```

### AI Agent 框架

- Python 3.11+
- uv 包管理器

## 项目结构

```
local-screeps/
├── screeps-env/              # Screeps 私服
│   ├── server/               # 服务器目录
│   │   ├── db.json           # 游戏数据库
│   │   ├── config.yml        # 游戏配置
│   │   └── logs/             # 服务器日志
│   └── *.sh                  # 操作脚本
└── agents/
    └── screeps-agent/        # AI Agent 框架
        ├── src/              # 源代码
        ├── scripts/          # 运行脚本
        ├── workspace/        # Agent 代码
        └── data/             # JSONL 日志
```

## 常用命令

### 启动服务

```bash
# 服务器（必须用 Node 12）
cd screeps-env && ./start.sh

# AI Agents
cd agents/screeps-agent && uv run python scripts/run_all_agents.py
```

### 检查状态

```bash
# 游戏时间
curl -s http://localhost:21025/api/game/time

# 端口检查
nc -z localhost 21025 && nc -z localhost 21026
```

### 重置数据库

```bash
# 必须从模板复制，不能直接删除！
cp screeps-env/server/node_modules/@screeps/launcher/init_dist/db.json screeps-env/server/db.json
```

## 注意事项

1. **不要用 Node 20+ 启动服务器** - 会导致架构不兼容
2. **不要直接删除 db.json** - 会导致存储进程崩溃
3. **服务器监听 IPv6** - 程序连接时注意
4. **登录失败时重设密码** - 使用 `setPassword()` 而不是 `system.setPassword()`

## CLI 常用命令

```bash
# 设置用户密码（screepsmod-auth 提供）
(echo "setPassword('用户名', '密码')"; sleep 0.5) | nc localhost 21026

# 批量设置所有 Agent 密码
for user in kimi claude gpt gemini; do
  (echo "setPassword('$user', '${user}123')"; sleep 0.5) | nc localhost 21026
done
```
