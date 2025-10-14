---
description: Translate a dependency phase into actionable breakout plans
argument-hint: [phase_title] [dependency_plan_refs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_dev_breakout_plan

## Purpose
Design a sequence of buildable increments that deliver value quickly while respecting dependency constraints.

## Variables
PHASE_TITLE: $1
DEPENDENCY_PLAN_REFS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
BREAKOUT_OUTPUT_DIRECTORY: <feature-workspace>/plans/breakouts/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review the dependency plan, feature specs, and prior breakout plans.
- Derive the feature workspace slug from `DEPENDENCY_PLAN_REFS` (expected to point at
  `ai-docs/workflow/features/<feature-id>/plans/dependency/`). If absent, ask the user to confirm the feature ID.
- Use Gemini MCP to propose cohesive breakouts that can be completed within a session or sprint.
- For each breakout, capture goals, tasks, acceptance criteria, and integration touchpoints.
- Save each breakout slice to `BREAKOUT_OUTPUT_DIRECTORY/<sequence>-<slug>.md` so plans remain grouped by feature.
- Highlight missing specifications, test data, or stakeholder approvals and queue them in the feature workspace backlog.

## Workflow
1. Gather context from dependency plan docs and relevant specs.
2. Define breakout objectives and success metrics.
3. List tasks, deliverables, and prerequisites for each breakout.
4. Map breakouts to personas and downstream features they unlock.
5. Recommend next commands to prepare tasks or begin implementation.

## Report
- Present breakout summaries in a table or ordered list.
- Include acceptance criteria, dependencies, and risk mitigation for each breakout.
- End with `/baw_dev_execution_prep` guidance for the highest-priority breakout.

## Automation Trace
- Save workflow status with `phase: "breakout-plan"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-breakout-plan.json`.
- Use `status` values `completed`, `needs_docs`, or `blocked`.
- Record the saved breakout files under `outputPath` and any documentation gaps under `documentation`.
- Set `nextCommand` to `/baw_dev_execution_prep` (or `/baw_dev_discovery` if discovery gaps remain).
- Remind the user to run `npm run baw:workflow:sync`.

## Next Steps
- `/baw_dev_execution_prep "<breakout-title>" "<spec-references>"`
- `/baw_dev_discovery "<breakout-title>"`
