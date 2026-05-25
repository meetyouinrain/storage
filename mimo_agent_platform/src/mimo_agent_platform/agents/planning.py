from __future__ import annotations

from .base import AgentContext, BaseAgent
from ..models import AgentOutput


class PlanningAgent(BaseAgent):
    name = "execution_plan"
    title = "Execution Plan"
    system_prompt = (
        "You are an engineering planning agent that produces phased execution plans, "
        "sequencing, ownership boundaries, and validation checkpoints."
    )

    def build_prompt(self, context: AgentContext) -> str:
        prior = context.previous_outputs["requirement_analysis"]
        return (
            f"Task:\n{context.task}\n\n"
            f"Requirement analysis summary:\n{prior.summary}\n\n"
            f"Repository snapshot:\n{context.repository.condensed_view()}\n\n"
            "Generate a phased plan with milestones, likely touched files, and validation gates."
        )

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        candidate_files = [item.path for item in context.repository.summaries[:10]]
        details = {
            "phases": [
                "Phase 1: Confirm impacted modules and implementation boundaries.",
                "Phase 2: Apply targeted code updates and keep the diff narrow.",
                "Phase 3: Add or update tests and fixtures.",
                "Phase 4: Run review checklist and prepare delivery notes.",
            ],
            "milestones": [
                "Architecture fit validated",
                "Core implementation drafted",
                "Regression coverage defined",
                "Review findings triaged",
            ],
            "candidate_files": candidate_files,
            "validation_gates": [
                "API and interface compatibility checked",
                "Critical path tests identified",
                "Rollback strategy noted for risky changes",
            ],
            "llm_notes": content,
        }
        summary = (
            "The implementation should proceed in phases: scope confirmation, targeted code changes, "
            "test updates, and final review with clear checkpoints."
        )
        return AgentOutput(
            agent_name=self.name,
            title=self.title,
            summary=summary,
            details=details,
        )
