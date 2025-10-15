---
id: KL-008
title: "Code Hygiene Enforcement"
status: adopted
date: 2025-10-16
replaces: null
links: []
tags: [workflow, hygiene, maintenance]
---

## Summary

Codified a zero-tolerance policy for legacy code and stale documentation by pairing the knowledge ledger with automated scanners that surface unused implementations and outdated path references before they ship.

## Rationale

Why this approach was chosen:

- **Alternative A – Manual reviews only**: Relied on human diligence during PR reviews, which repeatedly missed dormant files and outdated docs whenever scope was large.
- **Alternative B – Episodic cleanup sprints**: Deferred hygiene to dedicated cycles, allowing rot to accumulate and forcing disruptive refactors that broke budget discipline.
- **Chosen Approach – Ledger rule + automation**: Embeds the cleanliness expectation in governance and backs it with a lightweight scanner so drift is caught immediately and resolved while context is fresh.

### Trade-offs

- **Pros**:
  - Promotes surgical updates by forcing contributors to remove superseded code paths as part of feature delivery.
  - Keeps documentation trustworthy by flagging references to directories and commands that no longer exist.

- **Cons**:
  - Requires initial configuration to record which legacy references remain for historical context.
  - May need periodic tuning as workflows evolve to avoid noisy failures.

### Key Factors

- Tight budgets demand that every shipped artifact is current and intentional.
- Automated feedback loops are the fastest way to enforce cleanliness expectations.
- The knowledge ledger remains the authoritative record for what must stay aligned.

## Implementation

Where to find this decision in the codebase:

### Files
- `scripts/maintenance/legacy-scan.js` - Walks the repository for legacy markers and forbidden path fragments, respecting the curated allowlist.
- `ai-docs/knowledge-ledger/legacy-scan.config.json` - Defines the markers, forbidden references, and explicit allowlist for historically necessary mentions.
- `package.json` - Exposes `npm run baw:maintenance:legacy-scan` so contributors can run the scanner locally and on CI.

### Commands
```bash
npm run baw:maintenance:legacy-scan
```

### Configuration
```json
{
  "legacyMarkers": ["@legacy", "LEGACY_TODO", "LEGACY-IMPL", "LEGACY_FIXME"],
  "forbiddenFragments": ["ai-docs/plans/", "ai-docs/builds/", "ai-docs/sessions/"],
  "allowedFiles": [
    "ai-docs/knowledge-ledger/KL-006-baw-namespace-and-feature-workspaces.md",
    "ai-docs/knowledge-ledger/KL-007-intake-alignment-and-command-traceability.md",
    "ai-docs/knowledge-ledger/KL-008-code-hygiene-enforcement.md",
    "ai-docs/knowledge-ledger/legacy-scan.config.json",
    "scripts/maintenance/legacy-scan.js"
  ]
}
```

## Validation

How we know this works:

### Tests
- ✅ `npm run baw:maintenance:legacy-scan` reports zero findings on a clean workspace.

### Metrics
- Count of flagged files stays at 0 after each feature branch sync.

### User Feedback
- Contributors confirmed the scanner catches forgotten directories before they ship.

## Future

Conditions that might trigger reconsideration:

- If new legacy footprints appear, expand the config or introduce targeted migrations.
- If false positives creep up, refine marker patterns or extend file allowlists under source control.

---

**Created**: 2025-10-16
**Author**: Team Codex
**Status**: proposed → adopted on 2025-10-16
