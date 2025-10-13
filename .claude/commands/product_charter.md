---
description: Map the product charter, personas, and core value proposition
argument-hint: [product_title] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw:product_charter

## Purpose
Establish a product north star that clarifies what the product does, who it serves, and how success will be measured before any implementation work begins.

## Variables
PRODUCT_TITLE: $1
CONTEXT: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
PRODUCT_INTAKE_DIRECTORY: <feature-workspace>/intake/product/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Gather background material from `app-docs/`, `ai-docs/knowledge-ledger/`, and any linked specs to understand the business problem.
- Derive or confirm the feature (product) slug; create `PRODUCT_INTAKE_DIRECTORY` inside the workspace if it does not exist.
- Use Gemini MCP to propose personas, their goals, and success metrics tailored to the supplied context.
- Summarize the core product capabilities, constraints, and open questions that must be answered before planning.
- Save the resulting charter to `PRODUCT_INTAKE_DIRECTORY/charter.md` (append when the charter already exists).
- Identify missing research or stakeholder decisions the team must capture in `ai-docs/` or `app-docs/`.

## Workflow
1. Parse the prompt and prior documentation to extract product vision, target markets, and stakeholders.
2. Produce a persona table covering roles (provider, consumer, support, developer) with primary pains and desired outcomes.
3. Outline core product capabilities and non-negotiable constraints.
4. List validation metrics and next discovery steps.
5. Recommend follow-up commands for feature cataloging or research gaps.

## Report
- Provide structured sections for vision, personas, success metrics, and unresolved questions.
- Link to any documentation that should be created or updated.
- End with a checklist of immediate follow-ups (e.g., `/baw:product_features`, `/baw:product_helper`).

## Automation Trace
- Emit `phase: "product-charter"` in the workflow status JSON saved to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-product-charter.json`.
- Set `status` to `completed`, `needs_docs`, or `blocked` depending on available information.
- Point `nextCommand` to the most relevant next slash command and list supporting docs under `documentation`.
- Remind the user to run `npm run baw:workflow:sync` after updating docs.

## Next Steps
Typical follow-on commands:
- `/baw:product_features "<product-title>"`
- `/baw:product_helper "<product-title>" "<question>"`
