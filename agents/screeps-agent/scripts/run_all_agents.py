#!/usr/bin/env python3
"""Run all Screeps AI agents with optional commentator."""
import asyncio
import sys
import argparse
sys.path.insert(0, "src")
from screeps_agent.agent import main
from screeps_agent.commentator import CommentatorAgent

async def run_with_commentator():
    """运行所有 agent 和解说员"""
    from screeps_agent.agent import Config
    
    cfg = Config.load("config.yaml")
    
    print("=" * 60)
    print("Screeps Multi-Agent + AI Commentator")
    print(f"Server: {cfg.server_url}:{cfg.cli_port}")
    print(f"Interval: {cfg.inference_interval}s")
    print(f"Agents: {[a['name'] for a in cfg.agents]}")
    print("=" * 60)
    
    # 创建解说员
    commentator = CommentatorAgent(
        name="commentator",
        server_url=cfg.server_url,
        cli_port=cfg.cli_port,
        interval=cfg.inference_interval * 2,  # 解说员更新频率慢一些
        model="kimi-k2-turbo-preview",  # 可以用其他模型
        yolo=cfg.yolo
    )
    
    # 运行 agent 主循环和解说员
    try:
        await asyncio.gather(
            main(),  # 运行原有 agent
            commentator.run()  # 运行解说员
        )
    except KeyboardInterrupt:
        print("\n正在停止所有服务...")
        commentator.stop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="运行 Screeps AI agents")
    parser.add_argument("--commentator", action="store_true", 
                       help="启用 AI 解说员")
    parser.add_argument("--commentator-only", action="store_true",
                       help="只运行解说员，不运行游戏 agent")
    
    args = parser.parse_args()
    
    if args.commentator_only:
        # 只运行解说员
        asyncio.run(run_with_commentator())
    elif args.commentator:
        # 运行 agent + 解说员
        asyncio.run(run_with_commentator())
    else:
        # 只运行原有 agent
        asyncio.run(main())