import socket
import time
import json
import re

def send_command(command):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect(('localhost', 21026))
        
        # Read initial prompt
        data = b""
        while b"< " not in data:
            chunk = s.recv(1024)
            if not chunk: break
            data += chunk
            
        # Send command
        s.sendall((command + "\n").encode())
        
        # Read response
        response = b""
        while b"\n< " not in response:
            chunk = s.recv(4096)
            if not chunk: break
            response += chunk
            
        s.close()
        
        # Clean response
        text = response.decode('utf-8', errors='ignore')
        # Debug: print raw response to see what's happening
        print("RAW:", text)
        
        lines = text.split('\n')
        # Filter out the prompt lines
        result = [line for line in lines if not line.startswith('< ')]
        return '\n'.join(result).strip()
        
    except Exception as e:
        return str(e)

# Test simple math
print("Testing 1+1...")
print(send_command("1+1"))

# Check rooms
print("\nChecking rooms...")
cmd = "storage.db.rooms.find().then(r=>console.log(JSON.stringify(r)))"
print(send_command(cmd))

# Check objects in W5N5
print("\nChecking objects in W5N5...")
cmd = "storage.db['rooms.objects'].find({room: 'W5N5'}).then(o=>console.log(JSON.stringify(o)))"
print(send_command(cmd))
