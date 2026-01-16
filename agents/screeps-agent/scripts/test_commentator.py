#!/usr/bin/env python3
"""
测试解说员功能的简单脚本
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from screeps_agent.commentator import CommentatorAgent


async def test_commentator():
    """测试解说员功能"""
    print("🎤 测试解说员功能...")
    
    # 创建测试解说员
    commentator = CommentatorAgent(
        name="test_commentator",
        server_url="http://localhost:21025",
        cli_port=21026,
        interval=10.0,  # 10秒测试间隔
        model="kimi-k2-turbo-preview",
        yolo=True
    )
    
    try:
        # 测试获取游戏时间
        print("测试获取游戏时间...")
        tick = await commentator._get_game_tick()
        print(f"当前游戏时间: Tick {tick}")
        
        # 测试获取 agent 信息
        print("测试获取 agent 信息...")
        agents_info = await commentator._get_all_agents_info()
        print(f"发现 {len(agents_info)} 个 agent:")
        for name, info in agents_info.items():
            print(f"  - {name}: {info.get('creep_count', 0)} 单位, {info.get('energy', 0)} 能量")
        
        # 测试读取日志
        print("测试读取 agent 日志...")
        logs = commentator._read_agents_logs()
        print(f"读取了 {len(logs)} 个 agent 的日志")
        
        # 测试解说生成
        print("测试生成解说内容...")
        prompt = commentator._generate_commentary_prompt(
            tick=tick,
            agents_info=agents_info,
            state_changes={},
            recent_logs=logs
        )
        
        print("解说提示词已生成，长度:", len(prompt))
        
        # 测试解说文档
        print("测试解说文档...")
        commentary = "🎮 测试解说内容：各路 AI 正在暗中较劲，精彩大战即将开始！"
        commentator._append_to_commentary(commentary, tick)
        print("解说内容已追加到文档")
        
        print("✅ 解说员功能测试完成！")
        
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_commentator())