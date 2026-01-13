#!/bin/bash
# 停止 Screeps 服务器

docker stop screeps 2>/dev/null && echo "✓ 服务器已停止" || echo "服务器未运行"
