---
description: Generate code critique and wait for approval (AI-internal command)
argument-hint: []
allowed-tools: ["Read", "Write", "Grep", "run_shell_command"]
model: o4-mini
---

# Wait For Review (AI-Internal)

## Purpose
**AI-INTERNAL COMMAND** - Automatically triggered after `/build` completes. Generates code critique and pauses for human review.

## Instructions
- **You don't run this manually** - Codex runs it automatically after build.
- Analyze code for complexity, standards adherence, risks.
- Generate Code Critique Summary.
- **PAUSE** and wait for user approval.

## Workflow
1. Read all modified files from latest build.
2. Analyze:
   - Function/file complexity metrics
   - Code standards adherence (linting, formatting)
   - Risk assessment
3. Generate critique summary with recommendations.
4. **PAUSE** and wait for user response (yes/no/revise).

## Report
- Display complexity analysis (function sizes, cyclomatic complexity).
- Show standards adherence checklist.
- Present risk assessment (Low/Medium/High).
- List recommendations for improvement.
- **WAIT** for user approval before proceeding.

## Budget
~5K tokens (Codex orchestration + Claude MCP analysis)
