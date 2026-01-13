#!/bin/bash
# 上传代码
# 用法: ./upload.sh <agent> <代码目录或文件>
# 示例: ./upload.sh MichaelBot ./my-bot/
#       ./upload.sh MichaelBot ./main.js

[ $# -lt 2 ] && echo "用法: $0 <agent> <代码目录或文件>" && exit 1

AGENT="$1"
CODE_PATH="$2" 
PASSWORD="password"
$(if [ -z "$CODE_PATH" ]; then CODE_PATH="agents/main-empty.js"; fi; echo)

cd "$(dirname "$0")"
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 12 > /dev/null 2>&1

node << EOF
const { ScreepsAPI } = require('screeps-api');
const fs = require('fs');
const path = require('path');

(async () => {
  const api = new ScreepsAPI({ protocol: 'http', hostname: 'localhost', port: 21025, path: '/' });
  await api.auth('${AGENT}', '${PASSWORD}');
  
  const codePath = '${CODE_PATH}';
  const stat = fs.statSync(codePath);
  let modules = {};
  
  if (stat.isDirectory()) {
    // 上传目录中所有 .js 文件
    fs.readdirSync(codePath).filter(f => f.endsWith('.js')).forEach(f => {
      const name = f.replace('.js', '');
      modules[name] = fs.readFileSync(path.join(codePath, f), 'utf8');
    });
  } else {
    // 上传单个文件作为 main
    modules.main = fs.readFileSync(codePath, 'utf8');
  }
  
  await api.code.set('default', modules);
  console.log('✓ ${AGENT} 代码已上传:', Object.keys(modules).join(', '));
})();
EOF
