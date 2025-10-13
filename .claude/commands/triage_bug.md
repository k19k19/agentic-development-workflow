---
description: Focused bug root cause analysis (AI-internal command)
argument-hint: [bug-id]
allowed-tools: ["Read", "Grep", "Glob", "Write", "mcp__gemini-cli__ask-gemini"]
model: claude-sonnet-4-5
---

# /baw:triage_bug

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/baw:hotfix` ingests bug. Performs focused analysis to pinpoint bug location.

## Variables
BUG_ID: $1
BUG_REPORTS_DIRECTORY: app-docs/debugging/
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
SUPPORT_INTAKE_DIRECTORY: <feature-workspace>/intake/support/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically after hotfix.
- Highly focused analysis to pinpoint bug location.
- Load the relevant bug report from `SUPPORT_INTAKE_DIRECTORY/bug-report-[BUG_ID].md` (mirror from `BUG_REPORTS_DIRECTORY` when necessary).
- Propose fix strategy.
- Skip broad scout, jump directly to `/baw:dev_plan` or `/baw:dev_build`.

## Workflow
1. Read bug report from `SUPPORT_INTAKE_DIRECTORY/bug-report-[BUG_ID].md` (fallback to `BUG_REPORTS_DIRECTORY/BUG_REPORT_[BUG_ID].md`).
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
- Suggest jumping to `/baw:dev_build` (simple) or `/baw:dev_plan` (complex) and save the findings to `SUPPORT_INTAKE_DIRECTORY/<ISO-timestamp>-triage.md`.
- Log `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-triage.json` with `phase: "triage"` and recommended follow-up.

## Budget
~8K tokens (Gemini + Claude targeted search)
