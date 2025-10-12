---
description: Deploy to production
argument-hint: []
allowed-tools: ["run_shell_command", "Read", "Write"]
model: o4-mini
---

# Release (Production Deployment)

## Purpose
Deploy to production environment after all tests pass.

## Instructions
- Final pre-flight checks before production deployment.
- Execute production deployment command.
- Verify production health checks.
- Update deployment log.

## Workflow
1. Confirm all tests passing (unit, integration, UAT).
2. Run `./scripts/validation/pre-deploy-check.sh` for production.
3. Execute production deployment command (e.g., `npm run deploy:prod`).
4. Wait for deployment to complete.
5. Run production health checks.
6. Update deployment log with timestamp and version.

## Report
- Confirm production deployment status.
- Show production URL.
- Display health check results.
- Log deployment timestamp and version.
- Suggest running `/next` to select next feature.

## Budget
FREE (no AI calls)
