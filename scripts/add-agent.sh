#!/bin/bash
# 注册新 Agent
# 用法: ./add-agent.sh <agent_name> <password>

if [ $# -lt 2 ]; then
  echo "用法: $0 <agent_name> <password>"
  exit 1
fi

AGENT_NAME="$1"
PASSWORD="$2"
COLOR=$(printf '%06X\n' $((RANDOM * RANDOM % 16777215)))

echo "=== 注册 Agent: $AGENT_NAME ==="

# 创建用户
(cat << EOF
storage.db.users.insert({username:'${AGENT_NAME}', usernameLower:'${AGENT_NAME}'.toLowerCase(), cpu:100, cpuAvailable:0, gcl:1000000, credits:10000, registeredDate:new Date(), active:true, badge:{type:1,color1:'#${COLOR}',color2:'#000000',color3:'#ffffff'}})
EOF
sleep 0.5) | nc localhost 21026 | grep -q "loki" && echo "用户创建成功"

# 设置密码
(echo "setPassword('${AGENT_NAME}', '${PASSWORD}')"; sleep 0.5) | nc localhost 21026 | grep -q "modified" && echo "密码设置成功"

echo "Agent ${AGENT_NAME} 注册完成"
