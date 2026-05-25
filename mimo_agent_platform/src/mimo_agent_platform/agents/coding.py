from __future__ import annotations

from .base import AgentContext, BaseAgent
from ..models import AgentOutput


class CodingAgent(BaseAgent):
    name = "coding_plan"
    title = "Coding Plan"
    system_prompt = (
        "You are an implementation-focused coding agent that proposes concrete file edits, "
        "pseudocode, refactoring boundaries, and delivery notes."
    )

    def build_prompt(self, context: AgentContext) -> str:
        plan = context.previous_outputs["execution_plan"]
        return (
            f"Task:\n{context.task}\n\n"
            f"Execution plan:\n{plan.summary}\n\n"
            f"Repository snapshot:\n{context.repository.condensed_view()}\n\n"
            "Propose concrete code changes, touched files, pseudocode, and implementation caveats."
        )

    def parse_response(self, content: str, context: AgentContext) -> AgentOutput:
        touched_files = [item.path for item in context.repository.summaries[:6]]
        pseudocode = [
            "Load current module interfaces and identify extension points.",
            "Introduce the new behavior behind existing abstractions when possible.",
            "Update call sites and configuration handling.",
            "Add tests for success, failure, and backward-compatible paths.",
        ]
        details = {
            "touched_files": touched_files,
            "implementation_strategy": [
                "Prefer minimal invasive edits over broad refactors.",
                "Preserve existing public interfaces unless the task explicitly requires API changes.",
                "Document assumptions for any generated code or migrations.",
            ],
            "pseudocode": pseudocode,
            "delivery_notes": [
                "Keep commit scope aligned to one feature or refactor unit.",
                "Attach test evidence and known limitations with the final handoff.",
            ],
            "llm_notes": content,
        }
        summary = (
            "The coding phase should target a narrow set of files, preserve existing abstractions, "
            "and produce implementation notes that are ready for engineering handoff."
        )
        return AgentOutput(
            agent_name=self.name,
            title=self.title,
            summary=summary,
            details=details,
        )
