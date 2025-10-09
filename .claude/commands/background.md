---
description: Load high-level project background before starting scoped work
argument-hint: [focus-area]
model: claude-sonnet-4-5
---

# Background Briefing

## Purpose
Assemble a concise brief covering history, stakeholders, and context for the requested focus area so downstream agents start with shared knowledge.

## Workflow
1. Parse the optional `FOCUS_AREA` argument to tailor the search; default to the overall project.
2. Read `CLAUDE.md`, `AGENTS.md`, and relevant docs in `app-docs/` and `ai-docs/` to capture goals, architecture, and open initiatives.
3. Summarize key points: objectives, active workflows, known risks, and recent changes (use `git log -5 --oneline`).
4. Store the briefing in `ai-docs/reports/background-<timestamp>.md` for reuse.

## Report
- Provide the path to the saved briefing.
- Bullet the most critical contextual notes for quick consumption.
