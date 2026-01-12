#!/bin/bash
# 上传 Agent 代码
# 用法: ./upload-code.sh <agent_name> <password> <code_file>

if [ $# -lt 3 ]; then
  echo "用法: $0 <agent_name> <password> <code_file>"
  exit 1
fi

AGENT_NAME="$1"
PASSWORD="$2"
CODE_FILE="$3"

cd "$(dirname "$0")/.."

# 使用 Node 12
source ~/.nvm/nvm.sh && nvm use 12 > /dev/null 2>&1

node << EOF
const { ScreepsAPI } = require('screeps-api');
const fs = require('fs');

async function upload() {
  const api = new ScreepsAPI({
    protocol: 'http',
    hostname: 'localhost',
    port: 21025,
    path: '/'
  });
  
  try {
    await api.auth('${AGENT_NAME}', '${PASSWORD}');
    const code = fs.readFileSync('${CODE_FILE}', 'utf8');
    await api.code.set('default', { main: code });
    console.log('代码上传成功: ${AGENT_NAME}');
  } catch (e) {
    console.error('错误:', e.message);
    process.exit(1);
  }
}

upload();
EOF
