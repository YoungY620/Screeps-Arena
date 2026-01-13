#!/usr/bin/env python3
"""Run all Screeps AI agents."""
import asyncio
import sys
sys.path.insert(0, "src")
from screeps_agent.agent import main

if __name__ == "__main__":
    asyncio.run(main())
