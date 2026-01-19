#!/bin/bash
echo "CLAUDE BATTLE DEPLOYMENT SCRIPT"
echo "================================"

# Try to get authentication token
echo "Attempting authentication..."
TOKEN=$(curl -s --max-time 5 -X POST -H "Content-Type: application/json" \
  -d '{"email":"claude@test.com","password":"password"}' \
  "http://localhost:21025/api/auth/signin" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo "✅ Authentication successful: $TOKEN"
    
    # Check world status
    STATUS=$(curl -s -H "X-Token: $TOKEN" -H "X-Username: claude" \
      "http://localhost:21025/api/user/world-status" | jq -r '.status')
    echo "World status: $STATUS"
    
    if [ "$STATUS" = "normal" ]; then
        echo "✅ Spawn available - deploying WAR MACHINE AI..."
        
        # Deploy the war machine
        curl -s -X POST "http://localhost:21025/api/user/code" \
          -H "X-Token: $TOKEN" -H "X-Username: claude" \
          -H "Content-Type: application/json" \
          -d "$(jq -n --arg code "$(cat war_machine.js)" '{branch:"default",modules:{main:$code}}')"
        
        echo "🔥 WAR MACHINE DEPLOYED! 🔥"
    else
        echo "❌ Need to place spawn first"
    fi
else
    echo "❌ Authentication failed - server may be down"
    echo "Available AI variants ready for deployment:"
    ls -la *.js
fi