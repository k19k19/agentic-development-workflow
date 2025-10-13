# KL-006 — BAW Namespace & Feature Workspace Unification

- **Status:** Adopted
- **Adopted on:** 2024-05-12
- **Linked Artifacts:**
  - `.claude/commands/`
  - `CLAUDE.md`
  - `app-docs/guides/large-feature-workflow.md`
  - `scripts/workflow-status.js`
  - `ai-docs/workflow/features/README.md`

## Problem

Command sprawl and split storage under `ai-docs/plans/` vs `ai-docs/workflow/` confused contributors and prevented
multi-session features from staying organized. New prompts frequently reused `/baw:dev_discovery` output but saved plans elsewhere,
forcing humans to reconcile artifacts manually. Command names also collided with third-party tools and lacked a
consistent namespace.

## Decision

1. Prefix every workflow slash command with `baw:` so prompts, docs, and dashboards speak a single dialect.
2. Retire the legacy `ai-docs/plans/`, `ai-docs/builds/`, and `ai-docs/sessions/` outputs in favor of per-feature workspaces
   under `ai-docs/workflow/features/<feature-id>/` (plans, builds, reports, sessions, workflow logs, intake/tasks, handoff, artifacts).
3. Update automation (`scripts/workflow-status.js`, dashboard, installers) and documentation to read/write the new structure
   while keeping legacy directories ignored for backwards compatibility.

## Rationale

- **Traceability:** Storing plans, builds, and logs together preserves the narrative for long-running initiatives and
  simplifies hand-offs.
- **Command clarity:** A `baw:` namespace mirrors the npm script prefix and eliminates confusion with core Claude
  commands or external MCPs.
- **Tooling alignment:** Updating scripts and docs ensures dashboards, status sync, and onboarding material reflect the
  same directory contract, reducing onboarding time for future contributors.

## Implementation

- Refreshed command documentation and templates in `.claude/commands/` to use `/baw:*` names and write artifacts to the
  feature workspace.
- Updated `CLAUDE.md`, `CLAUDE-TEMPLATE.md`, and repository guides to describe the unified structure and new command
  taxonomy.
- Extended `scripts/workflow-status.js`, `scripts/tasks-session-start.js`, and the installer to support the namespaced
  commands and new workflow directory layout.
- Added `/ai-docs/workflow/features/_template/` updates (including `intake/tasks/`) so scaffolding matches the
  architecture decision.
