# ai-docs/

Automation drops session artifacts here. Treat everything as disposable unless a command tells you otherwise, *except* the curated feature directories described below.

## Top-Level Directories

- `knowledge-ledger/` – Canonical governance decisions (see `knowledge-ledger/README.md`).
- `workflow/` – Houses the aggregated `status-index.json` used by the dashboard plus per-feature workspaces in `workflow/features/`.
- `workflow/cross-session-prompt.md` *(optional)* – Create this if you want a lightweight hand-off prompt to carry between sessions.
- `workflow/tasks.json` *(optional)* – Add this when you need backlog metadata for `npm run baw:session:start`.
- `workflow/features/` – Structured feature directories managed by `npm run baw:feature:scaffold` (details below).

Legacy scratch directories (`plans/`, `builds/`, `sessions/`, `failures/`) have been removed; start new work inside a feature directory instead.

After completing a command, run `npm run baw:workflow:sync` to refresh the aggregated index before opening the dashboard. When using feature directories, run the same command after each build/report pair so manifests, checklists, and dashboards stay aligned.

## Feature Directories

Long-running initiatives live in `workflow/features/<feature-slug>/`. Each directory is self-contained and safe to hand off between sessions because it includes:

- `feature-manifest.json` – Metadata such as owner, lifecycle status, token guardrails, and linked ledger decisions.
- `README.md` – Human-readable summary and navigation pointers.
- `intake/`, `plans/`, `builds/`, `reports/`, `sessions/`, `workflow/`, `handoff/`, `artifacts/` – Phase-specific subdirectories that mirror the Large Feature Delivery Playbook in `app-docs/guides/large-feature-workflow.md`.
- `intake/tasks/` – Structured specs captured by `/baw_dev_execution_prep` so breakout details stay linked to the core plan slice.

Use `npm run baw:feature:scaffold -- --title "<Feature Title>"` to generate the structure and register the feature in `workflow/features/index.json`.

When additional details surface after the initial `/baw_dev_discovery`, append them to the existing plan under `workflow/features/<feature-slug>/plans/<timestamp>-*/plan.md`, update the matching row in `workflow/features/<feature-slug>/plans/checklist.json`, and capture any open questions in `workflow/features/<feature-slug>/sessions/session-backlog.json`. Avoid creating duplicate plan slices or new feature directories just to hold clarifications.
