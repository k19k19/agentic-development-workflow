---
description: Initialize clean environment for new feature
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_dev_feature_start

## Purpose
Initialize a clean, hermetic environment for a new feature. Load feature specifications and set up session logging.

## Variables
FEATURE_ID: $1
SPECS_DIRECTORY: app-docs/specs/
CAPABILITY_WORKSPACE_ROOT: ai-docs/capabilities/
INTAKE_DIRECTORY: <capability-workspace>/intake/
SESSIONS_DIRECTORY: <capability-workspace>/sessions/
WORKFLOW_LOG_DIRECTORY: <capability-workspace>/workflow/

## Instructions
- If `FEATURE_ID` is missing, stop and ask the user to provide it.
- Look for a spec file matching `SPECS_DIRECTORY/[FEATURE_ID].md` or `SPECS_DIRECTORY/*-[FEATURE_ID].md`.
- If found, read and summarize the feature requirements, then copy or link them into `INTAKE_DIRECTORY/requirements.md`.
- Treat `<capability-workspace>` as `CAPABILITY_WORKSPACE_ROOT/<capability-id>` and create it with `npm run baw:capability:scaffold` when needed.
- Initialize a session log file (`SESSIONS_DIRECTORY/SESSION-[date]-kickoff.md`) with timestamp and loaded context.
- Clear any stale context to ensure a fresh start.

## Workflow
1. Validate `FEATURE_ID` is provided.
2. Search for feature spec in `SPECS_DIRECTORY`.
3. If spec exists, read and summarize key requirements.
4. Create session directory structure inside the capability workspace.
5. Initialize session log with timestamp and capture initial context.
6. Write `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-start.json` (`phase: "start"`, `status: "completed"`).
7. Report successful initialization and suggest next steps (`/baw_dev_discovery` followed by `/baw_dev_plan`).

## Report
- Confirm environment initialized for `FEATURE_ID`.
- Display path to loaded spec (if found).
- Show session log location inside the capability workspace.
- Suggest running `/baw_dev_discovery` to discover relevant files.
- Remind the user to run `npm run baw:workflow:sync` so dashboards pick up the new feature.
