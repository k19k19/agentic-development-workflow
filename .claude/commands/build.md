---
description: Build the codebase based on the plan
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Bash
model: claude-sonnet-4-5
---

# Build

## Purpose
Implement the delivered plan and report the resulting changes.

## Variables
PATH_TO_PLAN: $1

## Workflow
- **Build on Existing Code:** Before writing any new code, check `app-docs/mappings/feature-to-source.md` to see if a similar function or component already exists. If it does, build upon it rather than creating a new one.
- If no `PATH_TO_PLAN` is provided, stop immediately and request it from the user.
- **Track plan status:** Extract plan ID from `PATH_TO_PLAN` (e.g., `ai-docs/plans/20251011-token-accounting/plan.md` → `20251011-token-accounting`), then mark as in-progress:
  ```bash
  npm run plans:update <plan-id> in_progress "Build started"
  ```
- Read the plan at `PATH_TO_PLAN`, reason through the steps, and implement them in the codebase using the delegated tools.

## Report
- Summarize the work you completed in concise bullet points.
- Run `git diff --stat` and include the resulting file and line change summary.
- Note: Token usage will be automatically captured if using `complete-auto` command.

## Session Memory (Auto-generate)
After completing the build, automatically generate a session summary in `ai-docs/sessions/SESSION-[YYYY-MM-DD]-[feature-slug].md` with:
- Task summary (1-2 sentences)
- Files modified (from git diff --stat)
- Key decisions made
- Token usage estimate
- Follow-up tasks

After writing the session file, automatically run:
```bash
npm run vectorize
```

This makes the session searchable for future AI sessions via vector search.

## Token Budget Tracking
After completing the build, mark the plan as completed and show updated budget:
```bash
npm run plans:complete <plan-id>
npm run tasks:session-start
```

This displays:
- Updated token budget with usage percentage
- Remaining daily tokens
- Warnings if approaching limits (75%/90%)
- Recommendations for next tasks that fit budget

## Next Steps
After completing the build:

**→ Run tests:**
```bash
/test
```

**If tests pass →** Deploy to staging:
```bash
/deploy_staging
```

**If tests fail →** Fix issues and re-test:
- Review test output
- Make necessary fixes
- Run `/test` again

**Check your work:**
```bash
git diff --stat                    # See what changed
cat ai-docs/sessions/SESSION-*.md  # Read session summary
```

📖 **Need help?** See: `TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md`
