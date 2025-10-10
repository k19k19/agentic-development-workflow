---
description: Create a concise engineering implementation plan based on user requirements and saves it to specs directory
argument-hint: [user_prompt] [documentation_urls] [relevant files]
allowed-tools: Read, Write, Edit, Glob, Grep, MultiEdit
model: claude-sonnet-4-5
---

# Plan

## Purpose
Create a detailed implementation plan with complexity assessment based on user requirements supplied through the `USER_PROMPT`. Analyze the request, pull in supporting documentation, reason deeply about the approach, and save a comprehensive specification markdown file to `PLAN_OUTPUT_DIRECTORY/<name-of-plan>.md`.

## Variables
USER_PROMPT: $1
DOCUMENT_URLS: $2
RELEVANT_FILES_COLLECTION: $3
SPECS_INPUT_DIRECTORY: app-docs/specs/
PLAN_OUTPUT_DIRECTORY: ai-docs/plans/
DOCUMENTATION_OUTPUT_DIRECTORY: ai-docs/plans/

## Instructions
- **Read the Spec:** Before planning, read the feature specification from `SPECS_INPUT_DIRECTORY/[round-type]-[feature].md`.
- If any of `USER_PROMPT`, `DOCUMENT_URLS`, or `RELEVANT_FILES_COLLECTION` is missing, stop and ask the user to provide it.
- Read `RELEVANT_FILES_COLLECTION`; it contains a bullet list of `<path> (offset: N, limit: M)` entries from the scout phase.
- Use the Task tool in parallel to scrape each URL in `DOCUMENT_URLS` with Firecrawl (fallback to Webfetch when Firecrawl is unavailable).
  - Instruct subagents to save each document to `DOCUMENTATION_OUTPUT_DIRECTORY/<name-of-document>`.
  - Require each subagent to return the saved path for future reference.
- Think deeply about the optimal implementation strategy using the gathered context.
- Read the referenced source files using the provided offsets and limits. Respect token budgets and only pull the necessary ranges.
- **Budget Mode:** If `USER_PROMPT` contains `[BUDGET MODE]`, skip external scraping unless a URL is explicitly provided, cap the written plan at ~350 words, and limit the section list to: Summary, Key Steps (max 4 bullets), Risks, Tests.

## Workflow
1. Analyze Requirements - extract the problem statement, constraints, and success criteria from `USER_PROMPT`.
2. Scrape Documentation - parallelize downloads of `DOCUMENT_URLS` to the documentation directory and log their paths (Budget Mode: only when URLs are present).
3. Design Solution - outline architecture choices, data flow, and tool delegation strategy.
4. Document Plan - draft a markdown plan that includes summary, implementation steps, risks, testing strategy, and next actions (Budget Mode: use the trimmed section set and stay concise).
5. Generate Filename - derive a descriptive kebab-case filename based on the plan's focus area.
6. Create Output Directory - create `PLAN_OUTPUT_DIRECTORY/[timestamp]-[feature]/` directory structure.
7. Save & Report - write the plan to `PLAN_OUTPUT_DIRECTORY/[timestamp]-[feature]/plan.md` and external docs to subdirectory. Follow the Report section.

## Report
- Provide the saved plan path and list any documentation files retrieved.
- Summarize the major implementation phases and testing strategy (Budget Mode: 3 bullets or fewer).

## Next Steps
After reviewing the plan, proceed with implementation:

**→ Execute the plan:**
```bash
/build "[path-to-plan]"
```

**→ Execute with detailed reporting:**
```bash
/build_w_report "[path-to-plan]"
```
*(Recommended: generates session summary + updates knowledge base)*

**Before building:**
- Review the plan file at the path shown above
- Verify the approach makes sense
- Make manual edits if needed

📖 **Need help?** See: `TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md`
