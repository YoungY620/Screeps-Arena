# Binary Forensics & Recovery (二进制取证与恢复)

## Skill Description
针对看似"受损"或未知的私有二进制格式文件，通过系统性逆向工程恢复其结构与语义。特别适用于游戏存档、物联网固件、专有数据库等小型二进制blob的解析。

**核心哲学**: *看起来损坏的数据往往只是使用了错误解析协议的绝对正确的信息。*

## When to Use
- 遇到无法被标准工具识别的二进制文件（`file`命令返回`data`）
- 残留的`.save`, `.dat`, `.bin`文件，怀疑是损坏的游戏/应用存档
- 需要纠正既有解析中的字节序错误（大小端混淆）
- 文件头存在可识别字符串（如`SCRE`）但结构未知的私有格式

## Prerequisites
- 文件大小建议 < 10MB（便于人工检视），大文件需先采样
- 对工作领域的先验知识（如：游戏地图坐标范围、时间戳 epoch 起点等）

## Recovery Workflow (流程图)

```mermaid
graph TD
    A[获取二进制样本] --> B{熵检测}
    B -->|高熵| C[可能是压缩/加密<br/>尝试常见解压头]
    B -->|低熵| D[魔术字识别<br/>strings提取]
    
    D --> E[结构猜测]
    E --> F{有领域约束?}
    F -->|是| G[启发式字节序验证<br/>坐标/时间戳范围检查]
    F -->|否| H[双端解析对比]
    
    G --> I[识别数据类型]
    H --> I
    
    I --> J[Pascal字符串?]
    I --> K[紧凑型结构体?<br/>pack(1)]
    I --> L[变长字段?]
    
    J --> M[生成多格式输出]
    K --> M
    L --> M
    
    M --> N[创建Kaitai Struct定义]
    M --> O[Python解析器+验证]
    M --> P[可视化HTML报告]
    
    N --> Q[置信度标记<br/>确认 vs 可疑]
    O --> Q
    P --> Q
```

## Critical Checkpoints (关键检查点)

### 1. 字节序判定 (Endianness Heuristic)
**绝不假设小端序(Little-Endian)**，即使文件来自x86系统。

| 验证域 | 大端合理值 | 小端风险值 | 判定逻辑 |
|--------|-----------|-----------|---------|
| 游戏坐标 | 50 (0x0032) | 12800 (0x3200) | 检查是否超出物理边界(±120) |
| Unix时间戳 | 1.7e9 (2024年) | 4.5e10 (3361年) | 检查是否在合理时间范围 |
| 对象ID | 1001, 1002... | 260万, 650万... | 检查是否为小数字序列 |

**陷阱告警**: 先前解析文件(`legacy_parsed.json`)显示坐标12800，**这是小端误读的典型症状**。

### 2. 字符串格式识别
- **C风格**: `Spawn1 00` (null结尾) → 常见于Windows/标准C
- **Pascal风格**: `06 Spawn1` (长度前缀) → **常见于游戏存档、Pascal/Delphi、嵌入式系统**
- **残留填充**: 若看到`Spawn1 00 00 00`后跟非零数据，可能是固定宽度字段而非变长字符串

### 3. 内存对齐检测
观察16位或32位字段的偏移地址：
- 标准C结构体: 字段位于偶数地址(2的倍数)或4的倍数
- **紧凑结构体(packed)**: 可能出现于奇数地址(如本例中对象ID位于0x17)

**解决方案**: 使用Python `struct.unpack`逐字节重组，禁止直接Cast结构体指针。

## Common Pitfalls (常见陷阱)

### 🚫 陷阱1: 自动对齐假设
**症状**: 直接定义C结构体读取，导致后续字段全部错位。  
**修复**: 始终按字节流解析，显式处理每个字段的偏移量。

### 🚫 陷阱2: 坐标混淆
**症状**: 将世界坐标(World Coords: E50S50)与房间局部坐标(Room Local: x10,y20)混淆。  
**区分**: 世界坐标范围大(±120)，房间局部范围小(0-49)。

### 🚫 陷阱3: 静态语义臆断
**症状**: 将未知字段(如`0x14`的`02 00 00`)强行解释为CRC或魔法值。  
**纪律**: 单样本无法确定语义。必须标记为`unknown_prefix_type_1`，待多样本对比。

## Toolchain Commands (工具链速查)

```bash
# 基础检视
hexdump -C file.bin | head -20          # 标准十六进制视图
xxd -b file.bin | grep -E '^000000(0|1)' # 二进制位视图(看位域flags)
file file.bin                            # 文件类型(经常失败返回"data")
wc -c file.bin                           # 确认文件大小(是否对齐到2/4/8?)

# 字符串考古
strings -a -t x file.bin | head -10      # 提取所有ASCII，-t x显示偏移
strings -e l file.bin                    # 尝试UTF-16小端字符串

# Python快速验证
python3 -c "import struct; print(struct.unpack('>HH', b'\\x00\\x32\\x00\\x32'))"  # BE: (50,50)
python3 -c "import struct; print(struct.unpack('<HH', b'\\x00\\x32\\x00\\x32'))"  # LE: (12800,12800)

# 熵计算(判断加密/压缩)
python3 -c "import math,sys;d=open(sys.argv[1],'rb').read();h=[d.count(i)/len(d)for i in range(256)];e=-sum([p*math.log2(p)for p in h if p]);print(f'Entropy:{e:.2f}bits/byte')