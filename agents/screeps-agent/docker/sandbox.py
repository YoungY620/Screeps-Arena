"""
Agent Sandbox Manager

为 agent 提供隔离的 Docker 容器执行环境。
支持两种模式：
- isolated: 每个 agent 独立容器（默认）
- shared: 所有 agent 共享一个容器，在不同子目录下工作

通过 SSHKaos 连接，所有文件操作和命令执行都在容器内进行。
"""

import asyncio
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, Literal

from kaos import Kaos
from kaos.ssh import SSHKaos


# =============================================================================
# Configuration
# =============================================================================

SandboxMode = Literal["isolated", "shared"]

@dataclass
class SandboxConfig:
    """沙箱容器配置"""
    host: str
    port: int
    username: str = "root"
    password: str = "sandbox"
    cwd: str = "/workspace"


@dataclass
class SandboxSettings:
    """沙箱全局设置"""
    mode: SandboxMode = "isolated"
    shared_port: int = 2200  # shared 模式下的 SSH 端口
    agents: list[str] = field(default_factory=lambda: ["kimi", "claude", "gpt", "gemini"])


# 默认设置
_settings = SandboxSettings()


def configure_sandbox(mode: SandboxMode = "isolated", shared_port: int = 2200, agents: list[str] = None):
    """
    配置沙箱模式。
    
    Args:
        mode: "isolated" - 每个 agent 独立容器
              "shared" - 所有 agent 共享一个容器
        shared_port: shared 模式下的 SSH 端口
        agents: agent 名称列表
    """
    global _settings
    _settings = SandboxSettings(
        mode=mode,
        shared_port=shared_port,
        agents=agents or ["kimi", "claude", "gpt", "gemini"],
    )


def get_sandbox_config(agent_name: str) -> SandboxConfig:
    """获取指定 agent 的沙箱配置"""
    # 统一的工作目录格式：/workspace_<agent_name>
    cwd = f"/workspace_{agent_name}"
    
    if _settings.mode == "shared":
        # 共享模式：所有 agent 使用同一个端口
        return SandboxConfig(
            host="localhost",
            port=_settings.shared_port,
            cwd=cwd,
        )
    else:
        # 隔离模式：每个 agent 独立端口
        agent_index = _settings.agents.index(agent_name) if agent_name in _settings.agents else 0
        return SandboxConfig(
            host="localhost",
            port=2201 + agent_index,  # 2201, 2202, 2203, 2204...
            cwd=cwd,
        )


# Docker 镜像名
IMAGE_NAME = "agent-sandbox"


# =============================================================================
# Docker Helpers
# =============================================================================

def _run_cmd(cmd: list[str], check: bool = True) -> subprocess.CompletedProcess:
    """运行命令并返回结果"""
    return subprocess.run(cmd, capture_output=True, text=True, check=check)


def _container_exists(name: str) -> bool:
    """检查容器是否存在"""
    result = _run_cmd(["docker", "ps", "-a", "--format", "{{.Names}}"], check=False)
    return name in result.stdout.split()


def _container_running(name: str) -> bool:
    """检查容器是否在运行"""
    result = _run_cmd(["docker", "ps", "--format", "{{.Names}}"], check=False)
    return name in result.stdout.split()


def build_sandbox_image() -> bool:
    """构建沙箱 Docker 镜像"""
    dockerfile_dir = Path(__file__).parent
    if not (dockerfile_dir / "Dockerfile").exists():
        print(f"[sandbox] Dockerfile not found in {dockerfile_dir}")
        return False
    
    print(f"[sandbox] Building image: {IMAGE_NAME}")
    result = _run_cmd(
        ["docker", "build", "-t", IMAGE_NAME, str(dockerfile_dir)],
        check=False
    )
    if result.returncode != 0:
        print(f"[sandbox] Build failed: {result.stderr}")
        return False
    return True


# =============================================================================
# Container Management - Isolated Mode
# =============================================================================

