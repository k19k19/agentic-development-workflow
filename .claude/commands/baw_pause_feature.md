---
description: Pause feature due to complexity threshold (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Write", "run_shell_command"]
model: claude-haiku-4-5
---

# /baw_pause_feature

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered during `/baw_dev_plan` if complexity exceeds threshold. Pauses feature and suggests decomposition.

## Variables
FEATURE_ID: $1
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
SESSIONS_DIRECTORY: <feature-workspace>/sessions/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically when complexity is too high.
- Commit current work.
- Mark feature as "Paused" in session log located under `SESSIONS_DIRECTORY`.
- Suggest breaking down into smaller subtasks.
- Switch context via `/baw_next`.

## Workflow
1. Commit current analysis work.
2. Create paused state file: `SESSIONS_DIRECTORY/[ISO-timestamp]-paused.md` summarizing outstanding questions.
3. Analyze how to decompose feature into smaller tasks.
4. Suggest subtask breakdown (3-5 smaller tasks).
5. Report pause reason and recommendations and emit `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-pause.json` with `status: "blocked"`.

## Report
- Display complexity threshold exceeded warning.
- Show suggested task breakdown.
- Provide paths to saved work.
- Recommend starting with simplest subtask.

## Budget
FREE (no AI calls, just file operations)
