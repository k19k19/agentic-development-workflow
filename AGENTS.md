# Repository Guidelines

## Project Structure & Module Organization
Keep runtime code in `app/`, grouped by feature. Long-form knowledge lives in `app-docs/`: active specs in `specs/active/`, history in `specs/archive/`, references in `specs/reference/`, guides in `guides/`, and architecture notes in `architecture/`. Generated plans, build logs, and Scout output belong in `ai-docs/`. Co-locate tests with the code they cover (`app/<feature>/__tests__/` or `tests/`).

## Build, Test, and Development Commands
- `npm run manage-knowledge -- list` — list active specs; use `archive <file>` or `restore <file>` to move docs.
- `npm run workflow:sync` — aggregate workflow JSON emitted by slash commands for dashboard consumption.
- `npm run work` — open the unified workflow dashboard backed by the aggregated status index.
- `npm run lint` / `npm run lint:fix` / `npm run format` — enforce ESLint + Prettier conventions.
- `npm test` — reserved for the Jest harness; wire up features before enabling CI.

## Coding Style & Naming Conventions
Write modern TypeScript/JavaScript with 2-space indentation, single quotes, and explicit async/await chains. Favor descriptive filenames for utilities (e.g., `scripts/workflow-status.js`), PascalCase components, and Title Case markdown headings. Keep each change focused on one concern and document cross-cutting context in `app-docs/guides/`.

## Testing Guidelines
Bootstrap Jest (or the spec-mandated runner) alongside the first executable module. Name suites `feature-name.test.ts`, colocate fixtures near their subjects, and record notable edges in each spec’s Testing section. Run coverage locally before raising PRs and update the mappings doc with touched code.

## Commit & Pull Request Guidelines
Use action-first commit messages such as `Implement scout plan workflow`, citing specs or guides when they inform your work. PRs should link the initiating brief, outline scope, attach validation artefacts (tests, logs, screenshots), and flag follow-up tasks. Call out workflow or command changes so documentation stays current.

## Knowledge Ops & Agent Workflow
Default to the budget Scout→Plan→Build loop to minimize tokens. Build commands auto-generate session summaries in `ai-docs/sessions/SESSION-*.md` and emit workflow status JSON so automation can resume later. Keep the aggregated index fresh with `npm run workflow:sync` before reviewing the dashboard. Follow the next-step prompts at the end of each command (tests, deploy, retries) before handing off or pausing work.
