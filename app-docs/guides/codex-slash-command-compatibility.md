# Making Slash Commands Codex-Orchestrator Compatible

The slash-command workflow lives in `.claude/commands/*.md`. Each command now runs through Codex by default but must invoke Claude and Gemini MCP tools to get work done. Use this checklist when you add a new command or retrofit an existing one so that Codex can orchestrate without manual intervention.

## 1. Allow the Claude & Gemini MCP tools
- In the command front matter, make sure the `allowed-tools` array includes `"mcp__claude__complete"` (for edits) and `"mcp__gemini-cli-mcp__ask-gemini"` (for research) alongside the standard filesystem tools.
- Example (`/quick` already ships this setup):
  ```yaml
  allowed-tools: ["mcp__claude__complete", "mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Edit", "run_shell_command"]
  ```
  This grants Codex permission to call the MCP tools whenever the command runs.【F:.claude/commands/quick.md†L1-L20】

## 2. Point instructions at delegated work
- Spell out in the command body when Codex hands off to Claude MCP or Gemini MCP. `/quick` shows the pattern with explicit guidance to delegate edits to Claude MCP while Codex reports results.【F:.claude/commands/quick.md†L16-L37】
- Reuse this language in other commands so the orchestrator consistently routes implementation to Claude MCP and research to Gemini MCP.

## 3. Keep Claude MCP in the budget model list
- The session kickoff dashboard treats Claude MCP as part of the low-cost pool. Verify that `scripts/tasks-session-start.js` lists your Claude deployment (e.g., `claude-sonnet-4-5`) inside `CHEAP_MODELS` so token reports categorize it correctly.【F:scripts/tasks-session-start.js†L12-L210】
- If you rename the Claude deployment, add the new identifier to that array to avoid skewed budget recommendations.

## 4. Update automation tips when needed
- The same script prints guidance encouraging delegates to lean on Gemini for docs and Claude MCP for implementation while Codex focuses on oversight.【F:scripts/tasks-session-start.js†L120-L210】
- When you introduce new commands or alter the division of labor, adjust these tips so they match the current Codex orchestration strategy.

Following this checklist ensures every slash command grants Codex access to Claude and Gemini MCP, the instructions steer work to the right tool, and the reporting pipeline continues to reinforce the orchestrator-driven workflow.
