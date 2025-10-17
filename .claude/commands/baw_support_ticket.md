---
description: Analyze support feedback and convert it into actionable follow-ups
argument-hint: [queue_or_issue] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-haiku-4-5
---

# /baw_support_ticket

## Purpose
Transform customer or support feedback into prioritized actions for product, developer, or provider teams.

## Variables
QUEUE_OR_ISSUE: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
SUPPORT_INTAKE_DIRECTORY: <feature-workspace>/intake/support/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review support logs, analytics, and workflow status to understand recurring issues.
- Derive or confirm the affected capability workspace (reuse the feature slug referenced in `CONTEXT_DOCS` or ask the user when ambiguous).
- Ensure `SUPPORT_INTAKE_DIRECTORY` exists and store synthesized ticket analyses there.
- Use Gemini MCP to classify tickets by severity, persona impacted, and root cause.
- Recommend fixes, documentation updates, or new feature requests.
- Suggest how to track outcomes in the workflow dashboard or knowledge ledger.

## Workflow
1. Aggregate ticket context and existing resolutions.
2. Cluster feedback into categories (bug, data fix, enhancement, education).
3. Prioritize actions with owners, due dates, and verification steps.
4. Identify documentation or training updates to prevent recurrence.
5. Recommend follow-up commands (e.g., `/baw_triage_bug`, `/baw_workflow_radar`, `/baw_product_wishlist`).

## Report
- Provide a summarized queue with priority, impact, and recommended owner and save it to `SUPPORT_INTAKE_DIRECTORY/<ISO-timestamp>-support-review.md`.
- Highlight quick wins versus deeper investigations.
- Include documentation or metrics to update.
- Reference the saved workspace path so support teams can revisit it.

## Automation Trace
- Emit status JSON with `phase: "support-feedback"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-support-feedback.json`.
- Use `status` values `needs_docs`, `in_progress`, or `completed`.
- Set `nextCommand` to the best-fit follow-up slash command per highest-priority ticket.
- Include the saved intake summary under `outputPath`/`documentation` and remind the user to run `npm run baw:workflow:sync`.

## Next Steps
- `/baw_triage_bug "<bug-title>"`
- `/baw_workflow_radar "<initiative>"`
- `/baw_product_wishlist "<product>"`
