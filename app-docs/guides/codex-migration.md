# Codex Orchestration Playbook

Use this runbook when you want Codex to orchestrate the workflow while Claude and Gemini handle Model Context Protocol (MCP) duties. Follow the steps in order so slash commands, automation, and documentation all direct execution through Claude MCP and research through Gemini MCP without breaking existing guardrails.

## 1. Wire Claude & Gemini MCP into every implementation command
- Ensure each implementation command front matter whitelists the Claude MCP tool. `/quick` shows the required entry: `allowed-tools: ["mcp__claude__complete", "mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Edit", "run_shell_command"]`. Mirror that list in other build-style commands before shipping them. 【F:.claude/commands/quick.md†L1-L27】
- Update command bodies to state explicitly that Codex orchestrates while Claude MCP executes edits and Gemini MCP handles large documentation pulls. 【F:.claude/commands/quick.md†L16-L37】

## 2. Reorient onboarding docs toward Codex orchestration
- Confirm that the high-level repo guidance frames Codex as the orchestrator and Claude MCP as the hands-on implementer. `CLAUDE.md` now documents this split; revise those sections whenever tool responsibilities change. 【F:CLAUDE.md†L1-L210】
- When you adjust responsibilities (e.g., handing more research to Gemini MCP), revise summaries in `CLAUDE.md` and `USER-MEMORY-CLAUDE.md` so new contributors inherit the latest expectations. 【F:USER-MEMORY-CLAUDE.md†L1-L660】

## 3. Align automation and budget tracking
- Keep Claude MCP in the cheap-model pool so budget reports stay accurate. Verify `CHEAP_MODELS` in `scripts/tasks-session-start.js` includes `claude-sonnet-4-5` (or your deployment name) after any renames. 【F:scripts/tasks-session-start.js†L1-L210】
- Review dashboard copy nudging delegates toward Gemini for research and Claude for implementation so Codex can stay focused on oversight. 【F:scripts/tasks-session-start.js†L120-L210】
- When thresholds change, adjust automation tips so the dashboard keeps reinforcing the Codex-orchestrated, MCP-driven workflow. 【F:scripts/tasks-session-start.js†L190-L210】

## 4. Close the loop with knowledge artifacts
- After migrating commands, note in session summaries that Codex orchestrates while Claude/Gemini operate as MCP tools so downstream automation (status index, knowledge ledger) captures the change. 【F:CLAUDE.md†L24-L210】
- Archive any outdated guides that still claim Codex performs edits directly; replace them with references to Claude MCP execution.

By walking through these steps, you ensure Codex keeps orchestration responsibilities, contributors know when to lean on Claude or Gemini MCP, and your dashboards continue to reinforce the Codex-first workflow.