def _start_isolated_containers(workspace_root: Path) -> bool:
    """
    隔离模式：为每个 agent 启动独立容器。
    
    目录结构：
    workspace_root/
    ├── kimi/       -> agent-kimi:/workspace_kimi
    ├── claude/     -> agent-claude:/workspace_claude
    ├── gpt/        -> agent-gpt:/workspace_gpt
    └── gemini/     -> agent-gemini:/workspace_gemini
    """
    print("[sandbox] Mode: ISOLATED (each agent in separate container)")
    
    for i, agent_name in enumerate(_settings.agents):
        container_name = f"agent-{agent_name}"
        port = 2201 + i
        workspace_path = workspace_root / agent_name
        container_workspace = f"/workspace_{agent_name}"
        
        # 确保 workspace 目录存在
        workspace_path.mkdir(parents=True, exist_ok=True)
        
        # 如果容器已在运行，跳过
        if _container_running(container_name):
            print(f"[sandbox] {container_name} already running")
            continue
        
        # 如果容器存在但未运行，删除它
        if _container_exists(container_name):
            _run_cmd(["docker", "rm", "-f", container_name], check=False)
        
        # 启动容器
        print(f"[sandbox] Starting {container_name} (port {port})")
        result = _run_cmd([
            "docker", "run", "-d",
            "--name", container_name,
            "--hostname", container_name,
            "-p", f"{port}:22",
            "-v", f"{workspace_path.absolute()}:{container_workspace}:rw",
            "--add-host=host.docker.internal:host-gateway",
            "--restart", "unless-stopped",
            IMAGE_NAME
        ], check=False)
        
        if result.returncode != 0:
            print(f"[sandbox] Failed to start {container_name}: {result.stderr}")
            return False
    
    return True


def _stop_isolated_containers():
    """停止所有隔离模式的容器"""
    for agent_name in _settings.agents:
        container_name = f"agent-{agent_name}"
        if _container_exists(container_name):
            print(f"[sandbox] Stopping {container_name}")
            _run_cmd(["docker", "stop", container_name], check=False)
            _run_cmd(["docker", "rm", container_name], check=False)


# =============================================================================
# Container Management - Shared Mode
# =============================================================================

def _start_shared_container(workspace_root: Path) -> bool:
    """
    共享模式：所有 agent 共享一个容器。
    
    目录结构：
    workspace_root/
    ├── kimi/       -> agent-shared:/workspace_kimi
    ├── claude/     -> agent-shared:/workspace_claude
    ├── gpt/        -> agent-shared:/workspace_gpt
    └── gemini/     -> agent-shared:/workspace_gemini
    
    所有 agent 在同一个容器内，可以互相访问其他 agent 的文件。
    """
    print("[sandbox] Mode: SHARED (all agents in one container)")
    
    container_name = "agent-shared"
    port = _settings.shared_port
    
    # 确保每个 agent 的 workspace 目录存在
    for agent_name in _settings.agents:
        agent_workspace = workspace_root / agent_name
        agent_workspace.mkdir(parents=True, exist_ok=True)
    
    # 如果容器已在运行，跳过
    if _container_running(container_name):
        print(f"[sandbox] {container_name} already running")
        return True
    
    # 如果容器存在但未运行，删除它
    if _container_exists(container_name):
        _run_cmd(["docker", "rm", "-f", container_name], check=False)
    
    # 构建 volume 挂载参数：每个 agent 的目录挂载到 /workspace_<agent>
    volume_args = []
    for agent_name in _settings.agents:
        workspace_path = workspace_root / agent_name
        container_workspace = f"/workspace_{agent_name}"
        volume_args.extend(["-v", f"{workspace_path.absolute()}:{container_workspace}:rw"])
    
    # 启动容器
    print(f"[sandbox] Starting {container_name} (port {port})")
    cmd = [
        "docker", "run", "-d",
        "--name", container_name,
        "--hostname", container_name,
        "-p", f"{port}:22",
        *volume_args,
        "--add-host=host.docker.internal:host-gateway",
        "--restart", "unless-stopped",
        IMAGE_NAME
    ]
    result = _run_cmd(cmd, check=False)
    
    if result.returncode != 0:
        print(f"[sandbox] Failed to start {container_name}: {result.stderr}")
        return False
    
    return True


