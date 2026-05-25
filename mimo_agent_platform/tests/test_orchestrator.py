from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from mimo_agent_platform.config import Settings
from mimo_agent_platform.orchestrator import WorkflowOrchestrator


class WorkflowOrchestratorTest(unittest.TestCase):
    def test_mock_workflow_runs_end_to_end(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "service.py").write_text(
                "import json\n\n"
                "def handle_request(payload):\n"
                "    return {'ok': True, 'payload': payload}\n",
                encoding="utf-8",
            )
            (root / "README.md").write_text("# Demo Repo\n", encoding="utf-8")

            settings = Settings(provider="mock", max_files=10, max_file_chars=2000)
            orchestrator = WorkflowOrchestrator(settings)
            result = orchestrator.run(
                task="Add unified error handling and propose tests.",
                repo_path=root,
            )

            self.assertEqual(result.metadata["provider"], "mock")
            self.assertIn("requirement_analysis", result.artifacts)
            self.assertIn("execution_plan", result.artifacts)
            self.assertIn("coding_plan", result.artifacts)
            self.assertIn("testing_plan", result.artifacts)
            self.assertIn("review_report", result.artifacts)
            self.assertGreaterEqual(len(result.timeline), 5)

            payload = result.to_dict()
            json.dumps(payload, ensure_ascii=False)


if __name__ == "__main__":
    unittest.main()
