---
description: Select next feature from roadmap
argument-hint: []
allowed-tools: ["Read", "Write", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw:next

## Purpose
Select the next feature to work on from the product roadmap.

## Variables
ROADMAP_FILE: app-docs/roadmap.md
SPECS_DIRECTORY: app-docs/specs/
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/

## Instructions
- Read the product roadmap.
- Identify next priority feature.
- Check if spec exists for that feature.
- Suggest running `/baw:dev_feature_start [feature-id]` to begin, ensuring a feature workspace skeleton exists at
  `FEATURE_WORKSPACE_ROOT/<feature-id>/`.

## Workflow
1. Read `ROADMAP_FILE` to see feature priority list.
2. Identify the next feature marked as "Ready" or "To Do".
3. Check if spec file exists in `SPECS_DIRECTORY` and whether the workspace has been scaffolded under `FEATURE_WORKSPACE_ROOT`.
4. Report next feature, indicate workspace readiness, and suggest starting it.

## Report
- Display next feature ID and title.
- Show feature priority and estimated complexity.
- Indicate if spec exists or needs to be created.
- Highlight whether `ai-docs/workflow/features/<feature-id>/` already exists or should be scaffolded via `npm run baw:scaffold:feature`.
- Suggest running `/baw:dev_feature_start "[feature-id]"` to begin.

## Budget
FREE (no AI calls, just file reading)
