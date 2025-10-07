description: Search the codebase for files needed to complete the task
argument-hint: [user_prompt] [scale]
model: claude-sonnet-4-5

# Purpose
Search the codebase for files needed to complete the task using a fast, token efficient agent.

## Workflow
- Write a prompt for `SCALE` number of agents to the Task tool that will immediately call the Bash tool to run these commands to kick off you agents to conduct search:
    - `gemini -p “[prompt]” — model gemini-2.5-flash`
    - `gemini -p “[prompt]” — model gemini-2.5-flash-lite` (if count >= 3
    - `codex exec -m gpt-5-codex -s read-only -c model_resoning_effort="low” “[prompt”` (if count >- 4)
    - clause -p “[prompt]” —model sonnet-4.5 thinking` (if count >= 5)
- How to prompt the agents:
    - IMPORTANT: Kick these agents off in parallel using the Task tool.
    - IMPORTANT: These agent are calling OTHER agentic coding tools to search codebase. Do not call any search tools yourself.
    - IMPORTANT: That means with the Task toll, you’ll immediately call the Bash tool to run the respective agentic coding tool (gemini, claude, etc.)
    - IMPORTANT: Instruct the agents to quickly search the codebase for files needed to complete the task. This isn’t about a full blown search, just a quick search to find files needed to complete the task.
    - Instruct the subagent to use a timeout of 3 minutes for each agent’s bash call. Skip any agents that don’t return within this time limit.
    - Make it absolutely clear that the Task tool is ONLY going to call the Bash tool and pass in the appropriate prompt, replacing the [prompt] with the actual prompt you want to run.
    - Prompt the agent to retuen a structed list of file with specific line ranges in this format:
        - `<path to file> (offset: N, limit: M)` where offset is the starting line number and limit us tge number of lines to read.
        - If there are multiple relevant sections in the same file, repeat the entry with different offset/limit values
    - Execute additional agent calls in round robin fashion.
    - Give them the relevant information needed to complete the task.
    - Skip any agent outputs that are not relevant to the task including failures and errors.
    - If any agent don’t return in the proper format, don’t try ti fix it for them, just ignore their output and continue with the next agents response.
    - IMPORTANT: Again, don’t search for the agents themselves, just call the Bash tool with the appropriate prompt.
- After the agents complete, run `git diff —stat` to make sure no files were changed. If there are any changes run `git reset —hard` to reset changes.
- Follow the `Report` section to manage and report the results. We’re going to create a file to store the results.