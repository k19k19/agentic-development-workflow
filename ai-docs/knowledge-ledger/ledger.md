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

## Superseded Decisions

_None yet._
