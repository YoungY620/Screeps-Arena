# Screeps Room Renderer

无需登录即可渲染 Screeps 私服房间截图。

## 安装

```bash
cd renderer
npm install
```

## 使用方法

### 基本截图（当前状态）
```bash
# 渲染指定房间当前状态
node capture.js <房间名> [输出文件名]

# 示例
node capture.js W6N5                    # 输出 W6N5_screenshot.png
node capture.js W5N5 my_room.png        # 输出 my_room.png
```

### 指定Tick截图（智能版本）
```bash
# 渲染指定房间的特定tick状态（支持多种模式）
node capture-tick-smart.js <房间名> <tick> [输出文件名] [选项]

# 基本用法
node capture-tick-smart.js W6N5 current                    # 当前状态
node capture-tick-smart.js W6N5 1000000                  # 尝试获取tick 1000000
node capture-tick-smart.js W6N5 1000000 --simulate      # 模拟tick 1000000的历史状态
node capture-tick-smart.js W6N5 saved W6N5_old.png       # 使用保存的数据文件

# 高级选项
node capture-tick-smart.js W6N5 50000 --simulate --save  # 模拟并保存数据
```

**注意**: 如果安装了screepsmod-history插件，会自动尝试获取真实历史数据；否则会提供模拟历史数据功能。

### 连接不同服务器
```bash
# 默认连接 http://localhost:21025，可通过环境变量修改
SCREEPS_SERVER=http://other-server:21025 node capture.js W5N5
SCREEPS_SERVER=http://other-server:21025 node capture-tick-smart.js W6N5 1000000
```

## 技术方案

### 最终确定的截图方法
经过多次测试和优化，最终采用以下方案：

1. **API数据获取**：通过Screeps API获取房间数据
   - `/api/game/room-objects` - 获取房间对象数据
   - `/api/game/room-terrain` - 获取地形数据
   - `/api/game/time` - 获取游戏时间
   - **指定tick**: 使用history插件的 `/api/room-history/{room}/{tick}.json` 端点

2. **渲染引擎**：使用官方 `@screeps/renderer` 库
   - 基于PIXI.js的高性能渲染
   - 支持完整的游戏视觉效果
   - 包含所有建筑、单位、地形等游戏元素

3. **截图技术**：Puppeteer无头浏览器
   - 900x900像素固定分辨率
   - 自动等待渲染完成
   - PNG格式输出

### 关键技术特点

- **完整资源支持**：包含150+游戏资源文件（SVG/PNG）
- **正确的数据格式**：修复了对象数组格式问题
- **自动缩放**：zoomLevel=0.18，完整显示50x50房间
- **错误处理**：完善的错误检测和超时机制
- **调试支持**：自动保存房间数据到JSON文件

## 输出规格

- **格式**：PNG
- **分辨率**：900x900像素
- **内容**：完整房间视图（50x50格子）
- **文件命名**：默认 `{房间名}_screenshot.png`

## 系统要求

- Node.js 18+
- Screeps 私服运行中
- 网络连接（获取API数据）

## 依赖库

- `@screeps/renderer` - 官方渲染引擎
- `@screeps/renderer-metadata` - 渲染元数据
- `puppeteer` - 无头浏览器截图
- `pixi.js` - 2D渲染引擎
- `node-fetch` - HTTP请求

## 故障排除

### 常见问题
1. **截图空白**：检查私服是否运行，API是否可访问
2. **资源加载失败**：确认resources目录包含完整资源文件
3. **渲染超时**：增加等待时间或检查数据格式
4. **历史tick截图失败**：确保已安装并启用screepsmod-history插件，检查history数据是否存在

### 指定Tick截图技术特点

#### 智能数据获取
- **自动检测history插件**: 优先尝试获取真实历史数据
- **多重API支持**: 尝试多个可能的history API端点
- **模拟历史功能**: 当真实历史不可用时，基于当前数据生成合理的模拟历史
- **保存状态支持**: 可以加载之前保存的房间状态数据

#### 模拟历史算法
- **Creep移动模拟**: 基于tick差异随机移动creep位置
- **能量消耗/再生**: 模拟source能量和creep携带能量的变化
- **时间一致性**: 确保模拟数据与目标tick的时间逻辑一致

#### 数据持久化
- **自动保存**: 生成的历史数据可以保存供后续使用
- **状态文件**: 支持从保存的JSON文件加载房间状态
- **调试支持**: 所有生成的数据都会保存为JSON文件便于分析

### 调试方法
- 查看生成的 `{房间名}_data.json` 文件确认数据
- 检查浏览器控制台输出（capture.js已启用console监听）
- 验证资源文件完整性

## 更新日志

- **2026-01-14**：新增智能指定tick截图功能（capture-tick-smart.js）
  - 支持真实历史数据获取（需要screepsmod-history插件）
  - 提供模拟历史数据生成功能
  - 支持从保存的状态文件加载数据
  - 多重API端点自动尝试机制
- **2026-01-14**：最终确定稳定版本，修复对象数组格式问题
- **2026-01-14**：完善资源映射，支持所有游戏元素
- **2026-01-14**：优化渲染参数，确保完整房间显示