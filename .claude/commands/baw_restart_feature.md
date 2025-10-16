---
description: Restart feature after failure with lessons learned (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Read", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_restart_feature

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/baw_report_failure`. Restarts workflow from Step 1 with failure context.

## Variables
FEATURE_ID: $1
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
FAILURES_DIRECTORY: <feature-workspace>/reports/failures/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically after failure report.
- Jump back to Step 1 (/baw_dev_discovery).
- **Prioritize** reading the most recent failure report from `FAILURES_DIRECTORY` for context.
- Incorporate lessons learned into next planning cycle.

## Workflow
1. Read the most recent failure report from `FAILURES_DIRECTORY`.
2. Extract lessons learned and what to avoid.
3. Re-run `/baw_dev_discovery` with focus on areas identified in failure report.
4. Proceed through workflow with enhanced context.

## Report
- Confirm restart with failure context.
- Display key lessons incorporated.
- Show focus areas for renewed discovery.
- Begin discovery phase with enhanced context and log `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-restart.json` noting the corrective focus.

## Budget
Restarts full cycle (varies by project size)
