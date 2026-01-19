
import subprocess
import json
import sys

def run_cli_command(js_command):
    js_command_safe = json.dumps(js_command) 
    node_script = f"""
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');
c.on('connect', () => {{ c.write({js_command_safe} + '\\n'); }});
let buffer = '';
c.on('data', d => {{
    buffer += d.toString();
    const s = buffer;
    if (s.includes('JSON_START') && s.includes('JSON_END')) {{
        console.log(s);
        c.destroy();
    }}
}});
setTimeout(() => {{ process.exit(0); }}, 3000);
"""
    with open("temp_check.js", "w") as f:
        f.write(node_script)
    cmd = "cat temp_check.js | docker exec -i screeps node"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def get_creeps():
    cmd = 'storage.db["rooms.objects"].find({type: "creep", user: "7f6f4ded257c35f"}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    output = run_cli_command(cmd)
    try:
        start = output.find("JSON_START")
        end = output.find("JSON_END")
        if start != -1 and end != -1:
            return json.loads(output[start+10:end])
    except: pass
    return []

creeps = get_creeps()
workers = [c for c in creeps if c.get("name", "").startswith("Worker")]
attackers = [c for c in creeps if c.get("name", "").startswith("Attacker")]
print(f"Workers: {len(workers)}")
print(f"Attackers: {len(attackers)}")
