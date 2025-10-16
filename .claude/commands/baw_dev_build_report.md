---
description: Build the codebase based on the plan and produce a detailed report
argument-hint: [path-to-plan]
allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command", "Bash"]
model: claude-sonnet-4-5
---

# /baw_dev_build_report

## Purpose
Execute the approved implementation plan and provide a thorough report covering code changes, validation evidence, and follow-up work.

## Variables
PATH_TO_PLAN: $1
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
BUILD_OUTPUT_DIRECTORY: <feature-workspace>/builds/
REPORT_OUTPUT_DIRECTORY: <feature-workspace>/reports/
SESSION_DIRECTORY: <feature-workspace>/sessions/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md

## Workflow
1. Ensure `PATH_TO_PLAN` is provided; request it if missing.
2. Read and internalize the plan, noting acceptance criteria and tooling requirements. Derive the capability workspace from the
   plan path (expect `ai-docs/capabilities/<capability-id>/plans/...`) and ensure sibling `builds/`, `reports/`, and
   `sessions/` directories exist for new artifacts.
3. Delegate code implementation to Codex MCP using `mcp__codex__codex`; keep Claude focused on orchestration, validation, and reporting.
4. Implement the plan step by step, running lint/tests or other safeguards when needed.
5. Capture validation output (commands, logs, screenshots) for inclusion in the final report.
6. Summarize decisions, risks, and documentation updates so the report is self-contained.

## Report
Organize your final message into:
- **Summary:** High-level overview of what changed.
- **Implementation Details:** Bullet list that maps plan sections to code updates.
- **Validation:** Commands run, their outcomes, and links to logs or artifacts.
- **Follow-ups:** Outstanding tasks, manual QA, or documentation to revisit.
- **Diff Stats:** Include the `git diff --stat` output so reviewers can gauge change size.

## Automation Trace
- Save a workflow status JSON update (`app-docs/guides/workflow-status-format.md`).
  - Write to `ai-docs/capabilities/<capability-id>/workflow/<ISO-timestamp>-build.json`.
  - Use `phase: "build"` and select `status` (`in_progress`, `needs_validation`, `failed`, or `completed`).
  - Reference the generated build report in `outputPath` and list supporting documentation.
  - Set `nextCommand` to the next actionable slash command for the user (e.g., `/baw_dev_test`, `/baw_report_failure`).
- After writing artifacts, remind the user to run `npm run baw:workflow:sync` so the dashboard reflects the latest state.

## Session Memory
Create or update `SESSION_DIRECTORY/SESSION-[YYYY-MM-DD]-[feature-slug].md` with:
- Task summary (1–2 sentences)
- Files modified (from `git diff --stat`)
- Key decisions and rationale
- Validation highlights
- Follow-up tasks or questions for the next agent

## Next Steps
After completing the build with report:

- **→ Run tests:**
```bash
/baw_dev_test
```

**If tests pass →** Deploy to staging:
```bash
/baw_dev_deploy_staging
```

**If tests fail →** Fix issues and re-test:
- Review test output: `BUILD_OUTPUT_DIRECTORY/[timestamp]/test-output.txt`
- Make necessary fixes
- Run `/baw_dev_test` again

**Review your work:**
```bash
git diff --stat                                            # See what changed
cat SESSION_DIRECTORY/SESSION-*.md                         # Read detailed session summary
cat app-docs/mappings/feature-to-source.md  # Check updated mappings
```
