---
description: Scout and build workflow orchestrated by Codex (skips plan approval)
argument-hint: [task]
allowed-tools: ["mcp__claude__complete", "mcp__gemini-cli-mcp__ask-gemini", "Read", "Write", "Edit", "Glob", "Grep", "run_shell_command"]
model: o4-mini
---

# Scout Build (Budget Shortcut)

## Purpose
Medium-sized workflow that scouts for relevant files, then builds directly without plan approval. Codex orchestrates the flow while Claude MCP executes code changes (~30K tokens).

## Variables
TASK: $1

## Instructions
- **When to use**: Medium projects (10-50 files), known patterns, task well-understood.
- **When NOT to use**: Unfamiliar features, architectural changes, high-risk tasks.
- If `TASK` is missing, stop and ask the user to provide it.
- Execute scout phase using vector search.
- Route research requests through Gemini MCP when large summaries are needed and delegate implementation steps to Claude MCP via `mcp__claude__complete` while Codex focuses on coordination and follow-ups.
- Skip plan approval gate for speed.
- Build using existing patterns found during scout.
- Run tests automatically after build.

## Workflow
1. Validate `TASK` is provided.
2. Run SlashCommand(`/scout "[TASK]"`) -> `relevant_files_collection_path`.
3. Identify existing patterns from scouted files.
4. Build directly using identified patterns (no plan approval) and execute code edits through Claude MCP.
5. Run tests using `npm test` or appropriate test command.
6. Report results with token usage.

## Report
- Show scout results (files found).
- List files created/modified during build.
- Display test results.
- Show token usage (~30K target).
- Note: Approval gate skipped for speed.

## Next Steps

**→ Review and test:**
```bash
git diff --stat  # Review changes
/test            # Run full test suite
```

**If tests pass:**
```bash
/deploy_staging
```

**If tests fail:**
- Fix issues
- Re-run: `/test`

**If build was insufficient:**
- Use full workflow with plan approval:
```bash
/full "[task]" "[docs]" "budget"
```

After wrapping up, refresh the dashboard so the ledger stays in sync:
```bash
npm run tasks:session-start
```

## Budget
~30K tokens (Scout: 5K + Build: 25K)
