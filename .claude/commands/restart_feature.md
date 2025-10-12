---
description: Restart feature after failure with lessons learned (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Read", "run_shell_command"]
model: o4-mini
---

# Restart Feature (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/report_failure`. Restarts workflow from Step 1 with failure context.

## Variables
FEATURE_ID: $1
FAILURES_DIRECTORY: ai-docs/failures/

## Instructions
- **You don't run this manually** - Codex runs it automatically after failure report.
- Jump back to Step 1 (/scout).
- **Prioritize** reading FAILURE_REPORT.md for context.
- Incorporate lessons learned into next planning cycle.

## Workflow
1. Read FAILURE_REPORT.md from `FAILURES_DIRECTORY`.
2. Extract lessons learned and what to avoid.
3. Re-run `/scout` with focus on areas identified in failure report.
4. Proceed through workflow with enhanced context.

## Report
- Confirm restart with failure context.
- Display key lessons incorporated.
- Show focus areas for re-scout.
- Begin scout phase with enhanced context.

## Budget
Restarts full cycle (varies by project size)
