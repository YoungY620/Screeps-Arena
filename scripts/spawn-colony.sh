#!/bin/bash
# 为 Agent 创建殖民地
# 用法: ./spawn-colony.sh <agent_name> <room>

if [ $# -lt 2 ]; then
  echo "用法: $0 <agent_name> <room>"
  echo "可用房间: W0N0 - W10N10 (默认 11x11 地图)"
  exit 1
fi

AGENT_NAME="$1"
ROOM="$2"

echo "=== 在 $ROOM 为 $AGENT_NAME 创建殖民地 ==="

(cat << EOF
const user = storage.db.users.findOne({username:'${AGENT_NAME}'});
if (!user) {
  console.log('ERROR: 用户不存在');
} else {
  const userId = user._id;
  storage.db['rooms.objects'].insert({type:'spawn', room:'${ROOM}', x:25, y:25, name:'Spawn1', user:userId, hits:5000, hitsMax:5000, spawning:null, notifyWhenAttacked:true, store:{energy:300}, storeCapacityResource:{energy:300}});
  storage.db['rooms.objects'].update({room:'${ROOM}', type:'controller'}, {\$set:{user:userId, level:1, progress:0, downgradeTime:null}});
  console.log('SUCCESS: 殖民地创建完成');
}
EOF
sleep 1) | nc localhost 21026 | grep -E "SUCCESS|ERROR"
