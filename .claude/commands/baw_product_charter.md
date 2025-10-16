---
description: Map the product charter, personas, and core value proposition
argument-hint: [product_title] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_product_charter

## Purpose
Establish a product north star that clarifies what the product does, who it serves, and how success will be measured before any implementation work begins.

## Variables
PRODUCT_TITLE: $1
CONTEXT: $2
CAPABILITY_WORKSPACE_ROOT: ai-docs/capabilities/
PRODUCT_CHARTER_PATH: ai-docs/charter.md
WORKFLOW_LOG_DIRECTORY: <capability-workspace>/workflow/

## Instructions
- Gather background material from `app-docs/`, `ai-docs/knowledge-ledger/`, and any linked specs to understand the business problem.
- Derive or confirm the capability slug; if one does not exist yet, prompt the user to scaffold a workspace before proceeding.
- When a capability workspace already exists, treat `<capability-workspace>` as `CAPABILITY_WORKSPACE_ROOT/<capability-slug>`.
- Use Gemini MCP to propose personas, their goals, and success metrics tailored to the supplied context.
- Summarize the core product capabilities, constraints, and open questions that must be answered before planning.
- Draft a first-pass man-hour range (optimistic, most likely, buffer) by sizing the charter capabilities using the estimation heuristics in `app-docs/guides/product-charter-effort-estimates.md`.
- Save the resulting charter to `PRODUCT_CHARTER_PATH` (append when the charter already exists) and link any supporting artifacts.
- Identify missing research or stakeholder decisions the team must capture in `ai-docs/research/`, `ai-docs/helper/`, or `app-docs/`.

## Workflow
1. Parse the prompt and prior documentation to extract product vision, target markets, and stakeholders.
2. Produce a persona table covering roles (provider, consumer, support, developer) with primary pains and desired outcomes.
3. Outline core product capabilities and non-negotiable constraints.
4. List validation metrics and next discovery steps.
5. Recommend follow-up commands for feature cataloging or research gaps.

## Report
- Provide structured sections for vision, personas, success metrics, unresolved questions, and an "Initial Man-Hour Estimate" table capturing the sizing assumptions.
- Link to any documentation that should be created or updated.
- End with a checklist of immediate follow-ups (e.g., `/baw_product_capabilities`, `/baw_product_helper`).

## Automation Trace
- Emit `phase: "product-charter"` in the workflow status JSON saved to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-product-charter.json`.
- Set `status` to `completed`, `needs_docs`, or `blocked` depending on available information.
- Point `nextCommand` to the most relevant next slash command and list supporting docs under `documentation`.
- Remind the user to run `npm run baw:workflow:sync` after updating docs.

## Next Steps
Typical follow-on commands:
- `/baw_product_capabilities "<product-title>"`
- `/baw_product_helper "<product-title>" "<question>"`
