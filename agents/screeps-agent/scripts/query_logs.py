#!/usr/bin/env python3
"""Query agent inference logs.

Usage:
    # List recent sessions for an agent
    python scripts/query_logs.py kimi sessions
    
    # Show details of a specific session
    python scripts/query_logs.py kimi session <session_id>
    
    # Show last N sessions
    python scripts/query_logs.py kimi sessions --last 5
    
    # Follow logs in real-time (like tail -f)
    python scripts/query_logs.py kimi tail
    
    # Search for text in logs
    python scripts/query_logs.py kimi search "spawn"
    
    # Show thinking content from recent sessions
    python scripts/query_logs.py kimi thinking
    
    # Show tool calls
    python scripts/query_logs.py kimi tools
    
    # Show errors
    python scripts/query_logs.py kimi errors
    
    # Export session to readable format
    python scripts/query_logs.py kimi export <session_id>
"""

import argparse
import json
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Iterator


def load_logs(agent_name: str, data_dir: str = "data") -> list[dict]:
    """Load all logs for an agent."""
    log_path = Path(data_dir) / f"{agent_name}.jsonl"
    if not log_path.exists():
        return []
    
    logs = []
    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    logs.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return logs


def iter_logs(agent_name: str, data_dir: str = "data") -> Iterator[dict]:
    """Iterate over logs for an agent."""
    log_path = Path(data_dir) / f"{agent_name}.jsonl"
    if not log_path.exists():
        return
    
    with open(log_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    yield json.loads(line)
                except json.JSONDecodeError:
                    pass


def get_sessions(logs: list[dict]) -> list[dict]:
    """Extract session summaries from logs."""
    sessions = {}
    
    for log in logs:
        session_id = log.get("session_id")
        if not session_id:
            continue
        
        if session_id not in sessions:
            sessions[session_id] = {
                "session_id": session_id,
                "agent": log.get("agent_name"),
                "events": 0,
                "tool_calls": 0,
                "thinking_blocks": 0,
            }
        
        s = sessions[session_id]
        s["events"] += 1
        
        event_type = log.get("event_type")
        if event_type == "session_start":
            s["started_at"] = log.get("timestamp")
            s["trigger"] = log.get("trigger")
            s["game_tick"] = log.get("game_tick")
        elif event_type == "session_end":
            s["ended_at"] = log.get("timestamp")
            s["status"] = log.get("status")
            s["duration_ms"] = log.get("duration_ms")
            s["error"] = log.get("error")
        elif event_type == "tool_call":
            s["tool_calls"] += 1
        elif event_type == "thinking":
            s["thinking_blocks"] += 1
    
    return sorted(sessions.values(), key=lambda x: x.get("started_at", ""), reverse=True)


def format_duration(ms: int | None) -> str:
    """Format duration in human readable form."""
    if ms is None:
        return "?"
    if ms < 1000:
        return f"{ms}ms"
    elif ms < 60000:
        return f"{ms/1000:.1f}s"
    else:
        return f"{ms/60000:.1f}m"


def format_timestamp(ts: str | None) -> str:
    """Format timestamp for display."""
    if not ts:
        return "?"
    try:
        dt = datetime.fromisoformat(ts)
        return dt.strftime("%Y-%m-%d %H:%M:%S")
    except (ValueError, TypeError):
        return ts[:19] if ts else "?"


def cmd_sessions(args):
    """List sessions."""
    logs = load_logs(args.agent, args.data_dir)
    sessions = get_sessions(logs)
    
    if args.last:
        sessions = sessions[:args.last]
    
    if not sessions:
        print(f"No sessions found for agent '{args.agent}'")
        return
    
    print(f"Sessions for {args.agent}:")
    print("-" * 100)
    print(f"{'Session ID':<40} {'Status':<10} {'Trigger':<12} {'Duration':<10} {'Tools':<6} {'Started'}")
    print("-" * 100)
    
    for s in sessions:
        session_id = s["session_id"][:38] if len(s.get("session_id", "")) > 38 else s.get("session_id", "?")
        status = s.get("status", "running")
        trigger = s.get("trigger", "?")[:10]
        duration = format_duration(s.get("duration_ms"))
        tools = s.get("tool_calls", 0)
        started = format_timestamp(s.get("started_at"))
        
        # Color status
        status_color = {
            "completed": "\033[92m",  # Green
            "failed": "\033[91m",     # Red
            "cancelled": "\033[93m",  # Yellow
            "running": "\033[94m",    # Blue
        }.get(status, "")
        reset = "\033[0m" if status_color else ""
        
        print(f"{session_id:<40} {status_color}{status:<10}{reset} {trigger:<12} {duration:<10} {tools:<6} {started}")


def cmd_session(args):
    """Show session details."""
    logs = load_logs(args.agent, args.data_dir)
    
    # Filter logs for this session
    session_logs = [l for l in logs if l.get("session_id", "").startswith(args.session_id)]
    
    if not session_logs:
        print(f"No logs found for session '{args.session_id}'")
        return
    
    print(f"Session: {session_logs[0].get('session_id')}")
    print("=" * 80)
    
    for log in session_logs:
        ts = format_timestamp(log.get("timestamp"))
        event = log.get("event_type", "?")
        
        if event == "session_start":
            print(f"\n[{ts}] 🚀 SESSION START")
            print(f"  Trigger: {log.get('trigger')}")
            print(f"  Game Tick: {log.get('game_tick')}")
            if log.get("extra", {}).get("user_prompt"):
                print(f"  Prompt: {log['extra']['user_prompt'][:200]}...")
        
        elif event == "session_end":
            status = log.get("status", "?")
            icon = {"completed": "✅", "failed": "❌", "cancelled": "⚠️"}.get(status, "❓")
            print(f"\n[{ts}] {icon} SESSION END")
            print(f"  Status: {status}")
            print(f"  Duration: {format_duration(log.get('duration_ms'))}")
            if log.get("error"):
                print(f"  Error: {log['error']}")
            if log.get("extra", {}).get("final_response"):
                print(f"  Response: {log['extra']['final_response'][:200]}...")
        
        elif event == "thinking":
            print(f"\n[{ts}] 💭 THINKING")
            content = log.get("content", "")
            # Indent thinking content
            for line in content.split("\n")[:10]:
                print(f"  {line}")
            if content.count("\n") > 10:
                print(f"  ... ({content.count(chr(10)) - 10} more lines)")
        
        elif event == "message":
            role = log.get("role", "?")
            icon = "👤" if role == "user" else "🤖"
            print(f"\n[{ts}] {icon} {role.upper()}")
            content = log.get("content", "")[:300]
            for line in content.split("\n"):
                print(f"  {line}")
        
        elif event == "tool_call":
            print(f"\n[{ts}] 🔧 TOOL CALL: {log.get('tool_name')}")
            if log.get("tool_input"):
                for k, v in log["tool_input"].items():
                    v_str = str(v)[:100]
                    print(f"  {k}: {v_str}")
        
        elif event == "tool_result":
            print(f"\n[{ts}] 📤 TOOL RESULT: {log.get('tool_name')}")
            if log.get("tool_output"):
                output = log["tool_output"][:200]
                print(f"  Output: {output}")
            if log.get("tool_error"):
                print(f"  Error: {log['tool_error']}")


def cmd_tail(args):
    """Follow logs in real-time."""
    log_path = Path(args.data_dir) / f"{args.agent}.jsonl"
    
    if not log_path.exists():
        print(f"Log file not found: {log_path}")
        print("Waiting for logs...")
        while not log_path.exists():
            time.sleep(1)
    
    print(f"Following {log_path} (Ctrl+C to stop)")
    print("-" * 60)
    
    with open(log_path, "r", encoding="utf-8") as f:
        # Go to end of file
        f.seek(0, 2)
        
        while True:
            line = f.readline()
            if line:
                try:
                    log = json.loads(line.strip())
                    event = log.get("event_type", "?")
                    ts = format_timestamp(log.get("timestamp"))
                    
                    # Compact format for tail
                    if event == "session_start":
                        print(f"[{ts}] 🚀 START {log.get('trigger')} (tick:{log.get('game_tick')})")
                    elif event == "session_end":
                        status = log.get("status", "?")
                        icon = {"completed": "✅", "failed": "❌", "cancelled": "⚠️"}.get(status, "❓")
                        print(f"[{ts}] {icon} END {status} ({format_duration(log.get('duration_ms'))})")
                    elif event == "thinking":
                        print(f"[{ts}] 💭 {log.get('content', '')[:80]}...")
                    elif event == "tool_call":
                        print(f"[{ts}] 🔧 {log.get('tool_name')}")
                    elif event == "tool_result":
                        err = " ❌" if log.get("tool_error") else ""
                        print(f"[{ts}] 📤 {log.get('tool_name')}{err}")
                    elif event == "message":
                        role = log.get("role", "?")
                        icon = "👤" if role == "user" else "🤖"
                        print(f"[{ts}] {icon} {log.get('content', '')[:60]}...")
                except json.JSONDecodeError:
                    pass
            else:
                time.sleep(0.5)


def cmd_search(args):
    """Search logs for text."""
    pattern = args.pattern.lower()
    
    print(f"Searching for '{args.pattern}' in {args.agent} logs:")
    print("-" * 60)
    
    matches = 0
    for log in iter_logs(args.agent, args.data_dir):
        log_str = json.dumps(log).lower()
        if pattern in log_str:
            matches += 1
            ts = format_timestamp(log.get("timestamp"))
            event = log.get("event_type", "?")
            session = log.get("session_id", "?")[:20]
            
            # Find where the match is
            content = ""
            if log.get("content") and pattern in log["content"].lower():
                content = log["content"][:100]
            elif log.get("tool_name") and pattern in log["tool_name"].lower():
                content = f"Tool: {log['tool_name']}"
            elif log.get("tool_output") and pattern in log.get("tool_output", "").lower():
                content = f"Output: {log['tool_output'][:100]}"
            
            print(f"[{ts}] {event:<15} {session} | {content}")
            
            if matches >= 50:
                print(f"... (showing first 50 matches)")
                break
    
    print(f"\nTotal matches: {matches}")


def cmd_thinking(args):
    """Show thinking content."""
    logs = load_logs(args.agent, args.data_dir)
    thinking_logs = [l for l in logs if l.get("event_type") == "thinking"]
    
    if args.last:
        thinking_logs = thinking_logs[-args.last:]
    
    print(f"Thinking blocks for {args.agent}:")
    print("=" * 80)
    
    for log in thinking_logs:
        ts = format_timestamp(log.get("timestamp"))
        session = log.get("session_id", "?")[:20]
        content = log.get("content", "")
        
        print(f"\n[{ts}] Session: {session}")
        print("-" * 40)
        print(content[:500])
        if len(content) > 500:
            print(f"... ({len(content) - 500} more chars)")


def cmd_tools(args):
    """Show tool calls."""
    logs = load_logs(args.agent, args.data_dir)
    tool_logs = [l for l in logs if l.get("event_type") in ("tool_call", "tool_result")]
    
    if args.last:
        tool_logs = tool_logs[-args.last * 2:]  # *2 for call+result pairs
    
    print(f"Tool calls for {args.agent}:")
    print("-" * 80)
    
    for log in tool_logs:
        ts = format_timestamp(log.get("timestamp"))
        event = log.get("event_type")
        tool = log.get("tool_name", "?")
        
        if event == "tool_call":
            print(f"\n[{ts}] 🔧 {tool}")
            if log.get("tool_input"):
                for k, v in list(log["tool_input"].items())[:3]:
                    print(f"    {k}: {str(v)[:60]}")
        else:
            if log.get("tool_error"):
                print(f"    ❌ Error: {log['tool_error'][:100]}")
            elif log.get("tool_output"):
                print(f"    ✓ {log['tool_output'][:100]}")


def cmd_errors(args):
    """Show errors."""
    logs = load_logs(args.agent, args.data_dir)
    
    error_logs = []
    for log in logs:
        if log.get("error") or log.get("tool_error") or log.get("status") == "failed":
            error_logs.append(log)
    
    if not error_logs:
        print(f"No errors found for {args.agent}")
        return
    
    print(f"Errors for {args.agent}:")
    print("-" * 80)
    
    for log in error_logs[-20:]:  # Last 20 errors
        ts = format_timestamp(log.get("timestamp"))
        session = log.get("session_id", "?")[:20]
        
        error = log.get("error") or log.get("tool_error") or "Failed session"
        print(f"[{ts}] {session} | {error[:100]}")


def cmd_export(args):
    """Export session to readable format."""
    logs = load_logs(args.agent, args.data_dir)
    session_logs = [l for l in logs if l.get("session_id", "").startswith(args.session_id)]
    
    if not session_logs:
        print(f"No logs found for session '{args.session_id}'")
        return
    
    # Build readable output
    output = []
    output.append(f"# Session: {session_logs[0].get('session_id')}")
    output.append(f"# Agent: {args.agent}")
    output.append("")
    
    for log in session_logs:
        event = log.get("event_type")
        
        if event == "session_start":
            output.append(f"## Session Start")
            output.append(f"- Trigger: {log.get('trigger')}")
            output.append(f"- Game Tick: {log.get('game_tick')}")
            output.append(f"- Time: {log.get('timestamp')}")
            if log.get("extra", {}).get("user_prompt"):
                output.append(f"\n### Prompt\n```\n{log['extra']['user_prompt']}\n```")
        
        elif event == "thinking":
            output.append(f"\n### Thinking\n{log.get('content', '')}")
        
        elif event == "message":
            role = log.get("role", "?").upper()
            output.append(f"\n### {role}\n{log.get('content', '')}")
        
        elif event == "tool_call":
            output.append(f"\n### Tool Call: {log.get('tool_name')}")
            if log.get("tool_input"):
                output.append("```json")
                output.append(json.dumps(log["tool_input"], indent=2))
                output.append("```")
        
        elif event == "tool_result":
            if log.get("tool_error"):
                output.append(f"\n**Error:** {log['tool_error']}")
            elif log.get("tool_output"):
                output.append(f"\n**Result:** {log['tool_output'][:500]}")
        
        elif event == "session_end":
            output.append(f"\n## Session End")
            output.append(f"- Status: {log.get('status')}")
            output.append(f"- Duration: {format_duration(log.get('duration_ms'))}")
            if log.get("error"):
                output.append(f"- Error: {log['error']}")
    
    print("\n".join(output))


def main():
    parser = argparse.ArgumentParser(description="Query agent inference logs")
    parser.add_argument("agent", help="Agent name (e.g., kimi, claude)")
    parser.add_argument("--data-dir", default="data", help="Data directory")
    
    subparsers = parser.add_subparsers(dest="command", required=True)
    
    # sessions
    p = subparsers.add_parser("sessions", help="List sessions")
    p.add_argument("--last", "-n", type=int, help="Show last N sessions")
    p.set_defaults(func=cmd_sessions)
    
    # session
    p = subparsers.add_parser("session", help="Show session details")
    p.add_argument("session_id", help="Session ID (or prefix)")
    p.set_defaults(func=cmd_session)
    
    # tail
    p = subparsers.add_parser("tail", help="Follow logs in real-time")
    p.set_defaults(func=cmd_tail)
    
    # search
    p = subparsers.add_parser("search", help="Search logs")
    p.add_argument("pattern", help="Search pattern")
    p.set_defaults(func=cmd_search)
    
    # thinking
    p = subparsers.add_parser("thinking", help="Show thinking content")
    p.add_argument("--last", "-n", type=int, default=10, help="Show last N blocks")
    p.set_defaults(func=cmd_thinking)
    
    # tools
    p = subparsers.add_parser("tools", help="Show tool calls")
    p.add_argument("--last", "-n", type=int, default=20, help="Show last N calls")
    p.set_defaults(func=cmd_tools)
    
    # errors
    p = subparsers.add_parser("errors", help="Show errors")
    p.set_defaults(func=cmd_errors)
    
    # export
    p = subparsers.add_parser("export", help="Export session to markdown")
    p.add_argument("session_id", help="Session ID (or prefix)")
    p.set_defaults(func=cmd_export)
    
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
