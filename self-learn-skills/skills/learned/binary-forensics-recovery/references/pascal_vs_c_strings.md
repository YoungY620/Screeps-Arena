# Pascal 字符串 vs C 字符串识别指南

## 核心区别

| 特性 | C风格 (Null-terminated) | Pascal风格 (Length-prefixed) |
|------|------------------------|------------------------------|
| **结束标志** | `0x00` (NUL字符) | 无结束标志，靠长度字段 |
| **长度前缀** | 无 | 1字节(短)或4字节(长) |
| **最大长度** | 无理论上限(遇0为止) | 255(1字节)或4GB(4字节) |
| **在Hex中特征** | `... 53 70 61 77 6E 00 ...` | `... 06 53 70 61 77 6E ...` |
| **读取方式** | 线性扫描直到0 | 先读长度N，再读N字节 |
| **常见系统** | Unix/C标准 | Delphi/Pascal, 游戏存档, 网络协议 |

## 识别技巧

### 场景A: 您看到了可疑字符串 "Spawn1"
十六进制: `53 70 61 77 6E 31`

**检查前1字节**:
- 若前1字节是 `06` → **Pascal风格确认** (长度=6，正好匹配"Spawn1")
- 若前1字节是 `00` 或其他非6值 → 可能是C风格的一部分或字段填充

**检查后1字节**:
- 若后1字节是 `00` → **C风格确认**
- 若后1字节立即是下一个字段的数据(如`02`或其他非零) → 可能是Pascal且下一个字段紧邻

### 场景B: Unicode变体
现代游戏可能使用宽字符:
- **Pascal宽**: `06 00` (LE长度) + `53 00 70 00 ...` (UTF-16LE字符串)
- **C宽**: `53 00 70 00 ... 00 00` (双null结束)

## 内存对齐影响
在结构体中，Pascal字符串的布局有两种:

### 变体1: 紧凑打包 (Screeps Save使用)
```
[uint8_t len][char data[len]]  // 紧跟前一字段，无填充
```
- 总长度 = 1 + len
- 下一字段始于偏移: current + 1 + len

### 变体2: 固定宽度缓冲
```
[uint8_t len][char data[31]]  // 总是32字节，len表示有效长度
```
- 常用于数据库记录，节省重新分配开销
- 废弃部分用 `00` 或 `20`(空格)填充

## 恢复工具中的判断逻辑

```python
def guess_string_type(data: bytes, offset: int) -> str:
    prev_byte = data[offset-1] if offset > 0 else None
    next_after = data[offset+length] if offset+length < len(data) else None
    
    # Pascal检测: 前1字节数值等于字符串长度
    if prev_byte == length:
        return "pascal_compact"
    
    # C检测: 后1字节为0，且字符串内无0
    if next_after == 0 and 0 not in data[offset:offset+length]:
        return "c_null_terminated"
    
    # 固定宽度: 后面有大量00或空格填充
    if next_after == 0 and data[offset+length:offset+length+10].count(0) > 5:
        return "fixed_width_padded"
```

## 常见误判案例

**误判**: 将Pascal长度字节当成上一个字段的低位字节。
- **发生场景**: 小端序 machine-word 紧接着字符串。
- **例子**: `03 EA 06 53 70 ...`
  - 误读: 小端 `0xEA03` (数值59907) -> 字符串 -> 不合理的大数ID
  - 正解: ID `0x03EA` (1002大端) -> 长度 `0x06` -> 字符串 "Spawn..."

**检查**: 如果"数值字段"结果在100-10000之间(常见ID范围)，且接下来的字节是可打印ASCII，极可能是您把长度字节吃进了前一个整数。

## 参考
- Screeps Legacy Save: 使用1字节长度前缀，最大长度通常<32(对象名长度限制)