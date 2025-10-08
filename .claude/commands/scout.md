description: Search the codebase for files needed to complete the task
argument-hint: [user_prompt] [scale]
allowed-tools: Read, Glob, Grep
model: claude-sonnet-4-5

# Scout

## Purpose
Launch parallel subagents to quickly find files relevant to the `USER_PROMPT` without editing the workspace.

## Variables
USER_PROMPT: $1
SCALE: $2 (default 4)
RELEVANT_FILE_OUTPUT_DIR: agents/scout_files/

## Instructions
- Use the Task tool to launch subagents in parallel; each subagent should immediately invoke the Bash tool to run the appropriate agentic CLI.
- Construct a concise prompt describing the search target for each agent and replace `[prompt]` with that string in the commands below.
- Respect timeouts: instruct each subagent to terminate if it takes more than 3 minutes.
- Ignore responses that do not follow the required format or are irrelevant to the task.
- Do not perform any direct searches yourself; rely entirely on the delegated agents.
- After the agents finish, run `git diff --stat` to confirm the working tree is unchanged. If any files were modified, run `git reset --hard` and inform the user.

## Workflow
1. Parse arguments and default `SCALE` to 4 when not provided.
2. Kick off subagents in round-robin fashion based on `SCALE`:
   - `>= 1`: `gemini -p "[prompt]" --model gemini-2.5-flash`
   - `>= 2`: `gemini -p "[prompt]" --model gemini-2.5-flash-lite`
   - `>= 4`: `codex exec -m gpt-5-codex -s read-only -c model_reasoning_effort="low" "[prompt]"`
   - `>= 5`: `claude -p "[prompt]" --model sonnet-4.5 --thinking`
3. Instruct each subagent to return a structured list in the exact format `<path/to/file> (offset: N, limit: M)` and to repeat entries for multiple regions within a file.
4. Collate successful outputs, skipping errors and malformed responses.
5. Persist the merged list to `ai-docs/scout-results/<timestamp>/relevant-files.md` and duplicate it to `RELEVANT_FILE_OUTPUT_DIR` for downstream commands.
6. Follow the Report section below.

## Report
- Summarize how many agents completed successfully and list the top files discovered.
- Provide the path to the saved results file.
