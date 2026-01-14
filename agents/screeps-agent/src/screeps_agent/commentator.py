"""
Screeps AI Commentator - 纯文档驱动解说员

特点：
1. 只提供文档链接和查询方法，不提供硬编码状态
2. 工作目录是整个repo，可以读取所有agent日志
3. 除了解说文件外不能写任何文件
4. 第一轮提供完整指导，后续只需"再探再报"
"""

import asyncio
import json
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

from kaos.path import KaosPath
from kimi_cli.app import KimiCLI
from kimi_cli.session import Session


class CommentatorAgent:
    """纯文档驱动的游戏解说员"""
    
    def __init__(self, name: str, server_url: str, cli_port: int, 
                 interval: float, model: str, yolo: bool):
        self.name = name
        self.server_url = server_url
        self.cli_port = cli_port
        self.interval = interval
        self.model = model
        self.yolo = yolo
        
        # 工作目录是整个repo
        self.workspace = Path("/Users/moonshot/dev/local-screeps")
        
        # 解说记录文档（唯一可写文件）
        self.commentary_file = self.workspace / "agents" / "screeps-agent" / "workspace" / name / "game_commentary.md"
        self.commentary_file.parent.mkdir(parents=True, exist_ok=True)
        self.init_commentary_file()
        
        self.logger = None  # 不使用单独的logger
        self._kimi: Optional[KimiCLI] = None
        self._stop = asyncio.Event()
        self._first_run = True  # 标记是否是第一次运行
        
    def init_commentary_file(self):
        """初始化解说文档"""
        if not self.commentary_file.exists():
            self.commentary_file.write_text(f"""# 🎮 Screeps AI 大战解说记录

**解说员**: {self.name}  
**开始时间**: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}  
**服务器**: {self.server_url}

---

""")
    
    async def _init_kimi(self):
        """初始化 Kimi CLI - 工作目录是整个repo"""
        if not self._kimi:
            session = await Session.create(work_dir=KaosPath(str(self.workspace.absolute())))
            self._kimi = await KimiCLI.create(session, yolo=self.yolo, model_name=self.model)
    
    def _build_initial_prompt(self) -> str:
        """构建第一轮完整提示词"""
        
        # 构建 CLI 连接模板，避免 f-string 嵌套问题
        cli_port = str(self.cli_port)
        
        prompt = f"""你是一位专业的 Screeps 游戏解说员，负责解说一场精彩的 AI 大战！

## 🎮 你的任务

每隔一段时间，你需要：
1. 自主使用工具获取当前游戏状态
2. 分析所有 AI 玩家的行为
3. 发现有趣的变化和戏剧性时刻
4. 用诙谐幽默、充满戏剧性的语言进行解说

## 📚 重要学习资源

### Screeps 官方文档（必须阅读）
- 📖 游戏 API 完整参考: https://docs.screeps.com/api/
- 🎮 游戏机制详解: https://docs.screeps.com/index.html
- ⚔️ 战斗系统: https://docs.screeps.com/combat.html
- 🏗️ 建筑系统: https://docs.screeps.com/defense.html

### 服务器连接信息
- 🌐 服务器地址: {self.server_url}
- 🔧 CLI 端口: {cli_port}

### 数据获取方法（自主学习）

#### 1. HTTP API 查询
```bash
# 基础游戏信息
curl -s {self.server_url}/api/game/time
curl -s {self.server_url}/api/game/room-status?room=W5N5

# 用户相关信息 (需要时尝试)
curl -s {self.server_url}/api/user/stats
curl -s {self.server_url}/api/user/world-status
```

#### 2. CLI 命令查询 (通过 Shell 工具)
连接 CLI 的通用模板:
```bash
docker exec screeps node -e '
const net = require(\"net\");
const client = new net.Socket();
let output = \"\";
client.connect({cli_port}, \"localhost\", () => {{}});
client.on(\"data\", (data) => {{
  output += data.toString();
  if (output.includes(\"< \")) {{
    client.write(\"YOUR_COMMAND_HERE\\n\");
    setTimeout(() => {{
      console.log(output.split(\"\\n\").filter(l => !l.startsWith(\"< \")).join(\"\\n\"));
      client.destroy();
    }}, 1000);
  }}
}});
setTimeout(() => process.exit(0), 5000);
'
```

常用 CLI 命令：
- `storage.env.get("gameTime").then(t => print(t))` - 游戏时间
- `storage.db.users.find({{}}).toArray().then(users => print(JSON.stringify(users)))` - 所有用户
- `storage.db["rooms.objects"].find({{room: "W5N5"}}).toArray().then(o => print(JSON.stringify(o)))` - 房间对象

#### 3. Agent 日志分析
所有 agent 的日志文件位置：
- workspace/kimi/logs.jsonl
- workspace/claude/logs.jsonl  
- workspace/gpt/logs.jsonl
- workspace/gemini/logs.jsonl

使用 ReadFile 工具读取分析。

## 🎯 解说要点

### 要发现的有趣内容：
1. **经济竞争** 💰: 能量采集、单位生产、资源争夺
2. **军事冲突** ⚔️: 兵力对比、攻击行为、防御建设
3. **科技发展** 🚀: RCL 升级、新建筑、科技树
4. **战略布局** 🗺️: 房间选择、扩张意图、联盟可能
5. **戏剧性时刻** 🎭: 突然暴兵、意外损失、惊天逆转

### AI 玩家性格设定：
- **kimi**: 激进好战，喜欢闪电战
- **claude**: 稳重保守，擅长经济发展
- **gpt**: 变化多端，战术灵活
- **gemini**: 技术流，重视科技升级

## 🗣️ 解说风格要求

### 语言特色：
- **戏剧性**: "史诗级的大战即将爆发！"
- **人格化**: "kimi 这个战争狂魔又在憋大招了！"
- **预见性**: "根据这个发展趋势，接下来可能会..."
- **幽默性**: "claude 的工人宝宝们辛苦劳作的样子真让人心疼~"

### 常用表达：
```
"哇！XXX 突然暴兵 N 个，这是要搞事情啊！😱"
"XXX 的能量储备见底了，这是在走钢丝啊！⚡"
"XXX 默默升级到 RCL X，这个老阴比肯定在憋大招！🏆"
"XXX 的工蜂们疯狂采集，这是要经济碾压的节奏？💰"
"注意！XXX 和 XXX 之间可能有火药味，小心擦枪走火！🔥"
```

## ⚠️ 重要规则

1. **只能读不能写**: 除了解说文件外，绝对不能写入或修改任何文件
2. **自主发现**: 不要等待指示，主动发现有趣的内容
3. **基于事实**: 所有解说必须基于你实际获取到的数据
4. **持续学习**: 每轮都要重新查询最新状态

## 🛠️ 工具使用策略

建议的执行顺序：
1. 获取当前游戏时间
2. 查询所有用户状态
3. 分析各个房间的有趣变化
4. 读取 agent 日志了解行为意图
5. 生成精彩解说

记住：**只输出最终解说内容，不要输出任何分析过程！**

现在开始你的第一次精彩解说吧！🎤"""
        
        return prompt
    
    def _build_followup_prompt(self) -> str:
        """构建后续轮次的简洁提示词"""
        return "再探再报！用同样的风格继续解说最新战况。记住只输出解说内容。"
    
    async def _generate_commentary(self, prompt: str) -> str:
        """生成解说内容"""
        await self._init_kimi()
        
        try:
            cancel = asyncio.Event()
            commentary = ""
            
            async for msg in self._kimi.run(prompt, cancel, merge_wire_messages=True):
                if hasattr(msg, 'text'):
                    commentary += msg.text
                    
            return commentary
            
        except Exception as e:
            return f"解说出现技术故障: {e}"
    
    def _append_to_commentary(self, content: str):
        """追加解说到文档"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # 格式化解说内容
        formatted_content = f"""## ⏰ {timestamp}

