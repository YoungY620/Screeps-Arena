#!/bin/bash
# 停止并删除 Screeps 服务器容器

docker stop screeps 2>/dev/null && echo "✓ 服务器已停止" || echo "服务器未运行"
