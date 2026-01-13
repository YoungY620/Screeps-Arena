#!/bin/bash
# 启动 Screeps 服务器 (Docker)

cd "$(dirname "$0")"

IMAGE_NAME="screeps-server"
CONTAINER_NAME="screeps"

# 构建镜像（如果不存在）
if ! docker image inspect $IMAGE_NAME >/dev/null 2>&1; then
    echo "首次运行，构建镜像..."
    docker build -t $IMAGE_NAME .
fi

# 停止已有容器
docker rm -f $CONTAINER_NAME 2>/dev/null

# 启动容器
docker run -d \
    --name $CONTAINER_NAME \
    -p 21025:21025 \
    -p 21026:21026 \
    -v "$(pwd)/server/db.json:/screeps/db.json" \
    $IMAGE_NAME

echo "=== Screeps 服务器 ==="
echo "游戏: http://localhost:21025"
echo "CLI:  localhost:21026"
echo ""
echo "查看日志: docker logs -f $CONTAINER_NAME"
