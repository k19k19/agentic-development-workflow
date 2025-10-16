---
description: Discovery and build workflow for medium tasks (skips plan approval)
argument-hint: [task]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "mcp__codex__codex", "Read", "Write", "Edit", "Glob", "Grep", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_dev_discovery_build

## Purpose
Medium-sized workflow that runs discovery for relevant files, then builds directly without plan approval. Suitable for known patterns and medium-complexity tasks (~30K tokens).

## Variables
TASK: $1

## Instructions
- **When to use**: Medium projects (10-50 files), known patterns, task well-understood.
- **When NOT to use**: Unfamiliar features, architectural changes, high-risk tasks.
- If `TASK` is missing, stop and ask the user to provide it.
- For the discovery phase, delegate to Gemini MCP (`mcp__gemini-cli__ask-gemini`) to analyze the `TASK` and generate optimal `rg` search keywords and file globs.
- For the build phase, delegate all code implementation to Codex MCP (`mcp__codex__codex`). Claude's role is to orchestrate the build based on discovery findings and report the results.
- Derive or confirm the capability workspace slug from the discovery output and ensure all artifacts land in `ai-docs/capabilities/<capability-id>/`.
- Skip plan approval gate for speed.
- Build using existing patterns found during discovery.
- Run tests automatically after build.

## Workflow
1. Validate `TASK` is provided.
2. Run SlashCommand(`/baw_dev_discovery "[TASK]"`) -> `relevant_files_collection_path`.
3. Identify existing patterns from discovery results.
4. Build directly using identified patterns (no plan approval) and execute code edits through Codex MCP.
5. Run tests using `npm test` or appropriate test command.
6. Save a session summary under `ai-docs/capabilities/<capability-id>/sessions/SESSION-[date]-discovery-build.md` and report results with token usage.

## Report
- Show discovery results (files found).
- List files created/modified during build.
- Display test results.
- Show token usage (~30K target).
- Note: Approval gate skipped for speed.

## Next Steps

**→ Review and test:**
```bash
git diff --stat  # Review changes
/baw_dev_test            # Run full test suite
```

**If tests pass:**
```bash
/baw_dev_deploy_staging
```

**If tests fail:**
- Fix issues
- Re-run: `/baw_dev_test`

**If build was insufficient:**
- Use full workflow with plan approval:
```bash
/baw_dev_full_pipeline "[task]" "[docs]" "budget"
```

After wrapping up, refresh the dashboard so the ledger stays in sync:
```bash
npm run baw:workflow:sync
```

## Budget
~30K tokens (Discovery: 5K + Build: 25K)
