---
description: Enumerate and prioritize the product feature set
argument-hint: [product_title] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw:product_features

## Purpose
Translate the product charter into a dependency-aware feature catalog that aligns business problems with measurable outcomes.

## Variables
PRODUCT_TITLE: $1
CONTEXT: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
PRODUCT_INTAKE_DIRECTORY: <feature-workspace>/intake/product/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review product documentation, personas, and prior feature manifests under `ai-docs/workflow/features/`.
- Ensure `PRODUCT_INTAKE_DIRECTORY/features/` exists (create it if missing) to store catalog slices.
- Use Gemini MCP to propose feature groupings and identify the business problem each feature solves.
- Tag features with the primary persona, success criteria, dependencies, and status (core vs. stretch).
- Flag missing specs or research needed before planning can begin.

## Workflow
1. Parse the charter and existing documentation for explicit requirements.
2. Organize features into epics or capability areas with dependency notes.
3. Produce a priority table (must-have, should-have, could-have) tied to personas and metrics.
4. Identify documentation gaps and responsible owners.
5. Recommend follow-up commands for wishlist or developer planning.

## Report
- Output a structured table of features with columns for persona, problem, outcome, dependencies, and readiness and save it to
  `PRODUCT_INTAKE_DIRECTORY/features/<ISO-timestamp>-feature-catalog.md`.
- Highlight features that require discovery tasks or additional specs.
- Close with actionable next commands (e.g., `/baw:dev_dependency_plan`, `/baw:product_wishlist`).
- Reference the saved file path for future sessions.

## Automation Trace
- Save status JSON with `phase: "feature-catalog"` in `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-feature-catalog.json`.
- Set `status` to `completed`, `needs_docs`, or `blocked`.
- Populate `nextCommand` with the recommended follow-up and include documentation references.
- Remind the user to run `npm run baw:workflow:sync`.

## Next Steps
- `/baw:product_wishlist "<product-title>"`
- `/baw:dev_dependency_plan "<feature-or-initiative>" "<catalog-path>"`
