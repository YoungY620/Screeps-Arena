#!/bin/bash
# 启动 Screeps 服务器
# 必须使用 Node 12 (x64) + Python 2.7

cd "$(dirname "$0")/server"

# 设置 Node 12 环境（必须！）
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12 || {
  echo "错误: 需要 Node 12"
  echo "运行: nvm install 12"
  exit 1
}

# 设置 Python 2.7 环境（可选，仅安装依赖时需要）
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
eval "$(pyenv init -)" 2>/dev/null

echo "=== 启动 Screeps 服务器 ==="
echo "Node: $(node --version) ($(node -p process.arch))"
echo "端口: 21025 (游戏) / 21026 (CLI)"
echo "按 Ctrl+C 停止"
echo ""

npx screeps start --port 21025 --cli_port 21026
