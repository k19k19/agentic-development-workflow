description: Create a concise engineering implementation plan based on user requirements and saves it to specs directory
argument-hint: [user_prompt] [documentation_urls] [relevant files]
allowed-tools: Read, Write, Edit, Glob, Grep, MultiEdit
model: claude-sonnet-4-5

# Plan with Documentation

## Quick Plan
Create a detailed implementation plan based on user requirements supplied through the `USER_PROMPT`. Analyze the request, pull in supporting documentation, reason deeply about the approach, and save a comprehensive specification markdown file to `PLAN_OUTPUT_DIRECTORY/<name-of-plan>.md`.

## Variables
USER_PROMPT: $1
DOCUMENT_URLS: $2
RELEVANT_FILES_COLLECTION: $3
PLAN_OUTPUT_DIRECTORY: specs/
DOCUMENTATION_OUTPUT_DIRECTORY: ai-docs/

## Instructions
- **Read the Spec:** Before planning, read the feature specification from `app-docs/specs/[round-type]-[feature].md`.
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
6. Save & Report - write the plan to `PLAN_OUTPUT_DIRECTORY/<filename>.md` and follow the Report section.

## Report
- Provide the saved plan path and list any documentation files retrieved.
- Summarize the major implementation phases and testing strategy (Budget Mode: 3 bullets or fewer).
