#!/bin/bash
# 初始化四个 Agent（注册账户，不选择出生点）
# 用户名按模型短名称: kimi, claude, gpt, gemini

cd "$(dirname "$0")"

AGENTS="kimi claude gpt gemini"
PASSWORD="password"
CONTAINER_NAME="screeps"

# 检查容器是否运行
docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$" || { echo "错误: 服务器未运行，先执行 ./start.sh"; exit 1; }

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12 > /dev/null 2>&1

echo "=== 注册 Agent 账户 ==="

node << 'EOF'
const { ScreepsAPI } = require('screeps-api');

const agents = ['kimi', 'claude', 'gpt', 'gemini'];
const password = 'password';

(async () => {
  const api = new ScreepsAPI({ 
    protocol: 'http', 
    hostname: 'localhost', 
    port: 21025, 
    path: '/' 
  });
  
  for (const username of agents) {
    try {
      // 注册新用户
      const result = await api.raw.register.submit(
        username,
        `${username}@test.com`,
        password,
        { main: '// Empty' }
      );
      
      if (result.ok) {
        console.log(`✓ ${username} 注册成功`);
      } else {
        console.log(`✗ ${username} 注册失败:`, result.error || '未知错误');
      }
    } catch (err) {
      // 可能已存在，尝试设置密码
      if (err.message && err.message.includes('exists')) {
        console.log(`- ${username} 已存在`);
      } else {
        console.log(`✗ ${username} 错误:`, err.message);
      }
    }
  }
  
  console.log('');
  console.log('=== 完成 ===');
  console.log('Agent: kimi, claude, gpt, gemini');
  console.log('密码: password');
  console.log('状态: 未选择出生点 (empty)');
})();
EOF
