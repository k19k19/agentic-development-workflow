# Making Slash Commands Codex-Orchestrator Compatible

The slash-command workflow lives in `.claude/commands/*.md`. Each command now runs entirely under Codex: the orchestrator decides the flow **and** performs the actual edits using the built-in Write/Edit tools. Gemini MCP remains available for research-heavy steps, but Claude is no longer part of the loop. Follow this checklist whenever you add or modify a command so Codex can execute it end-to-end without manual intervention.

## 1. Allow the right tools
- In the command front matter, make sure the `allowed-tools` array includes `"mcp__gemini-cli-mcp__ask-gemini"` for documentation lookups plus the standard filesystem tools (`Read`, `Write`, `Edit`, `run_shell_command`, `Bash` when needed).
- Example (`/quick` already ships this setup):
  ```yaml
  allowed-tools: ["mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Edit", "run_shell_command"]
  ```
  This keeps Codex empowered to edit files directly while still letting it escalate research to Gemini when required.

## 2. Point instructions at Codex-led implementation
- Spell out in the command body that Codex performs the code changes itself with Write/Edit tools. `/quick` shows the pattern with explicit guidance to let Codex do the edits and only lean on Gemini for large references.【F:.claude/commands/quick.md†L16-L39】
- Mirror that wording across other commands so the orchestrator consistently assumes it owns the implementation work.

## 3. Keep budgets focused on Codex + Gemini
- The session kickoff dashboard tracks inexpensive usage under the Gemini tier. Verify that `CHEAP_MODELS` in `scripts/tasks-session-start.js` only lists Gemini deployments (plus lightweight OpenAI models) so token reports categorize them correctly.【F:scripts/tasks-session-start.js†L17-L210】
- If you add another research-focused model, include it in that array so the budget assistant keeps steering expensive edits toward Codex only when necessary.

## 4. Update automation tips when responsibilities change
- The same dashboard script prints guidance reminding contributors to route research to Gemini and let Codex execute the edits.【F:scripts/tasks-session-start.js†L120-L210】
- When you tweak command responsibilities, adjust those tips so they stay aligned with the Codex-only implementation strategy.

Following this checklist ensures every slash command gives Codex the permissions and guidance it needs to implement tasks directly while still drawing on Gemini MCP for documentation support. That keeps the workflow consistent with the "Codex only" implementation window the team is operating under this week.
