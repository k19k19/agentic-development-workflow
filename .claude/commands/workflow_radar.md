---
description: Visualize workflow health, blockers, and outstanding specs across personas
argument-hint: [initiative_title] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw:workflow_radar

## Purpose
Provide a management-grade view of open tasks, missing documentation, data fixes, and bug queues across the entire initiative.

## Variables
INITIATIVE_TITLE: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
RADAR_REPORT_DIRECTORY: <feature-workspace>/reports/ops/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Aggregate workflow status JSON, feature manifests, and knowledge ledger decisions.
- Derive the initiative's feature workspace (use the slug referenced in `CONTEXT_DOCS` or ask the user) and create `RADAR_REPORT_DIRECTORY` if missing.
- Use Gemini MCP to classify outstanding work into categories: missing specs, in-flight builds, testing gaps, data fixes, bugs, support follow-ups.
- Highlight owner assignments, due dates, and dependencies that affect downstream phases.
- Recommend automation or dashboard updates (`npm run baw:work`) to keep stakeholders aligned.

## Workflow
1. Sync workflow status (`npm run baw:workflow:sync`) if needed and review aggregated index.
2. Map outstanding actions by persona (product, developer, provider, support).
3. Identify bottlenecks and propose mitigation steps.
4. Surface documentation that must be updated or created and log them in `RADAR_REPORT_DIRECTORY/<ISO-timestamp>-radar.md`.
5. Recommend targeted slash commands for each blocker category.

## Report
- Present a radar-style summary or table covering backlog categories, owners, next steps, and due dates and save it to the radar report directory.
- Include KPIs such as number of features per phase and high-risk gaps.
- Provide a follow-up checklist to regain momentum.
- Reference the saved report path and any supporting attachments.

## Automation Trace
- Emit status JSON with `phase: "ops-coordination"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-workflow-radar.json`.
- Use `status` values `needs_docs`, `in_progress`, or `completed` depending on clarity.
- Set `nextCommand` for each persona (e.g., `/baw:dev_execution_prep`, `/baw:product_helper`, `/baw:support_ticket`).
- Attach the radar report path and remind the user to rerun `npm run baw:workflow:sync` and `npm run baw:work` after updates.

## Next Steps
- `/baw:dev_execution_prep "<task>"`
- `/baw:support_ticket "<queue>"`
- `/baw:product_helper "<topic>"`
