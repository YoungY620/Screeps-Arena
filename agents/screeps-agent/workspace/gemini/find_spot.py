
import json
import sys
import os

def find_spots():
    terrain_path = 'terrain.json'
    if not os.path.exists(terrain_path):
        print("No terrain.json")
        return []

    with open(terrain_path, 'r') as f:
        data = json.load(f)

    terrain_str = data['terrain'][0]['terrain']
    spots = []
    
    # Prioritize center: iterate spirally or just sort by distance to center
    # For simplicity, just scan and sort later
    for y in range(5, 45):
        for x in range(5, 45):
            idx = y * 50 + x
            if terrain_str[idx] == '0': # Plain
                # Check neighbors for a 3x3 clear area
                clear = True
                for dy in [-1, 0, 1]:
                    for dx in [-1, 0, 1]:
                        n_idx = (y+dy) * 50 + (x+dx)
                        if terrain_str[n_idx] == '1':
                            clear = False
                            break
                    if not clear: break
                
                if clear:
                    spots.append((x, y))
    
    # Sort by distance to center (25, 25)
    spots.sort(key=lambda p: (p[0]-25)**2 + (p[1]-25)**2)
    return spots

if __name__ == "__main__":
    spots = find_spots()
    for s in spots:
        print(f"Found clear spot: {s[0]},{s[1]}")
