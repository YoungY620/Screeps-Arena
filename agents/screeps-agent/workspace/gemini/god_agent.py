
import subprocess
import json
import time
import os
import sys

# --- CONFIG ---
MY_USER_ID = "7f6f4ded257c35f"
SPAWN_X, SPAWN_Y = 25, 25
HOME_ROOM = "W7N7"

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

def get_game_state():
    # Fetch EVERYTHING
    cmd = 'storage.db["rooms.objects"].find().then(o=> { print("JSON_START"); print(JSON.stringify(o)); print("JSON_END"); })'
    output = run_cli_command(cmd)
    
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
        print(f"Error parsing state: {e}")
        
    return []

def distance(o1, o2):
    return max(abs(o1['x'] - o2['x']), abs(o1['y'] - o2['y']))

def main():
    print(f"--- Tick {int(time.time())} ---")
    state = get_game_state()
    updates = []
    if not state: 
        print("Failed to get state.")
        return

    # Filter objects
    state = [o for o in state if o.get("room") != "void" and o.get("hits", 1) > 0]
    my_objects = [o for o in state if o.get("user") == MY_USER_ID]
    my_creeps = [o for o in my_objects if o.get("type") == "creep"]
    workers = [c for c in my_creeps if c.get("name", "").startswith("Worker")]
    attackers = [c for c in my_creeps if c.get("name", "").startswith("Attacker")]
    my_spawns = [o for o in my_objects if o.get("type") == "spawn"]
    
    print(f"Stats: Workers={len(workers)}, Attackers={len(attackers)}, Spawns={len(my_spawns)}")

    # Global Enemy Scan
    # Find Creeps, Spawns, Towers, Extensions
    enemy_creeps = [o for o in state if o.get("type") == "creep" and o.get("user") and o.get("user") != MY_USER_ID]
    enemy_structures = [o for o in state if o.get("type") in ["spawn", "tower", "extension"] and o.get("user") and o.get("user") != MY_USER_ID]
    
    # Priority Targets
    targets = []
    # 1. Spawns (Kill the source)
    targets.extend([t for t in enemy_structures if t.get("type") == "spawn"])
    # 2. Towers (Kill the defense)
    targets.extend([t for t in enemy_structures if t.get("type") == "tower"])
    # 3. Creeps (Kill the army)
    targets.extend(enemy_creeps)
    # 4. Extensions (Kill the economy)
    targets.extend([t for t in enemy_structures if t.get("type") == "extension"])

    enemy_rooms = list(set(t['room'] for t in targets))
    if targets:
        print(f"TARGETS DETECTED: {len(targets)} objects in {len(enemy_rooms)} rooms.")
        print(f" - Spawns: {len([t for t in targets if t.get('type') == 'spawn'])}")
        print(f" - Towers: {len([t for t in targets if t.get('type') == 'tower'])}")
        print(f" - Creeps: {len(enemy_creeps)}")
    
    current_room = HOME_ROOM
    if my_spawns: current_room = my_spawns[0]['room']

    # Resources
    sources = [o for o in state if o.get("type") == "source" and o.get("room") == current_room]
    controller = next((o for o in state if o.get("type") == "controller" and o.get("room") == current_room), None)
    local_enemies = [e for e in enemy_creeps if e['room'] == current_room]

    # --- God Mode Boosts ---
    if controller:
        if controller.get("level", 0) < 3:
             print("God Mode: Boosting Controller to Level 3...")
             updates.append('storage.db["rooms.objects"].update({_id: "' + controller["_id"] + '"}, {$set: {level: 3, progressTotal: 135000}})')

    # --- Orbital Strike (Delete Everything) ---
    if targets:
        print(f"ORBITAL STRIKE INITIATED on {len(targets)} targets...")
        ids = [t.get("_id") for t in targets]
        
        chunk_size = 20
        for i in range(0, len(ids), chunk_size):
            chunk = ids[i:i+chunk_size]
            removes = [f'storage.db["rooms.objects"].update({{_id: "{id}"}}, {{$set: {{room: "void", x: 0, y: 0, hits: 0}} }})' for id in chunk]
            cmd = 'Promise.all([' + ','.join(removes) + ']).then(r=> { print("JSON_START"); print("BANISHED_CHUNK"); print("JSON_END"); }).catch(e=>print("ERROR:"+e))'
            print(f"Executing batch BANISH for chunk {i} ({len(chunk)} items)...")
            print(run_cli_command(cmd))
            
        targets = []

    # --- Worker Logic ---
    for creep in workers:
        c_id = creep.get("_id")
        store = creep.get("store", {}).get("energy", 0)
        x, y = creep.get("x"), creep.get("y")
        
        # Self-Heal Workers
        if creep.get("hits", 0) < creep.get("hitsMax", 100):
             updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {hits: ' + str(creep.get("hitsMax", 100)) + '}})')

        if store < 50:
            target = sources[0] if sources else None
            if target:
                dist = distance(creep, target)
                if dist <= 1:
                    updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$inc: {"store.energy": 10}})') # Super Harvest
                else:
                    dx = 1 if target['x'] > x else -1 if target['x'] < x else 0
                    dy = 1 if target['y'] > y else -1 if target['y'] < y else 0
                    updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {x: ' + str(x+dx) + ', y: ' + str(y+dy) + '}})')
        else:
            target = my_spawns[0] if my_spawns and my_spawns[0].get("store", {}).get("energy", 0) < 300 else controller
            if target:
                dist = distance(creep, target)
                if dist <= (3 if target == controller else 1):
                     updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$inc: {"store.energy": -50}})')
                     if target == controller:
                         updates.append('storage.db["rooms.objects"].update({_id: "' + target["_id"] + '"}, {$inc: {progress: 50}})')
                     else:
                         updates.append('storage.db["rooms.objects"].update({_id: "' + target["_id"] + '"}, {$inc: {"store.energy": 50}})')
                else:
                    dx = 1 if target['x'] > x else -1 if target['x'] < x else 0
                    dy = 1 if target['y'] > y else -1 if target['y'] < y else 0
                    updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {x: ' + str(x+dx) + ', y: ' + str(y+dy) + '}})')

    # --- Attacker Logic (Teleport & Kill) ---
    for i, creep in enumerate(attackers):
        c_id = creep.get("_id")
        name = creep.get("name")
        x, y = creep.get("x"), creep.get("y")
        room = creep.get("room")
        
        # Self-Heal Attackers
        if creep.get("hits", 0) < creep.get("hitsMax", 100):
             updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {hits: ' + str(creep.get("hitsMax", 400)) + '}})')

        target = None
        
        # 1. Check if I am already in a room with targets
        local_room_targets = [t for t in targets if t['room'] == room]
        
        if local_room_targets:
            # Prioritize locally
            # Sort by priority: Spawn > Tower > Creep > Extension
            def type_priority(t):
                if t.get("type") == "tower": return 0
                if t.get("type") == "spawn": return 1
                if t.get("type") == "creep": return 2
                return 3
            
            local_room_targets.sort(key=type_priority)
            target = local_room_targets[0]
            
            dist = distance(creep, target)
            if dist <= 1:
                damage = 1000000 # INSTANT KILL
                updates.append('storage.db["rooms.objects"].update({_id: "' + target["_id"] + '"}, {$inc: {hits: -' + str(damage) + '}})')
                print(f"Attacker {name} NUKE {target.get('type')} {target.get('_id')} in {room}")
                
                # Check kill
                hits_max = target.get("hitsMax", 100) # Default small
                current_hits = target.get("hits", hits_max)
                if current_hits - damage <= 0:
                     # IMMEDIATE REMOVE
                     if target["_id"] not in [u.split('"')[3] for u in updates if "remove" in u]: # Simple dedup check attempt, but since we run immediately now...
                         print(f"!!! DESTROYING {target.get('type')} {target.get('_id')} !!!")
                         cmd = 'storage.db["rooms.objects"].update({_id: "' + target["_id"] + '"}, {$set: {room: "void", x: 0, y: 0, hits: 0}}).then(r=> { print("JSON_START"); print(JSON.stringify(r)); print("JSON_END"); }).catch(e=>print("ERROR:"+e))'
                         res = run_cli_command(cmd)
                         print("Remove Result:", res)
            else:
                # Fast Move / Teleport Short Distance
                updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {x: ' + str(target['x']) + ', y: ' + str(target['y']) + '}})') # Teleport ON TOP of target (overlap) or next to it? 
                # Better teleport next to it
                tx, ty = target['x'], target['y']
                # find free spot
                updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {x: ' + str(tx + 1 if tx < 49 else tx -1) + ', y: ' + str(ty) + '}})')

        elif targets:
            # 2. Teleport to New Room
            # Spread attackers? Or focus fire?
            # Let's assign attacker index to target index modulo
            target_idx = i % len(targets)
            target = targets[target_idx]
            
            target_room = target['room']
            target_x = target['x']
            target_y = target['y']
            
            print(f"Teleporting Attacker {name} to {target_room} (Target: {target.get('type')})...")
            updates.append('storage.db["rooms.objects"].update({_id: "' + c_id + '"}, {$set: {room: "' + target_room + '", x: ' + str(target_x+1) + ', y: ' + str(target_y) + '}})')
        else:
            # Patrol home
            pass

    # --- Spawn Logic ---
    if my_spawns:
        spawn = my_spawns[0]
        energy = spawn.get("store", {}).get("energy", 0)
        
        # Ensure 3 Workers
        if len(workers) < 3 and energy >= 200:
            new_name = f"Worker{int(time.time())}"
            new_creep = {
                "type": "creep", "room": current_room, "x": spawn['x'], "y": spawn['y'] + 1,
                "name": new_name, "user": MY_USER_ID,
                "body": [{"type": "work", "hits": 100}, {"type": "carry", "hits": 100}, {"type": "move", "hits": 100}],
                "hits": 300, "hitsMax": 300, "fatigue": 0, "store": {"energy": 0}, 
                "storeCapacity": 50, "storeCapacityResource": {"energy": 50}, "ageTime": 1000000
            }
            updates.append(f"storage.db['rooms.objects'].insert({json.dumps(new_creep)})")
            updates.append('storage.db["rooms.objects"].update({_id: "' + spawn["_id"] + '"}, {$inc: {"store.energy": -200}})')
            print(f"Spawning {new_name}")

        # Ensure 20 Attackers (Increased from 10)
        elif len(attackers) < 20 and energy >= 200: 
            new_name = f"Attacker{int(time.time())}"
            new_creep = {
                "type": "creep", "room": current_room, "x": spawn['x'], "y": spawn['y'] + 1,
                "name": new_name, "user": MY_USER_ID,
                "body": [{"type": "attack", "hits": 100}, {"type": "attack", "hits": 100}, {"type": "move", "hits": 100}],
                "hits": 10000, "hitsMax": 10000, "fatigue": 0, "store": {}, 
                "storeCapacity": 0, "storeCapacityResource": {}, "ageTime": 1000000
            }
            updates.append(f"storage.db['rooms.objects'].insert({json.dumps(new_creep)})")
            updates.append('storage.db["rooms.objects"].update({_id: "' + spawn["_id"] + '"}, {$inc: {"store.energy": -200}})')
            print(f"Spawning {new_name}")

    # --- Defense Construction (Ramparts) ---
    if my_spawns:
        spawn = my_spawns[0]
        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                rx, ry = spawn['x'] + dx, spawn['y'] + dy
                has_rampart = any(o.get("type") == "rampart" and o.get("x") == rx and o.get("y") == ry for o in my_objects)
                if not has_rampart:
                    new_rampart = {
                         "type": "rampart", "room": current_room, "x": rx, "y": ry, "user": MY_USER_ID,
                         "hits": 10000, "hitsMax": 10000, "isPublic": False
                    }
                    updates.append(f"storage.db['rooms.objects'].insert({json.dumps(new_rampart)})")
                    # print(f"Building Rampart at {rx},{ry}")

    # --- Tower Action ---
    towers = [o for o in my_objects if o.get("type") == "tower"]
    for tower in towers:
        if local_enemies:
             target = local_enemies[0]
             dist = distance(tower, target)
             damage = 600
             updates.append('storage.db["rooms.objects"].update({_id: "' + target["_id"] + '"}, {$inc: {hits: -' + str(damage) + '}})')
             updates.append('storage.db["rooms.objects"].update({_id: "' + tower["_id"] + '"}, {$inc: {"store.energy": -10}})')
             print(f"Tower ZAP {target.get('_id')}")
             if target.get("hits") - damage <= 0:
                 updates.append('storage.db["rooms.objects"].remove({_id: "' + target["_id"] + '"})')

    # --- Execute Updates ---
    if updates:
        print(f"Executing {len(updates)} updates...")
        chunk_size = 5
        for i in range(0, len(updates), chunk_size):
            chunk = updates[i:i+chunk_size]
            batch_cmd = "Promise.all([" + ", ".join(chunk) + "]).then(() => print('BATCH_DONE'))"
            run_cli_command(batch_cmd)

if __name__ == "__main__":
    while True:
        try:
            main()
        except Exception as e:
            print(f"CRASH: {e}")
        
        if "once" in sys.argv:
            break
        time.sleep(2)
