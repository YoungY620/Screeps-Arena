#!/usr/bin/env python3
"""
Screeps AI Commentator - 独立解说员运行脚本

这个脚本专门运行解说员，不需要启动游戏 agent。
解说员会通过提示词中的文档链接自主获取游戏状态，发现有趣的故事。
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from screeps_agent.commentator import CommentatorAgent


async def main():
    """运行解说员"""
    print("🎤" * 20)
    print("Screeps AI 大战解说员上线啦！")
    print("我会通过文档链接自主获取游戏状态，发现有趣的故事！")
    print("🎤" * 20)
    
    # 创建解说员
    commentator = CommentatorAgent(
        name="commentator",
        server_url="http://localhost:21025",
        cli_port=21026,
        interval=45.0,  # 每45秒更新一次
        model="kimi-k2-turbo-preview",
        yolo=True
    )
    
    try:
        await commentator.run()
    except KeyboardInterrupt:
        print("\n🎤 解说员下线，感谢观看！")
        commentator.stop()


if __name__ == "__main__":
    asyncio.run(main())