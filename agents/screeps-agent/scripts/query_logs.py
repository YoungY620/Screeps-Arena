#!/usr/bin/env python3
"""Query agent logs."""

import json
import sys
from pathlib import Path

def load_logs(agent: str) -> list:
    path = Path("data") / f"{agent}.jsonl"
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]

def cmd_sessions(agent: str):
    """List all sessions."""
    logs = load_logs(agent)
    sessions = {}
    for e in logs:
        sid = e.get("session", "")
        if not sid:
            continue
        if sid not in sessions:
            sessions[sid] = {"start": None, "end": None, "events": 0}
        sessions[sid]["events"] += 1
        if e["type"] == "start":
            sessions[sid]["start"] = e["ts"]
        elif e["type"] == "end":
            sessions[sid]["end"] = e["ts"]
            sessions[sid]["status"] = e.get("status", "?")
    
    for sid, info in sessions.items():
        status = info.get("status", "running")
        print(f"{sid}: {info['events']} events, status={status}")

def cmd_session(agent: str, session_id: str):
    """Show session details."""
    logs = load_logs(agent)
    for e in logs:
        if e.get("session", "").startswith(session_id):
            t = e["type"]
            ts = e["ts"][11:19]
            if t == "start":
                print(f"[{ts}] START")
                print(f"  Prompt: {e.get('prompt', '')[:100]}...")
            elif t == "end":
                print(f"[{ts}] END: {e.get('status', '?')}")
                if e.get("error"):
                    print(f"  Error: {e['error']}")
            elif t == "msg":
                print(f"[{ts}] {e['role']}: {e['content'][:80]}...")
            elif t == "tool":
                print(f"[{ts}] TOOL: {e['tool']}")
            elif t == "result":
                out = e.get("output", "") or e.get("error", "")
                print(f"[{ts}]   -> {out[:60]}...")

def cmd_tools(agent: str):
    """Show tool usage."""
    logs = load_logs(agent)
    from collections import Counter
    tools = Counter()
    for e in logs:
        if e["type"] == "tool":
            tools[e.get("tool", "?")] += 1
    for tool, count in tools.most_common():
        print(f"{tool}: {count}")

def cmd_tail(agent: str, n: int = 20):
    """Show last N events."""
    logs = load_logs(agent)
    for e in logs[-n:]:
        t = e["type"]
        ts = e["ts"][11:19]
        if t == "msg":
            print(f"[{ts}] {e['role']}: {e['content'][:60]}...")
        elif t == "tool":
            print(f"[{ts}] TOOL: {e['tool']}")
        elif t == "result":
            out = e.get("output", "")[:40] or e.get("error", "")[:40]
            print(f"[{ts}]   -> {out}...")
        else:
            print(f"[{ts}] {t.upper()}")

def main():
    if len(sys.argv) < 3:
        print("Usage: query_logs.py <agent> <command> [args]")
        print("Commands: sessions, session <id>, tools, tail [n]")
        sys.exit(1)
    
    agent = sys.argv[1]
    cmd = sys.argv[2]
    
    if cmd == "sessions":
        cmd_sessions(agent)
    elif cmd == "session" and len(sys.argv) > 3:
        cmd_session(agent, sys.argv[3])
    elif cmd == "tools":
        cmd_tools(agent)
    elif cmd == "tail":
        n = int(sys.argv[3]) if len(sys.argv) > 3 else 20
        cmd_tail(agent, n)
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()
