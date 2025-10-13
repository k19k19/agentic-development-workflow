---
description: Run user acceptance tests
argument-hint: []
allowed-tools: ["mcp__chrome-devtools__*", "run_shell_command", "Read"]
model: claude-sonnet-4-5
---

# /baw:uat

## Purpose
Run user acceptance tests on staging environment using Chrome DevTools MCP for E2E testing.

## Variables
FEATURE_ID: $1 (optional — ask the user if not supplied)
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
UAT_REPORT_DIRECTORY: <feature-workspace>/reports/uat/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Use Chrome DevTools MCP for E2E test execution.
- Test critical user flows.
- Validate against acceptance criteria from feature spec stored in the feature workspace.
- Save results and screenshots to `UAT_REPORT_DIRECTORY/<ISO-timestamp>-uat-report.md` (store images alongside if needed).
- If failures detected, document and report.

## Workflow
1. Read feature spec to identify acceptance criteria.
2. Use Chrome DevTools MCP to execute E2E tests.
3. Test critical user flows on staging environment.
4. Collect test results and screenshots and save them under `UAT_REPORT_DIRECTORY`.
5. Emit `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-uat.json` with `phase: "uat"` and status (`passed`/`failed`/`needs_validation`).
6. Report pass/fail status.

## Report
- Display UAT results summary.
- Show critical user flows tested.
- List any failures with screenshots (reference workspace paths).
- Suggest next step: `/baw:release` if passing, or fix issues.

## Next Steps

**✅ If all UAT tests pass:**
```bash
/baw:finalize "[feature-id]"
```

Then prepare for production:
```bash
/baw:release
```

**❌ If UAT tests fail:**
1. Document the failures
2. Fix the issues
3. Re-deploy to staging: `/baw:deploy_staging`
4. Re-test: `/baw:uat`

**🔴 If major issues found:**
```bash
/baw:report_failure "[feature-id]"  # Escalate for review
```

## Budget
~5K tokens (Chrome DevTools MCP)
