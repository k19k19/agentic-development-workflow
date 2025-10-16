# ai-docs/

Automation drops session artifacts here. Treat everything as disposable unless a command tells you otherwise, *except* the curated capability directories described below.

## Top-Level Directories

- `charter.md` – The current product vision and guardrails produced by `/baw_product_charter`.
- `capabilities/` – Capability catalog outputs (`/baw_product_capabilities`) plus individual capability workspaces.
- `wishlist/` – Stretch ideas captured via `/baw_product_wishlist`.
- `helper/` – Research notes created by `/baw_product_helper`.
- `research/` – Deep-dive compliance or market studies that inform roadmap decisions.
- `knowledge-ledger/` – Canonical governance decisions (see `knowledge-ledger/README.md`).

Legacy scratch directories (`plans/`, `builds/`, `sessions/`, `failures/`) have been removed; start new work inside a capability directory instead.

After completing a command, run `npm run baw:workflow:sync` to refresh the aggregated index before opening the dashboard. When using capability directories, run the same command after each build/report pair so manifests, checklists, and dashboards stay aligned.

## Capability Directories

Long-running initiatives live in `capabilities/<capability-slug>/`. Each directory is self-contained and safe to hand off between sessions because it includes:

- `capability-manifest.json` – Metadata such as owner, lifecycle status, token guardrails, and linked ledger decisions.
- `README.md` – Human-readable summary and navigation pointers.
- `intake/`, `plans/`, `builds/`, `reports/`, `sessions/`, `workflow/`, `handoff/`, `artifacts/` – Phase-specific subdirectories that mirror the Large Capability Delivery Playbook in `app-docs/guides/large-feature-workflow.md`.
- `intake/tasks/` – Structured specs captured by `/baw_dev_execution_prep` so breakout details stay linked to the core plan slice.

Use `npm run baw:capability:scaffold -- --title "<Capability Title>"` to generate the structure and register the capability in `capabilities/index.json`.

When additional details surface after the initial `/baw_dev_discovery`, append them to the existing plan under `capabilities/<capability-slug>/plans/<timestamp>-*/plan.md`, update the matching row in `capabilities/<capability-slug>/plans/checklist.json`, and capture any open questions in `capabilities/<capability-slug>/sessions/session-backlog.json`. Avoid creating duplicate plan slices or new capability directories just to hold clarifications.
