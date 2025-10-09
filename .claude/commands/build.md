---
description: Build the codebase based on the plan
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Bash
model: claude-sonnet-4-5
---

# Build

## Purpose
Implement the delivered plan and report the resulting changes.

## Variables
PATH_TO_PLAN: $1

## Workflow
- **Build on Existing Code:** Before writing any new code, check `app-docs/mappings/feature-to-source.md` to see if a similar function or component already exists. If it does, build upon it rather than creating a new one.
- If no `PATH_TO_PLAN` is provided, stop immediately and request it from the user.
- Read the plan at `PATH_TO_PLAN`, reason through the steps, and implement them in the codebase using the delegated tools.

## Report
- Summarize the work you completed in concise bullet points.
- Run `git diff --stat` and include the resulting file and line change summary.
