
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
    if (buffer.includes('JSON_END')) {{
        console.log(buffer);
        c.destroy();
    }}
}});
setTimeout(() => {{ if(!buffer.includes('JSON_END')) console.log(buffer); process.exit(0); }}, 3000);
"""
    with open("temp_nuke.js", "w") as f:
        f.write(node_script)
    cmd = "cat temp_nuke.js | docker exec -i screeps node"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def nuke():
    # Find Tower
    cmd = 'storage.db["rooms.objects"].findOne({type: "tower", user: {$ne: "7f6f4ded257c35f"}}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    out = run_cli_command(cmd)
    if "JSON_START" in out:
        start = out.find("JSON_START") + 10
        end = out.find("JSON_END")
        
        raw_part = out[start:end]
        j_start = raw_part.find('{')
        j_end = raw_part.rfind('}') + 1
        
        if j_start != -1 and j_end != -1:
            obj_str = raw_part[j_start:j_end]
            try:
                obj = json.loads(obj_str)
                if obj:
                    print(f"Targeting Tower: {obj['_id']} in {obj['room']}")
                    # NUKE IT
                    # 1. Update room to void
                    cmd1 = 'storage.db["rooms.objects"].update({_id: "' + obj["_id"] + '"}, {$set: {room: "void", x: 0, y: 0, hits: 0}})'
                    run_cli_command(cmd1)
                    print("Banished to void.")
                else:
                    print("No tower found.")
            except Exception as e:
                print("Error parsing:", e, "Raw:", obj_str)

nuke()
