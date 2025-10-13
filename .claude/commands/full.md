---
description: Run a three step engineering workflow to deliver on the user_prompt
argument-hint: [user_prompt] [document-urls] [mode]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "mcp__codex__codex", "Read", "Write", "Edit", "Glob", "Grep", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw:full

## Purpose
Execute the complete engineering workflow with approval gates for large, complex features.
First scout the codebase for files needed to complete the task.
Then plan the task based on the files found.
Then build the task based on the plan with human approval before implementation.

## Variables
USER_PROMPT: $1
DOCUMENTATION_URLS: $2
MODE: $3 (default: standard)

## Instructions
- Execute each workflow step in order, pausing only for explicit approval gates as defined in the `Workflow` section.
- Accepted MODE values:
  - `standard` (default) — run the full workflow with `rg` (ripgrep) search scout and detailed plan.
  - `budget` — minimize paid model usage (concise ~350-word plan).
- If an unexpected result is returned, stop immediately and notify the user.
- Place every SlashCommand argument in double quotes and convert nested double quotes to single quotes.
- Only modify the `USER_PROMPT` when MODE is `budget` (append ` [BUDGET MODE]` before passing it downstream).
- **Tool Delegation Strategy**:
  - **Scout Phase**: Delegate to Gemini MCP (`mcp__gemini-cli__ask-gemini`) to analyze the `USER_PROMPT` and generate optimal `rg` search keywords and file globs.
 - **Build Phase**: Delegate all code implementation to Codex MCP (`mcp__codex__codex`). Claude's role is to orchestrate, review, and manage approvals.
- Track the feature workspace slug throughout the run so each downstream command writes to the same
  `ai-docs/workflow/features/<feature-id>/` directory.

## Workflow
1. Run SlashCommand(`/baw:scout "[USER_PROMPT]"`) -> `relevant_files_collection_path`.
2. If MODE is `budget`, run SlashCommand(`/baw:plan "[USER_PROMPT] [BUDGET MODE]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"`); otherwise run `/baw:plan "[USER_PROMPT]" "[DOCUMENTATION_URLS]" "[relevant_files_collection_path]"` to obtain `path_to_plan`.
3. When the plan is ready, announce the pause clearly: `🛑 Still inside /baw:full (plan ready). Reply 'resume' to run /baw:build_w_report or 'stop' to exit.` Then wait for user approval.
4. Run SlashCommand(`/baw:build_w_report "[path_to_plan]"`) -> `build_report` and ensure that command delegates its code changes to Codex MCP.
5. Report your work based on the `Report` section defined in the downstream commands.

## Next Steps
After the full workflow completes:

**→ Review the session summary:**
```bash
cat ai-docs/workflow/features/<feature-id>/sessions/SESSION-*.md  # Latest session
git diff --stat                                                      # See all changes
```

**→ Run tests:**
```bash
/baw:test
```

**If tests pass → Deploy:**
```bash
/baw:deploy_staging
```

**Then validate:**
```bash
/baw:uat
```

**If all good → Finalize:**
```bash
/baw:finalize "[feature-id]"
/baw:release  # Deploy to production
```

**Check token budget:**
```bash
npm run baw:session:start  # See remaining budget and next recommendations
```
