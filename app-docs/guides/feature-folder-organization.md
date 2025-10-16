# Feature Folder Organization and Shared Modules

## When to Restructure Feature Directories
- **Prefer domain-based slices.** Organize feature folders around the user or business capability they deliver (e.g., `billing`, `analytics`, `user-preferences`). This keeps related UI, API, and data logic co-located and reduces cross-team coupling.
- **Avoid rearranging purely for release phases.** Release timing changes frequently; using directory structure to mirror phases or quarters creates churn, inflates merge conflicts, and hides long-lived modules. Track release plans in planning docs or issue metadata instead.
- **Expose dependency information with metadata.** Instead of embedding dependency order into folder names, keep a lightweight `README.md` or `status.yml` inside each feature folder that lists upstream/downstream dependencies and readiness. This keeps source layout stable while making sequencing explicit.
- **Highlight unfinished work with status dashboards.** Use tags in your backlog tool or per-capability status files to surface "not yet implemented" slices. Stable directory names combined with accurate status metadata give a clearer signal than reorganizing folders after every phase.

## Handling Shared or Reusable Components
- **Extract into a shared package.** Move reusable UI components, hooks, or utilities into a dedicated `packages/shared-*` workspace (in a monorepo) or a versioned library repository. Publish with semantic versioning to document compatibility.
- **Codify design system assets.** Pair shared component code with Storybook stories, usage docs, and design tokens. Co-locate design specs (`/design-system` or `/packages/ui/docs`) so every project has a single source of truth.
- **Automate distribution.** Use your package manager (npm, pnpm, etc.) or an internal registry to distribute updates across projects. Continuous integration should lint, test, and build shared packages independently to protect downstream consumers.
- **Document contribution rules.** Provide a `CONTRIBUTING.md` for shared modules describing review owners, version bump policy, and testing requirements so teams trust the shared layer.

## Prompting Roadmaps and Backlogs
- **Call out shared scope explicitly, not structurally.** When you create prompts, issues, or tasks for roadmap generators, list the planned shared modules in their own bullet list or section so they are visible alongside project-specific features. Avoid splitting them into different prompts unless a different team is responsible—the dependency view should stay unified.
- **Prefer tags over renaming.** Instead of renaming a feature folder or backlog item with prefixes like `SHARED-`, add a metadata flag (e.g., a `shared: true` field in `status.yml`, a label, or a checkbox in the prompt). This keeps the canonical feature name stable while still signalling its cross-project scope.
- **Reference the destination package.** In the same prompt, specify which shared package or repository the feature will live in and whether it requires a new release channel. That context helps planning tools schedule integration work without conflating it with app-specific delivery.

## Quick Checklist
- [ ] Keep feature directories stable and domain-aligned.
- [ ] Record dependencies and release intent in metadata files or backlog tooling, not directory names.
- [ ] Flag shared roadmap items with labels or metadata instead of renaming folders.
- [ ] Centralize shared components in versioned packages with documented usage patterns.
- [ ] Automate validation of shared packages before publishing.
- [ ] Maintain contribution guidelines for reusable modules.
