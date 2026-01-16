import sys
import json
from pathlib import Path

def analyze_log(file_path):
    path = Path(file_path)
    if not path.exists():
        print(f"Error: Context file not found at {path}")
        return

    try:
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Parse JSONL
    messages = []
    for line in lines:
        try:
            msg = json.loads(line)
            # Filter out checkpoints, usage stats, and system prompts to reduce noise
            if msg.get("role") in ["_checkpoint", "_usage", "system"]:
                continue
            messages.append(msg)
        except json.JSONDecodeError:
            continue

    if not messages:
        print("Log is empty or invalid.")
        return

    print(f"=== ANALYSIS REPORT FOR: {path.parent.name} ===")
    print("This report summarizes the interaction history to help you extract a skill.\n")

    # 1. Identify the Goal (First User Message)
    user_msgs = [m for m in messages if m.get("role") == "user"]
    if user_msgs:
        first_content = str(user_msgs[0].get("content"))
        print(f"--- ORIGINAL GOAL ---\n{first_content[:300]}...\n")

    # 2. Extract Errors & Pitfalls
    print("--- ENCOUNTERED ERRORS (POTENTIAL PITFALLS) ---")
    error_count = 0
    for msg in messages:
        if msg.get("role") == "tool":
            content = str(msg.get("content"))
            # Heuristic for errors
            if any(k in content for k in ["Error", "Exception", "Failed", "exit code: 1", "Traceback"]):
                error_count += 1
                # Show only the first line of error or a snippet
                snippet = content.split('\n')[0][:150]
                print(f"[Error #{error_count}] {snippet}")
    
    if error_count == 0:
        print("(No explicit errors detected in tool outputs)")

    print("\n--- CRITICAL TURNS (LAST 5 STEPS) ---")
    print("Focus on these steps to identify the solution.\n")

    # Show the last few exchanges in detail
    recent_history = messages[-10:] 
    for i, msg in enumerate(recent_history):
        role = msg.get("role").upper()
        content = msg.get("content")
        
        # Simplify content display
        if isinstance(content, list):
            # Extract text parts for readability
            text = ""
            for part in content:
                if isinstance(part, dict):
                    if part.get("type") == "text":
                        text += part.get("text", "")
                    elif part.get("type") == "tool_use":
                        text += f"[Tool Call: {part.get('name')}] "
            content = text
        else:
            content = str(content)

        # Truncate very long outputs
        if len(content) > 500:
            content = content[:500] + "... [truncated]"
            
        print(f"[{role}] {content}")

    print("\n=== INSTRUCTIONS FOR AGENT ===")
    print("1. Compare the 'Original Goal' with the 'Critical Turns'.")
    print("2. Identify what action finally solved the problem.")
    print("3. Check the 'Encountered Errors' to write the 'Common Pitfalls' section.")
    print("4. IGNORE the internal 'locate_context' and 'analyze_log' tool calls in the history.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: analyze_log.py <path_to_context_jsonl>")
        sys.exit(1)
        
    analyze_log(sys.argv[1])
