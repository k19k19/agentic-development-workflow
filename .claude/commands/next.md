---
description: Select next feature from roadmap
argument-hint: []
allowed-tools: ["Read", "Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# Next Feature

## Purpose
Select the next feature to work on from the product roadmap.

## Variables
ROADMAP_FILE: app-docs/roadmap.md
SPECS_DIRECTORY: app-docs/specs/

## Instructions
- Read the product roadmap.
- Identify next priority feature.
- Check if spec exists for that feature.
- Suggest running `/start [feature-id]` to begin.

## Workflow
1. Read `ROADMAP_FILE` to see feature priority list.
2. Identify the next feature marked as "Ready" or "To Do".
3. Check if spec file exists in `SPECS_DIRECTORY`.
4. Report next feature and suggest starting it.

## Report
- Display next feature ID and title.
- Show feature priority and estimated complexity.
- Indicate if spec exists or needs to be created.
- Suggest running `/start "[feature-id]"` to begin.

## Budget
FREE (no AI calls, just file reading)
