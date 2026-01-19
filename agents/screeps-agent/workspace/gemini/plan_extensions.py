
import json
import sys

def plan_extensions():
    try:
        with open('terrain.json', 'r') as f:
            data = json.load(f)
    except:
        print("No terrain.json")
        return

    terrain_str = data['terrain'][0]['terrain']
    spawn_x, spawn_y = 25, 28
    
    # Check spiral around spawn
    extensions = []
    checked = set()
    checked.add((spawn_x, spawn_y))
    
    queue = [(spawn_x, spawn_y)]
    
    # We need 5 extensions.
    # Pattern: Checkerboard or just adjacent is fine for now.
    
    for r in range(1, 6): # radius
        for dy in range(-r, r+1):
            for dx in range(-r, r+1):
                if max(abs(dx), abs(dy)) != r: continue
                
                x, y = spawn_x + dx, spawn_y + dy
                
                if x < 2 or x > 47 or y < 2 or y > 47: continue
                
                idx = y * 50 + x
                tile = terrain_str[idx]
                
                # 0=plain, 2=swamp. 1=wall (blocked)
                if tile == '1': continue
                
                # We also shouldn't build ON existing structures (like the spawn itself), 
                # but for this script we just check terrain.
                # The agent code will check for existing structures before building.
                
                print(f"Potential spot: {x}, {y} (Tile: {tile})")
                extensions.append((x, y))
                if len(extensions) >= 5:
                    return

if __name__ == "__main__":
    plan_extensions()
