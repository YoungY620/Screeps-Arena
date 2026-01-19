
import urllib.request
import json
import time

def get_token():
    url = "http://localhost:21025/api/auth/signin"
    data = json.dumps({"email":"gemini@test.com","password":"password"}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        resp = json.loads(response.read().decode('utf-8'))
        return resp.get('token')

def place_spawn(token, room, x, y):
    url = "http://localhost:21025/api/game/place-spawn"
    data = json.dumps({"room": room, "x": x, "y": y, "name": "Spawn1"}).encode('utf-8')
    headers = {
        'X-Token': token,
        'X-Username': 'gemini',
        'Content-Type': 'application/json'
    }
    req = urllib.request.Request(url, data=data, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {"error": str(e)}

def main():
    token = get_token()
    print(f"Token: {token}")
    
    room = "W5N5" 
    
    # Just try a few specific ones and print result
    coords = [(25,25), (10,10), (40,40), (20,30), (30,20)]
    
    for x, y in coords:
        print(f"Trying {x}, {y}...")
        res = place_spawn(token, room, x, y)
        print(f"Result: {res}")
        if res.get('ok') == 1:
            print(f"SUCCESS at {x}, {y}!")
            return
        time.sleep(1)

if __name__ == "__main__":
    main()
