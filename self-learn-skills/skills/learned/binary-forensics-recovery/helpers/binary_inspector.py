#!/usr/bin/env python3
"""
Binary Inspector Helper - 可执行工具
快速检查二进制文件的关键特征
"""

import sys
import math
from pathlib import Path
from collections import Counter

class BinaryInspector:
    """轻量级二进制文件快速检视工具"""
    
    def __init__(self, filepath: Path):
        self.filepath = filepath
        self.data = filepath.read_bytes()
        self.size = len(self.data)
    
    def entropy(self) -> float:
        """计算香农熵 (0-8 bits)"""
        if not self.data:
            return 0.0
        counts = Counter(self.data)
        probs = [c/self.size for c in counts.values()]
        return -sum(p * math.log2(p) for p in probs if p > 0)
    
    def printable_ratio(self) -> float:
        """可打印ASCII字符比例 (用于判断是否为文本/结构化数据)"""
        printable = sum(1 for b in self.data if 32 <= b <= 126 or b in (9, 10, 13))
        return printable / self.size
    
    def null_ratio(self) -> float:
        """零字节比例"""
        return self.data.count(0) / self.size
    
    def likely_endianness(self) -> dict:
        """
        基于常见模式的字节序猜测
        返回评分字典
        """
        if self.size < 4:
            return {"unknown": 1.0}
        
        # 统计32位字中高字节为0的比例 (大端序中小数字会这样)
        big_endian_zeros = 0
        little_endian_zeros = 0
        samples = min(1000, self.size // 4)
        
        for i in range(0, samples * 4, 4):
            word = self.data[i:i+4]
            if word[0] == 0:  # 大端序高位在前，小数字高位常为0
                big_endian_zeros += 1
            if word[3] == 0:  # 小端序高位在后
                little_endian_zeros += 1
        
        be_ratio = big_endian_zeros / samples
        le_ratio = little_endian_zeros / samples
        
        # 启发式: 结构化数据通常包含许多小整数(0-255)，在大端表示中首字节为0
        if be_ratio > 0.3 and be_ratio > le_ratio + 0.1:
            return {"big": 0.7, "little": 0.3, "rationale": f"High byte zero ratio {be_ratio:.2f} suggests BE small integers"}
        elif le_ratio > 0.3 and le_ratio > be_ratio + 0.1:
            return {"little": 0.7, "big": 0.3, "rationale": f"Last byte zero ratio {le_ratio:.2f} suggests LE"}
        else:
            return {"ambiguous": 1.0, "note": "No clear endianness signature"}
    
    def find_magic(self) -> list:
        """寻找常见的魔术字"""
        magics = {
            b'\x89PNG': 'PNG image',
            b'GIF87a': 'GIF image',
            b'GIF89a': 'GIF image',
            b'\xff\xd8\xff': 'JPEG image',
            b'%PDF': 'PDF document',
            b'PK\x03\x04': 'ZIP archive',
            b'SCRE': 'Screeps Legacy Save (detected)',
        }
        found = []
        for magic, desc in magics.items():
            if magic in self.data[:20]:  # 通常在前20字节
                offset = self.data.index(magic)
                found.append((offset, magic.decode('latin1', errors='replace'), desc))
        return found
    
    def report(self):
        """生成快速报告"""
        print(f"File: {self.filepath}")
        print(f"Size: {self.size} bytes ({self.size/1024:.1f} KB)")
        print(f"Entropy: {self.entropy():.2f} bits/byte")
        
        e = self.entropy()
        if e > 7.5:
            print("  -> Likely encrypted or compressed (high entropy)")
        elif e < 2.0:
            print("  -> Likely sparse or highly structured (low entropy)")
        else:
            print("  -> Structured binary data")
        
        print(f"Printable ASCII: {self.printable_ratio()*100:.1f}%")
        print(f"Null bytes: {self.null_ratio()*100:.1f}%")
        
        magics = self.find_magic()
        if magics:
            print("\nMagic signatures found:")
            for offset, magic, desc in magics:
                print(f"  0x{offset:02x}: {magic} ({desc})")
        
        endian = self.likely_endianness()
        print(f"\nEndianness hint: {endian}")


def main():
    if len(sys.argv) != 2:
        print("Usage: binary_inspector.py <file>")
        sys.exit(1)
    
    inspector = BinaryInspector(Path(sys.argv[1]))
    inspector.report()


if __name__ == "__main__":
    main()