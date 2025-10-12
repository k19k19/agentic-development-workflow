---
description: Verify scout results quality (AI-internal command)
argument-hint: [scout-results-path]
allowed-tools: ["Read", "Write", "mcp__gemini-cli__ask-gemini"]
model: o4-mini
---

# Verify Scout (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/scout` completes. Verifies scout results for completeness and quality.

## Variables
SCOUT_RESULTS_PATH: $1

## Instructions
- **You don't run this manually** - Codex runs it automatically after `/scout`.
- Analyze scout results for completeness.
- Calculate confidence score (0-100%).
- Identify unanswered questions.
- If confidence < 70%, trigger targeted re-scout.
- Generate `SCOUTING_VERDICT.md`.

## Workflow
1. Read scout results from `SCOUT_RESULTS_PATH`.
2. Use Gemini MCP to analyze result quality.
3. Calculate confidence score based on:
   - Number of files found
   - Coverage of key areas
   - Unanswered questions
4. If confidence < 70%, identify gaps and re-scout.
5. Generate verification report.

## Report
- Display confidence score percentage.
- Show files found count.
- List unanswered questions (if any).
- Status: PASS (>70%) or RE-SCOUT (<70%).

## Budget
~2K tokens (Gemini MCP)
