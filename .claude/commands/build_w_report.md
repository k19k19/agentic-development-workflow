---
description: Build the codebase based on the plan and produce a detailed report
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Bash
model: claude-sonnet-4-5
---

# Build with Report

## Purpose
Execute the implementation plan and compile a structured report covering changes, validation, and follow-ups.

## Variables
PATH_TO_PLAN: $1
BUILD_OUTPUT_DIRECTORY: ai-docs/builds/
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md

## Workflow
1. Ensure `PATH_TO_PLAN` is provided; request it if missing.
2. Read and internalize the plan, noting tasks, acceptance criteria, and assigned tools.
3. Implement the plan step by step, checking in with lint, tests, and other project safeguards as required.
4. Capture validation output (command snippets, screenshots, or logs) for inclusion in the final report.

## Report
- **Update Knowledge Base:** After the build is complete, update the structured knowledge base:
  - Update `app-docs/mappings/feature-to-source.md` with the new file paths and features implemented.
  - If the implementation introduced a new, reusable utility or pattern, add a brief entry to `app-docs/guides/common-patterns.md`.
- Provide a bullet list of completed work items tied to plan sections.
- Include validation evidence (command names and outcomes).
- Append `git diff --stat` to summarize the change surface.
- Note any follow-up tasks or open questions for the next agent.

## Session Memory (Auto-generate)
After completing the build, automatically generate a detailed session summary in `ai-docs/sessions/SESSION-[YYYY-MM-DD]-[feature-slug].md` using this template:

```markdown
# Session: [Feature Name]

**Date**: [YYYY-MM-DD]
**Workflow**: [/scout → /plan → /build_w_report OR other commands used]
**Status**: ✅ Complete | ⏸️ In Progress | ❌ Blocked

---

## Task Summary
[1-2 sentences describing what was built]

## Workflow Execution
- **Scout**: [findings summary or N/A]
- **Plan**: [approach summary or N/A]
- **Build**: [implementation summary]

## Files Modified
[git diff --stat output]

## Key Decisions
1. **[Decision]**: [Why and what alternatives were considered]
2. **[Decision]**: [Why and what alternatives were considered]

## Issues & Resolutions
- **Issue**: [Problem description]
  - **Resolution**: [How it was solved]

## Token Metrics
- Scout: ~XK tokens (or N/A)
- Plan: ~XK tokens (or N/A)
- Build: ~XK tokens
- Total: ~XK tokens
- Efficiency: X%

## Follow-up Tasks
- [ ] [Task 1]
- [ ] [Task 2]

---

**Next Session Notes**: [Any context needed for next session]
```

After writing the session file, automatically run:
```bash
npm run vectorize
```

This makes the session searchable for future AI sessions via vector search.

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

📖 **Need help?** See: `app-docs/guides/WORKFLOW-DECISION-TREE.md`
