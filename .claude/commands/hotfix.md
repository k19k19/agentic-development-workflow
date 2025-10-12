---
description: Triage and fix production bug
argument-hint: [bug-id]
allowed-tools: ["mcp__claude__complete", "mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Grep", "Glob", "run_shell_command"]
model: o4-mini
---

# Hotfix (Production Bug)

## Purpose
Triage and fix production bugs with focused analysis. Creates bug report and jumps directly to fix with minimal scouting.

## Variables
BUG_ID: $1
BUG_REPORTS_DIRECTORY: app-docs/debugging/

## Instructions
- If `BUG_ID` is missing, stop and ask the user to provide it.
- Create internal bug report: `BUG_REPORTS_DIRECTORY/BUG_REPORT_[BUG_ID].md`.
- Trigger `/triage_bug` for focused root cause analysis.
- Skip broad scout phase - use targeted search only.
- Jump directly to `/plan` or `/build` based on complexity.
- When it's time to patch code, delegate execution to Claude MCP via `mcp__claude__complete`, let Codex orchestrate communication, and call Gemini MCP for any doc lookups needed to validate the fix.
- Update bug tracking system when complete.

## Workflow
1. Validate `BUG_ID` is provided.
2. Look for external bug report (if integrated with issue tracker).
3. Create internal bug report document.
4. Run SlashCommand(`/triage_bug "[BUG_ID]"`) for analysis.
5. Based on complexity:
   - Simple: Jump to `/build` directly
   - Complex: Run `/plan` first
6. Update bug status when fix is complete.

## Report
- Show bug report summary.
- Display root cause analysis from triage.
- Show proposed fix strategy.
- List files to be modified.
- Provide estimated complexity (Low/Medium/High).

## Budget
~30K tokens (targeted analysis, no broad scout)
