#!/bin/bash
# 重启所有 Screeps 服务
# 用法: ./restart.sh [--server-only]

cd "$(dirname "$0")/.."

echo "=== 停止服务 ==="
pkill -9 -f "screeps" 2>/dev/null && echo "已停止 screeps"
pkill -9 -f "steamless-client" 2>/dev/null && echo "已停止 steamless-client"
sleep 2

echo ""
echo "=== 启动服务器 ==="
./scripts/start.sh &
sleep 5

if [ "$1" != "--server-only" ]; then
  echo ""
  echo "=== 启动客户端 ==="
  ./scripts/start-client.sh &
  sleep 3
fi

echo ""
echo "=== 状态 ==="
lsof -i :21025 2>/dev/null | grep -q LISTEN && echo "✓ 服务器运行中 (端口 21025)" || echo "✗ 服务器未启动"
lsof -i :8080 2>/dev/null | grep -q LISTEN && echo "✓ 客户端运行中 (端口 8080)" || echo "✗ 客户端未启动"
echo ""
echo "访问: http://localhost:8080/(http://localhost:21025)/"
