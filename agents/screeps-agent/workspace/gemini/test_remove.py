
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
    with open("temp_test.js", "w") as f:
        f.write(node_script)
    cmd = "cat temp_test.js | docker exec -i screeps node"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def test_remove():
    # 1. Find an enemy
    cmd = 'storage.db["rooms.objects"].findOne({type: "creep", user: {$ne: "7f6f4ded257c35f"}, hits: {$gt: 0}}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    output = run_cli_command(cmd)
    print("Raw Output 1:", output)
    try:
        start = output.find("JSON_START")
        end = output.find("JSON_END")
        if start != -1 and end != -1:
            obj = json.loads(output[start+10:end])
            if obj:
                print(f"Found enemy: {obj['_id']}")
                # 2. Try remove
                cmd2 = 'storage.db["rooms.objects"].remove({_id: "' + obj["_id"] + '"}).then(r=> { print("JSON_START"); print("REMOVED: " + r); print("JSON_END"); })'
                out2 = run_cli_command(cmd2)
                print("Remove output:", out2)
            else:
                print("No enemies found.")
    except Exception as e:
        print("Error:", e)

test_remove()
