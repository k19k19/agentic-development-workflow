# KL-005 — Persona-Aligned Command Restructure

- **Status:** Adopted
- **Adopted on:** 2024-05-10
- **Linked Artifacts:**
  - `README.md`
  - `CLAUDE.md`
  - `.claude/commands/product_charter.md`
  - `.claude/commands/dev_dependency_plan.md`
  - `.claude/commands/workflow_radar.md`
  - `app-docs/guides/end-to-end-command-workflow.md`
  - `app-docs/guides/workflow-status-format.md`

## Problem

The previous command catalog focused almost entirely on implementation phases. Product discovery, roadmap sequencing, and post-release support lacked dedicated prompts, forcing users to improvise instructions for Claude. This made it difficult to manage large initiatives across multiple personas and to keep automation artifacts aligned from ideation to operations.

## Decision

Restructure the command set into persona-aligned tracks:

1. **Product + Strategy** commands (`/baw:product_charter`, `/baw:product_features`, `/baw:product_wishlist`, `/baw:product_helper`) capture vision, personas, and backlog context.
2. **Developer Delivery** commands (`/baw:dev_dependency_plan`, `/baw:dev_breakout_plan`, `/baw:task_prep`, `/baw:dev_test_matrix`, `/baw:dev_deploy_plan`) bridge discovery artifacts into build-ready plans.
3. **Operations + Support** commands (`/baw:workflow_radar`, `/baw:provider_functions`, `/baw:support_ticket`) keep ongoing work, provider tooling, and feedback loops visible.

Each command writes workflow status JSON with new phase names so dashboards and governance artifacts can trace progress end-to-end.

## Rationale

Structuring commands by persona mirrors how complex products are delivered in the real world. Product teams can iterate on scope without muddying developer plans, engineers receive dependency-aware breakouts, and operations teams see blockers alongside customer feedback. The standardized phases also improve automation: dashboards categorize features accurately, and the knowledge ledger records which command produced each milestone.

## Implementation

- Authored new slash command templates under `.claude/commands/` for discovery, delivery, and operations.
- Updated `README.md` and `CLAUDE.md` to document the persona tracks and command taxonomy.
- Added the `end-to-end-command-workflow.md` guide plus workflow status guidance for the expanded phase list.
- Logged this decision so future template updates maintain the persona-aligned structure.
