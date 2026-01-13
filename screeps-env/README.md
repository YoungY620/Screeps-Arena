# Screeps 私服环境

本地 Screeps 私服，用于 AI Agent 开发测试。

## 快速开始

```bash
# 1. 启动服务器（终端 1）
./start.sh

# 2. 初始化 Agent（另开终端）
./init.sh

# 3. 启动客户端（终端 2）
./client.sh

# 4. 打开浏览器
open "http://localhost:8080/(http://localhost:21025)/"
```

## 脚本说明

| 脚本 | 用途 |
|------|------|
| `start.sh` | 启动服务器 |
| `stop.sh` | 停止服务 |
| `client.sh` | 启动 Web 客户端 |
| `init.sh` | 初始化 Agent（设置密码+清空代码）|
| `reset.sh` | 重置游戏数据 |
| `upload.sh` | 上传代码 |
| `cli.sh` | 连接管理 CLI |

## Agent 账户

初始化后可用的四个 Agent：

| Agent | 密码 |
|-------|------|
| MichaelBot | password |
| EmmaBot | password |
| AliceBot | password |
| JackBot | password |

## 上传代码

```bash
# 上传目录（所有 .js 文件）
./upload.sh MichaelBot ./my-bot/

# 上传单个文件
./upload.sh MichaelBot ./main.js
```

## 重置游戏

```bash
./reset.sh      # 重置数据
./start.sh      # 启动服务器
./init.sh       # 初始化 Agent
```

## 环境要求

- Node.js 12（服务器）
- Node.js 20（客户端）
- nvm

```bash
nvm install 12
nvm install 20
```

## 端口

| 端口 | 用途 |
|------|------|
| 21025 | 游戏 API |
| 21026 | 管理 CLI |
| 8080 | Web 客户端 |
