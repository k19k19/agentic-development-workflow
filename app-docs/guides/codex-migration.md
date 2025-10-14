# Codex Migration Playbook

Use this runbook when you want to make Codex the default implementation agent across the workflow. Follow the steps in order so slash commands, automation, and documentation all point at Codex without breaking existing guardrails.

## 1. Wire Codex into every implementation command
- Ensure each command front matter whitelists the Codex MCP tool. `/baw_dev_quick_build` shows the required entry: `allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command"]`. Mirror that list in other implementation commands before shipping them. 【F:.claude/commands/baw_dev_quick_build.md†L1-L27】
- Keep the instructions explicit that Codex should execute the task. Reuse the `/baw_dev_quick_build` phrasing "Use Codex MCP directly to implement the task" so the orchestrator consistently delegates hands-on work to Codex. 【F:.claude/commands/baw_dev_quick_build.md†L16-L33】

## 2. Reorient onboarding docs toward Codex
- Confirm that the high-level repo guidance frames Codex as the default implementer. `CLAUDE.md` already positions `/baw_dev_quick_build` as “Direct implementation via Codex MCP,” calls out the Codex delegation strategy, and lists common Codex-friendly scenarios. Update those sections if your Codex deployment name or responsibilities change. 【F:CLAUDE.md†L9-L198】
- When you adjust responsibilities (e.g., giving Codex more complex scopes), revise the command summaries and tooling notes in `CLAUDE.md` so new contributors see the latest expectations. 【F:CLAUDE.md†L9-L198】

## 3. Align automation and budget tracking
- Keep Codex inside the cheap-model pool so budget reports stay accurate. Verify `CHEAP_MODELS` in `scripts/tasks-session-start.js` still includes `codex` after any renames or environment changes. 【F:scripts/tasks-session-start.js†L1-L200】
- Review the dashboard copy that nudges delegates toward Codex (`Use Gemini MCP for research/doc reviews and Codex MCP for implementation…`). Update those strings if your division of labor or model names evolve. 【F:scripts/tasks-session-start.js†L120-L200】
- When cheap-model thresholds change, adjust the automation tips that mention Codex usage so the dashboard keeps reflecting the desired mix. 【F:scripts/tasks-session-start.js†L194-L200】

## 4. Close the loop with knowledge artifacts
- After migrating commands, add a short note to your feature/session summaries about Codex becoming the default implementer so downstream automation (status index, knowledge ledger) captures the change. The session workflow already prompts you to run `/baw_dev_quick_build` or follow-up commands through Codex; documenting the migration keeps future agents aligned. 【F:CLAUDE.md†L24-L199】
- Archive any outdated guides that still reference Claude or Gemini as the primary implementation agents to prevent regressions.

By walking through these steps, you ensure Codex has the right permissions, contributors know when to use it, and your dashboards continue to reinforce the Codex-first workflow.
