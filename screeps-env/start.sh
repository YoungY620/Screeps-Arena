#!/bin/bash
# 启动 Screeps 服务器

cd "$(dirname "$0")/server"

# 设置环境
source ~/.nvm/nvm.sh && nvm use 12
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)" 2>/dev/null

echo "=== 启动 Screeps 服务器 ==="
echo "端口: 21025 (游戏) / 21026 (CLI)"
echo "按 Ctrl+C 停止"
echo ""

npx screeps start --port 21025 --cli_port 21026