{content}

---

"""
        
        # 追加到文件
        with open(self.commentary_file, 'a', encoding='utf-8') as f:
            f.write(formatted_content)
    
    async def run(self):
        """主运行循环"""
        print(f"[{self.name}] 🎤 解说员上线！工作目录: {self.workspace}")
        print(f"[{self.name}] 📚 我会自主学习文档，发现有趣的故事！")
        
        while not self._stop.is_set():
            try:
                # 选择提示词
                if self._first_run:
                    prompt = self._build_initial_prompt()
                    self._first_run = False
                    print(f"[{self.name}] 🎯 第一轮解说，提供完整指导...")
                else:
                    prompt = self._build_followup_prompt()
                    print(f"[{self.name}] 🎯 后续轮次，简洁模式...")
                
                # 生成解说内容
                commentary = await self._generate_commentary(prompt)
                
                if commentary:
                    print(f"[{self.name}] 🎤 生成了解说内容 ({len(commentary)} 字符)")
                    
                    # 追加到解说文档
                    self._append_to_commentary(commentary)
                    
                    # 打印部分解说内容
                    preview = commentary[:150] + "..." if len(commentary) > 150 else commentary
                    print(f"[{self.name}] 📝 {preview}")
                
            except Exception as e:
                print(f"[{self.name}] ❌ 解说过程中出现错误: {e}")
            
            # 等待下一轮
            try:
                await asyncio.wait_for(self._stop.wait(), self.interval)
                break
            except asyncio.TimeoutError:
                pass
        
        print(f"[{self.name}] 🎤 解说员下线，感谢观看！")
    
    def stop(self):
        """停止解说员"""
        self._stop.set()