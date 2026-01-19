
import subprocess
import time
import signal
import sys

def run_agent():
    proc = subprocess.Popen(["python3", "god_agent.py"], cwd="/Users/moonshot/dev/local-screeps/agents/screeps-agent/workspace/gemini")
    print("Agent started. Running for 30 seconds...")
    time.sleep(30)
    proc.send_signal(signal.SIGINT)
    proc.wait()
    print("Agent stopped.")

if __name__ == "__main__":
    run_agent()
