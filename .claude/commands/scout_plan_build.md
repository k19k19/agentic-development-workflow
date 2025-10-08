description: Run a three step engineering workflow to deliver on the user_prompt
argument-hint: [user_prompt] [document-urls]
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

## Instructions
- Execute each step in order, top to bottom, without pausing between stages.
- If an unexpected result is returned, stop immediately and notify the user.
- Place every SlashCommand argument in double quotes and convert nested double quotes to single quotes.
- Do not alter the `USER_PROMPT` value; pass it through exactly as provided.

## Workflow
1. Run SlashCommand(`/scout "[USER_PROMPT]" "4"`) -> `relevant_files_collection_path`.
2. Run SlashCommand(`/plan_w_docs "[USER_PROMPT]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"`) -> `path_to_plan`.
3. Run SlashCommand(`/build_w_report "[path_to_plan]"`) -> `build_report`.
4. Report your work based on the `Report` section defined in the downstream commands.
