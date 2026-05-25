from __future__ import annotations

from .base import AgentContext, BaseAgent
from ..models import AgentOutput


class TestingAgent(BaseAgent):
    name = "testing_plan"
    title = "Testing Plan"
    system_prompt = (
        "You are a software test strategist. Produce regression-aware unit, integration, "
        "and edge-case coverage recommendations."
    )

    def build_prompt(self, context: AgentContext) -> str:
        coding = context.previous_outputs["coding_plan"]
        return (
            f"Task:\n{context.task}\n\n"
            f"Coding plan:\n{coding.summary}\n\n"
            f"Repository snapshot:\n{context.repository.condensed_view()}\n\n"
            "Create a practical test strategy with unit, integration, regression, and edge-case coverage."
        )

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        details = {
            "test_layers": [
                "Unit tests for core business logic and helper functions.",
                "Integration tests for module boundaries and configuration flow.",
                "Regression tests around previously stable user paths.",
            ],
            "coverage_targets": [
                "Happy path behavior",
                "Invalid input handling",
                "Missing dependency or config fallback",
                "Backward compatibility for existing consumers",
            ],
            "test_data_notes": [
                "Use representative fixtures based on current repository contracts.",
                "Prefer deterministic mocks over flaky external dependencies.",
            ],
            "release_checks": [
                "Smoke test the main user journey",
                "Re-run tests that cover neighboring modules",
                "Verify logs and error handling behavior",
            ],
            "llm_notes": content,
        }
        summary = (
            "Testing should span unit, integration, and regression layers, with explicit coverage for "
            "failure handling, configuration drift, and compatibility-sensitive paths."
        )
        return AgentOutput(
            agent_name=self.name,
            title=self.title,
            summary=summary,
            details=details,
        )
