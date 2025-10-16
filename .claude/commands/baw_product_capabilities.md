---
description: Enumerate and prioritize the product capability set
argument-hint: [product_title] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_product_capabilities

## Purpose
Translate the product charter into a dependency-aware capability catalog that aligns business problems with measurable outcomes.

## Variables
PRODUCT_TITLE: $1
CONTEXT: $2
CAPABILITY_WORKSPACE_ROOT: ai-docs/capabilities/
CAPABILITY_CATALOG_ROOT: ai-docs/capabilities/
WORKFLOW_LOG_DIRECTORY: <capability-workspace>/workflow/

## Instructions
- Review `ai-docs/charter.md`, existing capability manifests under `ai-docs/capabilities/`, and any supporting research in `ai-docs/research/` or `ai-docs/helper/`.
- Treat `<capability-workspace>` as `CAPABILITY_WORKSPACE_ROOT/<capability-slug>` and ensure it exists before cataloging follow-up work.
- Use Gemini MCP to propose capability groupings and identify the business problem each capability solves.
- Tag capabilities with the primary persona, success criteria, dependencies, and status (core vs. stretch).
- Flag missing specs or research needed before planning can begin.

## Workflow
1. Parse the charter and existing documentation for explicit requirements.
2. Organize capabilities into epics or value streams with dependency notes.
3. Produce a priority table (must-have, should-have, could-have) tied to personas and metrics.
4. Identify documentation gaps and responsible owners.
5. Recommend follow-up commands for wishlist or developer planning.

## Report
- Output a structured table of capabilities with columns for persona, problem, outcome, dependencies, and readiness and save it to
  `CAPABILITY_CATALOG_ROOT/<ISO-timestamp>-capability-catalog.md`.
- Highlight capabilities that require discovery tasks or additional specs.
- Close with actionable next commands (e.g., `/baw_dev_dependency_plan`, `/baw_product_wishlist`).
- Reference the saved file path for future sessions.

## Automation Trace
- Save status JSON with `phase: "capability-catalog"` in `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-capability-catalog.json`.
- Set `status` to `completed`, `needs_docs`, or `blocked`.
- Populate `nextCommand` with the recommended follow-up and include documentation references.
- Remind the user to run `npm run baw:workflow:sync`.

## Next Steps
- `/baw_product_wishlist "<product-title>"`
- `/baw_dev_dependency_plan "<capability-or-initiative>" "<catalog-path>"`
