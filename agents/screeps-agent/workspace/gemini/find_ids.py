import subprocess
import json
import time

def run_cli_command(js_command):
    js_command_safe = json.dumps(js_command) 
    
    node_script = f"""
const net = require('net');
const c = new net.Socket();
c.connect(21026, '127.0.0.1');

c.on('connect', () => {{
    c.write({js_command_safe} + '\\n');
}});

let buffer = '';
c.on('data', d => {{
    buffer += d.toString();
    const s = buffer;
    if (s.includes('JSON_START') && s.includes('JSON_END')) {{
        console.log(s);
        c.destroy();
    }}
}});

c.on('error', e => console.error(e));
setTimeout(() => {{ process.exit(0); }}, 3000);
"""
    
    with open("temp_cli.js", "w") as f:
        f.write(node_script)
        
    cmd = "cat temp_cli.js | docker exec -i screeps node"
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def parse_json(output):
    try:
        start_marker = "JSON_START"
        end_marker = "JSON_END"
        start = output.find(start_marker)
        end = output.find(end_marker)
        if start != -1 and end != -1:
            raw = output[start+len(start_marker):end]
            j_start = raw.find('[')
            j_end = raw.rfind(']') + 1
            if j_start != -1 and j_end != -1:
                return json.loads(raw[j_start:j_end])
    except Exception as e:
        print(f"Error parsing: {e}")
    return []

def main():
    # 1. Get User ID
    cmd = 'storage.db.users.find({username: "gemini"}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    users = parse_json(run_cli_command(cmd))
    if users:
        print(f"User: {users[0]['username']} ID: {users[0]['_id']}")
        user_id = users[0]['_id']
    else:
        print("User gemini not found!")
        return

    # 2. Get Controller in W9N8
    cmd = 'storage.db["rooms.objects"].find({room: "W9N8", type: "controller"}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    controllers = parse_json(run_cli_command(cmd))
    # 3. Check Spawns in W9N8
    cmd = 'storage.db["rooms.objects"].find({room: "W9N8", type: "spawn"}).then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    spawns = parse_json(run_cli_command(cmd))
    if spawns:
        print(f"Spawns found: {len(spawns)}")
        print(json.dumps(spawns))
    else:
        print("No spawns found in W9N8.")

if __name__ == "__main__":
    main()
