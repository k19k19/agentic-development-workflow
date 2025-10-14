# Large Feature Delivery Playbook

This playbook codifies the operating model for features that span multiple prompts, agents, and development days. It expands the lightweight defaults into a structure that scales without breaking token budgets or losing traceability.

## Guiding Principles

1. **Decompose deliberately.** Every epic is decomposed into feature tracks, and each track is broken into prompt-sized plans capped by the agreed token budget.
2. **Promote artifacts to first-class citizens.** Plans, build logs, reports, and deployment notes live alongside the feature they belong to so they can be replayed, audited, and handed off between sessions.
3. **Session continuity is sacred.** Daily work always resumes from the feature directory, using the session backlog to decide what to do next.
4. **Ledger-first governance.** Any non-trivial change in strategy, tooling, or architecture is ratified through the knowledge ledger so downstream teams inherit the same guardrails.
5. **Dashboards are aggregations, not silos.** The unified dashboard reads from the same structured directories so it can surface pending plans, builds, and open follow-ups.

## Feature Lifecycle in Practice

| Phase | Artifacts | Commands |
| --- | --- | --- |
| **Intake** | `feature-manifest.json`, `intake/requirements.md` | `npm run baw:feature:scaffold -- --title "Fleet Dispatch" --token 20000 --owner ops`
| **Discovery** | `intake/requirements.md`, `intake/tasks/` | `/baw_dev_discovery` with follow-ups captured in `intake/`
| **Planning** | `plans/<timestamp>-*/plan.md`, `plans/checklist.json` | `/baw_dev_plan` per manageable slice (`maxPlanTokens` in manifest)
| **Build / Test** | `builds/<timestamp>-*/`, `reports/<timestamp>-*/report.md` | `/baw_dev_build`, `/baw_dev_build_report`, `/baw_dev_test`
| **Deploy / Verify** | `handoff/deploy.md`, `reports/uat.md` | `/baw_dev_deploy_staging`, `/baw_dev_finalize`, `/baw_dev_release`, plus human UAT notes
| **Closeout** | `sessions/session-backlog.json`, `handoff/summary.md`, `workflow/*.json` | `/baw_workflow_radar` summaries and ledger updates

Each iteration through the table is scoped to a plan slice that fits within the token budget recorded in the manifest.

## Breaking Down Work to Fit Token Budgets

- The manifest stores the **maximum plan token allotment** (`maxPlanTokens`). Use it as a hard stop; if `/baw_dev_plan` would exceed the limit, split the scope and produce two plans.
- Plans are sequenced through `plans/checklist.json`. Items cannot be marked `complete` until their build artifacts exist.
- When `/baw_dev_discovery` exposes missing implementation details, update the active `plans/<timestamp>-*/plan.md` file and the matching checklist entry instead of opening a new plan slice. Flag the need for clarification in `sessions/session-backlog.json` so the next session keeps refining the same slice until it is actionable.
- Session notes must capture the remaining plan backlog so the next session can resume without re-issuing the original high-level prompt.
- The knowledge ledger tracks any deliberate cuts or deferrals so scope changes are explicit.

## Multi-Command Build Strategy

Relying on a single `build-w-report` command for massive features is fragile. Instead:

1. Run `/baw_dev_build` for each plan slice, committing after a focused set of changes.
2. Generate reports with `/baw_dev_build_report` scoped to the same slice (or use `reports/` for manually written summaries).
3. Invoke `npm run baw:workflow:sync` after every build/report pair so the dashboard reflects the new state.
4. When the slice spans multiple days, record what remains in `sessions/session-backlog.json` and open a follow-up plan entry before ending the session.

This pipeline keeps pull requests reviewable and avoids token overruns.

## Session-Oriented Workflow

- **Start of day:** run `npm run baw:session:start` to view the backlog. Open the relevant feature directory and read `sessions/session-backlog.json`.
- **During work:** append to `sessions/SESSION-YYYYMMDD.md` with accomplishments, blockers, and next steps. Link to plan IDs and build logs.
- **End of day:** update `sessions/session-backlog.json` with remaining tasks, run `npm run baw:workflow:sync`, and attach the latest ledger decisions.
- **Carryover:** future sessions load the same backlog file, ensuring continuity without rediscovering context.

## ai-docs/ Folder Organization

Feature work now lives under `ai-docs/workflow/features/<feature-slug>/` with the following canonical layout:

```
feature-slug/
  feature-manifest.json
  README.md
  intake/
    tasks/
  plans/
  builds/
  reports/
  sessions/
    session-backlog.json
  workflow/
  handoff/
  artifacts/
```

Automation, scripts, and humans all read from the same structure, making it trivial to answer “what’s the current status?”

## Knowledge Ledger Integration

- Every feature manifest references the `KL-` entries that govern its approach.
- New process rules (like this playbook) are captured via a `KL-` proposal and added to `ledger.md` once adopted.
- Session backlog items link to ledger entries when they depend on a decision, providing traceability from task to rationale.

## Dashboard and Reporting Roadmap

The unified dashboard remains useful for quick status checks, but large programs require additional slices:

1. **Feature Backlog View** – Reads `features/index.json` and each manifest to display lifecycle status, owners, and token budgets.
2. **Session Timeline View** – Aggregates `sessions/*.md` across features to show continuity and hand-offs.
3. **Risk & Debt View** – Surfaces ledger entries tagged with `risk`, `debt`, or `follow-up` alongside open backlog items.

These views are planned as incremental enhancements to `scripts/unified-dashboard.js`, driven by the structured files introduced above.

## When to Create a Knowledge Ledger Entry

- When a new workflow command or automation is introduced (e.g., a feature scaffolder).
- When changing how plans are sliced or how the backlog is tracked.
- When introducing cross-feature dependencies that require coordination policies.

Keeping the ledger current ensures every contributor can reason about the system years after the initial rollout.

## Next Steps

1. Adopt the directory structure immediately for all new features (use the scaffolding script below).
2. Migrate existing features into the structure as they are touched; capture migration notes in `handoff/` and the ledger.
3. Prioritize dashboard enhancements once at least one feature has active intake, plans, and sessions recorded under the new layout.

