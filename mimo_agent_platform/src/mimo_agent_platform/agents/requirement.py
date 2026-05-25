from __future__ import annotations

from .base import AgentContext, BaseAgent
from ..models import AgentOutput


class RequirementAgent(BaseAgent):
    name = "requirement_analysis"
    title = "Requirement Analysis"
    system_prompt = (
        "You are a senior staff engineer focused on requirement decomposition, "
        "scope definition, edge cases, and delivery risk assessment."
    )

    def build_prompt(self, context: AgentContext) -> str:
        return (
            f"Task:\n{context.task}\n\n"
            f"Repository snapshot:\n{context.repository.condensed_view()}\n\n"
            "Please identify:\n"
            "1. Goals\n"
            "2. Constraints\n"
            "3. Dependencies\n"
            "4. Edge cases\n"
            "5. Top risks\n"
        )

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        details = {
            "goals": [
                "Clarify the requested engineering outcome and acceptance expectations.",
                "Map likely repository areas impacted by the requested change.",
            ],
            "constraints": [
                "Respect existing architecture and coding conventions.",
                "Minimize regression risk across neighboring modules.",
            ],
            "dependencies": [item.path for item in context.repository.summaries[:8]],
            "edge_cases": [
                "Unexpected input shape or missing configuration.",
                "Backward compatibility for existing callers.",
                "Test environment drift and incomplete fixtures.",
            ],
            "risks": [
                "Cross-file dependency changes may be underestimated.",
                "Generated code may diverge from repository conventions without review.",
            ],
            "llm_notes": content,
        }
        summary = (
            "The task should be treated as a multi-stage implementation effort with explicit scope, "
            "cross-file dependency mapping, and regression-aware validation."
        )
        return AgentOutput(
            agent_name=self.name,
            title=self.title,
            summary=summary,
            details=details,
        )
