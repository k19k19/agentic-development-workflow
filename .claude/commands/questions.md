description: Collect clarifying questions before implementation begins
argument-hint: [user_prompt]
model: claude-sonnet-4-5

# Clarifying Questions

## Purpose
Ensure requirements are unambiguous by identifying gaps, risks, and decisions that need confirmation before work starts.

## Workflow
1. Read the `USER_PROMPT` and supporting specs to understand the request.
2. Identify uncertainties about scope, data, UX, dependencies, or validation.
3. Draft concise, numbered questions grouped by theme.
4. Suggest default assumptions for each question in case immediate answers are unavailable.

## Report
- Present the question list and assumptions for user review.
- Highlight any blockers that should halt implementation until resolved.
