---
description: Define end-to-end testing strategy across environments
argument-hint: [initiative_or_task] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-haiku-4-5
---

# /baw_dev_test_matrix

## Purpose
Establish a comprehensive testing approach covering development, staging, and production validation for the selected task or release.

## Variables
SUBJECT: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
TEST_MATRIX_DIRECTORY: <feature-workspace>/reports/test-matrices/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Gather requirements, acceptance criteria, and risk notes from plans and task prep docs located in the capability workspace.
- Derive the feature slug from `CONTEXT_DOCS` or request confirmation from the user if ambiguous.
- Use Gemini MCP to propose test categories (unit, integration, e2e, data validation, UAT) aligned with personas.
- Map each test to environment, tooling, owners, and expected evidence.
- Save the resulting matrix to `TEST_MATRIX_DIRECTORY/<ISO-timestamp>-<subject-slug>.md` so verification artifacts live with the feature.
- Highlight missing fixtures, test data, or automation gaps and log the follow-ups under `intake/tasks/` when necessary.

## Workflow
1. Review existing checklists and prior test results.
2. Define testing objectives and trace them to requirements.
3. Enumerate tests per environment and persona.
4. Identify automation opportunities and manual validation steps.
5. Recommend follow-up commands (`/baw_dev_test`, `/baw_uat`, `/baw_report_failure`) as needed.

## Report
- Provide a test matrix with environment, scope, owner, and evidence columns.
- Include risk assessment and rollback/mitigation guidance.
- Clarify readiness criteria to proceed to deployment.

## Automation Trace
- Emit status JSON with `phase: "verification"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-test-matrix.json`.
- Set `status` to `completed`, `needs_docs`, `needs_validation`, or `blocked`.
- Point `nextCommand` toward `/baw_dev_test`, `/baw_uat`, or `/baw_dev_deploy_plan` depending on readiness.
- Attach the saved matrix path under `outputPath` and list referenced docs in `documentation`.
- Remind the user to run `npm run baw:workflow:sync` after documentation updates.

## Next Steps
- `/baw_dev_test "<task-or-release>"`
- `/baw_uat "<release-name>"`
- `/baw_dev_deploy_plan "<release-name>" "<test-matrix-path>"`
