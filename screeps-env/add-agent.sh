#!/bin/bash
# 注册新 Agent
# 用法: ./add-agent.sh <agent_name> <password>
#
# 注意: 密码通过 screepsmod-auth 的 setPassword() 命令设置
# 如果登录时提示 "Account credentials are invalid"，请重新运行此脚本或手动设置密码：
#   (echo "setPassword('用户名', '密码')"; sleep 0.5) | nc localhost 21026

if [ $# -lt 2 ]; then
  echo "用法: $0 <agent_name> <password>"
  exit 1
fi

AGENT_NAME="$1"
PASSWORD="$2"
COLOR=$(printf '%06X\n' $((RANDOM * RANDOM % 16777215)))

echo "=== 注册 Agent: $AGENT_NAME ==="

# 检查服务器是否运行
if ! nc -z localhost 21026 2>/dev/null; then
  echo "错误: 服务器未运行，请先启动服务器"
  exit 1
fi

# 检查用户是否已存在
EXISTS=$((echo "storage.db.users.findOne({username:'${AGENT_NAME}'}).then(u => u ? 'exists' : 'not_found')"; sleep 0.5) | nc localhost 21026 | grep -o "exists\|not_found")

if [ "$EXISTS" = "exists" ]; then
  echo "用户 ${AGENT_NAME} 已存在，仅更新密码..."
else
  # 创建用户
  echo "创建用户..."
  (cat << EOF
storage.db.users.insert({username:'${AGENT_NAME}', usernameLower:'${AGENT_NAME}'.toLowerCase(), cpu:100, cpuAvailable:10000, gcl:10000000, credits:10000, registeredDate:new Date(), active:true, badge:{type:1,color1:'#${COLOR}',color2:'#000000',color3:'#ffffff'}})
EOF
  sleep 0.5) | nc localhost 21026 | grep -q "loki" && echo "✓ 用户创建成功" || echo "⚠ 用户创建可能失败"
fi

# 设置密码（使用 screepsmod-auth 提供的 setPassword 命令）
echo "设置密码..."
RESULT=$((echo "setPassword('${AGENT_NAME}', '${PASSWORD}')"; sleep 0.5) | nc localhost 21026)
if echo "$RESULT" | grep -q "modified"; then
  echo "✓ 密码设置成功"
else
  echo "⚠ 密码设置可能失败，请手动设置："
  echo "  (echo \"setPassword('${AGENT_NAME}', '${PASSWORD}')\"; sleep 0.5) | nc localhost 21026"
fi

echo ""
echo "Agent ${AGENT_NAME} 注册完成"
echo "登录信息: 用户名=${AGENT_NAME}, 密码=${PASSWORD}"
