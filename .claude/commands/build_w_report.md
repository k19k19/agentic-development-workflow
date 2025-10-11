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

### 1. Update Knowledge Base (Automated)

Run these automation scripts to update documentation:

```bash
# Update feature-to-source mapping
node scripts/update-mappings.js update "[feature-name]" [modified-files]

# Example:
# node scripts/update-mappings.js update "Authentication" src/auth/login.js src/auth/middleware.js

# Generate session summary
node scripts/generate-session-summary.js generate "[PATH_TO_PLAN]" "[feature-name]" "[workflow]" "[token-usage]"

# Example:
# node scripts/generate-session-summary.js generate "ai-docs/plans/plan.md" "Authentication" "/full" "85K"

# Re-vectorize documentation for future searches
npm run vectorize
```

**Manual additions** (if needed):
- If the implementation introduced a new, reusable utility or pattern, add a brief entry to `app-docs/guides/common-patterns.md`.

### 2. Report Deliverables

Provide the following in your report:
- Bullet list of completed work items tied to plan sections
- Validation evidence (command names and outcomes)
- `git diff --stat` output to summarize change surface
- Any follow-up tasks or open questions for the next agent

## Session Memory (Auto-generated)

The `generate-session-summary.js` script automatically creates a detailed session summary at `ai-docs/sessions/SESSION-[YYYY-MM-DD]-[feature-slug].md` with this structure:

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
