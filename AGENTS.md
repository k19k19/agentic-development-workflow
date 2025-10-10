# Repository Guidelines

## Project Structure & Module Organization
Keep executable features in `app/`, grouping files by feature and co-locating helpers. Long-form knowledge lives in `app-docs/`: specs under `specs/active/`, previous cycles in `specs/archive/`, references in `specs/reference/`, guides in `guides/`, and architecture notes in `architecture/`. Generated plans, build logs, and Scout output belong in `ai-docs/`. Place tests beside the code they cover (`app/<feature>/__tests__/` or `tests/`) and note coverage paths in `app-docs/mappings/feature-to-source.md`.

## Build, Test, and Development Commands
- `node scripts/detect-project-scale.js` — size up the repo before kicking off heavy automation.
- `npm run manage-knowledge -- list` — inspect active specs; pair with `archive <file>` or `restore <file>` to move docs and trigger re-vectorization.
- `npm run vectorize` — rebuild the curated vector store after manual doc edits.
- `npm run search -- "<query>" --limit=3` — surface top semantic matches; add `--root=app-docs/specs/active` for current work.
- `npm run lint` / `npm run lint:fix` / `npm run format` — enforce ESLint + Prettier conventions.
- `npm test` — reserved for the Jest harness; implement feature tests before enabling CI.

## Coding Style & Naming Conventions
Write modern TypeScript/JavaScript with 2-space indentation, single quotes, and explicit async/await chains. Favor descriptive filenames—kebab-case for utilities (`scripts/vectorize-docs.js`), PascalCase for React-style components, and Title Case headings in Markdown. Keep changes focused on one concern and document cross-cutting context in `app-docs/guides/`.

## Testing Guidelines
Bootstrap Jest (or the spec-mandated runner) alongside the first executable module. Name suites `feature-name.test.ts`, colocate fixtures near their subjects, and capture notable edges in each spec’s Testing section. Run coverage locally before raising PRs and record touched files in the mappings doc.

## Commit & Pull Request Guidelines
Use action-first commit messages such as `Implement scout plan workflow`, referencing specs or guides when they inform your work. PRs should link the initiating brief, outline scope, attach validation artefacts (tests, logs, screenshots), and flag follow-up tasks. Call out workflow or command changes so documentation stays current.

## Knowledge Ops & Agent Workflow
Prefer the budget Scout→Plan→Build loop: Scout identifies candidate files, Plan refines tasks, and Build executes with minimal tokens. Keep `specs/active/` lean by archiving shipped work through `npm run manage-knowledge`; extract enduring lessons into guides before vectorizing. Coordinate with other agents via `AGENTS.md` updates when processes shift.
