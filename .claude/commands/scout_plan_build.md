description: Run a three step engineering workflow to deliver on the user_prompt
argument-hint: [user_prompt] [document-urls] [mode]
model: claude-sonnet-4-5

# Scout Plan Build

## Purpose
Run a three step engineering workflow to deliver on the `USER_PROMPT`.
First scout the codebase for files needed to complete the task.
Then plan the task based on the files found.
Then build the task based on the plan.

## Variables
USER_PROMPT: $1
DOCUMENTATION_URLS: $2
MODE: $3 (default: standard)

## Instructions
- Execute each step in order, top to bottom, without pausing between stages.
- Accepted MODE values:
  - `standard` (default) — run the full workflow.
  - `questions` — insert the clarifying-questions step before planning.
  - `budget` — minimize paid model usage (reduced scout scale, concise plan output).
- If an unexpected result is returned, stop immediately and notify the user.
- Place every SlashCommand argument in double quotes and convert nested double quotes to single quotes.
- Only modify the `USER_PROMPT` when MODE is `budget` (append ` [BUDGET MODE]` before passing it downstream).

## Workflow
1. If MODE is `budget`, run SlashCommand(`/scout "[USER_PROMPT] [BUDGET MODE]" "2"`) -> `relevant_files_collection_path`; otherwise run `/scout "[USER_PROMPT]" "4"`.
2. If MODE is `questions` (or any truthy value other than `budget`), run SlashCommand(`/questions "[USER_PROMPT]"`). Skip this step for `budget`.
3. If MODE is `budget`, run SlashCommand(`/plan_w_docs "[USER_PROMPT] [BUDGET MODE]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"`); otherwise run `/plan_w_docs "[USER_PROMPT]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"` to obtain `path_to_plan`.
4. Run SlashCommand(`/build_w_report "[path_to_plan]"`) -> `build_report`.
5. Report your work based on the `Report` section defined in the downstream commands.
