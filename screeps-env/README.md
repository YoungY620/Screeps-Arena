# Screeps Private Server

本地 Screeps 私服环境，用于 AI Agent 开发和测试。

## ⚠️ 重要：环境要求

Screeps 私服的原生依赖 (`isolated-vm`) 需要特定的编译环境：

| 依赖 | 版本 | 说明 |
|------|------|------|
| **Node.js** | **12.x** | 必须是 x64 版本，Apple Silicon 通过 Rosetta 2 运行 |
| **Python** | **2.7.x** | node-gyp 3.8.0 需要 Python 2 语法 |
| **Rosetta 2** | - | Apple Silicon Mac 必需 |

```bash
# 安装 Rosetta 2 (Apple Silicon)
softwareupdate --install-rosetta

# 安装 pyenv 和 Python 2.7
brew install pyenv
pyenv install 2.7.18
pyenv global 2.7.18

# 安装 Node 12
nvm install 12
```

> **为什么需要这么旧的环境？**
> 
> Screeps 私服依赖的 `isolated-vm` 和 `@screeps/driver` 包含原生 C++ 模块，
> 必须用 `node-gyp` 编译。这些包内置的 node-gyp 3.8.0 只支持 Python 2 语法，
> 且编译产物必须与 Node.js 运行时架构匹配。
> 
> 在 Apple Silicon Mac 上：
> - Node 12 只有 x64 版本，通过 Rosetta 2 运行
> - 编译出的 `.node` 文件也是 x64 架构
> - 如果用 arm64 的 Node 20+ 运行，会报架构不兼容错误

## 快速开始

### 1. 首次安装

```bash
./setup.sh
```

### 2. 启动服务

```bash
# 启动服务器（终端 1）
./start.sh

# 启动 Web 客户端（终端 2）
./start-client.sh
```

或使用便捷脚本：
```bash
./restart.sh          # 重启所有服务
./stop.sh             # 停止所有服务
```

### 3. 访问游戏

浏览器打开：
```
http://localhost:8080/(http://localhost:21025)/
```

**登录**：点击右上角 Sign In，输入用户名和密码

### 4. 注册用户

```bash
./add-agent.sh <用户名> <密码>

# 示例
./add-agent.sh agent1 pass123
```

> **注意**: 如果登录时提示 "Account credentials are invalid"，可能需要重新设置密码：
> ```bash
> (echo "setPassword('用户名', '密码')"; sleep 0.5) | nc localhost 21026
> ```

### 5. 创建殖民地

```bash
./spawn-colony.sh <用户名> <房间>

# 示例
./spawn-colony.sh agent1 W0N0
```

### 6. 上传代码

```bash
./upload-code.sh <用户名> <密码> <代码文件>

# 示例
./upload-code.sh agent1 pass123 agents/main.js
```

## 重置游戏

**完全重置**（推荐方法）：

```bash
# 1. 停止服务器
./stop.sh

# 2. 复制初始数据库模板
cp server/node_modules/@screeps/launcher/init_dist/db.json server/db.json

# 3. 启动服务器
./start.sh

# 4. 初始化地图
./init-map.sh

# 5. 添加用户和殖民地
./add-agent.sh kimi kimi123
./spawn-colony.sh kimi W0N0
```

> **注意**: 直接删除 db.json 会导致存储进程启动失败！必须从模板复制。

## CLI 管理

```bash
# 交互模式
./cli.sh

# 执行单个命令（需要 sleep 等待异步结果）
(echo "storage.db.users.count()"; sleep 0.5) | nc localhost 21026
```

### CLI 命令示例

```javascript
// 查看用户数量
storage.db.users.count()

// 查询用户（Promise 格式）
storage.db.users.findOne({username: 'kimi'}).then(u => JSON.stringify(u))

// 查看房间对象
storage.db['rooms.objects'].find({room: 'W0N0'}).then(o => JSON.stringify(o))

// 设置 tick 速度（毫秒）
system.setTickDuration(100)

// 当前游戏时间（仅在游戏运行时可用）
Game.time

// 设置用户密码（screepsmod-auth 提供）
setPassword('用户名', '密码')
```

