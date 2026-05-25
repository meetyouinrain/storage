from __future__ import annotations

import json
import textwrap
import urllib.error
import urllib.request
from dataclasses import dataclass

from .config import Settings


@dataclass(slots=True)
class LLMResponse:
    content: str
    provider: str
    model: str


class BaseLLMClient:
    def complete(self, *, system_prompt: str, user_prompt: str) -> LLMResponse:
        raise NotImplementedError


class MockLLMClient(BaseLLMClient):
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def complete(self, *, system_prompt: str, user_prompt: str) -> LLMResponse:
        body = textwrap.shorten(user_prompt.replace("\n", " "), width=700, placeholder="...")
        content = (
            "MOCK_RESPONSE\n"
            f"System intent: {textwrap.shorten(system_prompt, width=120, placeholder='...')}\n"
            f"User context: {body}\n"
            "Reasoning hints:\n"
            "- Prioritize repository-aware planning.\n"
            "- Surface risks, test strategy, and likely touch points.\n"
            "- Assume the workflow will iterate on complex tasks."
        )
        return LLMResponse(content=content, provider="mock", model=self.settings.model)


class OpenAICompatibleClient(BaseLLMClient):
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def complete(self, *, system_prompt: str, user_prompt: str) -> LLMResponse:
        if not self.settings.api_key:
            raise RuntimeError("MIMO_AGENT_API_KEY is required for openai_compatible provider.")

        payload = json.dumps(
            {
                "model": self.settings.model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.2,
            }
        ).encode("utf-8")
        url = self.settings.base_url.rstrip("/") + "/chat/completions"
        request = urllib.request.Request(
            url=url,
            data=payload,
            method="POST",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.settings.api_key}",
            },
        )
        try:
            with urllib.request.urlopen(request, timeout=self.settings.request_timeout) as response:
                raw = response.read().decode("utf-8")
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")
            raise RuntimeError(f"LLM request failed: HTTP {exc.code} {detail}") from exc
        except urllib.error.URLError as exc:
            raise RuntimeError(f"LLM request failed: {exc}") from exc

        data = json.loads(raw)
        content = data["choices"][0]["message"]["content"]
        return LLMResponse(content=content, provider="openai_compatible", model=self.settings.model)


def build_llm_client(settings: Settings) -> BaseLLMClient:
    provider = settings.provider.strip().lower()
    if provider == "mock":
        return MockLLMClient(settings)
    if provider == "openai_compatible":
        return OpenAICompatibleClient(settings)
    raise ValueError(f"Unsupported provider: {settings.provider}")
