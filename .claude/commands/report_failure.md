---
description: Document test failure and enter learning loop (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw:report_failure

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered by test failure in `/baw:test` phase. Analyzes root cause and enters learning loop.

## Variables
FEATURE_ID: $1
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
FAILURES_DIRECTORY: <feature-workspace>/reports/failures/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically on test failure.
- Analyze test failure root cause.
- Generate structured `FAILURES_DIRECTORY/<ISO-timestamp>-failure-report.md` (append if continuing same failure thread).
- Document lessons learned.
- Automatically trigger `/baw:restart_feature`.

## Workflow
1. Read test failure output.
2. Analyze root cause:
   - What went wrong?
   - Why did it happen?
   - What was missed?
3. Generate structured failure report.
4. Document lessons learned.
5. Trigger `/baw:restart_feature` to re-enter workflow with context.

## Report
- Display failure summary (tests failed count).
- Show root cause analysis.
- List failed tests with expected vs actual.
- Present lessons learned.
- Provide next steps for restart.

## Automation Trace
- Record a workflow status JSON entry (`app-docs/guides/workflow-status-format.md`).
  - Save to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-report-failure.json`.
  - Use `phase: "report"` and set `status` to `failed` or `blocked` based on severity.
  - Include the generated failure report path and any documentation requiring updates.
  - Set `nextCommand` to `/baw:restart_feature <feature-id>` or other recovery command the user must run.
- Prompt the user to run `npm run baw:workflow:sync` so the dashboard shows the failure context.

## Budget
~5K tokens (Claude root cause analysis)
