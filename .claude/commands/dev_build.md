---
description: Build the codebase based on the plan
argument-hint: [path-to-plan]
allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command", "Bash"]
model: claude-sonnet-4-5
---

# /baw_dev_build

## Purpose
Implement the delivered plan and report the resulting changes.

## Variables
PATH_TO_PLAN: $1

## Workflow
- **Build on Existing Code:** Before writing any new code, check `app-docs/mappings/feature-to-source.md` to see if a similar function or component already exists. If it does, build upon it rather than creating a new one.
- If no `PATH_TO_PLAN` is provided, stop immediately and request it from the user.
- Read the plan at `PATH_TO_PLAN`, reason through the steps, and implement them in the codebase using the delegated tools.
- Derive the feature workspace from the plan path (expect `ai-docs/workflow/features/<feature-id>/plans/...`). Use sibling
  directories for session notes, workflow logs, and artifacts instead of the legacy top-level folders.
- Delegate all code editing to Codex MCP via `mcp__codex__codex`; reserve Claude for orchestration, reviews, and approvals.

## Report
- Summarize the work you completed in concise bullet points.
- Run `git diff --stat` and include the resulting file and line change summary.
- Note: Token usage will be automatically captured if using `complete-auto` command.

## Automation Trace
- Write a workflow status JSON entry (`app-docs/guides/workflow-status-format.md`).
  - Save to `ai-docs/workflow/features/<feature-id>/workflow/<ISO-timestamp>-build.json`.
  - Use `phase: "build"` and set `status` to `in_progress`, `needs_validation`, `failed`, or `completed` based on the outcome.
  - Populate `outputPath` with the build summary/log and list any documentation needing updates.
  - Set `nextCommand` to the recommended follow-up (`/baw_dev_test`, `/baw_report_failure`, `/baw_dev_build --resume`, etc.).

## Session Memory (Auto-generate)
After completing the build, automatically generate a session summary in `ai-docs/workflow/features/<feature-id>/sessions/SESSION-[YYYY-MM-DD]-[feature-slug].md` with:
- Task summary (1-2 sentences)
- Files modified (from git diff --stat)
- Key decisions made
- Token usage estimate
- Follow-up tasks

After writing the session file, remind the user to run:
```bash
npm run baw:workflow:sync
```

This refreshes the dashboard so the new workflow entry appears immediately.

## Next Steps
After completing the build:

**→ Run tests:**
```bash
/baw_dev_test
```

**If tests pass →** Deploy to staging:
```bash
/baw_dev_deploy_staging
```

**If tests fail →** Fix issues and re-test:
- Review test output
- Make necessary fixes
- Run `/baw_dev_test` again

**Check your work:**
```bash
git diff --stat                                            # See what changed
cat ai-docs/workflow/features/<feature-id>/sessions/SESSION-*.md  # Read session summary
```
