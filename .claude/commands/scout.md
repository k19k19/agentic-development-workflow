description: Use vector search to find files and context relevant to the task
argument-hint: [user_prompt]
allowed-tools: ["run_shell_command"]
model: claude-sonnet-4-5

# Scout (Vector Search)

## Purpose
Use the project's vectorized knowledge base to instantly find the most relevant files and code snippets needed to complete the `USER_PROMPT`.

## Variables
USER_PROMPT: $1

## Instructions
- Your primary goal is to use the `npm run search` command to find context for the user's task.
- Take the `USER_PROMPT` as the search query.
- Execute the search using the `run_shell_command` tool.
- The output of the search command is the definitive context. It contains the most relevant file paths and text snippets.
- You do not need to read any other files or perform any other searches.

## Workflow
1.  Take the `USER_PROMPT` provided by the user.
2.  Construct the shell command: `npm run search -- "[USER_PROMPT]"`.
3.  Execute the command using `run_shell_command`.
4.  The standard output of this command is your result. Pass this context directly to the next phase (e.g., the Plan phase).

## Report
- Summarize the top search results found.
- List the source files identified as most relevant.
- This context will be used to inform the next step of the workflow.