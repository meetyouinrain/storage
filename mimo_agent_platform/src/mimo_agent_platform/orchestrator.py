from __future__ import annotations

from datetime import datetime, UTC
from pathlib import Path

from .agents.base import AgentContext
from .agents.coding import CodingAgent
from .agents.planning import PlanningAgent
from .agents.requirement import RequirementAgent
from .agents.review import ReviewAgent
from .agents.testing import TestingAgent
from .config import Settings
from .llm import build_llm_client
from .models import AgentOutput, TimelineEvent, WorkflowResult
from .repo_context import RepositoryScanner


def now_iso() -> str:
    return datetime.now(UTC).isoformat()


class WorkflowOrchestrator:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.llm_client = build_llm_client(settings)
        self.scanner = RepositoryScanner(settings)
        self.agents = [
            RequirementAgent(self.llm_client),
            PlanningAgent(self.llm_client),
            CodingAgent(self.llm_client),
            TestingAgent(self.llm_client),
            ReviewAgent(self.llm_client),
        ]

    def run(self, *, task: str, repo_path: str | Path) -> WorkflowResult:
        repository = self.scanner.scan(repo_path)
        artifacts: dict[str, AgentOutput] = {}
        timeline: list[TimelineEvent] = []

        for agent in self.agents:
            started_at = now_iso()
            context = AgentContext(task=task, repository=repository, previous_outputs=artifacts)
            output = agent.run(context)
            artifacts[agent.name] = output
            timeline.append(
                TimelineEvent(
                    agent=agent.name,
                    started_at=started_at,
                    completed_at=now_iso(),
                    status="completed",
                )
            )

        return WorkflowResult(
            task=task,
            repository_summary=repository.condensed_view(),
            artifacts=artifacts,
            timeline=timeline,
            metadata={
                "provider": self.settings.provider,
                "model": self.settings.model,
                "repo_path": str(Path(repo_path).resolve()),
                "indexed_files": repository.file_count,
            },
        )
