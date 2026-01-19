
import urllib.request
import json
import time
import find_spot

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
    spots = find_spot.find_spots()
    
    if not spots:
        print("No spots found!")
        return

    print(f"Found {len(spots)} spots. Trying the best ones...")
    
    for x, y in spots:
        print(f"Trying {x}, {y}...")
        res = place_spawn(token, room, x, y)
        if res.get('ok') == 1:
            print(f"SUCCESS at {x}, {y}!")
            return
        else:
            print(f"Failed: {res}")
            if "invalid room" in str(res):
                 # maybe wait a bit?
                 pass
        time.sleep(0.1)

if __name__ == "__main__":
    main()
