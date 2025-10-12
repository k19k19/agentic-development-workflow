---
description: Initialize clean environment for new feature
argument-hint: [feature-id]
allowed-tools: ["Read", "Write", "run_shell_command"]
model: o4-mini
---

# Start Feature

## Purpose
Initialize a clean, hermetic environment for a new feature. Load feature specifications and set up session logging.

## Variables
FEATURE_ID: $1
SPECS_DIRECTORY: app-docs/specs/
SESSIONS_DIRECTORY: ai-docs/sessions/

## Instructions
- If `FEATURE_ID` is missing, stop and ask the user to provide it.
- Look for a spec file matching `SPECS_DIRECTORY/[FEATURE_ID].md` or `SPECS_DIRECTORY/*-[FEATURE_ID].md`.
- If found, read and summarize the feature requirements.
- Create a session directory: `SESSIONS_DIRECTORY/[FEATURE_ID]/`.
- Initialize a session log file with timestamp and loaded context.
- Clear any stale context to ensure a fresh start.

## Workflow
1. Validate `FEATURE_ID` is provided.
2. Search for feature spec in `SPECS_DIRECTORY`.
3. If spec exists, read and summarize key requirements.
4. Create session directory structure.
5. Initialize session log with timestamp.
6. Report successful initialization and suggest next steps.

## Report
- Confirm environment initialized for `FEATURE_ID`.
- Display path to loaded spec (if found).
- Show session log location.
- Suggest running `/scout` to discover relevant files.
