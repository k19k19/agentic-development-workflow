---
description: Generate documentation and update trackers
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "Edit", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw:finalize

## Purpose
Generate final documentation, update feature trackers, and prepare for production release.

## Variables
FEATURE_ID: $1
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Feature Workspace
- Validate `FEATURE_ID` and confirm the workspace lives at `FEATURE_WORKSPACE_ROOT/<feature-id>/`.
- Use workspace subdirectories for source material: builds under `builds/`, reports under `reports/`, sessions under `sessions/`.
- Record final documentation artifacts inside `reports/finalization/` and update `feature-manifest.json` if ownership changed.

## Instructions
- If `FEATURE_ID` is missing, stop and ask the user to provide it.
- Update `MAPPINGS_FILE` with new feature-to-source mappings.
- Update README.md if user-facing changes exist.
- Generate architecture docs if structural changes were made and save them to `reports/finalization/`.
- Update feature tracker (mark as "Ready for Release") via a workflow log entry in `WORKFLOW_LOG_DIRECTORY`.
- Do NOT duplicate information across docs.

## Workflow
1. Validate `FEATURE_ID` is provided.
2. Read the latest build report from `ai-docs/workflow/features/<feature-id>/builds/` (or `reports/build/` for summaries).
3. Update `MAPPINGS_FILE` with new file locations.
4. Check if README.md needs updates (new commands, API changes, etc.).
5. Generate architecture documentation if applicable.
6. Mark feature as complete in tracker and write `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-finalize.json` with `phase: "finalize"`.

## Report
- List documentation files updated (include workspace-relative paths).
- Show feature-to-source mappings added.
- Confirm feature marked as ready for release with a pointer to the workflow log entry.
- Suggest running `/baw:release` to deploy to production.

## Next Steps

**→ Deploy to production:**
```bash
/baw:release
```

**→ Work on next feature:**
```bash
/baw:next  # Auto-select from roadmap
```

Or start a specific feature:
```bash
/baw:full "[new-task]" "[docs]" "budget"
```

**Review what was done:**
```bash
cat app-docs/mappings/feature-to-source.md                    # Check feature mappings
cat ai-docs/workflow/features/<feature-id>/sessions/SESSION-*.md  # Read session history
```

## Budget
~10K tokens (Claude for doc generation)
