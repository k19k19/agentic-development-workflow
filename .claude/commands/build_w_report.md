---
description: Build the codebase based on the plan and produce a detailed report
argument-hint: [path-to-plan]
allowed-tools: ["mcp__codex__codex", "Read", "Write", "Edit", "run_shell_command", "Bash"]
model: claude-sonnet-4-5
---

# Build with Report

## Purpose
Execute the approved implementation plan and provide a thorough report covering code changes, validation evidence, and follow-up work.

## Variables
PATH_TO_PLAN: $1
BUILD_OUTPUT_DIRECTORY: ai-docs/builds/
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md

## Workflow
1. Ensure `PATH_TO_PLAN` is provided; request it if missing.
2. Read and internalize the plan, noting acceptance criteria and tooling requirements.
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
  - Write to `ai-docs/workflow/<feature-id>/<ISO-timestamp>-build.json`.
  - Use `phase: "build"` and select `status` (`in_progress`, `needs_validation`, `failed`, or `completed`).
  - Reference the generated build report in `outputPath` and list supporting documentation.
  - Set `nextCommand` to the next actionable slash command for the user.
- After writing artifacts, remind the user to run `npm run baw:workflow:sync` so the dashboard reflects the latest state.

## Session Memory
Create or update `ai-docs/sessions/SESSION-[YYYY-MM-DD]-[feature-slug].md` with:
- Task summary (1–2 sentences)
- Files modified (from `git diff --stat`)
- Key decisions and rationale
- Validation highlights
- Follow-up tasks or questions for the next agent

## Next Steps
After completing the build with report:

**→ Run tests:**
```bash
/test
```

**If tests pass →** Deploy to staging:
```bash
/deploy_staging
```

**If tests fail →** Fix issues and re-test:
- Review test output: `ai-docs/builds/[timestamp]/test-output.txt`
- Make necessary fixes
- Run `/test` again

**Review your work:**
```bash
git diff --stat                    # See what changed
cat ai-docs/sessions/SESSION-*.md  # Read detailed session summary
cat app-docs/mappings/feature-to-source.md  # Check updated mappings
```
