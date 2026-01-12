"""Configuration management for Screeps Agent."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class AgentAccount:
    """Single agent account configuration - only credentials and model, everything else is dynamic."""
    
    name: str  # Agent identifier (e.g., "agent1")
    username: str
    password: str
    model: str | None = None  # Model name to use (None = use default)


@dataclass
class ServerConfig:
    """Screeps server configuration - shared across all agents."""
    
    server_url: str = "http://localhost:21025"
    cli_port: int = 21026


@dataclass
class RunnerConfig:
    """Runner configuration - shared across all agents."""
    
    # Inference interval in seconds
    inference_interval: float = 30.0
    
    # Signal check interval in seconds
    signal_check_interval: float = 1.0
    
    # Grace period for high priority signals (seconds)
    high_priority_delay: float = 5.0
    
    # Whether to auto-approve all tool calls
    yolo: bool = True
    
    # Maximum inference duration before timeout
    max_inference_duration: float = 120.0


@dataclass
class MultiAgentConfig:
    """Configuration for multiple agents."""
    
    # Server config (shared)
    server: ServerConfig = field(default_factory=ServerConfig)
    
    # Runner config (shared)
    runner: RunnerConfig = field(default_factory=RunnerConfig)
    
    # Agent accounts
    agents: list[AgentAccount] = field(default_factory=list)
    
    # Custom system prompt (optional)
    system_prompt: str | None = None
    
    # Custom turn prompt template (optional)
    turn_prompt_template: str | None = None
    
    # Initial monitors (shared across all agents)
    initial_monitors: list[dict[str, Any]] = field(default_factory=list)
    
    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "MultiAgentConfig":
        """Create config from dictionary."""
        server_data = data.get("server", {})
        runner_data = data.get("runner", {})
        agents_data = data.get("agents", [])
        
        server = ServerConfig(
            server_url=server_data.get("server_url", "http://localhost:21025"),
            cli_port=server_data.get("cli_port", 21026),
        )
        
        runner = RunnerConfig(
            inference_interval=runner_data.get("inference_interval", 30.0),
            signal_check_interval=runner_data.get("signal_check_interval", 1.0),
            high_priority_delay=runner_data.get("high_priority_delay", 5.0),
            yolo=runner_data.get("yolo", True),
            max_inference_duration=runner_data.get("max_inference_duration", 120.0),
        )
        
        agents = []
        for agent_data in agents_data:
            agents.append(AgentAccount(
                name=agent_data.get("name", agent_data.get("username", "unknown")),
                username=agent_data["username"],
                password=agent_data["password"],
                model=agent_data.get("model"),
            ))
        
        return cls(
            server=server,
            runner=runner,
            agents=agents,
            system_prompt=data.get("system_prompt"),
            turn_prompt_template=data.get("turn_prompt_template"),
            initial_monitors=data.get("initial_monitors", []),
        )
    
    @classmethod
    def from_yaml(cls, path: str | Path) -> "MultiAgentConfig":
        """Load config from YAML file."""
        with open(path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return cls.from_dict(data or {})
    
    @classmethod
    def from_env(cls) -> "MultiAgentConfig":
        """Create config from environment variables."""
        server = ServerConfig(
            server_url=os.getenv("SCREEPS_SERVER_URL", "http://localhost:21025"),
            cli_port=int(os.getenv("SCREEPS_CLI_PORT", "21026")),
        )
        
        runner = RunnerConfig(
            inference_interval=float(os.getenv("INFERENCE_INTERVAL", "30.0")),
            signal_check_interval=float(os.getenv("SIGNAL_CHECK_INTERVAL", "1.0")),
            yolo=os.getenv("YOLO", "true").lower() == "true",
        )
        
        # Load agents from environment (AGENT1_USER, AGENT1_PASS, AGENT1_MODEL, etc.)
        agents = []
        for i in range(1, 10):  # Support up to 9 agents
            username = os.getenv(f"AGENT{i}_USER")
            password = os.getenv(f"AGENT{i}_PASS")
            model = os.getenv(f"AGENT{i}_MODEL")
            if username and password:
                agents.append(AgentAccount(
                    name=f"agent{i}",
                    username=username,
                    password=password,
                    model=model,
                ))
        
        return cls(
            server=server,
            runner=runner,
            agents=agents,
        )
    
    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary."""
        return {
            "server": {
                "server_url": self.server.server_url,
                "cli_port": self.server.cli_port,
            },
            "runner": {
                "inference_interval": self.runner.inference_interval,
                "signal_check_interval": self.runner.signal_check_interval,
                "high_priority_delay": self.runner.high_priority_delay,
                "yolo": self.runner.yolo,
                "max_inference_duration": self.runner.max_inference_duration,
            },
            "agents": [
                {"name": a.name, "username": a.username, "password": "***", "model": a.model}
                for a in self.agents
            ],
            "system_prompt": self.system_prompt,
            "turn_prompt_template": self.turn_prompt_template,
            "initial_monitors": self.initial_monitors,
        }


def load_config(
    config_path: str | Path | None = None,
    use_env: bool = True,
) -> MultiAgentConfig:
    """
    Load configuration from file and/or environment.
    
    Priority (highest to lowest):
    1. Environment variables (for overrides)
    2. Config file
    3. Defaults
    """
    # Start with defaults or file
    if config_path and Path(config_path).exists():
        config = MultiAgentConfig.from_yaml(config_path)
    else:
        config = MultiAgentConfig()
    
    # Merge with environment variables
    if use_env:
        env_config = MultiAgentConfig.from_env()
        
        # Override server settings if env vars are set
        if os.getenv("SCREEPS_SERVER_URL"):
            config.server.server_url = env_config.server.server_url
        if os.getenv("SCREEPS_CLI_PORT"):
            config.server.cli_port = env_config.server.cli_port
        
        # Override runner settings if env vars are set
        if os.getenv("INFERENCE_INTERVAL"):
            config.runner.inference_interval = env_config.runner.inference_interval
        if os.getenv("YOLO"):
            config.runner.yolo = env_config.runner.yolo
        
        # Add agents from env if config has none
        if not config.agents and env_config.agents:
            config.agents = env_config.agents
    
    return config
