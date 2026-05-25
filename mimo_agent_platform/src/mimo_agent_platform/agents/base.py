from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..llm import BaseLLMClient
from ..models import AgentOutput, RepositorySnapshot


@dataclass(slots=True)
class AgentContext:
    task: str
    repository: RepositorySnapshot
    previous_outputs: dict[str, AgentOutput]


class BaseAgent:
    name = "base"
    title = "Base Agent"
    system_prompt = "You are a helpful engineering workflow agent."

    def __init__(self, llm_client: BaseLLMClient) -> None:
        self.llm_client = llm_client

    def run(self, context: AgentContext) -> AgentOutput:
        user_prompt = self.build_prompt(context)
        response = self.llm_client.complete(system_prompt=self.system_prompt, user_prompt=user_prompt)
        return self.parse_response(response.content, context)

    def build_prompt(self, context: AgentContext) -> str:
        raise NotImplementedError

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        raise NotImplementedError

    def shared_snapshot(self, context: AgentContext) -> dict[str, Any]:
        return {
            "task": context.task,
            "repository_summary": context.repository.condensed_view(),
            "previous_artifacts": {
                key: value.summary
                for key, value in context.previous_outputs.items()
            },
        }
