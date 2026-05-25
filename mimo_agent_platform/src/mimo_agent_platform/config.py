from __future__ import annotations

import os
from dataclasses import dataclass


@dataclass(slots=True)
class Settings:
    provider: str = "mock"
    model: str = "gpt-4.1"
    base_url: str = "https://api.openai.com/v1"
    api_key: str = ""
    max_files: int = 60
    max_file_chars: int = 4000
    request_timeout: int = 120

    @classmethod
    def from_env(cls) -> "Settings":
        return cls(
            provider=os.getenv("MIMO_AGENT_PROVIDER", "mock"),
            model=os.getenv("MIMO_AGENT_MODEL", "gpt-4.1"),
            base_url=os.getenv("MIMO_AGENT_BASE_URL", "https://api.openai.com/v1"),
            api_key=os.getenv("MIMO_AGENT_API_KEY", ""),
            max_files=int(os.getenv("MIMO_AGENT_MAX_FILES", "60")),
            max_file_chars=int(os.getenv("MIMO_AGENT_MAX_FILE_CHARS", "4000")),
            request_timeout=int(os.getenv("MIMO_AGENT_REQUEST_TIMEOUT", "120")),
        )
