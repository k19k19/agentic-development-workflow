---
description: Direct implementation for small tasks using Codex MCP
argument-hint: [task]
allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command"]
model: claude-sonnet-4-5
---

# Quick (Budget Shortcut)

## Purpose
Direct implementation for small, well-understood tasks using Codex MCP. Bypasses scout/plan phases for maximum speed and minimal token usage (~5K tokens).

## Variables
TASK: $1

## Instructions
- **When to use**: Small projects (<10 files), simple single-file changes, well-understood patterns.
- **When NOT to use**: Complex features, multi-file changes, architectural decisions.
- If `TASK` is missing, stop and ask the user to provide it.
- Use Codex MCP directly to implement the task.
- Run tests automatically after implementation.
- No approval gates - assume task is straightforward.

## Workflow
1. Validate `TASK` is provided and suitable for quick mode.
2. Use `mcp__codex__codex` tool to implement the task directly.
3. Run tests using `npm test` or appropriate test command.
4. Report results with token usage.

## Report
- List files created/modified.
- Show test results.
- Display token usage (~5K target).
- Provide quick validation command (e.g., `curl` for API endpoints).

## Next Steps

**✅ If implementation successful:**
```bash
/deploy_staging
```

**Test first (if critical):**
```bash
/test
# If tests pass → /deploy_staging
```

**If task was too complex for quick mode:**
- Use proper workflow instead:
```bash
/scout_build "[task]"  # For medium tasks
# or
/full "[task]" "" "budget"  # For large tasks
```

📖 **Need help?** See: `TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md`

## Budget
~5K tokens (Codex MCP)
