description: Load and summarize AI workflow documentation relevant to the task
argument-hint: [user_prompt]
allowed-tools: Read, Glob, Grep
model: claude-sonnet-4-5

# Load AI Docs

## Purpose
Surface supporting guidance from `ai-docs/` that aligns with the `USER_PROMPT` so downstream agents have the right playbooks.

## Workflow
1. Parse `USER_PROMPT` and derive keywords.
2. Search `ai-docs/` (workflows, plans, reports, logs) for matching filenames and headings.
3. Extract key sections (limit to the most recent artifacts) and summarize actionable takeaways.
4. Package the excerpts into a scratch file under `ai-docs/reports/loaded-ai-docs-<timestamp>.md`.

## Report
- Link to the scratch file and list the included documents.
- Highlight steps or constraints that other agents must follow.
