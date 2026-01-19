
import json
import os

workspace = "/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini"
main_js_path = os.path.join(workspace, "simple_main.js")

with open(main_js_path, "r") as f:
    code = f.read()

# Note: The CLI command needs the string to be JSON stringified again because it's being passed as a string literal in the command
# But here we are generating a JS script that runs in node.
# The node script defines `codeStr`.
# Then constructing the CLI command string: `modules: {main: ...}`
# The CLI expects the command to be valid JS.
# `insert({... modules: {main: "content"} ...})`
# So we need to JSON.stringify the codeStr to get a valid string literal for the CLI command.

script = f"""
const net = require('net');
const c = new net.Socket();
c.connect(21026, 'localhost');

const codeStr = {json.dumps(code)};
const codeLiteral = JSON.stringify(codeStr); 

const cmds = [
    `storage.db['users.code'].remove({{user: "gemini_id"}})`,
    `storage.db['users.code'].insert({{user: "gemini_id", branch: "default", modules: {{main: ${{codeLiteral}}}}, timestamp: Date.now()}})`,
    `storage.db['rooms.objects'].update({{room: "W9N8", type: "controller"}}, {{$set: {{user: "gemini_id", level: 2, progress: 0}}}});`,
    `storage.db['rooms.objects'].remove({{room: "W9N8", type: "spawn"}})`,
    `storage.db['rooms.objects'].insert({{type: "spawn", room: "W9N8", x: 25, y: 25, name: "Spawn1", user: "gemini_id", hits: 3000, hitsMax: 3000, structureType: "spawn", store: {{energy: 300}}, storeCapacityResource: {{energy: 300}}, notifyWhenAttacked: true}})`,
    `print("RESTORE COMPLETE")`
];

let step = 0;
c.on('data', d => {{
    // console.log(d.toString());
    if (d.toString().includes('< ')) {{
        if (step < cmds.length) {{
            c.write(cmds[step] + '\\n');
            step++;
        }} else {{
            c.destroy();
        }}
    }}
    if (d.toString().includes('RESTORE COMPLETE')) {{
        console.log('SUCCESS');
    }}
}});
setTimeout(() => process.exit(0), 10000);
"""

print(script)
