#!/bin/bash
# 初始化四个 Agent（设置密码 + 清空代码）
# 使用默认 Bot: MichaelBot, EmmaBot, AliceBot, JackBot

cd "$(dirname "$0")"

AGENTS="MichaelBot EmmaBot AliceBot JackBot"
PASSWORD="password"
CONTAINER_NAME="screeps"

# 检查容器是否运行
docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" || { echo "错误: 服务器未运行，先执行 ./start.sh"; exit 1; }

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12 > /dev/null 2>&1

echo "=== 初始化 Agent ==="

# 通过 Docker 容器内的 CLI 一次性设置所有密码
docker exec -i $CONTAINER_NAME sh -c "(
echo \"setPassword('MichaelBot', '$PASSWORD')\"
sleep 0.2
echo \"setPassword('EmmaBot', '$PASSWORD')\"
sleep 0.2
echo \"setPassword('AliceBot', '$PASSWORD')\"
sleep 0.2
echo \"setPassword('JackBot', '$PASSWORD')\"
sleep 0.3
) | npx screeps cli" > /dev/null 2>&1 &
CLI_PID=$!

# 等待密码设置完成（最多10秒）
sleep 3
kill $CLI_PID 2>/dev/null
echo "✓ 密码已设置"

# 清空代码
node << 'EOF'
const { ScreepsAPI } = require('screeps-api');
(async () => {
  const api = new ScreepsAPI({ protocol: 'http', hostname: 'localhost', port: 21025, path: '/' });
  for (const agent of ['MichaelBot', 'EmmaBot', 'AliceBot', 'JackBot']) {
    await api.auth(agent, 'password');
    await api.code.set('default', { main: '// Empty' });
  }
  console.log('✓ 代码已清空');
})();
EOF

echo ""
echo "=== 完成 ==="
echo "Agent: MichaelBot, EmmaBot, AliceBot, JackBot"
echo "密码: password"
