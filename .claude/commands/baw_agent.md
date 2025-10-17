---
description: Route plain-language requests to the correct `/baw_` command
argument-hint: '[--persona product|dev|ops|support] "<request>"'
allowed-tools: ["run_shell_command"]
model: claude-haiku-4-5
---

# /baw_agent

## Purpose
Provide an in-CLI way to map natural language to the appropriate `/baw_` command. Keeps users inside the Claude Code session without dropping to a separate terminal.

## Variables
- PERSONA_FLAG: Optional flag (e.g., `--persona dev`)
- REQUEST: Quoted natural-language description of the task

## Instructions
- Require `REQUEST`. If missing, ask the user to restate their work item and provide usage guidance.
- Build the shell command `node scripts/baw-agent.js` using:
  - Include `PERSONA_FLAG` if the user supplied one (e.g., `--persona dev`).
  - Append the raw `REQUEST` (keep surrounding quotes to preserve spacing).
- Execute the command with `run_shell_command`. Capture stdout.
- Parse the script output. Highlight:
  - Recommended `/baw_` command (bold it in the response).
  - Persona track chosen.
  - Follow-up commands (if present).
- Reply with a short summary and ask the user if they want you to run the recommended `/baw_` command now.
- If the script reports no match, suggest the user clarify scope or pick from common options (`/baw_dev_quick_build`, `/baw_dev_discovery_build`, `/baw_dev_full_pipeline`).

## Output
- Echo the recommended `/baw_` command prominently.
- Include any suggested follow-up commands in a bulleted list.
- End by asking whether you should execute the recommended command.
