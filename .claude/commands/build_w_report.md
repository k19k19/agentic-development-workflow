---
description: Build the codebase based on the plan and produce a detailed report
argument-hint: [path-to-plan]
allowed-tools: Read, Write, Bash
model: claude-sonnet-4-5
---

# Build with Report

## Purpose
Execute the implementation plan and compile a structured report covering changes, validation, and follow-ups.

## Variables
PATH_TO_PLAN: $1
BUILD_OUTPUT_DIRECTORY: ai-docs/builds/
MAPPINGS_FILE: app-docs/mappings/feature-to-source.md

## Workflow
1. Ensure `PATH_TO_PLAN` is provided; request it if missing.
2. Read and internalize the plan, noting tasks, acceptance criteria, and assigned tools.
3. Implement the plan step by step, checking in with lint, tests, and other project safeguards as required.
4. Capture validation output (command snippets, screenshots, or logs) for inclusion in the final report.

## Report
- **Update Knowledge Base:** After the build is complete, update the structured knowledge base:
  - Update `app-docs/mappings/feature-to-source.md` with the new file paths and features implemented.
  - If the implementation introduced a new, reusable utility or pattern, add a brief entry to `app-docs/guides/common-patterns.md`.
- Provide a bullet list of completed work items tied to plan sections.
- Include validation evidence (command names and outcomes).
- Append `git diff --stat` to summarize the change surface.
- Note any follow-up tasks or open questions for the next agent.
