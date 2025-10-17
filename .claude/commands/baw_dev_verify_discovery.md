---
description: Verify discovery results quality (AI-internal command)
argument-hint: [discovery-results-path]
allowed-tools: ["Read", "Write", "mcp__gemini-cli__ask-gemini"]
model: claude-haiku-4-5
---

# /baw_dev_verify_discovery

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/baw_dev_discovery` completes. Verifies discovery results for completeness and quality.

## Variables
DISCOVERY_RESULTS_PATH: $1
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- **You don't run this manually** - Claude runs it automatically after `/baw_dev_discovery`.
- Analyze discovery results for completeness.
- Calculate confidence score (0-100%).
- Identify unanswered questions.
- If confidence < 70%, trigger targeted re-discovery.
- Generate `DISCOVERY_VERDICT.md` inside the same capability workspace (`reports/discovery/`).

## Workflow
1. Read discovery results from `DISCOVERY_RESULTS_PATH` and derive the capability workspace slug from its path.
2. Use Gemini MCP to analyze result quality.
3. Calculate confidence score based on:
   - Number of files found
   - Coverage of key areas
   - Unanswered questions
4. If confidence < 70%, identify gaps and re-run discovery.
5. Generate verification report saved to `ai-docs/capabilities/<capability-id>/reports/discovery/<ISO-timestamp>-verification.md`.
6. Emit `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-verify-discovery.json` capturing confidence and recommended next command.

## Report
- Display confidence score percentage.
- Show files found count.
- List unanswered questions (if any).
- Status: PASS (>70%) or RE-DISCOVER (<70%).

## Budget
~2K tokens (Gemini MCP)
