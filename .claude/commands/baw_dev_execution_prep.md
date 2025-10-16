---
description: Collect specifications, documents, and acceptance criteria for a breakout task
argument-hint: [task_title] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_dev_execution_prep

## Purpose
Ensure each actionable task has the documentation, specifications, and data sources needed for implementation and testing.
Use it to convert `/baw_dev_discovery` research into a delivery-ready brief that owners can execute without re-scanning the repo.

## Variables
TASK_TITLE: $1  
CONTEXT_DOCS: $2

## Instructions
- Treat `/baw_dev_execution_prep` as the structured follow-up to `/baw_dev_discovery`: reuse the same capability workspace and transform raw
  discoveries into actionable checklists with owners and validation hooks.
- Gather requirements from product specs, breakout plans, and relevant code references.
- Identify missing documentation, data sources, or stakeholder sign-offs. Log each gap in the capability workspace backlog so the
  team can coordinate outside of automation.
- Use Gemini MCP to generate checklists and acceptance criteria tailored to the task. Save outputs to
  `ai-docs/capabilities/<capability-id>/intake/tasks/` (one file per breakout) to keep discovery and implementation artifacts
  co-located.
- Recommend updates to knowledge ledger entries or specs when new decisions emerge.

## Workflow
1. Aggregate task context from the prompt and referenced docs.
2. Outline success criteria, dependencies, and validations.
3. List required documentation updates and data fixtures.
4. Map implementation steps to supporting files and owners.
5. Suggest next commands such as `/baw_dev_build`, `/baw_dev_test`, or `/baw_dev_breakout_plan` adjustments.

## Report
- Provide a ready-to-execute checklist with owners, documents, and validation steps.
- Highlight blockers or missing assets.
- Point to the file paths where task documentation should live (e.g., `ai-docs/capabilities/<capability-id>/intake/tasks/`).

## Automation Trace
- Emit status JSON with `phase: "execution-prep"` and save to `ai-docs/capabilities/<capability-id>/workflow/<ISO-timestamp>-dev-execution-prep.json`.
- Use `status` values `completed`, `needs_docs`, `needs_validation`, or `blocked`.
- Set `nextCommand` based on readiness (e.g., `/baw_dev_build`, `/baw_dev_test`, or `/baw_product_helper`).
- Remind the user to run `npm run baw:workflow:sync` after updates.

## Next Steps
- `/baw_dev_discovery "<task-title>"`
- `/baw_dev_build "<task-title>"`
- `/baw_dev_test "<task-title>"`
