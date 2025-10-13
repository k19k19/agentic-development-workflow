# Making Slash Commands Codex-Compatible

The slash-command workflow is defined in `.claude/commands/*.md`. Each command already runs through Claude by default but can invoke Codex MCP for implementation work. Use this checklist when you add a new command or retrofit an existing one so that Codex can execute it without manual intervention.

## 1. Allow the Codex MCP tool
- In the command front matter, make sure the `allowed-tools` array includes `"mcp__codex__codex"` alongside the standard filesystem tools.
- Example (`/baw:dev_quick_build` already ships this setup):
  ```yaml
  allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command"]
  ```
  This grants the workflow agent permission to call Codex when the command is executed.【F:.claude/commands/dev_quick_build.md†L1-L20】

## 2. Point instructions at Codex work
- Spell out in the command body when Codex should take over. `/baw:dev_quick_build` demonstrates the pattern with explicit guidance to “Use Codex MCP directly to implement the task.”【F:.claude/commands/dev_quick_build.md†L21-L37】
- Reuse this language in other commands so the orchestrator consistently delegates implementation steps to Codex.

## 3. Keep Codex in the budget model list
- The session kickoff dashboard treats Codex as a “cheap” model. Verify that `scripts/tasks-session-start.js` lists `codex` inside `CHEAP_MODELS` so token reports categorize it correctly.【F:scripts/tasks-session-start.js†L16-L38】
- If you rename the Codex deployment, add the new identifier to that array to avoid skewed budget recommendations.

## 4. Update automation tips when needed
- The same script prints guidance encouraging delegates to lean on Codex for straightforward implementation work.【F:scripts/tasks-session-start.js†L112-L154】
- When you introduce new commands or alter the division of labor, adjust these tips so they match the current Codex usage strategy.

Following this checklist ensures every slash command grants Codex the access it needs, the instructions steer work to Codex, and the reporting pipeline continues to treat Codex usage as part of the low-cost tier.
