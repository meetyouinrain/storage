from __future__ import annotations

import argparse
import json
from pathlib import Path

from .config import Settings
from .orchestrator import WorkflowOrchestrator


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="mimo-agent",
        description="Run a multi-agent R&D automation workflow against a repository.",
    )
    parser.add_argument("--task", required=True, help="Natural language task description.")
    parser.add_argument("--repo", default=".", help="Repository path to scan.")
    parser.add_argument("--provider", choices=["mock", "openai_compatible"], help="LLM provider override.")
    parser.add_argument("--model", help="Model override.")
    parser.add_argument("--output", help="Optional JSON output path.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    settings = Settings.from_env()
    if args.provider:
        settings.provider = args.provider
    if args.model:
        settings.model = args.model

    orchestrator = WorkflowOrchestrator(settings)
    result = orchestrator.run(task=args.task, repo_path=args.repo)

    print("=== MiMo Agent Platform ===")
    print(f"Provider: {result.metadata['provider']}")
    print(f"Model: {result.metadata['model']}")
    print(f"Task: {result.task}")
    print()
    print("Repository summary:")
    print(result.repository_summary)
    print()
    print("Artifacts:")
    for key, artifact in result.artifacts.items():
        print(f"- {key}: {artifact.summary}")

    if args.output:
        output_path = Path(args.output).resolve()
        output_path.write_text(
            json.dumps(result.to_dict(), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        print()
        print(f"JSON output written to: {output_path}")


if __name__ == "__main__":
    main()
