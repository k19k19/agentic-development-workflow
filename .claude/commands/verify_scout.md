---
description: Verify scout results quality (AI-internal command)
argument-hint: [scout-results-path]
allowed-tools: ["Read", "Write", "mcp__gemini-cli__ask-gemini"]
model: claude-sonnet-4-5
---

# /baw:verify_scout

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/baw:scout` completes. Verifies scout results for completeness and quality.

## Variables
SCOUT_RESULTS_PATH: $1
FEATURE_WORKSPACE_ROOT: ai-docs/workflow/features/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically after `/baw:scout`.
- Analyze scout results for completeness.
- Calculate confidence score (0-100%).
- Identify unanswered questions.
- If confidence < 70%, trigger targeted re-scout.
- Generate `SCOUTING_VERDICT.md` inside the same feature workspace (`reports/scout/`).

## Workflow
1. Read scout results from `SCOUT_RESULTS_PATH` and derive the feature workspace slug from its path.
2. Use Gemini MCP to analyze result quality.
3. Calculate confidence score based on:
   - Number of files found
   - Coverage of key areas
   - Unanswered questions
4. If confidence < 70%, identify gaps and re-scout.
5. Generate verification report saved to `ai-docs/workflow/features/<feature-id>/reports/scout/<ISO-timestamp>-verification.md`.
6. Emit `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-verify-scout.json` capturing confidence and recommended next command.

## Report
- Display confidence score percentage.
- Show files found count.
- List unanswered questions (if any).
- Status: PASS (>70%) or RE-SCOUT (<70%).

## Budget
~2K tokens (Gemini MCP)
