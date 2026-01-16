# Agent Sandbox Container - Minimal
# 提供隔离的执行环境，通过 SSH 连接

FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 只安装必要的工具
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssh-server \
    curl \
    jq \
    netcat-openbsd \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# SSH 配置
RUN mkdir /var/run/sshd \
    && echo 'root:sandbox' | chpasswd \
    && sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config \
    && sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config

# 创建工作目录
RUN mkdir -p /workspace

WORKDIR /workspace

EXPOSE 22

CMD ["/usr/sbin/sshd", "-D"]
