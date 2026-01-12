#!/bin/bash
# 初始化 3x3 随机地图（激进资源）

cd "$(dirname "$0")/../server"

echo "=== 初始化 3x3 地图 ==="

# 通过 CLI 执行命令
npx screeps cli --port 21026 << 'EOF'
// 生成 3x3 地图，每房间 4 个 source
const rooms = ['W0N0','W1N0','W2N0','W0N1','W1N1','W2N1','W0N2','W1N2','W2N2'];
for (const room of rooms) {
  map.generateRoom(room, { sources: 4 });
  console.log('Generated:', room);
}
console.log('=== 地图初始化完成 ===');
EOF

echo "地图已生成: W0N0 - W2N2 (3x3)"
