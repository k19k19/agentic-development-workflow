---
description: Create a concise engineering implementation plan based on user requirements and saves it to specs directory
argument-hint: [user_prompt] [documentation_urls] [relevant files]
allowed-tools: Read, Write, Edit, Glob, Grep, MultiEdit
model: claude-sonnet-4-5
---

# /baw_dev_plan

## Purpose
Create a detailed implementation plan with complexity assessment based on user requirements supplied through the `USER_PROMPT`.
Analyze the request, pull in supporting documentation, reason deeply about the approach, and save a comprehensive specification
markdown file into the associated feature workspace under `ai-docs/workflow/features/<feature-id>/plans/`.

## Variables
USER_PROMPT: $1
DOCUMENT_URLS: $2
RELEVANT_FILES_COLLECTION: $3
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
PLAN_OUTPUT_DIRECTORY: <feature-workspace>/plans/
DOCUMENTATION_OUTPUT_DIRECTORY: <feature-workspace>/artifacts/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **Check Knowledge Ledger:** Before planning, review `ai-docs/knowledge-ledger/` for relevant architectural decisions and patterns to reuse.
- **Locate or Derive Feature Workspace:**
  - If `RELEVANT_FILES_COLLECTION` or `DOCUMENT_URLS` references an existing workspace (`ai-docs/workflow/features/<feature-id>/`), reuse that slug.
  - Otherwise, slugify the core feature name from `USER_PROMPT` (trim to the first 6 meaningful words, drop stop words, kebab-case the result) and create the workspace if missing.
  - Ensure the workspace contains `plans/`, `sessions/`, `artifacts/`, and `workflow/` directories. Never write plans to the legacy `ai-docs/plans/` path.
- **Read the Spec:** Pull any seed specification in `app-docs/specs/` or the feature workspace intake files before drafting the plan.
- If any of `USER_PROMPT`, `DOCUMENT_URLS`, or `RELEVANT_FILES_COLLECTION` is missing, stop and ask the user to provide it.
- Read `RELEVANT_FILES_COLLECTION`; it contains a bullet list of `<path> (offset: N, limit: M)` entries from the discovery phase.
- Use the Task tool in parallel to scrape each URL in `DOCUMENT_URLS` with Firecrawl (fallback to Webfetch when Firecrawl is unavailable).
  - Save each document to `DOCUMENTATION_OUTPUT_DIRECTORY/<name-of-document>` and report the saved paths.
- Think deeply about the optimal implementation strategy using the gathered context.
- Read the referenced source files using the provided offsets and limits. Respect token budgets and only pull the necessary ranges.
- **Budget Mode:** If `USER_PROMPT` contains `[BUDGET MODE]`, skip external scraping unless a URL is explicitly provided, cap the written plan at ~350 words, and limit the section list to: Summary, Key Steps (max 4 bullets), Risks, Tests.
- After saving the plan, clearly state the verification pause:
  - Print `🛑 Still inside /baw_dev_plan. Reply 'resume' to hand off to /baw_dev_build or 'stop' to exit.`
  - Summarize what will happen on `resume` (e.g., call `/baw_dev_build_report`).

## Workflow
1. Analyze Requirements - extract the problem statement, constraints, and success criteria from `USER_PROMPT`.
2. Confirm Feature Workspace - reuse or create the workspace as described above and update `feature-manifest.json` if new context changes scope or dependencies.
3. Scrape Documentation - parallelize downloads of `DOCUMENT_URLS` to the documentation directory and log their paths (Budget Mode: only when URLs are present).
4. Design Solution - outline architecture choices, data flow, and tool delegation strategy.
5. Document Plan - draft a markdown plan that includes summary, implementation steps, risks, testing strategy, and next actions (Budget Mode: use the trimmed section set and stay concise).
6. Generate Filename - derive a descriptive kebab-case filename based on the plan's focus area.
7. Create Output Directory - create `PLAN_OUTPUT_DIRECTORY/<timestamp>-<plan-slice>/` and store supporting artifacts in sibling folders when needed.
8. Save & Report - write the plan, update or create `plans/checklist.json` for the slice, and surface the recommended follow-up command.

## Report
- Provide the saved plan path and list any documentation files retrieved.
- Summarize the major implementation phases and testing strategy (Budget Mode: 3 bullets or fewer).
- Update the existing `plans/checklist.json` entry for this slice (or create it if new) so future sessions iterate on the same artifact. If the plan needs more information, note that the next `/baw_dev_discovery` run must enrich this entry rather than spawning a new plan.
- Note: Token usage will be automatically captured if using `complete-auto` command.

## Automation Trace
- Write a workflow status JSON file (see `app-docs/guides/workflow-status-format.md`).
  - Save to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-plan.json`.
  - Use `phase: "plan"` and set `status` to `needs_validation`, `ready_for_build`, or `blocked`.
  - Fill `outputPath` with the generated plan path and list any supporting docs.
  - Set `nextCommand` to the recommended `/baw_dev_build`, `/baw_dev_build_report`, or follow-up `/baw_dev_plan --resume` invocation.
- Remind the user to run `npm run baw:workflow:sync` once the plan is finalized so the dashboard reflects the updated phase.

## Next Steps
After reviewing the plan, proceed with implementation or expand into persona-aligned tracks:

**→ Execute the plan:**
```bash
/baw_dev_build "[path-to-plan]"
```

**→ Execute with detailed reporting:**
```bash
/baw_dev_build_report "[path-to-plan]"
```
**Before building:**
- Review the plan file at the path shown above
- Verify the approach makes sense
- Make manual edits if needed

**Need additional structure?** Kick off `/baw_dev_dependency_plan` for multi-phase roadmaps or `/baw_dev_execution_prep` to collect documentation per breakout.

When the user approves, confirm which build command they want and offer to run it.
