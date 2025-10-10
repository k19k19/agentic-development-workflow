---
description: Scout and build workflow for medium tasks (skips plan approval)
argument-hint: [task]
model: claude-sonnet-4-5
---

# Scout Build (Budget Shortcut)

## Purpose
Medium-sized workflow that scouts for relevant files, then builds directly without plan approval. Suitable for known patterns and medium-complexity tasks (~30K tokens).

## Variables
TASK: $1

## Instructions
- **When to use**: Medium projects (10-50 files), known patterns, task well-understood.
- **When NOT to use**: Unfamiliar features, architectural changes, high-risk tasks.
- If `TASK` is missing, stop and ask the user to provide it.
- Execute scout phase using vector search.
- Skip plan approval gate for speed.
- Build using existing patterns found during scout.
- Run tests automatically after build.

## Workflow
1. Validate `TASK` is provided.
2. Run SlashCommand(`/scout "[TASK]"`) -> `relevant_files_collection_path`.
3. Identify existing patterns from scouted files.
4. Build directly using identified patterns (no plan approval).
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

📖 **Need help?** See: `TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md`

## Budget
~30K tokens (Scout: 5K + Build: 25K)
