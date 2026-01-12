#!/bin/bash
# 连接 Screeps CLI
# 用法: ./cli.sh [command]
# 示例: ./cli.sh "help()"
#       ./cli.sh  # 交互模式

if [ -n "$1" ]; then
  # 执行单个命令
  (echo "$1"; sleep 0.5) | nc localhost 21026
else
  # 交互模式
  echo "=== Screeps CLI ==="
  echo "输入 help() 获取帮助，Ctrl+C 退出"
  echo ""
  nc localhost 21026
fi
