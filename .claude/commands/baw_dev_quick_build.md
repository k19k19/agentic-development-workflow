---
description: Direct implementation for small tasks using Codex MCP
argument-hint: [task]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_dev_quick_build

## Purpose
Direct implementation for small, well-understood tasks using Codex MCP. Bypasses discovery/`/baw_dev_plan` phases for maximum speed and minimal token usage (~5K tokens).

## Variables
TASK: $1

## Instructions
- **When to use**: Small projects (<10 files), simple single-file changes, well-understood patterns.
- **When NOT to use**: Complex features, multi-file changes, architectural decisions.
- If `TASK` is missing, stop and ask the user to provide it.
- **Delegate Analysis**: Use Gemini MCP (`mcp__gemini-cli__ask-gemini`) to generate `rg` keywords from the `TASK`.
- **Gather Context**: Use `rg` with the generated keywords to find the most relevant file(s).
- **Delegate Implementation**: Pass the `TASK` and relevant file context to Codex MCP (`mcp__codex__codex`) for implementation.
- Run tests automatically after implementation.
- No approval gates - assume task is straightforward.

## Workflow
1. Validate `TASK` is provided and suitable for quick mode.
2. Use Gemini to generate `rg` keywords, then use `rg` to find the relevant file context.
3. Use `mcp__codex__codex` to implement the `TASK` using the gathered file context.
4. Derive or confirm the feature workspace slug (reuse an existing feature when possible; otherwise slugify the task) and write automation outputs inside `ai-docs/workflow/features/<feature-id>/`.
5. Capture a short session summary in `ai-docs/workflow/features/<feature-id>/sessions/SESSION-[date]-quick.md`.
5. Trigger `npm run baw:session:start` so the ledger reflects the change.
6. Report results with token usage.

## Report
- List files created/modified.
- Show test results.
- Display token usage (~5K target).
- Provide quick validation command (e.g., `curl` for API endpoints).
- Note: Token usage will be automatically captured if using `complete-auto` command.

## Next Steps

**✅ If implementation successful:**
```bash
/baw_dev_deploy_staging
```

**Test first (if critical):**
```bash
/baw_dev_test
# If tests pass → /baw_dev_deploy_staging
```

**If task was too complex for quick mode:**
- Use proper workflow instead:
```bash
/baw_dev_discovery_build "[task]"  # For medium tasks
# or
/baw_dev_full_pipeline "[task]" "" "budget"  # For large tasks
```

## Budget
~5K tokens (Codex MCP)
