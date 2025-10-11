---
description: Generate documentation and update trackers
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "Edit", "run_shell_command"]
model: claude-sonnet-4-5
---

# Finalize Feature

## Purpose
Generate final documentation, update feature trackers, and prepare for production release.

## Variables
FEATURE_ID: $1
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md

## Instructions
- If `FEATURE_ID` is missing, stop and ask the user to provide it.
- Update `MAPPINGS_FILE` with new feature-to-source mappings.
- Update README.md if user-facing changes exist.
- Generate architecture docs if structural changes were made.
- Update feature tracker (mark as "Ready for Release").
- Do NOT duplicate information across docs.

## Workflow
1. Validate `FEATURE_ID` is provided.
2. Read latest build report from `ai-docs/builds/`.
3. Update `MAPPINGS_FILE` with new file locations.
4. Check if README.md needs updates (new commands, API changes, etc.).
5. Generate architecture documentation if applicable.
6. Mark feature as complete in tracker.

## Report
- List documentation files updated.
- Show feature-to-source mappings added.
- Confirm feature marked as ready for release.
- Suggest running `/release` to deploy to production.

## Next Steps

**→ Deploy to production:**
```bash
/release
```

**→ Work on next feature:**
```bash
/next  # Auto-select from roadmap
```

Or start a specific feature:
```bash
/full "[new-task]" "[docs]" "budget"
```

**Review what was done:**
```bash
cat app-docs/mappings/feature-to-source.md  # Check feature mappings
cat ai-docs/sessions/SESSION-*.md           # Read session history
```

## Budget
~10K tokens (Claude for doc generation)
