# KL-006 — BAW Namespace & Capability Workspace Unification

- **Status:** Adopted
- **Adopted on:** 2025-10-12
- **Linked Artifacts:**
  - `.claude/commands/`
  - `CLAUDE.md`
  - `app-docs/guides/large-feature-workflow.md`
  - `scripts/workflow-status.js`
  - `ai-docs/capabilities/README.md`

## Problem

Command sprawl and split storage under `ai-docs/plans/` vs the legacy workflow tree confused contributors and prevented
multi-session capabilities from staying organized. New prompts frequently reused `/baw_dev_discovery` output but saved plans elsewhere,
forcing humans to reconcile artifacts manually. Command names also collided with third-party tools and lacked a
consistent namespace.

## Decision

1. Prefix every workflow slash command with `baw_` so prompts, docs, and dashboards speak a single dialect.
2. Retire the legacy `ai-docs/plans/`, `ai-docs/builds/`, and `ai-docs/sessions/` outputs in favor of per-capability workspaces
   under `ai-docs/capabilities/<capability-id>/` (plans, builds, reports, sessions, workflow logs, intake/tasks, handoff, artifacts).
3. Update automation (`scripts/workflow-status.js`, dashboard, installers) and documentation to read/write the new structure
   while keeping legacy directories ignored for backwards compatibility.

## Rationale

- **Traceability:** Storing plans, builds, and logs together preserves the narrative for long-running initiatives and
  simplifies hand-offs.
- **Command clarity:** A `baw_` namespace mirrors the npm script prefix and eliminates confusion with core Claude
  commands or external MCPs.
- **Tooling alignment:** Updating scripts and docs ensures dashboards, status sync, and onboarding material reflect the
  same directory contract, reducing onboarding time for future contributors.

## Implementation

- Refreshed command documentation and templates in `.claude/commands/` to use `/baw_*` names and write artifacts to the
  capability workspace.
- Updated `CLAUDE.md`, `CLAUDE-TEMPLATE.md`, and repository guides to describe the unified structure and new command
  taxonomy.
- Extended `scripts/workflow-status.js`, `scripts/tasks-session-start.js`, and the installer to support the namespaced
  commands and new workflow directory layout.
- Added `/ai-docs/capabilities/_template/` updates (including `intake/tasks/`) so scaffolding matches the
  architecture decision.
