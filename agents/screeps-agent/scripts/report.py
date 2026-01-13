#!/usr/bin/env python3
"""Generate report from agent logs."""
import json
from pathlib import Path
from collections import defaultdict

def main():
    data_dir = Path(__file__).parent.parent / "data"
    workspace_dir = Path(__file__).parent.parent / "workspace"
    
    print("=" * 60)
    print("SCREEPS AGENT REPORT")
    print("=" * 60)
    
    for log_file in sorted(data_dir.glob("*.jsonl")):
        agent = log_file.stem
        if agent == "test":
            continue
            
        print(f"\n## {agent.upper()}")
        print("-" * 40)
        
        # Parse logs
        logs = [json.loads(line) for line in log_file.read_text().splitlines() if line]
        
        # Stats
        sessions = [l for l in logs if l["type"] == "start"]
        tools = [l for l in logs if l["type"] == "tool"]
        errors = [l for l in logs if l.get("status") == "error"]
        
        print(f"Sessions: {len(sessions)}")
        print(f"Tool calls: {len(tools)}")
        print(f"Errors: {len(errors)}")
        
        # Tool breakdown
        tool_counts = defaultdict(int)
        for t in tools:
            tool_counts[t.get("tool", "?")] += 1
        if tool_counts:
            print(f"Tools: {dict(tool_counts)}")
        
        # Code files
        ws = workspace_dir / agent
        if ws.exists():
            files = list(ws.glob("*.js"))
            if files:
                print(f"Code files: {[f.name for f in files]}")
                for f in files:
                    lines = len(f.read_text().splitlines())
                    print(f"  - {f.name}: {lines} lines")
        
        # Last activity
        if logs:
            last = logs[-1]
            print(f"Last: {last['ts'][:19]} - {last['type']}")

    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
