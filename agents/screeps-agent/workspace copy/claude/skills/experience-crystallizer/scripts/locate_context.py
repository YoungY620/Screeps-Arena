import os
import sys
import hashlib
import json
import time
from pathlib import Path

def get_session_root():
    cwd = os.getcwd()
    # Kimi CLI uses md5 of absolute path
    path_hash = hashlib.md5(cwd.encode('utf-8')).hexdigest()
    return Path.home() / ".kimi" / "sessions" / path_hash

def tail_file(path, n=10):
    """Read last n lines of a file."""
    if not path.exists():
        return []
    
    try:
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            # Efficient implementation for large files would seek from end
            # For now, simplistic approach is fine as context files aren't massive logs
            lines = f.readlines()
            return lines[-n:]
    except Exception:
        return []

def locate_active_session(fingerprint=None):
    """
    Locate the session that contains the specific fingerprint in its latest logs.
    If fingerprint is None, fall back to the most recently modified file (less reliable).
    """
    sessions_root = get_session_root()
    if not sessions_root.exists():
        return None
        
    # Get all session directories
    candidates = []
    for p in sessions_root.iterdir():
        if p.is_dir() and (p / "context.jsonl").exists():
            candidates.append(p)
    
    if not candidates:
        return None
        
    # Sort by mtime descending (check newest first)
    candidates.sort(key=lambda x: (x / "context.jsonl").stat().st_mtime, reverse=True)
    
    # If no fingerprint provided, return the latest one
    if not fingerprint:
        return candidates[0] / "context.jsonl"
        
    # Scan for fingerprint
    # We only check the top 5 most recent sessions to save IO
    print(f"DEBUG: Scanning for fingerprint '{fingerprint}' in {len(candidates)} sessions...")
    
    for session_dir in candidates[:5]:
        context_file = session_dir / "context.jsonl"
        last_lines = tail_file(context_file, n=50) # Look at last 50 lines to be safe
        
        for line in last_lines:
            if fingerprint in line:
                return context_file
                
    return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        fingerprint = sys.argv[1]
    else:
        fingerprint = None
        
    result = locate_active_session(fingerprint)
    
    if result:
        print(f"FOUND:{result}")
    else:
        print("NOT_FOUND")
