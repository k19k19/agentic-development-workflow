---
description: Focused bug root cause analysis (AI-internal command)
argument-hint: [bug-id]
allowed-tools: ["Read", "Grep", "Glob", "Write", "mcp__gemini-cli__ask-gemini"]
model: o4-mini
---

# Triage Bug (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/hotfix` ingests bug. Performs focused analysis to pinpoint bug location.

## Variables
BUG_ID: $1
BUG_REPORTS_DIRECTORY: app-docs/debugging/

## Instructions
- **You don't run this manually** - Codex runs it automatically after hotfix.
- Highly focused analysis to pinpoint bug location.
- Propose fix strategy.
- Skip broad scout, jump directly to `/plan` or `/build`.

## Workflow
1. Read bug report from `BUG_REPORTS_DIRECTORY/BUG_REPORT_[BUG_ID].md`.
2. Use targeted Grep searches to find related code.
3. Analyze bug symptoms and identify root cause.
4. Pinpoint exact file and line number.
5. Propose fix strategy.
6. Assess complexity (Low/Medium/High).

## Report
- Display root cause analysis.
- Show exact bug location (file:line).
- Present proposed fix strategy.
- Assess severity and complexity.
- Suggest jumping to `/build` (simple) or `/plan` (complex).

## Budget
~8K tokens (Gemini MCP discovery + Claude MCP analysis orchestrated by Codex)
