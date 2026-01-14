#!/bin/bash
# 重置游戏数据 - 使用预置的空地图

cd "$(dirname "$0")"

read -p "确认重置所有数据? (y/N) " confirm
[ "$confirm" != "y" ] && [ "$confirm" != "Y" ] && echo "已取消" && exit 0

# 停止并删除容器
docker stop screeps 2>/dev/null && echo "✓ 服务器已停止"
docker rm screeps 2>/dev/null && echo "✓ 容器已删除"

# 使用预置的空地图（干净地图，只有系统用户）
if [ -f "server/db_empty.json" ]; then
    cp server/db_empty.json server/db.json
    echo "✓ 已使用预置空地图重置"
else
    # 备用：从容器获取初始 db.json
    echo "警告: db_empty.json 不存在，使用默认初始化"
    docker run --rm screeps-server cat /screeps/node_modules/@screeps/launcher/init_dist/db.json > server/db.json
fi

echo ""
echo "下一步:"
echo "  1. ./start.sh  启动服务器"
echo "  2. ./init.sh   创建 Agent 用户 (kimi, claude, gpt, gemini)"
