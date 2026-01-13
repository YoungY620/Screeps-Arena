#!/bin/bash
# 启动 Web 客户端

cd "$(dirname "$0")"
source ~/.nvm/nvm.sh && nvm use 20 > /dev/null 2>&1

echo "=== Web 客户端 ==="
echo "访问: http://localhost:8080/(http://localhost:21025)/"
echo ""

npx screepers-steamless-client --host 0.0.0.0 --port 8080
