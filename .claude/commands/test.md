---
description: Run hermetic unit and integration tests
argument-hint: []
allowed-tools: ["run_shell_command", "Read", "Write"]
model: claude-sonnet-4-5
---

# Test (Hermetic V&V)

## Purpose
Run hermetic unit and integration tests in an isolated environment. Automatically triggers learning loop if tests fail.

## Variables
TEST_OUTPUT_DIRECTORY: ai-docs/builds/

## Instructions
- Run tests in isolated environment with no external dependencies.
- Use mock data for all external services.
- If tests fail, trigger `/report_failure` automatically.
- Save test output for debugging.

## Workflow
1. Run hermetic unit tests: `npm test` (or project-appropriate command).
2. Run integration tests with mocks.
3. Collect test results and coverage data.
4. If failures detected, trigger `/report_failure` and enter learning loop.
5. Save test output to latest build directory.

## Report
- Display test results summary (passed/failed counts).
- Show code coverage percentage.
- List failed tests with error messages (if any).
- Provide path to full test output.
- Suggest next step: `/deploy_staging` if passing, or review failures.

## Budget
FREE (no AI calls, just test execution)
