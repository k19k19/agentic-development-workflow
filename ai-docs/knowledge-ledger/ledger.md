# Knowledge Ledger (Canonical Record)

This ledger is the authoritative history of adopted implementation decisions. Each entry points to a full `KL-` document that explains the problem, the selected approach, and the resulting implementation. Treat anything not listed here as proposed or experimental work that never became part of the project's law.

## Using this document

- **When you adopt a decision**, add a new subsection under "Adopted Decisions" using the format below.
- **When a decision is superseded**, move its subsection to "Superseded Decisions" and link to the new `KL-` entry that replaces it.
- **When you need context**, follow the link to the `KL-` file for comprehensive rationale, alternatives considered, and implementation notes.

Each subsection should answer three questions: What was implemented? Why was that direction chosen? How is it realized in the codebase?

### Entry format

```
### KL-XYZ — Title (Adopted YYYY-MM-DD)
- **What:** <One-sentence description of the behavior or asset that now exists>
- **Why:** <Key rationale or constraint that led to this choice>
- **How:** <Pointers to files, commands, or processes that embody the decision>
```

## Adopted Decisions

### KL-001 — Knowledge Ledger Governance (Adopted 2024-05-03)
- **What:** Established a constitution-style knowledge ledger with a canonical index and individual `KL-` decision files.
- **Why:** Prevent future iterations from discarding hard-earned context by requiring every adopted implementation to document its rationale and approach.
- **How:** `ai-docs/knowledge-ledger/README.md` defines the governance loop, `ai-docs/knowledge-ledger/ledger.md` tracks adopted decisions, and `ai-docs/knowledge-ledger/KL-001-knowledge-ledger-governance.md` captures the full decision record.

### KL-002 — Workflow Status Ledger Integration (Adopted 2024-05-04)
- **What:** Linked the knowledge ledger to the workflow status index so the dashboard and status sync commands surface adopted decisions alongside feature progress.
- **Why:** Ensure project monitoring tools consistently reference the ledger as the single source of truth, preventing later iterations from ignoring established implementations.
- **How:** `scripts/utils/knowledge-ledger.js` parses `ledger.md`, `scripts/workflow-status.js` embeds the parsed summary in `status-index.json`, and both `scripts/update-workflow-status.js` and `scripts/unified-dashboard.js` report ledger coverage during status checks.

### KL-003 — Large Feature Workflow Governance (Adopted 2024-05-06)
- **What:** Standardized large feature delivery around scaffolded directories, manifests, and session backlogs so complex initiatives remain within token budgets while maintaining traceability.
- **Why:** Ad-hoc artifacts made it impossible to split plans, coordinate sessions, or monitor progress at epic scale; a structured workspace keeps automation and humans aligned.
- **How:** `app-docs/guides/large-feature-workflow.md`, `ai-docs/workflow/features/README.md`, `ai-docs/workflow/features/_template/`, and `scripts/scaffold-feature.js` define and automate the new structure.

### KL-004 — Scout-to-Plan Revision Policy (Adopted 2024-05-07)
- **What:** Locked the `/baw:scout` feedback loop to existing plan artifacts so refinements enrich a single slice instead of forking duplicate features or plans.
- **Why:** Duplicate scaffolding burned tokens and hid progress across sessions; revising in-place keeps dashboards and backlogs trustworthy.
- **How:** Guidance in `CLAUDE.md`, `app-docs/guides/large-feature-workflow.md`, `ai-docs/workflow/features/README.md`, and the feature template ensure agents update the same plan/checklist/backlog entries.

### KL-005 — Persona-Aligned Command Restructure (Adopted 2024-05-10)
- **What:** Reorganized slash commands into product, developer, and operations tracks with new prompts for discovery, planning, deployment, and support.
- **Why:** Large initiatives require clarity across personas; dedicated commands keep specs, plans, and support artifacts aligned from ideation through operations.
- **How:** New command templates in `.claude/commands/`, updated workflow documentation (`README.md`, `CLAUDE.md`, `app-docs/guides/end-to-end-command-workflow.md`), and expanded workflow status guidance capture the structure.

### KL-006 — BAW Namespace & Feature Workspace Unification (Adopted 2024-05-12)
- **What:** Namespaced all workflow commands with `baw:` and routed automation outputs into per-feature workspaces under `ai-docs/workflow/features/`.
- **Why:** A unified namespace and directory layout eliminate drift between scout, plan, and build artifacts while keeping dashboards and hand-offs consistent.
- **How:** Updated `.claude/commands/`, `CLAUDE.md`, repository guides, and workflow scripts (`scripts/workflow-status.js`, installers, dashboards) to read/write the new structure and provide scaffolding updates (including `intake/tasks/`).

### KL-007 — Intake Alignment & Command Traceability (Adopted 2024-05-14)
- **What:** Expanded the feature template and command documentation so discovery, planning, build, and support outputs all land in consistent subdirectories inside each feature workspace.
- **Why:** Prevent artifact drift and make it obvious how research flows into plans, builds, tests, deployments, and operations without revisiting legacy folders.
- **How:** Updated `.claude/commands/`, template scaffolding under `ai-docs/workflow/features/_template/`, onboarding scripts, and maintainer guides (`README.md`, `CLAUDE.md`, `CLAUDE-TEMPLATE.md`) to reference the new layout and clarify the scout ➝ task prep split.

## Superseded Decisions

_None yet._
