---
description: Capture future enhancements and stretch goals for the product
argument-hint: [product_title] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_product_wishlist

## Purpose
Record aspirational features, experiments, and deferred scope so the core delivery plan stays focused while keeping a backlog of future ideas.

## Variables
PRODUCT_TITLE: $1
CONTEXT: $2
CAPABILITY_WORKSPACE_ROOT: ai-docs/capabilities/
PRODUCT_WISHLIST_ROOT: ai-docs/wishlist/
WORKFLOW_LOG_DIRECTORY: <capability-workspace>/workflow/

## Instructions
- Review the capability catalog, personas, and stakeholder notes for deferred asks (look in `PRODUCT_WISHLIST_ROOT` and `ai-docs/charter.md`).
- Treat `<capability-workspace>` as `CAPABILITY_WORKSPACE_ROOT/<capability-slug>` and ensure it exists if workflow logging is required.
- Use Gemini MCP to brainstorm enhancements that extend the product vision without blocking the core launch.
- For each wishlist item, track customer value, prerequisites, and triggers that would justify activation.
- Suggest documentation updates or experiments required to validate the idea.

## Workflow
1. Summarize current scope boundaries from the feature catalog.
2. List wishlist items grouped by persona or capability area.
3. Note dependencies, required research, and signals for prioritization.
4. Identify which items should flow into discovery or research tracks.
5. Recommend follow-up commands for research or task management.

## Report
- Provide a table of wishlist items with value statement, persona, dependency notes, and activation signals and save it to
  `PRODUCT_WISHLIST_ROOT/<ISO-timestamp>-wishlist.md`.
- Highlight experiments or metrics needed to validate each idea.
- End with guidance on where the wishlist lives inside the capability workspace.

## Automation Trace
- Emit status JSON with `phase: "wishlist"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-wishlist.json`.
- Use `status` values `completed`, `needs_docs`, or `blocked`.
- Set `nextCommand` toward `/baw_product_helper`, `/baw_workflow_radar`, or other relevant follow-ups.
- Remind the user to run `npm run baw:workflow:sync`.

## Next Steps
- `/baw_product_helper "<product-title>" "<research-question>"`
- `/baw_workflow_radar "<initiative>"`
