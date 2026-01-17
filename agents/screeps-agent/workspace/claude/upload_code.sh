#!/bin/bash

# Read the main.js file and create a proper JSON payload
code_content=$(cat /Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/claude/main.js)

# Create JSON payload using Python to handle escaping properly
json_payload=$(python3 -c "
import json
code = open('/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/claude/main.js', 'r').read()
payload = {
    'branch': 'default',
    'modules': {
        'main': code
    }
}
print(json.dumps(payload))
")

# Upload the code
curl -s -X POST "http://localhost:21025/api/user/code" \
  -H "Content-Type: application/json" \
  -d "$json_payload"

echo "Code upload attempt completed"