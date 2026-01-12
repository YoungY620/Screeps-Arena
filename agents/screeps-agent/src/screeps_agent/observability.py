"""Observability module for tracking agent inference processes.

Each agent gets its own JSONL file to record:
- Inference sessions (prompt, trigger, timing)
- Thinking/reasoning content
- Step-by-step execution (tool calls and results)

JSONL format - one JSON object per line, easy to tail/grep/process.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Any
import threading


@dataclass
class InferenceRecord:
    """A single record in the inference log."""
    
    timestamp: str
    session_id: str
    agent_name: str
    event_type: str  # 'session_start', 'session_end', 'thinking', 'message', 'tool_call', 'tool_result'
    
    # Session info (for session_start/session_end)
    trigger: str | None = None
    game_tick: int | None = None
    status: str | None = None
    duration_ms: int | None = None
    error: str | None = None
    
    # Content
    content: str | None = None
    
    # Tool info
    tool_name: str | None = None
    tool_input: dict | None = None
    tool_output: str | None = None
    tool_error: str | None = None
    
    # Message info
    role: str | None = None
    
    # Extra data
    extra: dict | None = None
    
    def to_json(self) -> str:
        """Convert to JSON string, excluding None values."""
        d = {k: v for k, v in asdict(self).items() if v is not None}
        return json.dumps(d, ensure_ascii=False)


class InferenceLogger:
    """Logger for recording inference processes to JSONL files.
    
    Each agent has its own log file: data/{agent_name}.jsonl
    """
    
    def __init__(self, log_path: str | Path, agent_name: str):
        """Initialize the logger.
        
        Args:
            log_path: Path to the JSONL log file
            agent_name: Name of the agent
        """
        self.log_path = Path(log_path)
        self.agent_name = agent_name
        self._lock = threading.Lock()
        self._ensure_dir()
    
    def _ensure_dir(self) -> None:
        """Ensure log directory exists."""
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
    
    def _write(self, record: InferenceRecord) -> None:
        """Write a record to the log file."""
        with self._lock:
            with open(self.log_path, "a", encoding="utf-8") as f:
                f.write(record.to_json() + "\n")
    
    def _now(self) -> str:
        """Get current timestamp."""
        return datetime.now().isoformat()
    
    def start_session(
        self,
        session_id: str,
        trigger: str,
        game_tick: int | None = None,
        system_prompt: str | None = None,
        user_prompt: str | None = None,
        game_state: dict | None = None,
    ) -> str:
        """Log session start."""
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="session_start",
            trigger=trigger,
            game_tick=game_tick,
            extra={
                "system_prompt": system_prompt[:500] if system_prompt else None,
                "user_prompt": user_prompt[:1000] if user_prompt else None,
                "game_state": game_state,
            } if any([system_prompt, user_prompt, game_state]) else None,
        ))
        return session_id
    
    def end_session(
        self,
        session_id: str,
        status: str = "completed",
        final_response: str | None = None,
        code_uploaded: str | None = None,
        error_message: str | None = None,
        duration_ms: int | None = None,
    ) -> None:
        """Log session end."""
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="session_end",
            status=status,
            duration_ms=duration_ms,
            error=error_message,
            extra={
                "final_response": final_response[:1000] if final_response else None,
                "code_uploaded": code_uploaded[:500] if code_uploaded else None,
            } if any([final_response, code_uploaded]) else None,
        ))
    
    def log_thinking(self, session_id: str, content: str) -> None:
        """Log thinking/reasoning content."""
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="thinking",
            content=content[:2000],  # Limit length
        ))
    
    def log_message(self, session_id: str, role: str, content: str) -> None:
        """Log a message (user/assistant)."""
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="message",
            role=role,
            content=content[:2000],
        ))
    
    def log_tool_call(
        self,
        session_id: str,
        tool_name: str,
        tool_input: dict,
    ) -> None:
        """Log a tool call."""
        # Truncate large inputs
        truncated_input = {}
        for k, v in tool_input.items():
            if isinstance(v, str) and len(v) > 500:
                truncated_input[k] = v[:500] + "...[truncated]"
            else:
                truncated_input[k] = v
        
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="tool_call",
            tool_name=tool_name,
            tool_input=truncated_input,
        ))
    
    def log_tool_result(
        self,
        session_id: str,
        tool_name: str,
        output: str | None = None,
        error: str | None = None,
        duration_ms: int | None = None,
    ) -> None:
        """Log a tool result."""
        self._write(InferenceRecord(
            timestamp=self._now(),
            session_id=session_id,
            agent_name=self.agent_name,
            event_type="tool_result",
            tool_name=tool_name,
            tool_output=output[:1000] if output else None,
            tool_error=error[:500] if error else None,
            duration_ms=duration_ms,
        ))


def get_logger_for_agent(agent_name: str, data_dir: str | Path = "data") -> InferenceLogger:
    """Get an InferenceLogger for a specific agent.
    
    Args:
        agent_name: Name of the agent
        data_dir: Directory to store log files
        
    Returns:
        InferenceLogger instance with agent-specific log file
    """
    data_path = Path(data_dir)
    log_path = data_path / f"{agent_name}.jsonl"
    return InferenceLogger(log_path, agent_name)
