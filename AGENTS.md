# Repository Guidelines

## Project Structure & Module Organization
Runtime code belongs under `app/` as features emerge. Long-form knowledge lives in `app-docs/`: specs are split into `specs/active/`, `specs/archive/`, and `specs/reference/`; evergreen guides stay in `guides/`, architecture decisions in `architecture/`, and mappings in `mappings/`. Generated plans, builds, and logs remain in `ai-docs/`. Co-locate tests alongside their targets (`tests/` or `app/<feature>/__tests__/`).

## Build, Test, and Development Commands
- `node scripts/detect-project-scale.js` — gauge project size before triggering heavier workflows.
- `npm run manage-knowledge -- list` — inspect active/archive/reference specs; use `archive <file>` or `restore <file>` to move them and re-vectorize automatically.
- `npm run vectorize` — rebuild the curated vector store manually after significant doc edits outside the helper.
- `npm run search -- "<query>" --limit=3` — pull the top semantic matches; add `--root=app-docs/specs/active` when you only need current specs.
- `/scout_plan_build "<prompt>" "<doc urls>" ["budget"]` — orchestrate Scout→Plan→Build with optional budget mode for lighter passes.
- `/quick-plan "<prompt>"` or `/build "<spec>"` — lean follow-ups once the target file list is known.

## Coding Style & Naming Conventions
Use modern TypeScript/JavaScript with 2-space indentation, single quotes, and explicit async/await. Prefer descriptive filenames: kebab-case utilities (`scripts/project-audit.js`), PascalCase components, and Title Case Markdown headings. Align docs with their specs (`app-docs/specs/active/round5-caching.md`) and keep changes focused on one concern.

## Testing Guidelines
Bootstrap Jest—or the spec-mandated harness—once executable code exists. Name suites `feature-name.test.ts`, colocate them with their implementations, and log coverage paths in `app-docs/mappings/feature-to-source.md`. Capture edge cases in each spec’s Testing section so downstream agents know the expectations.

## Commit & Pull Request Guidelines
Write concise, action-first commits like `Implement scout plan workflow`, citing supporting docs when relevant. PRs should link the initiating prompt, summarize scope, include validation artifacts (tests, logs, screenshots), and flag follow-up work for future cycles. Note any workflow or command changes so guidance stays current.

## Workflow Tips
Default to budget mode: let scout + researcher identify files, then hand builds to Claude/GPT. Keep `specs/active/` lean by archiving shipped work with the knowledge helper; reuse lessons by extracting guides instead of crowding the store. Before vectorizing, prefer Gemini or the CLI for reconnaissance to keep high-quality tokens for planning and builds.
