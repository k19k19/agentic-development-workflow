# Feature Workflow Directory

Every long-running feature lives in its own directory inside `ai-docs/workflow/features/`. The structure is designed for multi-session continuity, traceability across plans/builds, and compatibility with the unified dashboard.

## Naming

- Use a short **slug** that matches the feature name (e.g., `fleet-dispatch`).
- Optionally prefix the slug with a sequencing number if you have many concurrent tracks (e.g., `2025Q1-fleet-dispatch`).
- The scaffolding script (`npm run baw:feature:scaffold`) handles slug generation for you.

## Directory Layout

```
feature-slug/
  feature-manifest.json
  README.md
  intake/
  plans/
    checklist.json
  builds/
  reports/
  sessions/
    session-backlog.json
  handoff/
  artifacts/
```

### Manifest

`feature-manifest.json` captures metadata that downstream tooling uses:

- `title`, `slug`, `description`, `owner` – human context.
- `status`, `stage` – lifecycle tracking for dashboards.
- `maxPlanTokens` – guardrail for `/plan` commands.
- `linkedLedgerEntries` – array of `KL-` IDs that govern the feature.
- `relatedFeatures` – optional list of dependent slugs.

### Plans

- Each `/plan` result becomes `plans/PLAN-YYYYMMDD-HHMM.md`.
- `plans/checklist.json` keeps the authoritative backlog of plan slices, including status (`pending`, `in_progress`, `complete`, `blocked`).
- When `/scout` returns additional requirements for a slice, append the findings to the existing plan file, annotate the same checklist entry, and log the revision in `sessions/session-backlog.json`—do not scaffold a new feature or duplicate plan for missing details.
- If a plan is superseded, record it in the checklist and link to the new plan document.

### Builds & Reports

- `/build` logs are saved as `builds/BUILD-YYYYMMDD-HHMM.log`.
- `/report` output or manual summaries live in `reports/REPORT-YYYYMMDD-HHMM.md`.
- Tie each build/report pair back to the checklist via the `workItems` array.

### Sessions

- `sessions/session-backlog.json` tracks carryover work.
- Each working session creates `sessions/SESSION-YYYYMMDD.md` summarizing activities, blockers, and next steps.
- Use the backlog to seed the next session’s `/plan` request instead of rewriting the high-level epic each time.

### Handoff & Artifacts

- `handoff/` contains UAT notes, deployment instructions, and final summaries.
- `artifacts/` stores design assets, exported data, or generated screenshots.

## Template Directory

`_template/` mirrors the structure and supplies starter content. The scaffolding script copies it when creating a new feature directory.

## Index File

`index.json` maintains the list of all active features. Scripts and dashboards rely on it for navigation, so never edit it by hand—use `npm run baw:feature:scaffold` instead.

## Migration Guidance

When migrating existing work into this structure:

1. Create the feature directory via the scaffolding script.
2. Move legacy plans/builds/reports into the new folders, keeping filenames intact.
3. Backfill `plans/checklist.json` with historical plan slices.
4. Record the migration decision in the knowledge ledger.

Following this process ensures all historical artifacts remain discoverable while future automation can reason about the same layout.

