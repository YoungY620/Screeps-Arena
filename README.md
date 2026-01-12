# Screeps Private Server

本地 Screeps 私服环境，用于 AI Agent 开发和测试。

## 环境要求

- **Node.js 12** (通过 nvm，Screeps 依赖需要旧版本编译)
- **Node.js 20** (客户端需要)
- **Python 2.7** (通过 pyenv，node-gyp 需要)

```bash
# 安装 pyenv 和 Python 2.7
brew install pyenv
pyenv install 2.7.18
pyenv global 2.7.18

# 安装 Node 12 和 20
nvm install 12
nvm install 20
```

## 快速开始

### 1. 首次安装

```bash
./scripts/setup.sh
```

### 2. 启动服务

```bash
# 启动服务器（终端 1）
./scripts/start.sh

# 启动 Web 客户端（终端 2）
./scripts/start-client.sh
```

或使用便捷脚本：
```bash
./scripts/restart.sh          # 重启所有服务
./scripts/stop.sh             # 停止所有服务
```

### 3. 访问游戏

浏览器打开：
```
http://localhost:8080/(http://localhost:21025)/
```

**登录**：点击右上角 Sign In，输入用户名和密码（见下方注册用户）

### 4. 注册用户

```bash
./scripts/add-agent.sh <用户名> <密码>

# 示例
./scripts/add-agent.sh agent1 pass123
```

> 不需要邮箱验证，用户名即可登录。

### 5. 创建殖民地

```bash
./scripts/spawn-colony.sh <用户名> <房间>

# 示例
./scripts/spawn-colony.sh agent1 W0N0
```

### 6. 上传代码

```bash
./scripts/upload-code.sh <用户名> <密码> <代码文件>

# 示例
./scripts/upload-code.sh agent1 pass123 agents/main.js
```

## 查看历史录制

服务器已安装 `screepsmod-history`，自动录制游戏历史。

**查看方法**：
1. 在浏览器中进入房间视图（如 W0N0）
2. 按 **`H`** 键 或点击右上角 **⏱️ 时钟图标**
3. 底部出现时间轴，拖动滑块可回放历史

历史数据存储在 `server/history.db`。

## 脚本说明

| 脚本 | 用途 |
|------|------|
| `setup.sh` | 首次安装服务器和依赖 |
| `start.sh` | 启动游戏服务器 |
| `start-client.sh` | 启动 Web 客户端 |
| `stop.sh` | 停止所有服务 |
| `restart.sh` | 重启所有服务 |
| `cli.sh` | 连接管理 CLI |
| `init-map.sh` | 初始化 3x3 地图 |
| `reset.sh` | 重置所有游戏数据 |
| `add-agent.sh` | 注册新用户 |
| `spawn-colony.sh` | 为用户创建殖民地 |
| `upload-code.sh` | 上传用户代码 |

## CLI 管理

```bash
# 交互模式
./scripts/cli.sh

# 执行单个命令
./scripts/cli.sh "help()"
```

常用命令：
```javascript
// 查看用户
storage.db.users.find()

// 查看 spawn
storage.db['rooms.objects'].find({type:'spawn'})

// 设置 tick 速度（毫秒）
system.setTickDuration(100)

// 重置游戏
system.resetAllData()
```

## 端口配置

| 端口 | 用途 |
|------|------|
| 21025 | 游戏 API |
| 21026 | 管理 CLI |
| 8080 | Web 客户端 |

## 游戏配置

配置文件：`server/config.yml`

当前设置（加速模式）：
- **tickRate**: 200ms（5 倍速）
- **SOURCE_ENERGY_CAPACITY**: 10000（丰富能量）
- **HARVEST_POWER**: 8（快速采集）
- **UPGRADE_POWER**: 10（快速升级）

## 目录结构

```
├── scripts/          # 操作脚本
├── server/           # 服务器数据和配置
│   ├── .screepsrc    # 服务器配置
│   ├── config.yml    # 游戏常量配置
│   ├── mods.json     # 加载的 mods
│   └── history.db    # 历史录制数据
├── agents/           # Agent 代码
└── recordings/       # 视频录制输出（如有）
```

## 已安装 Mods

- **screepsmod-auth** - 用户认证（支持用户名密码登录）
- **screepsmod-admin-utils** - 管理工具（自定义游戏常量）
- **screepsmod-history** - 历史录制
