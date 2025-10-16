---
description: Deploy to staging environment
argument-hint: []
allowed-tools: ["run_shell_command", "Read"]
model: claude-sonnet-4-5
---

# /baw_dev_deploy_staging

## Purpose
Deploy the current build to staging environment for user acceptance testing.

## Capability Workspace
- Identify the feature currently moving toward release (usually the subject of the most recent `/baw_dev_build` or `/baw_dev_test`).
- Confirm the workspace at `ai-docs/capabilities/<capability-id>/` exists; if unclear, ask the user to specify the feature slug.
- Write deployment notes to `ai-docs/capabilities/<capability-id>/reports/deployments/` and automation logs to
  `ai-docs/capabilities/<capability-id>/workflow/`.

## Instructions
- Run pre-deployment validation script.
- Deploy to staging environment using project-appropriate command.
- Save deployment console output to `reports/deployments/<ISO-timestamp>-staging.log` inside the capability workspace.
- Verify deployment health checks and capture results in the same directory.
- Emit a workflow entry (`phase: "deploy-staging"`) so dashboards track the hand-off to `/baw_uat`.
- No AI calls needed - just orchestration.

## Workflow
1. Run `./scripts/validation/pre-deploy-check.sh` (if exists).
2. Execute staging deployment command (e.g., `npm run deploy:staging`).
3. Wait for deployment to complete.
4. Run `./scripts/health-check/health-check.sh` (if exists).
5. Verify service health.

## Report
- Confirm staging deployment status.
- Show deployment URL.
- Display health check results (reference the saved log path under the capability workspace).
- Suggest running `/baw_uat` for user acceptance testing.

## Next Steps

**→ Run user acceptance tests:**
```bash
/baw_uat
```

**Check staging environment:**
- Staging URL: [shown in deployment output]
- Manual testing: Test critical flows yourself
- Logs: `tail -f logs/staging.log` (if applicable)

**If deployment failed:**
1. Review deployment logs
2. Fix configuration issues
3. Re-deploy: `/baw_dev_deploy_staging`

## Budget
FREE (no AI calls)
