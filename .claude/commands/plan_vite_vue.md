---
description: Produce an implementation plan tailored to Vite + Vue projects
argument-hint: [user_prompt] [relevant files]
allowed-tools: Read, Write, Edit, Glob, Grep
model: claude-sonnet-4-5
---

# Plan for Vite + Vue

## Purpose
Generate a development plan focused on Vite-powered Vue applications, covering component structure, routing, state, and build steps.

## Workflow
1. Parse the `USER_PROMPT` and identify the affected areas (components, composables, routes, store, tests).
2. Read the supplied relevant files list and inspect critical paths (e.g., `app/src`, `app/src/router`, `app/src/components`, `app/tests`).
3. Outline updates required to maintain Vite configuration, TypeScript support, and hot-module reload safety.
4. Address UI/UX implications (component layout, props, emit contracts) and testing approach (Vitest / Chrome DevTools).
5. Save the plan as `specs/vite-vue-<slug>.md`, including migration steps, acceptance criteria, and validation commands.

## Report
- Provide the plan path and highlight key architectural decisions.
- List any follow-up tasks or open questions.
