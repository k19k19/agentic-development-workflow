---
description: Run hermetic unit and integration tests
argument-hint: []
allowed-tools: ["run_shell_command", "Read", "Write"]
model: claude-sonnet-4-5
---

# /baw:test

## Purpose
Run hermetic unit and integration tests in an isolated environment. Automatically triggers learning loop if tests fail.

## Variables
FEATURE_ID: $1 (optional — if omitted derive from latest `/baw:build` output)
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
TEST_OUTPUT_DIRECTORY: <feature-workspace>/reports/tests/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Determine the feature under test (prefer explicit `FEATURE_ID`; otherwise inspect the latest workflow log or ask the user).
- Run tests in isolated environment with no external dependencies.
- Use mock data for all external services.
- Save results to `TEST_OUTPUT_DIRECTORY/<ISO-timestamp>-test-results.json` (and append logs as needed).
- If tests fail, trigger `/baw:report_failure` automatically.

## Workflow
1. Run hermetic unit tests: `npm test` (or project-appropriate command).
2. Run integration tests with mocks.
3. Collect test results and coverage data.
4. If failures detected, trigger `/baw:report_failure` and enter learning loop.
5. Save test output into the feature workspace reports directory and update coverage metrics.
6. Emit `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-test.json` with `phase: "test"` and the summary results.

## Report
- Display test results summary (passed/failed counts).
- Show code coverage percentage.
- List failed tests with error messages (if any).
- Provide path to full test output inside the feature workspace.
- Suggest next step: `/baw:deploy_staging` if passing, or review failures.

## Next Steps

**✅ If all tests pass:**
```bash
/baw:deploy_staging
```

**❌ If tests fail:**
1. Review test output: `ai-docs/workflow/features/<feature-id>/reports/tests/<timestamp>-test-results.json`
2. Fix the failing tests
3. Re-run tests: `/baw:test`

**🔴 If tests keep failing:**
```bash
/baw:report_failure "[feature-id]"  # Document for review
```

## Budget
FREE (no AI calls, just test execution)
