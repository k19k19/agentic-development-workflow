---
description: Deploy to production
argument-hint: []
allowed-tools: ["run_shell_command", "Read", "Write"]
model: claude-sonnet-4-5
---

# /baw_dev_release

## Purpose
Deploy to production environment after all tests pass.

## Feature Workspace
- Identify the feature being promoted (usually from the latest `/baw_dev_finalize` or `/baw_dev_deploy_plan`).
- Ensure the workspace `ai-docs/workflow/features/<feature-id>/` exists and contains the deployment plan.
- Log production deployment artifacts to `reports/deployments/` and automation traces to `workflow/`.

## Instructions
- Final pre-flight checks before production deployment.
- Execute production deployment command.
- Verify production health checks.
- Update deployment log inside `reports/deployments/<ISO-timestamp>-production.log`.

## Workflow
1. Confirm all tests passing (unit, integration, UAT).
2. Run `./scripts/validation/pre-deploy-check.sh` for production.
3. Execute production deployment command (e.g., `npm run deploy:prod`).
4. Wait for deployment to complete.
5. Run production health checks.
6. Update deployment log with timestamp and version (include git SHA and operator).

## Report
- Confirm production deployment status.
- Show production URL.
- Display health check results.
- Log deployment timestamp and version and record the workspace path for traceability.
- Suggest running `/baw_next` to select next feature.

## Automation Trace
- Save status JSON with `phase: "release"` to `ai-docs/workflow/features/<feature-id>/workflow/<ISO-timestamp>-release.json`.
- Use `status` values `completed`, `failed`, or `needs_validation`.
- Populate `outputPath` with the deployment log under `reports/deployments/` and remind the user to run `npm run baw:workflow:sync`.

## Budget
FREE (no AI calls)
