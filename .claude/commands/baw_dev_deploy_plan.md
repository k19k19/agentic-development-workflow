---
description: Prepare deployment and release readiness plan
argument-hint: [release_name] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-haiku-4-5
---

# /baw_dev_deploy_plan

## Purpose
Coordinate release steps across environments, owners, and rollback procedures so production launches are safe and repeatable.

## Variables
RELEASE_NAME: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
DEPLOYMENT_PLAN_DIRECTORY: <feature-workspace>/plans/deployment/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review dependency plans, breakout notes, and test matrices for the release.
- Derive the capability workspace slug from `CONTEXT_DOCS` or the active release manifest; confirm the directory exists.
- Use Gemini MCP to build a deployment checklist covering staging, production, validation, and communication steps.
- Capture required approvals, runbooks, monitoring, and rollback strategies.
- Save the plan to `DEPLOYMENT_PLAN_DIRECTORY/<ISO-timestamp>-<release-slug>.md` alongside related assets.
- Identify data migrations, feature flags, or support readiness tasks and log them under `intake/tasks/` when action is required.

## Workflow
1. Aggregate release context from referenced docs.
2. Define deployment windows, owners, and prerequisites.
3. Outline detailed steps for each environment including validation checks.
4. Document rollback plan and communication cadence.
5. Recommend follow-up commands for support enablement or workflow tracking.

## Report
- Provide a deployment checklist with owners, commands, validation, and rollback.
- Include communication templates or stakeholder notifications.
- Highlight outstanding tasks blocking release readiness.

## Automation Trace
- Emit status JSON with `phase: "deployment"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-deployment-plan.json`.
- Use `status` values `pending`, `in_progress`, `needs_validation`, `blocked`, or `completed`.
- Populate `outputPath` with the saved deployment plan and surface any supporting docs under `documentation`.
- Set `nextCommand` to `/baw_dev_deploy_staging`, `/baw_dev_release`, or `/baw_workflow_radar` as appropriate.
- Remind the user to run `npm run baw:workflow:sync` after updates.

## Next Steps
- `/baw_dev_deploy_staging "<release-name>"`
- `/baw_dev_release "<release-name>"`
- `/baw_workflow_radar "<initiative>"`
