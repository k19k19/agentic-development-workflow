# Codex Orchestration Playbook (No-Claude Edition)

Use this runbook when you need Codex to orchestrate **and** implement the workflow without any help from Claude. Follow the steps in order so slash commands, automation, and documentation all steer work through Codex directly while keeping Gemini MCP available for research.

## 1. Update command front matter
- Ensure each implementation command only whitelists Codex-friendly tools. `/quick` is the reference point: `allowed-tools: ["mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Edit", "run_shell_command"]`. Mirror that list (plus `"Bash"` when a shell is required) so Codex can edit files itself.【F:.claude/commands/quick.md†L1-L39】
- Remove any stale references to Claude-specific MCP tools when copying commands between projects.

## 2. Refresh onboarding docs
- Confirm the high-level repo guidance frames Codex as both orchestrator and implementer, with Gemini MCP covering large documentation pulls. `CLAUDE.md` documents this split; revise the sections that talk about delegation whenever responsibilities shift.【F:CLAUDE.md†L1-L210】
- Mirror the same story in `USER-MEMORY-CLAUDE.md` so new contributors inherit the Codex-first expectations.【F:USER-MEMORY-CLAUDE.md†L1-L660】

## 3. Align automation and budget tracking
- Keep the cheap-model pool limited to Gemini (and other low-cost research models) inside `CHEAP_MODELS` so token reports remain accurate.【F:scripts/tasks-session-start.js†L17-L210】
- Review dashboard copy nudging teammates toward “Codex edits, Gemini research” to make sure the automation still matches the workflow.【F:scripts/tasks-session-start.js†L120-L210】

## 4. Close the loop with knowledge artifacts
- After migrating commands, note in session summaries that Codex handled implementation directly so the status index and knowledge ledger capture the change.
- Archive outdated guides that still mention delegating edits to Claude. Replace them with Codex-only instructions like the ones in this playbook.

By walking through these steps you ensure Codex owns implementation end-to-end, contributors know when to reach for Gemini MCP, and the dashboards continue to reinforce the budget-first workflow even while Claude access is paused.
