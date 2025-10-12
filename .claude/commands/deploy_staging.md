---
description: Deploy to staging environment
argument-hint: []
allowed-tools: ["run_shell_command", "Read"]
model: o4-mini
---

# Deploy Staging

## Purpose
Deploy the current build to staging environment for user acceptance testing.

## Instructions
- Run pre-deployment validation script.
- Deploy to staging environment using project-appropriate command.
- Verify deployment health checks.
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
- Display health check results.
- Suggest running `/uat` for user acceptance testing.

## Next Steps

**→ Run user acceptance tests:**
```bash
/uat
```

**Check staging environment:**
- Staging URL: [shown in deployment output]
- Manual testing: Test critical flows yourself
- Logs: `tail -f logs/staging.log` (if applicable)

**If deployment failed:**
1. Review deployment logs
2. Fix configuration issues
3. Re-deploy: `/deploy_staging`

## Budget
FREE (no AI calls)
