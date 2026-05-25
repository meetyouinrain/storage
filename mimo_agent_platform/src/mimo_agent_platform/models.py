from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, UTC
from typing import Any


def utc_now() -> str:
    return datetime.now(UTC).isoformat()


@dataclass(slots=True)
class RepoFileSummary:
    path: str
    language: str
    size: int
    summary: str
    symbols: list[str] = field(default_factory=list)
    imports: list[str] = field(default_factory=list)


@dataclass(slots=True)
class RepositorySnapshot:
    root: str
    file_count: int
    summaries: list[RepoFileSummary]
    generated_at: str = field(default_factory=utc_now)

    def condensed_view(self, limit: int = 12) -> str:
        lines = [
            f"Repository root: {self.root}",
            f"Indexed files: {self.file_count}",
        ]
        for item in self.summaries[:limit]:
            lines.append(
                f"- {item.path} [{item.language}] symbols={', '.join(item.symbols[:6]) or 'n/a'} summary={item.summary}"
            )
        if self.file_count > limit:
            lines.append(f"- ... {self.file_count - limit} more files omitted")
        return "\n".join(lines)


@dataclass(slots=True)
class AgentOutput:
    agent_name: str
    title: str
    summary: str
    details: dict[str, Any]
    generated_at: str = field(default_factory=utc_now)


@dataclass(slots=True)
class TimelineEvent:
    agent: str
    started_at: str
    completed_at: str
    status: str


@dataclass(slots=True)
class WorkflowResult:
    task: str
    repository_summary: str
    artifacts: dict[str, AgentOutput]
    timeline: list[TimelineEvent]
    metadata: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "task": self.task,
            "repository_summary": self.repository_summary,
            "artifacts": {
                key: {
                    "agent_name": value.agent_name,
                    "title": value.title,
                    "summary": value.summary,
                    "details": value.details,
                    "generated_at": value.generated_at,
                }
                for key, value in self.artifacts.items()
            },
            "timeline": [
                {
                    "agent": item.agent,
                    "started_at": item.started_at,
                    "completed_at": item.completed_at,
                    "status": item.status,
                }
                for item in self.timeline
            ],
            "metadata": self.metadata,
        }
