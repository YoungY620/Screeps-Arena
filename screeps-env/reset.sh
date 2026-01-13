#!/bin/bash
# 重置游戏数据

cd "$(dirname "$0")"

read -p "确认重置所有数据? (y/N) " confirm
[ "$confirm" != "y" ] && [ "$confirm" != "Y" ] && echo "已取消" && exit 0

# 停止服务器
./stop.sh 2>/dev/null

# 从容器中获取初始 db.json
docker run --rm screeps-server cat /screeps/node_modules/@screeps/launcher/init_dist/db.json > server/db.json

echo "✓ 数据已重置"
echo ""
echo "下一步: ./start.sh 启动服务器，然后 ./init.sh 初始化 Agent"
