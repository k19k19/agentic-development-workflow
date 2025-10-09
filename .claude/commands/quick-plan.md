---
description: Generate a lightweight plan when full documentation is unnecessary
argument-hint: [user_prompt] [relevant files]
allowed-tools: Read, Write, Edit
model: claude-sonnet-4-5
---

# Quick Plan

## Purpose
Produce a fast, high-level plan for small tasks while still documenting steps, risks, and validation.

## Workflow
1. Confirm both `USER_PROMPT` and `RELEVANT_FILES_COLLECTION` are provided; request them if not.
2. Skim the referenced files to understand the change surface.
3. Outline 3-5 implementation steps, call out affected files, and note any required tooling.
4. Add a minimal testing checklist and rollback considerations.
5. Save to `specs/quick-plan-<slug>.md`.

## Report
- Provide the plan path and bullet the key steps.
- Mention any assumptions or follow-up work.
