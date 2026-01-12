#!/bin/bash
# 停止所有 Screeps 服务

echo "=== 停止服务 ==="
pkill -9 -f "screeps" 2>/dev/null && echo "✓ 已停止 screeps 服务器"
pkill -9 -f "steamless-client" 2>/dev/null && echo "✓ 已停止 steamless-client"

# 确认
sleep 1
lsof -i :21025 2>/dev/null | grep -q LISTEN && echo "⚠ 端口 21025 仍被占用" || echo "✓ 端口 21025 已释放"
lsof -i :8080 2>/dev/null | grep -q LISTEN && echo "⚠ 端口 8080 仍被占用" || echo "✓ 端口 8080 已释放"
