---
id: KL-002
title: "Workflow Status Ledger Integration"
status: adopted
date: 2024-05-04
replaces: null
links:
  - path: scripts/workflow-status.js
    description: Aggregates workflow state and embeds knowledge ledger summaries
  - path: scripts/update-workflow-status.js
    description: CLI command that runs the aggregator and reports ledger coverage
  - path: scripts/unified-dashboard.js
    description: Dashboard output showing workflow and ledger context together
  - path: scripts/utils/knowledge-ledger.js
    description: Parser that normalizes ledger.md into structured data
  - path: ai-docs/knowledge-ledger/ledger.md
    description: Canonical ledger index consumed by the workflow aggregator
  - path: ai-docs/knowledge-ledger/README.md
    description: Documentation for the ledger process and workflow integration
tags: [knowledge, governance, workflow]
---

## Summary

Surface knowledge-ledger decisions directly inside workflow status tooling so project monitoring always reflects the currently adopted implementations and their rationale.

## Rationale

Why this approach was chosen:

- **Alternative A**: Keep the ledger manual-only — Risks the dashboard drifting from the "laws" of the project because humans must remember to cross-check docs.
- **Alternative B**: Duplicate rationale in workflow entries — Reintroduces multiple sources of truth and invites divergence as iterations evolve.
- **Chosen Approach**: Parse `ledger.md` into the workflow index — Keeps the ledger canonical while ensuring every status command reports which decisions are currently in force.

### Trade-offs

- **Pros**:
  - Guarantees monitoring commands surface ledger coverage without separate lookups.
  - Encourages teams to maintain `ledger.md` because omissions show up as warnings during status syncs.
- **Cons**:
  - Adds parser maintenance whenever the ledger format expands.
  - Slightly increases runtime for `npm run baw:workflow:sync`.

### Key Factors

- Requirement for a single source of truth that survives multiple implementation iterations.
- Desire for the dashboard to contextualize work-in-progress with the decisions it depends on.

## Implementation

Where to find this decision in the codebase:

### Files
- `scripts/utils/knowledge-ledger.js` – Normalizes `ledger.md` into adopted/superseded decision arrays and reports structural warnings.
- `scripts/workflow-status.js` – Embeds the parsed ledger summary into `status-index.json` (bumped index version to 1.1).
- `scripts/update-workflow-status.js` – Logs ledger coverage totals whenever the sync command runs.
- `scripts/unified-dashboard.js` – Prints top adopted decisions alongside workflow summaries.
- `ai-docs/knowledge-ledger/README.md` – Documents how workflow tooling now consumes the ledger.
- `ai-docs/knowledge-ledger/ledger.md` – Updated with the KL-002 entry and remains the canonical knowledge source.

### Commands
```bash
# Aggregate workflow status and surface ledger coverage
npm run baw:workflow:sync

# Open the dashboard to view workflow phases with current ledger decisions
npm run baw:work
```

### Configuration
_No configuration changes required._

## Validation

How we know this works:

### Manual checks
- ✅ Ran `node scripts/update-workflow-status.js` locally to confirm `status-index.json` includes `knowledgeLedger` data.
- ✅ Verified `npm run baw:work` output prints adopted decisions with their IDs and summaries.

### Metrics
- Not applicable.

### User Feedback
- Pending adoption by future iterations.

## Future

Conditions that might trigger reconsideration:

- If the ledger gains richer metadata (e.g., supersession dates), extend the parser and dashboard output accordingly.
- If parsing warnings become noisy, add automated validation or CI checks to enforce the ledger format.

---

**Created**: 2024-05-04
**Author**: Budget Agentic Workflow Team
**Status**: proposed → adopted on 2024-05-04
