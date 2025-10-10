---
description: Run a three step engineering workflow to deliver on the user_prompt
argument-hint: [user_prompt] [document-urls] [mode]
model: claude-sonnet-4-5
---

# Full Workflow (Scout → Plan → Build)

## Purpose
Execute the complete engineering workflow with approval gates for large, complex features.
First scout the codebase for files needed to complete the task.
Then plan the task based on the files found.
Then build the task based on the plan with human approval before implementation.

## Variables
USER_PROMPT: $1
DOCUMENTATION_URLS: $2
MODE: $3 (default: standard)

## Instructions
- Execute each step in order, top to bottom, without pausing between stages.
- Accepted MODE values:
  - `standard` (default) — run the full workflow with vector search scout and detailed plan.
  - `budget` — minimize paid model usage (concise ~350-word plan).
- If an unexpected result is returned, stop immediately and notify the user.
- Place every SlashCommand argument in double quotes and convert nested double quotes to single quotes.
- Only modify the `USER_PROMPT` when MODE is `budget` (append ` [BUDGET MODE]` before passing it downstream).

## Workflow
1. Run SlashCommand(`/scout "[USER_PROMPT]"`) -> `relevant_files_collection_path`.
2. If MODE is `budget`, run SlashCommand(`/plan "[USER_PROMPT] [BUDGET MODE]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"`); otherwise run `/plan "[USER_PROMPT]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"` to obtain `path_to_plan`.
3. Wait for user approval of the plan before proceeding.
4. Run SlashCommand(`/build_w_report "[path_to_plan]"`) -> `build_report`.
5. Report your work based on the `Report` section defined in the downstream commands.
