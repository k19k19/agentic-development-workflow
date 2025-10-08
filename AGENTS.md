# Repository Guidelines

## Project Structure & Module Organization
Keep coordination and playbook files (e.g., `CLAUDE.md`, `GEMINI.md`) in the repository root. Runtime code lives under `app/` when introduced, with feature docs, specs, and guides organized in `app-docs/`. Store generated reports in `ai-docs/` and automation or helper scripts in `scripts/` (see `scripts/detect-project-scale.js` for an example). Co-locate tests with their targets inside `tests/` or `app/<feature>/__tests__/`.

## Build, Test, and Development Commands
- `node scripts/detect-project-scale.js` — gauges project size to decide whether to run the full workflow.
- `npm run vectorize` — rebuilds the chunked vector store (with headings, line ranges, and labels) after meaningful documentation edits.
- `npm run search -- "<query>" [--root=app-docs] [--doc=guides] [--limit=3]` — fetches semantically ranked context slices from the vector store for scout/researcher agents.
- `/scout_plan_build "<prompt>" "<doc urls>"` — runs the standard Scout→Plan→Build sequence and writes reports to `ai-docs/reports/`.
- `/scout_plan_build "<prompt>" "<doc urls>" "budget"` — trims the loop for Budget Mode (reduced scout scale, concise plan, short build report).
- `/quick-plan "<prompt>"` or `/build "<spec>"` — lightweight helpers for follow-up passes when a full orchestration is unnecessary.

## Model & Token Budget Tips
- Treat `budget=true` as the default for small fixes: run scout + researcher only, and hand code changes to Claude or GPT once you know the file list.
- Prefer Gemini or the local CLI for reconnaissance; reserve Claude/GPT messages for plan/build reasoning where quality matters most.
- Reuse prior plans and build reports from `ai-docs/` when iterating on the same feature to avoid rerunning `/scout_plan_build`.
- Limit vector search output with `--limit=<n>` and keep persona prompts under 3 follow-ups to cap chat tokens.
- Read `app-docs/guides/budget-mode.md` for the step-by-step workflow when budget is the priority.

## Coding Style & Naming Conventions
Favor modern TypeScript/JavaScript with 2-space indentation, single quotes, strict async/await, and descriptive naming. Use kebab-case for utilities (`scripts/project-audit.js`), PascalCase for components or classes, and align doc names with their specs (e.g., `app-docs/specs/1st-backend-user-auth.md`). Keep Markdown headings in Title Case and reuse the provided templates when extending documentation.

## Testing Guidelines
Bootstrap Jest—or the framework specified in the relevant spec—once executable code lands. Name suites `feature-name.test.ts`, colocate them with their feature, and capture edge cases in the spec’s Testing section. After writing tests, append the suite path to `app-docs/mappings/feature-to-source.md` so downstream agents can trace coverage.

## Commit & Pull Request Guidelines
Write concise, active commit messages such as `Implement scout plan workflow`, referencing supporting docs when applicable. Pull requests should cite the initiating prompt, summarize the change, include validation evidence (test output, logs, or screenshots), and note follow-up tasks for later agents.

## Knowledge Base Hygiene
Review `app-docs/specs/` and `app-docs/guides/common-patterns.md` before building, and confirm that new work does not duplicate entries listed in `app-docs/mappings/feature-to-source.md`. After delivery, update the mapping, drop a run summary in `ai-docs/reports/`, copy `app-docs/releases/RELEASE-TEMPLATE.md` to `app-docs/releases/<version>.md` for milestone notes, and refresh guidance documents if command wiring or workflows change.
