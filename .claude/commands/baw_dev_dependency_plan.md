---
description: Build a dependency-driven implementation roadmap
argument-hint: [initiative_title] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_dev_dependency_plan

## Purpose
Convert the feature catalog into a delivery roadmap that sequences buildable increments based on dependencies, risk, and value.

## Variables
INITIATIVE_TITLE: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
DEPENDENCY_PLAN_DIRECTORY: <feature-workspace>/plans/dependency/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review product docs, feature catalog, and prior plans under `ai-docs/workflow/features/`.
- Derive the feature workspace slug from `CONTEXT_DOCS` (ask for clarification if ambiguous) and ensure `DEPENDENCY_PLAN_DIRECTORY` exists.
- Use Gemini MCP to map dependencies and identify enabling work required for later features.
- Break down the initiative into phases or milestones with clear completion criteria.
- Flag missing specs, integrations, or data that must be sourced before build.

## Workflow
1. Aggregate context from the prompt and referenced docs.
2. Identify foundational capabilities, shared services, and sequencing constraints.
3. Organize the plan into dependency-ordered phases with entry/exit criteria.
4. Map each phase to candidate breakout plans or tasks.
5. Recommend the follow-up `/baw_dev_breakout_plan` command for the first milestone.

## Report
- Provide a dependency diagram or ordered list of phases and save it to `DEPENDENCY_PLAN_DIRECTORY/<ISO-timestamp>-dependency-plan.md`.
- Include success metrics, dependencies, risks, and open questions per phase.
- Suggest documentation updates and next commands.
- Reference the saved plan path so breakout planning can build on it.

## Automation Trace
- Emit status JSON with `phase: "dependency-plan"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-dependency-plan.json`.
- Set `status` to `completed`, `needs_docs`, or `blocked` accordingly.
- Point `nextCommand` toward `/baw_dev_breakout_plan` or `/baw_dev_execution_prep` and include the saved plan in `outputPath`.
- Remind the user to run `npm run baw:workflow:sync` after documentation changes.

## Next Steps
- `/baw_dev_breakout_plan "<initiative-or-phase>" "<plan-docs>"`
- `/baw_dev_execution_prep "<initiative-or-phase>" "<breakout-reference>"`
