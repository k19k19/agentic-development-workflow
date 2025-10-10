---
description: Run user acceptance tests
argument-hint: []
allowed-tools: ["mcp__chrome-devtools__*", "run_shell_command", "Read"]
model: claude-sonnet-4-5
---

# UAT (User Acceptance Testing)

## Purpose
Run user acceptance tests on staging environment using Chrome DevTools MCP for E2E testing.

## Instructions
- Use Chrome DevTools MCP for E2E test execution.
- Test critical user flows.
- Validate against acceptance criteria from feature spec.
- If failures detected, document and report.

## Workflow
1. Read feature spec to identify acceptance criteria.
2. Use Chrome DevTools MCP to execute E2E tests.
3. Test critical user flows on staging environment.
4. Collect test results and screenshots.
5. Report pass/fail status.

## Report
- Display UAT results summary.
- Show critical user flows tested.
- List any failures with screenshots.
- Suggest next step: `/release` if passing, or fix issues.

## Next Steps

**✅ If all UAT tests pass:**
```bash
/finalize "[feature-id]"
```

Then prepare for production:
```bash
/release
```

**❌ If UAT tests fail:**
1. Document the failures
2. Fix the issues
3. Re-deploy to staging: `/deploy_staging`
4. Re-test: `/uat`

**🔴 If major issues found:**
```bash
/report_failure "[feature-id]"  # Escalate for review
```

📖 **Need help?** See: `TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md`

## Budget
~5K tokens (Chrome DevTools MCP)
