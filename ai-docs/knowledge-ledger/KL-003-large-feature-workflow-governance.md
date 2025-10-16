---
id: KL-003
title: "Large Feature Workflow Governance"
status: adopted
date: 2025-10-06
replaces: null
links:
  - path: app-docs/guides/large-feature-workflow.md
  - path: ai-docs/capabilities/README.md
  - path: scripts/scaffold-capability.js
  - path: ai-docs/README.md
tags: [workflow, governance, features]
---

## Summary

We formalized a durable workflow for large, multi-session features by introducing structured feature directories, a scaffolding script, and documentation that coordinates planning, building, and reporting around explicit token budgets.

## Rationale

Why this approach was chosen:

- **Alternative A – Continue using ad-hoc plans/baw_dev_build directories:** This left artifacts scattered across `plans/`, `builds/`, and `sessions/`, making it impossible to track progress or respect token budgets at epic scale.
- **Alternative B – Centralize everything in a single dashboard command:** A monolithic command could not ingest nuanced plan slices or session history, and it masked the need for human-readable artifacts.
- **Chosen Approach – Structured capability workspaces:** Creating first-class feature directories with manifests, checklists, and session logs gives both humans and automation a shared source of truth.

### Trade-offs

- **Pros:**
  - Guarantees traceability from high-level features down to builds and reports.
  - Enables session-to-session continuity without rehydrating massive prompts.
  - Prepares data structures for richer dashboards and analytics.
- **Cons:**
  - Requires initial migration of existing artifacts into the new structure.
  - Adds a scaffolding command that teams must learn before starting work.

### Key Factors

- Need to enforce plan token budgets and avoid oversized `/baw_dev_plan` prompts.
- Desire to preserve historical session context without ballooning agent tokens.
- Requirement to expand dashboard views beyond the current unified summary.

## Implementation

Where to find this decision in the codebase:

### Files
- `app-docs/guides/large-feature-workflow.md` – Playbook describing the lifecycle and artifact expectations.
- `ai-docs/README.md` – Updated root documentation pointing contributors to structured feature directories.
- `ai-docs/capabilities/README.md` – Detailed directory contract for capability workspaces.
- `ai-docs/capabilities/_template/` – Canonical scaffolding template copied per feature.
- `ai-docs/capabilities/index.json` – Registry of scaffolded features.
- `scripts/scaffold-capability.js` – CLI script that generates capability workspaces and updates the registry.

### Commands
```bash
npm run baw:capability:scaffold -- --title "<Feature Title>"
```

### Configuration
```json
{
  "maxPlanTokens": 4000,
  "linkedLedgerEntries": ["KL-003"]
}
```

## Validation

How we know this works:

### Tests
- ✅ Manual scaffolding of a feature creates the expected directory tree with manifest, checklist, and backlog files.

### Metrics
- Number of features tracked via `index.json` provides visibility into adoption.

### User Feedback
- Early reviewers highlighted the ability to resume work mid-plan without repeating discovery steps.

## Future

Conditions that might trigger reconsideration:

- If dashboard automation evolves into a database-backed system, revisit whether JSON manifests should sync with that source.
- If token budgets or command sets change significantly, update the template manifest and scaffolding defaults.

---

**Created**: 2024-05-06
**Author**: Project Workflow Maintainer
**Status**: proposed → adopted on 2024-05-06 → superseded on _n/a_ by _n/a_
