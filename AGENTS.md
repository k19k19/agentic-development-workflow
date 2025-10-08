# Repository Guidelines

## Project Structure & Module Organization
This repo is a starter template: keep coordination docs (e.g., `CLAUDE.md`, orchestrator prompts, memory guides) at the root. Runtime sources belong in `app/` when you add them, automation scripts in `scripts/` (see `scripts/detect-project-scale.js`), and shared docs in `app-docs/` (guides, specs, mappings, architecture, debugging). Store generated reports or run artifacts in `ai-docs/`. Add tests beside their targets (`tests/` or `app/<feature>/__tests__/`).

## Command Orchestration
Use `/scout_plan_build "<prompt>" "<doc urls>"` as the entry point; it chains `/scout`, `/plan_w_docs`, and `/build_w_report` for full Reduce & Delegate execution. Standalone helpers like `/quick-plan`, `/build`, or `/parallel_subagents` remain available but are not part of the primary loop—call them explicitly only when you need a lightweight pass or targeted follow-up. Reference `.claude/commands/` for the latest prompt wiring before extending workflows.

## Build, Test, and Development Commands
- `node scripts/detect-project-scale.js` — size the project to decide when the full pipeline is warranted.
- *(Add project-specific build/test runners when code appears; document the exact command here once you introduce them.)*
- `/scout_plan_build "<prompt>" "<doc urls>"` — launch the standard Scout→Plan→Build run, producing a report in `ai-docs/reports/`.

## Coding Style & Naming Conventions
Default to modern JavaScript/TypeScript with 2-space indentation, single quotes, and async/await. Use kebab-case for utility files, PascalCase for components or classes, and mirror spec names (e.g., `app-docs/specs/1st-backend-user-auth.md`). Keep Markdown headings in Title Case and follow the provided templates when adding docs.

## Testing Guidelines
Bootstrap Jest (or the framework specified in the feature spec) when you add executable code. Name suites `feature-name.test.ts` and colocate them under `tests/` or the feature’s directory. Record scenarios and edge cases in the spec’s Testing section, then append the new suite paths to `app-docs/mappings/feature-to-source.md`.

## Commit & Pull Request Guidelines
Write concise, active-voice commits such as `Implement scout plan workflow`, referencing the supporting spec or doc updates. Pull requests should cite the triggering prompt, include validation evidence (logs, screenshots, or test output), and capture follow-up tasks for downstream agents.

## Knowledge Base Hygiene
Before implementation, read the relevant spec in `app-docs/specs/`, scan `app-docs/mappings/feature-to-source.md` to avoid duplication, and check `app-docs/guides/common-patterns.md` for reusable approaches. After delivery, update mappings, log the run under `ai-docs/reports/`, and refresh `CLAUDE.md` or other guides if command wiring changes.
