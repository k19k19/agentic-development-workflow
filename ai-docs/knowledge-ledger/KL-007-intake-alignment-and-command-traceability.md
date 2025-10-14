# KL-007 — Intake Alignment & Command Traceability
- **Adopted:** 2025-10-14
- **Status:** Adopted
- **Supersedes:** _None_
- **Related:** KL-003, KL-004, KL-006

## Problem
Even after namespacing commands under `/baw_` and routing outputs into feature workspaces, discovery artifacts
(product strategy, persona notes, support triage) and follow-up command docs still drifted. Some commands
referenced legacy folders (`ai-docs/plans/`), while product/support outputs lacked a consistent home. As the
command surface expanded, teams struggled to trace how research flowed into plans, builds, and operations.

## Decision
Unify command guidance and the feature template so every discovery and execution artifact lands inside the same
`ai-docs/workflow/features/<feature-id>/` workspace:

1. Expand the template with structured intake directories (`product/`, `personas/`, `support/`, `tasks/`) and
   command-specific report folders (`reports/discovery`, `reports/tests`, `reports/uat`, etc.).
2. Update every `.claude/commands/*.md` to call out the feature workspace slug, identify the correct subfolder,
   and emit workflow logs that tie back to plan checklist entries.
3. Document the discovery ➝ execution prep distinction so discovery remains iterative while breakout prep produces
   actionable checklists linked to the same plan slice.
4. Refresh project guidance (`README.md`, `CLAUDE.md`, `CLAUDE-TEMPLATE.md`) so maintainers and downstream teams
   know where to inspect artifacts and how to scaffold new features.

## Status Impact
- Product discovery commands now save to `intake/product/` while provider/support playbooks live under
  `intake/personas/` and `intake/support/`.
- Developer-focused commands reference dedicated `plans/dependency`, `plans/breakouts`, `plans/deployment`, and
  report directories, eliminating references to deprecated top-level folders.
- Operations tooling (`/baw_workflow_radar`, `/baw_dev_deploy_staging`, `/baw_dev_release`) logs outputs in
  `reports/ops` and `reports/deployments`, ensuring the dashboard can trace readiness and release history.
- Command docs explicitly remind agents to reuse the existing workspace slug, preventing accidental feature
  duplication.

## Implementation
- Template updates: `ai-docs/workflow/features/_template/**`, `scripts/init-agentic-workflow.sh`
- Command guidance: `.claude/commands/*.md`
- Repo documentation: `README.md`, `CLAUDE.md`, `CLAUDE-TEMPLATE.md`

Run `npm run baw:feature:scaffold` after pulling this change to copy the expanded directory layout into downstream
projects.
