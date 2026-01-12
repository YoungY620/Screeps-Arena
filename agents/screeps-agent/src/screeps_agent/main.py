"""Main entry point for Screeps Agent."""

from __future__ import annotations

import argparse
import asyncio
import signal
import sys
from datetime import datetime
from pathlib import Path

from .config import load_config
from .multi_agent import MultiAgentManager
from .runner import InferenceResult


def create_argument_parser() -> argparse.ArgumentParser:
    """Create the argument parser."""
    parser = argparse.ArgumentParser(
        prog="screeps-agent",
        description="AI Agent for Screeps game - Multi-agent support",
    )
    
    parser.add_argument(
        "-c", "--config",
        type=str,
        default="config.yaml",
        help="Path to config file (YAML)",
    )
    
    parser.add_argument(
        "--server",
        type=str,
        default=None,
        help="Screeps server URL (overrides config)",
    )
    
    parser.add_argument(
        "--interval",
        type=float,
        default=None,
        help="Inference interval in seconds (default: 30)",
    )
    
    parser.add_argument(
        "--agent",
        type=str,
        default=None,
        help="Run only specific agent by name (default: all)",
    )
    
    parser.add_argument(
        "--once",
        action="store_true",
        help="Run inference once for each agent and exit",
    )
    
    parser.add_argument(
        "--no-yolo",
        action="store_true",
        help="Require approval for tool calls",
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose output",
    )
    
    return parser


async def on_inference_start(agent_name: str):
    """Called when an agent starts inference."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] 🤖 [{agent_name}] Starting inference...")


async def on_inference_end(agent_name: str, result: InferenceResult):
    """Called when an agent ends inference."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    
    if result.completed:
        status = "✅"
    elif result.cancelled:
        status = "⛔"
    else:
        status = "❌"
    
    print(f"[{timestamp}] {status} [{agent_name}] Inference {result.trigger} - {result.duration:.1f}s")
    
    if result.error:
        print(f"           Error: {result.error}")


async def run_multi_agent(config, verbose: bool = False, single_agent: str | None = None):
    """Run multiple agents in parallel."""
    # Filter to single agent if specified
    if single_agent:
        config.agents = [a for a in config.agents if a.name == single_agent]
        if not config.agents:
            print(f"Error: Agent '{single_agent}' not found in config")
            return 1
    
    if not config.agents:
        print("Error: No agents configured")
        return 1
    
    # Create manager
    manager = MultiAgentManager(config)
    
    # Register callbacks
    if verbose:
        manager.on_agent_inference_start(on_inference_start)
        manager.on_agent_inference_end(on_inference_end)
    
    # Print config summary
    print(f"\n{'=' * 60}")
    print(f"Screeps Multi-Agent Runner")
    print(f"{'=' * 60}")
    print(f"Server: {config.server.server_url}")
    print(f"Inference interval: {config.runner.inference_interval}s")
    print(f"YOLO mode: {config.runner.yolo}")
    print(f"\nAgents ({len(config.agents)}):")
    for agent in config.agents:
        print(f"  - {agent.name} (model: {agent.model or 'default'})")
    print(f"{'=' * 60}\n")
    
    # Set up signal handlers
    stop_event = asyncio.Event()
    
    def handle_signal(signum, frame):
        print("\n\n🛑 Received stop signal, shutting down...")
        stop_event.set()
    
    signal.signal(signal.SIGINT, handle_signal)
    signal.signal(signal.SIGTERM, handle_signal)
    
    # Start all agents
    await manager.start_all()
    
    try:
        # Wait for stop signal
        await stop_event.wait()
    finally:
        await manager.stop_all()
    
    return 0


async def run_once(config, verbose: bool = False, single_agent: str | None = None):
    """Run inference once for each agent."""
    from .runner import ScreepsAgentRunner
    from .screeps_client import AccountConfig
    
    # Filter to single agent if specified
    if single_agent:
        config.agents = [a for a in config.agents if a.name == single_agent]
        if not config.agents:
            print(f"Error: Agent '{single_agent}' not found in config")
            return 1
    
    if not config.agents:
        print("Error: No agents configured")
        return 1
    
    print(f"\n{'=' * 60}")
    print(f"Running single inference for {len(config.agents)} agent(s)...")
    print(f"{'=' * 60}\n")
    
    results = {}
    
    for agent in config.agents:
        print(f"[{agent.name}] Running inference (model: {agent.model or 'default'})...")
        
        runner = ScreepsAgentRunner(
            agent_account=agent,
            server_config=config.server,
            runner_config=config.runner,
        )
        
        try:
            result = await runner.run_once()
            results[agent.name] = result
            
            status = "✅ Completed" if result.completed else "❌ Failed"
            print(f"[{agent.name}] {status} in {result.duration:.1f}s")
            
            if result.error:
                print(f"[{agent.name}] Error: {result.error}")
        except Exception as e:
            print(f"[{agent.name}] ❌ Exception: {e}")
            results[agent.name] = None
    
    print(f"\n{'=' * 60}")
    print(f"Summary:")
    for name, result in results.items():
        if result and result.completed:
            print(f"  [{name}] ✅ Success")
        else:
            print(f"  [{name}] ❌ Failed")
    print(f"{'=' * 60}\n")
    
    return 0 if all(r and r.completed for r in results.values()) else 1


def main():
    """Main entry point."""
    parser = create_argument_parser()
    args = parser.parse_args()
    
    # Load config
    config_path = Path(args.config)
    if not config_path.exists():
        # Try relative to script location
        script_dir = Path(__file__).parent.parent.parent.parent
        config_path = script_dir / args.config
    
    config = load_config(config_path if config_path.exists() else None)
    
    # Apply command-line overrides
    if args.server:
        config.server.server_url = args.server
    if args.interval:
        config.runner.inference_interval = args.interval
    if args.no_yolo:
        config.runner.yolo = False
    
    # Run
    if args.once:
        exit_code = asyncio.run(run_once(config, verbose=args.verbose, single_agent=args.agent))
    else:
        exit_code = asyncio.run(run_multi_agent(config, verbose=args.verbose, single_agent=args.agent))
    
    sys.exit(exit_code)


if __name__ == "__main__":
    main()
