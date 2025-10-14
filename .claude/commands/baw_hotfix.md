---
description: Triage and fix production bug
argument-hint: [bug-id]
allowed-tools: ["mcp__codex__codex", "Read", "Write", "Grep", "Glob", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_hotfix

## Purpose
Triage and fix production bugs with focused analysis. Creates bug report and jumps directly to fix with minimal scouting.

## Variables
BUG_ID: $1
BUG_REPORTS_DIRECTORY: app-docs/debugging/
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
SUPPORT_INTAKE_DIRECTORY: <feature-workspace>/intake/support/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- If `BUG_ID` is missing, stop and ask the user to provide it.
- Derive or confirm the feature workspace slug (reuse the affected feature when known; otherwise slugify `BUG_ID`).
- Create internal bug report: `SUPPORT_INTAKE_DIRECTORY/bug-report-[BUG_ID].md` and mirror a copy under
  `BUG_REPORTS_DIRECTORY` if the organization tracks bugs centrally.
- Trigger `/baw_triage_bug` for focused root cause analysis.
- Skip broad scout phase - use targeted search only.
- Jump directly to `/baw_dev_plan` or `/baw_dev_build` based on complexity.
- When it's time to patch code, delegate execution to Codex MCP via `mcp__codex__codex` and keep Claude focused on coordination and reviews.
- Update bug tracking system when complete and capture the status in `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-hotfix.json` with
  `phase: "hotfix"`.

## Workflow
1. Validate `BUG_ID` is provided.
2. Look for external bug report (if integrated with issue tracker).
3. Create internal bug report document.
4. Run SlashCommand(`/baw_triage_bug "[BUG_ID]"`) for analysis.
5. Based on complexity:
   - Simple: Jump to `/baw_dev_build` directly
   - Complex: Run `/baw_dev_plan` first
6. Update bug status when fix is complete.

## Report
- Show bug report summary.
- Display root cause analysis from triage.
- Show proposed fix strategy.
- List files to be modified.
- Provide estimated complexity (Low/Medium/High).

## Budget
~30K tokens (targeted analysis, no broad scout)
