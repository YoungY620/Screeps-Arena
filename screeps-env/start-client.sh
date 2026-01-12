#!/bin/bash
# 启动 Web 客户端 (steamless-client)

cd "$(dirname "$0")"

source ~/.nvm/nvm.sh && nvm use 20 > /dev/null 2>&1

echo "=== 启动 Screeps Web 客户端 ==="
echo "访问: http://localhost:8080/(http://localhost:21025)/"
echo "按 Ctrl+C 停止"
echo ""

npx screepers-steamless-client --host 0.0.0.0 --port 8080
