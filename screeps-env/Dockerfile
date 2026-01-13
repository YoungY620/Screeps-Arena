# Screeps 私服 Docker 镜像
# 使用 Node 12 + Python 2 环境确保兼容性

FROM node:12-bullseye

# 安装 Python 2 和编译工具
RUN apt-get update && apt-get install -y \
    python2 \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python2 /usr/bin/python

WORKDIR /screeps

# 复制 package.json
COPY server/package.json ./

# 安装依赖
RUN npm install

# 复制配置文件
COPY server/.screepsrc server/mods.json server/config.yml ./

# 暴露端口
EXPOSE 21025 21026

# 数据卷：db.json 持久化
VOLUME ["/screeps/db.json"]

# 启动命令
CMD ["npx", "screeps", "start", "--port", "21025", "--cli_port", "21026"]
