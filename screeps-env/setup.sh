#!/bin/bash
# 安装 Screeps 服务器和依赖
# 
# 重要：必须使用 Node 12 + Python 2.7
# - Node 12 是 x64 版本，在 Apple Silicon 上通过 Rosetta 2 运行
# - 这是因为 Screeps 的原生依赖 (isolated-vm) 需要旧版工具链编译

set -e
cd "$(dirname "$0")"

echo "=== 检查环境 ==="

# 检查 nvm
if ! command -v nvm &> /dev/null; then
  source ~/.nvm/nvm.sh 2>/dev/null || {
    echo "错误: 需要安装 nvm"
    echo "参考: https://github.com/nvm-sh/nvm"
    exit 1
  }
fi

# 检查 pyenv 和 Python 2.7
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"
if command -v pyenv &> /dev/null; then
  eval "$(pyenv init -)"
else
  echo "错误: 需要安装 pyenv 和 Python 2.7"
  echo "运行: brew install pyenv && pyenv install 2.7.18"
  exit 1
fi

# 检查 Rosetta 2 (Apple Silicon)
if [[ $(uname -m) == "arm64" ]]; then
  if ! arch -x86_64 /usr/bin/true 2>/dev/null; then
    echo "错误: 需要安装 Rosetta 2"
    echo "运行: softwareupdate --install-rosetta"
    exit 1
  fi
  echo "✓ Rosetta 2 已安装"
fi

# 使用 Node 12 (x64)
source ~/.nvm/nvm.sh
nvm install 12 2>/dev/null || true
nvm use 12

# 设置 Python 2.7
pyenv global 2.7.18 2>/dev/null || {
  echo "错误: 需要 Python 2.7.18"
  echo "运行: pyenv install 2.7.18"
  exit 1
}

echo "Node: $(node --version) ($(node -p process.arch))"
echo "Python: $(python --version 2>&1)"

echo ""
echo "=== 安装 Screeps 服务器 ==="

cd server
npm init -y 2>/dev/null || true
npm install screeps screepsmod-auth screepsmod-admin-utils screepsmod-history

# 初始化
echo "" | npx screeps init 2>/dev/null || true

# 配置 mods
cat > mods.json << 'EOF'
{
  "mods": [
    "node_modules/screepsmod-auth",
    "node_modules/screepsmod-admin-utils",
    "node_modules/screepsmod-history"
  ],
  "bots": {
    "simplebot": "node_modules/@screeps/simplebot/src"
  }
}
EOF

# 设置假 Steam Key（使用 screepsmod-auth 认证）
sed -i '' 's/steam_api_key = .*/steam_api_key = PLACEHOLDER_KEY/' .screepsrc 2>/dev/null || true

echo ""
echo "=== 安装完成 ==="
echo "运行 ./start.sh 启动服务器"
