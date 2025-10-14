---
description: Generate code critique and wait for approval (AI-internal command)
argument-hint: []
allowed-tools: ["Read", "Write", "Grep", "run_shell_command"]
model: claude-sonnet-4-5
---

# /baw_dev_wait_for_review

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/baw_dev_build` completes. Generates code critique and pauses for human review.

## Instructions
- **You don't run this manually** - Claude runs it automatically after build.
- Derive the feature workspace from the build plan path and store critique artifacts under `ai-docs/workflow/features/<feature-id>/reports/review/`.
- Analyze code for complexity, standards adherence, risks.
- Generate Code Critique Summary (`reports/review/<ISO-timestamp>-critique.md`).
- **PAUSE** and wait for user approval.

## Workflow
1. Read all modified files from latest build.
2. Analyze:
   - Function/file complexity metrics
   - Code standards adherence (linting, formatting)
   - Risk assessment
3. Generate critique summary with recommendations and save it to the feature workspace review directory.
4. **PAUSE** and wait for user response (yes/no/revise).

## Report
- Display complexity analysis (function sizes, cyclomatic complexity).
- Show standards adherence checklist.
- Present risk assessment (Low/Medium/High).
- List recommendations for improvement and reference the saved critique path.
- **WAIT** for user approval before proceeding.

## Budget
~5K tokens (Claude analysis)
