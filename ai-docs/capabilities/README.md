# Capability Workflow Directory

Every long-running capability lives in its own directory inside `ai-docs/capabilities/`. The structure is designed for multi-session continuity, traceability across plans/builds, and compatibility with the unified dashboard.

## Naming

- Use a short **slug** that matches the capability name (e.g., `fleet-dispatch`).
- Optionally prefix the slug with a sequencing number if you have many concurrent tracks (e.g., `2025Q1-fleet-dispatch`).
- The scaffolding script (`npm run baw:capability:scaffold`) handles slug generation for you.

## Directory Layout

```
capability-slug/
  capability-manifest.json
  README.md
  intake/
    requirements.md
    product/
      charter.md
      capabilities/
      wishlist/
      research/
    personas/
      provider/
      consumer/
      support/
    support/
    tasks/
  plans/
    checklist.json
    dependency/
    breakouts/
    deployment/
  builds/
  reports/
    discovery/
    tests/
    test-matrices/
    uat/
    deployments/
    review/
    failures/
    ops/
  sessions/
    session-backlog.json
  workflow/
  handoff/
  artifacts/
```

### Manifest

`capability-manifest.json` captures metadata that downstream tooling uses:

- `title`, `slug`, `description`, `owner` – human context.
- `status`, `stage` – lifecycle tracking for dashboards.
- `maxPlanTokens` – guardrail for `/baw_dev_plan` commands.
- `linkedLedgerEntries` – array of `KL-` IDs that govern the capability.
- `relatedCapabilities` – optional list of dependent slugs.

### Plans

- `/baw_dev_plan` writes comprehensive specifications into timestamped folders under `plans/<slice>/` with supporting artifacts alongside as needed.
- `/baw_dev_dependency_plan`, `/baw_dev_breakout_plan`, and `/baw_dev_deploy_plan` store their outputs in the dedicated `dependency/`, `breakouts/`, and `deployment/` subdirectories.
- `plans/checklist.json` keeps the authoritative backlog of plan slices, including status (`pending`, `in_progress`, `complete`, `blocked`).
- When `/baw_dev_discovery` returns additional requirements for a slice, append findings to the existing plan file, annotate the same checklist entry, and log the revision in `sessions/session-backlog.json`—do not scaffold a new capability or duplicate plan for missing details.
- If a plan is superseded, record it in the checklist and link to the new plan document.

### Builds & Reports

- `/baw_dev_build` and `/baw_dev_build_report` create timestamped directories inside `builds/` (e.g., `builds/20250112T1530-core-auth/`) that contain logs and supporting assets.
- Detailed reports land in the `reports/` subdirectories that match the command (`tests/`, `uat/`, `deployments/`, etc.) and should link back to the matching checklist entry via the `workItems` array.
- Validation output (tests, screenshots) must stay within the capability workspace so hand-offs remain self-contained.

### Workflow Logs

- Each command writes JSON to `workflow/<timestamp>-<phase>.json` describing current status, resume commands, and documentation.
- `npm run baw:workflow:sync` reads these files to populate the global `ai-docs/capabilities/status-index.json` consumed by dashboards.

### Sessions

- `sessions/session-backlog.json` tracks carryover work.
- Each working session creates `sessions/SESSION-YYYYMMDD.md` summarizing activities, blockers, and next steps.
- Use the backlog to seed the next session’s `/baw_dev_plan` request instead of rewriting the high-level epic each time.

### Intake, Handoff & Artifacts

- `intake/` captures discovery outputs from product, persona, support, and task preparation commands.
- `handoff/` contains UAT notes, deployment instructions, and final summaries.
- `artifacts/` stores design assets, exported data, or generated screenshots.

## Template Directory

`_template/` mirrors the structure and supplies starter content. The scaffolding script copies it when creating a new capability directory.

## Index File

`index.json` maintains the list of all active capabilities. Scripts and dashboards rely on it for navigation, so never edit it by hand—use `npm run baw:capability:scaffold` instead.

## Migration Guidance

When migrating existing work into this structure:

1. Create the capability directory via the scaffolding script.
2. Move legacy plans/builds/reports into the new folders, keeping filenames intact.
3. Backfill `plans/checklist.json` with historical plan slices.
4. Record the migration decision in the knowledge ledger.

Following this process ensures all historical artifacts remain discoverable while future automation can reason about the same layout.

