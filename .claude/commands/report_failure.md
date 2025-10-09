---
description: Document test failure and enter learning loop (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# Report Failure (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered by test failure in `/test` phase. Analyzes root cause and enters learning loop.

## Variables
FEATURE_ID: $1
FAILURES_DIRECTORY: ai-docs/failures/

## Instructions
- **You don't run this manually** - Claude runs it automatically on test failure.
- Analyze test failure root cause.
- Generate structured `FAILURE_REPORT.md`.
- Document lessons learned.
- Automatically trigger `/restart_feature`.

## Workflow
1. Read test failure output.
2. Analyze root cause:
   - What went wrong?
   - Why did it happen?
   - What was missed?
3. Generate structured failure report.
4. Document lessons learned.
5. Trigger `/restart_feature` to re-enter workflow with context.

## Report
- Display failure summary (tests failed count).
- Show root cause analysis.
- List failed tests with expected vs actual.
- Present lessons learned.
- Provide next steps for restart.

## Budget
~5K tokens (Claude root cause analysis)
