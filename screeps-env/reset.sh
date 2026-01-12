#!/bin/bash
# 重置游戏（清除所有数据）

cd "$(dirname "$0")/./server"

echo "=== 警告: 将清除所有游戏数据 ==="
read -p "确认重置? (y/N) " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
  npx screeps cli --port 21026 << 'EOF'
system.resetAllData();
console.log('数据已重置');
EOF
  echo "请重启服务器并运行 init-map.sh"
else
  echo "取消"
fi
