from __future__ import annotations

from .base import AgentContext, BaseAgent
from ..models import AgentOutput


class ReviewAgent(BaseAgent):
    name = "review_report"
    title = "Review Report"
    system_prompt = (
        "You are a principal engineer performing a final review. Focus on correctness, maintainability, "
        "performance, security, and rollout risk."
    )

    def build_prompt(self, context: AgentContext) -> str:
        testing = context.previous_outputs["testing_plan"]
        coding = context.previous_outputs["coding_plan"]
        return (
            f"Task:\n{context.task}\n\n"
            f"Coding summary:\n{coding.summary}\n\n"
            f"Testing summary:\n{testing.summary}\n\n"
            f"Repository snapshot:\n{context.repository.condensed_view()}\n\n"
            "Produce a final review with key findings, residual risks, and release recommendations."
        )

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        details = {
            "findings": [
                "Verify that touched modules remain aligned with the existing architecture.",
                "Check for hidden coupling introduced by cross-file updates.",
                "Confirm test coverage exists for both happy path and failure path behavior.",
            ],
            "residual_risks": [
                "Behavioral regressions may still appear in low-traffic or poorly tested paths.",
                "If the implementation changes configuration shape, rollout should be staged.",
            ],
            "release_recommendations": [
                "Ship behind a flag when the scope touches shared infrastructure.",
                "Attach a rollback note and a brief operator checklist.",
            ],
            "llm_notes": content,
        }
        summary = (
            "The final review should validate architectural fit, test adequacy, and rollout safety before "
            "the change is considered ready for production delivery."
        )
        return AgentOutput(
            agent_name=self.name,
            title=self.title,
            summary=summary,
            details=details,
        )
