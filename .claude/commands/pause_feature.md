---
description: Pause feature due to complexity threshold (AI-internal command)
argument-hint: [feature-id]
allowed-tools: ["Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# Pause Feature (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered during `/plan` if complexity exceeds threshold. Pauses feature and suggests decomposition.

## Variables
FEATURE_ID: $1
SESSIONS_DIRECTORY: ai-docs/sessions/

## Instructions
- **You don't run this manually** - Claude runs it automatically when complexity is too high.
- Commit current work.
- Mark feature as "Paused" in session log.
- Suggest breaking down into smaller subtasks.
- Switch context via `/next`.

## Workflow
1. Commit current analysis work.
2. Create paused state file: `SESSIONS_DIRECTORY/[FEATURE_ID]/paused.md`.
3. Analyze how to decompose feature into smaller tasks.
4. Suggest subtask breakdown (3-5 smaller tasks).
5. Report pause reason and recommendations.

## Report
- Display complexity threshold exceeded warning.
- Show suggested task breakdown.
- Provide paths to saved work.
- Recommend starting with simplest subtask.

## Budget
FREE (no AI calls, just file operations)