def _stop_shared_container():
    """停止共享容器"""
    container_name = "agent-shared"
    if _container_exists(container_name):
        print(f"[sandbox] Stopping {container_name}")
        _run_cmd(["docker", "stop", container_name], check=False)
        _run_cmd(["docker", "rm", container_name], check=False)


# =============================================================================
# Public API
# =============================================================================

def start_sandbox_containers(workspace_root: Path) -> bool:
    """
    启动沙箱容器。
    
    Args:
        workspace_root: workspace 目录的根路径
    
    Returns:
        是否成功启动
    """
    # 确保镜像存在
    result = _run_cmd(["docker", "images", "-q", IMAGE_NAME], check=False)
    if not result.stdout.strip():
        if not build_sandbox_image():
            return False
    
    print("[sandbox] Starting sandbox containers...")
    
    # 根据模式启动
    if _settings.mode == "shared":
        success = _start_shared_container(workspace_root)
    else:
        success = _start_isolated_containers(workspace_root)
    
    if not success:
        return False
    
    # 等待 SSH 就绪
    print("[sandbox] Waiting for SSH to be ready...")
    import time
    time.sleep(2)
    
    # 验证容器
    import socket
    if _settings.mode == "shared":
        port = _settings.shared_port
        try:
            with socket.create_connection(("localhost", port), timeout=2):
                print(f"[sandbox] ✓ agent-shared ready (port {port})")
        except (socket.timeout, ConnectionRefusedError):
            print(f"[sandbox] ✗ agent-shared not ready (port {port})")
            return False
    else:
        all_ready = True
        for i, agent_name in enumerate(_settings.agents):
            port = 2201 + i
            try:
                with socket.create_connection(("localhost", port), timeout=2):
                    print(f"[sandbox] ✓ agent-{agent_name} ready (port {port})")
            except (socket.timeout, ConnectionRefusedError):
                print(f"[sandbox] ✗ agent-{agent_name} not ready (port {port})")
                all_ready = False
        if not all_ready:
            return False
    
    return True


def stop_sandbox_containers():
    """停止所有沙箱容器"""
    print("[sandbox] Stopping sandbox containers...")
    
    if _settings.mode == "shared":
        _stop_shared_container()
    else:
        _stop_isolated_containers()
    
    print("[sandbox] All containers stopped")


# =============================================================================
# Sandbox Manager
# =============================================================================

class SandboxManager:
    """管理 agent 沙箱连接"""
    
    def __init__(self):
        self._connections: dict[str, SSHKaos] = {}
    
    async def get_kaos(self, agent_name: str) -> Kaos:
        """
        获取指定 agent 的 SSHKaos 实例。
        如果已连接则复用，否则创建新连接。
        """
        if agent_name not in _settings.agents:
            raise ValueError(f"Unknown agent: {agent_name}")
        
        # 共享模式下，每个 agent 需要独立连接（因为 cwd 不同）
        cache_key = agent_name
        
        if cache_key not in self._connections:
            config = get_sandbox_config(agent_name)
            self._connections[cache_key] = await SSHKaos.create(
                host=config.host,
                port=config.port,
                username=config.username,
                password=config.password,
                cwd=config.cwd,
                known_hosts=None,  # 跳过 host key 验证
            )
        
        return self._connections[cache_key]
    
    async def close(self, agent_name: Optional[str] = None):
        """关闭沙箱连接"""
        if agent_name:
            if agent_name in self._connections:
                del self._connections[agent_name]
        else:
            self._connections.clear()
    
    async def close_all(self):
        """关闭所有连接"""
        await self.close()


# 全局单例
_sandbox_manager: Optional[SandboxManager] = None


def get_sandbox_manager() -> SandboxManager:
    """获取全局 SandboxManager 实例"""
    global _sandbox_manager
    if _sandbox_manager is None:
        _sandbox_manager = SandboxManager()
    return _sandbox_manager


async def create_sandbox_kaos(agent_name: str) -> Kaos:
    """
    便捷函数：为指定 agent 创建沙箱 Kaos。
    
    Usage:
        kaos = await create_sandbox_kaos("kimi")
        set_current_kaos(kaos)
    """
    return await get_sandbox_manager().get_kaos(agent_name)