> **关键**: 
> - 所有 `storage.db` 查询返回 Promise，必须用 `.then()` 处理！
> - 设置密码用 `setPassword()`，不是 `system.setPassword()`

## 端口配置

| 端口 | 用途 | IPv6 监听 |
|------|------|-----------|
| 21025 | 游戏 HTTP API | 是 |
| 21026 | 管理 CLI | 是 |
| 8080 | Web 客户端 | - |

> **注意**: 服务器默认监听 IPv6。如果程序连接失败，确保使用 IPv6 或 `localhost`。

## 游戏配置

配置文件：`server/config.yml`

当前设置（加速模式）：
- **tickRate**: 200ms（5 倍速）
- **SOURCE_ENERGY_CAPACITY**: 10000（丰富能量）
- **HARVEST_POWER**: 8（快速采集）
- **UPGRADE_POWER**: 10（快速升级）

## 目录结构

```
├── *.sh                    # 操作脚本
├── server/                 # 服务器数据和配置
│   ├── .screepsrc          # 服务器配置
│   ├── config.yml          # 游戏常量配置
│   ├── mods.json           # 加载的 mods
│   ├── db.json             # 游戏数据库（LokiJS）
│   └── node_modules/@screeps/launcher/init_dist/db.json  # 初始数据库模板
└── agents/                 # Agent 代码
```

## 已安装 Mods

- **screepsmod-auth** - 用户认证（支持用户名密码登录）
- **screepsmod-admin-utils** - 管理工具（自定义游戏常量）
- **screepsmod-history** - 历史录制

## 故障排除

### 引擎进程反复崩溃重启

**错误现象**：
```
[engine_main] process exited with code 1, restarting...
[engine_processor1] process exited with code 1, restarting...
```

**日志中的错误**：
```
Error: dlopen(...isolated_vm.node...): mach-o file, but is an incompatible architecture 
(have 'x86_64', need 'arm64')
```

**原因**：Node.js 运行时架构与编译的原生模块不匹配

**解决方法**：
1. 确保使用 **Node 12** 启动服务器（不是 Node 20+）
2. 如果依赖被错误的 Node 版本安装过，需要重新安装：
   ```bash
   # 切换到 Node 12 + Python 2.7
   nvm use 12
   pyenv global 2.7.18
   
   # 重新安装依赖
   cd server
   rm -rf node_modules package-lock.json
   npm install
   ```

### 存储进程启动失败

错误信息：
```
Error: Could not launch the storage process
TypeError: Cannot read properties of null (reading 'get')
```

**解决方法**：复制初始数据库模板
```bash
./stop.sh
cp server/node_modules/@screeps/launcher/init_dist/db.json server/db.json
./start.sh
```

### CLI 连接被拒绝

服务器可能还在启动中，等待几秒后重试：
```bash
sleep 10
nc -z localhost 21026 && echo "OK" || echo "FAIL"
```

### Python 程序连接失败

服务器监听 IPv6，确保程序支持 IPv6 连接：
```python
# 先尝试 IPv6，再尝试 IPv4
for family in (socket.AF_INET6, socket.AF_INET):
    sock = socket.socket(family, socket.SOCK_STREAM)
    try:
        sock.connect(('localhost', 21026))
        break
    except:
        sock.close()
```

### 登录失败 "Account credentials are invalid"

密码可能未正确设置，使用 CLI 重新设置：
```bash
(echo "setPassword('用户名', '密码')"; sleep 0.5) | nc localhost 21026
```

批量设置所有 Agent 密码：
```bash
for user in kimi claude gpt gemini; do
  (echo "setPassword('$user', '${user}123')"; sleep 0.5) | nc localhost 21026
done
```
