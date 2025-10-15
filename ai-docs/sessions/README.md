# Legacy Session Notes

**Status**: Deprecated. This directory only remains to preserve legacy session exports generated before the per-feature workflow rollout.

All current session tracking happens inside each feature workspace under `ai-docs/workflow/features/<feature-slug>/sessions/`. New files must **not** be written here—automation ignores this directory and the legacy scanner fails the CI gate if fresh content shows up.

## Current Source of Truth

- Every feature has a `sessions/` folder with:
  - `session-backlog.json` – the carryover queue that `/baw_dev_plan`, `/baw_dev_build`, and `/baw_dev_test` consume.
  - Daily session notes (`SESSION-YYYYMMDD.md`) recording what ran, artifacts produced, blockers, and intended follow-ups.
- Run `npm run baw:session:start` at the beginning of a work block to review the backlog and recommended next `/baw_` commands.
- Close out each session by updating the backlog, writing the note, and executing `npm run baw:workflow:sync` so the dashboard reflects the new state.

See `ai-docs/workflow/features/README.md` and the feature template in `ai-docs/workflow/features/_template/` for the canonical structure.

## Migrating Legacy Files

1. Identify the feature that owns the legacy file (`SESSION-YYYY-MM-DD-<slug>.md`).
2. Scaffold (or open) the matching feature directory via `npm run baw:feature:scaffold -- --title "<Feature>"` or `--feature <slug>`.
3. Move the markdown file into `ai-docs/workflow/features/<feature-slug>/sessions/`, keeping the original filename.
4. Populate `session-backlog.json` with unresolved items captured in the note.
5. Record the migration in the knowledge ledger (`KL-006`) if it materially changed the workflow.

After migration, delete the original file from this directory so the legacy scanner stays clean.

## Recommended Session Note Format

```markdown
# Session: [Feature]

**Date**: YYYY-MM-DD  
**Workflow**: /baw_dev_discovery → /baw_dev_plan → /baw_dev_build_report  
**Status**: ✅ Complete | ⏸️ In Progress | ❌ Blocked

---

## Task Summary
[What advanced during the session]

## Workflow Execution
- **Discovery**: [Key findings or links to `reports/discovery/`]
- **Plan**: [Checklist items touched and decisions]
- **Build/Test**: [Artifacts written under `builds/` or `reports/tests/`]

## Files & Artifacts
- `plans/<timestamp>-*/plan.md`
- `builds/<timestamp>-*/`
- `reports/tests/<timestamp>-*/results.md`

## Key Decisions
1. **[Decision]** — [Rationale and ledger link if applicable]

## Issues & Resolutions
- **Issue**: [Problem]  
  **Resolution**: [Fix or follow-up owner]

## Follow-up Tasks
- [ ] [Next action]
- [ ] [Validation required]

---

**Next Session Prep**: [Pointers for `/baw_dev_plan` or `/baw_dev_build`]
```

Tailor the sections to the work accomplished. The critical requirement is that the session note links to the relevant plan slice, build run, or report so the next contributor can resume without rediscovery.
