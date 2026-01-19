
import subprocess
import json

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
    with open("temp_scan.js", "w") as f:
        f.write(node_script)
    cmd = "cat temp_scan.js | docker exec -i screeps node"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def scan():
    cmd = 'storage.db["rooms.objects"].find({type: "tower"}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    output = run_cli_command(cmd)
    try:
        start = output.find("JSON_START")
        end = output.find("JSON_END")
        if start != -1 and end != -1:
            data = json.loads(output[start+10:end])
            for t in data:
                print(f"Tower found: {t['_id']} in {t['room']} (User: {t.get('user')})")
    except: pass

scan()
