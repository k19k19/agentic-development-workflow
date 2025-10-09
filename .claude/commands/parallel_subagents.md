---
description: Coordinate multiple specialized subagents on a single task
argument-hint: [user_prompt] [agent-list]
model: claude-sonnet-4-5
---

# Parallel Subagents

## Purpose
Plan and launch a set of specialized subagents that can work concurrently on the `USER_PROMPT`, while keeping outputs synchronized.

## Workflow
1. Parse `AGENT_LIST` (comma-separated) to determine which personas to launch; default to `scout,generator,researcher`.
2. For each persona, create a Task tool entry that immediately runs the Bash tool to start the correct CLI (`gemini`, `codex`, `claude`, etc.) with a persona-specific prompt.
3. Provide each subagent with deadlines, required output format, and escalation rules.
4. Collect results as they complete, merge the findings, and resolve conflicts or duplication.
5. Store combined output in `ai-docs/workflows/<timestamp>-parallel-subagents.md`.

## Report
- List the subagents launched and whether they succeeded.
- Summarize the consolidated findings and link to the saved workflow log.
