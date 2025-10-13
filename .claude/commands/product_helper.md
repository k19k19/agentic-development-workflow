---
description: Run focused research to close product discovery gaps
argument-hint: [topic] [context]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "mcp__gemini-cli__web-search", "Read", "Glob", "Grep", "Bash"]
model: claude-sonnet-4-5
---

# /baw:product_helper

## Purpose
Perform targeted research that unblocks product, feature, or wishlist decisions while capturing references for future work.

## Variables
TOPIC: $1
CONTEXT: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
PRODUCT_RESEARCH_DIRECTORY: <feature-workspace>/intake/product/research/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Derive the feature workspace slug from the context (ask the user if ambiguous) and ensure `PRODUCT_RESEARCH_DIRECTORY` exists.
- Use Gemini MCP web search to collect market insights, benchmarks, or technical references relevant to the topic.
- Summarize findings with citations, highlighting implications for personas and features.
- Save the synthesis to `PRODUCT_RESEARCH_DIRECTORY/<ISO-timestamp>-<topic-slug>.md` with embedded citations.
- Log unanswered questions and follow-ups that should be tracked in documentation or `intake/tasks/`.

## Workflow
1. Review existing product docs to avoid duplicate research.
2. Execute focused research via Gemini and synthesize concise insights.
3. Map findings back to personas, feature priorities, or wishlist triggers.
4. Identify documentation updates or experiments to conduct next.
5. Recommend subsequent slash commands or stakeholder reviews.

## Report
- Provide a summary of key findings, links, and implications.
- Explicitly call out how the research influences product scope or priority.
- Include a backlog of questions that remain open.

## Automation Trace
- Save status JSON with `phase: "product-research"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-product-research.json`.
- Use `status` values `completed`, `needs_docs`, or `blocked` based on research sufficiency.
- Set `nextCommand` to the most relevant follow-up (e.g., `/baw:product_features`, `/baw:dev_dependency_plan`).
- Include research doc paths under `outputPath`/`documentation` and remind the user to run `npm run baw:workflow:sync` once docs are updated.

## Next Steps
- `/baw:product_features "<product-title>"`
- `/baw:dev_dependency_plan "<initiative>" "<context-docs>"`
