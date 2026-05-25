from __future__ import annotations

import ast
from pathlib import Path

from .config import Settings
from .models import RepoFileSummary, RepositorySnapshot

SUPPORTED_EXTENSIONS = {
    ".py": "python",
    ".js": "javascript",
    ".ts": "typescript",
    ".tsx": "typescript-react",
    ".jsx": "javascript-react",
    ".java": "java",
    ".go": "go",
    ".rs": "rust",
    ".md": "markdown",
    ".json": "json",
    ".yml": "yaml",
    ".yaml": "yaml",
}

IGNORED_DIRS = {
    ".git",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".venv",
    "venv",
}


class RepositoryScanner:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def scan(self, repo_root: str | Path) -> RepositorySnapshot:
        root = Path(repo_root).resolve()
        summaries: list[RepoFileSummary] = []
        for path in root.rglob("*"):
            if len(summaries) >= self.settings.max_files:
                break
            if not path.is_file():
                continue
            if any(part in IGNORED_DIRS for part in path.parts):
                continue
            language = SUPPORTED_EXTENSIONS.get(path.suffix.lower())
            if not language:
                continue
            summary = self._summarize_file(root, path, language)
            summaries.append(summary)
        return RepositorySnapshot(
            root=str(root),
            file_count=len(summaries),
            summaries=summaries,
        )

    def _summarize_file(self, root: Path, file_path: Path, language: str) -> RepoFileSummary:
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        cropped = text[: self.settings.max_file_chars]
        if language == "python":
            symbols, imports = _extract_python_symbols(cropped)
        else:
            symbols, imports = _extract_generic_symbols(cropped)

        relative = file_path.relative_to(root).as_posix()
        summary = _build_summary(language=language, text=cropped, symbols=symbols, imports=imports)
        return RepoFileSummary(
            path=relative,
            language=language,
            size=len(text),
            summary=summary,
            symbols=symbols,
            imports=imports,
        )


def _extract_python_symbols(text: str) -> tuple[list[str], list[str]]:
    symbols: list[str] = []
    imports: list[str] = []
    try:
        tree = ast.parse(text)
    except SyntaxError:
        return symbols, imports

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            symbols.append(node.name)
        elif isinstance(node, ast.Import):
            imports.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.append(node.module)
    return dedupe(symbols), dedupe(imports)


def _extract_generic_symbols(text: str) -> tuple[list[str], list[str]]:
    symbols: list[str] = []
    imports: list[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if line.startswith(("import ", "from ")):
            imports.append(line[:120])
        if line.startswith(("def ", "class ", "function ", "export function ", "export class ")):
            symbols.append(line[:120])
    return dedupe(symbols), dedupe(imports)


def _build_summary(*, language: str, text: str, symbols: list[str], imports: list[str]) -> str:
    first_meaningful_line = ""
    for raw_line in text.splitlines():
        stripped = raw_line.strip()
        if stripped:
            first_meaningful_line = stripped[:180]
            break

    parts = [f"Primary language: {language}."]
    if symbols:
        parts.append(f"Key symbols: {', '.join(symbols[:8])}.")
    if imports:
        parts.append(f"Main imports: {', '.join(imports[:6])}.")
    if first_meaningful_line:
        parts.append(f"Opening line: {first_meaningful_line}")
    return " ".join(parts)


def dedupe(items: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for item in items:
        if item in seen:
            continue
        seen.add(item)
        result.append(item)
    return result
