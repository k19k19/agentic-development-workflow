---
description: Prime Claude Code with current project state before delegating work
argument-hint: []
model: claude-sonnet-4-5
---

# Prime Claude Code

## Purpose
Load the essential project context into Claude Code so subsequent commands run with up-to-date awareness.

## Workflow
1. Read `CLAUDE.md`, `AGENTS.md`, and the latest entries under `ai-docs/workflows/` to refresh the project's state.
2. Enumerate critical directories (`app/`, `specs/`, `.claude/commands/`) and note any recent structural changes.
3. Summarize outstanding tasks, open PRs, and validation scripts that must run before shipping.
4. Share the summary with the user and store it in `ai-docs/reports/prime-claude-<timestamp>.md`.

## Report
- Provide the summary bullet list inside the response.
- Link to the stored report for future reuse.
