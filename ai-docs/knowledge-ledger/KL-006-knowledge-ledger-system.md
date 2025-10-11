---
id: KL-006
title: Knowledge Ledger for Decision History
status: adopted
date: 2025-10-11
replaces: null
links: [KL-003]
tags: [knowledge-ledger, documentation, decisions]
---

## Summary

Store architectural decisions as versioned articles in `ai-docs/knowledge-ledger/` with frontmatter status (proposed/adopted/superseded). Only adopted/superseded articles are indexed with 1.5x search boost to prevent regression to rejected approaches.

## Rationale

Solves the "why did we decide this?" problem. Captures rationale, alternatives considered, and validation evidence. Prevents agents from re-proposing rejected solutions across sessions.

## Implementation

### Files

- `ai-docs/knowledge-ledger/README.md` - Schema documentation
- `ai-docs/knowledge-ledger/template.md` - Article template
- `scripts/validate-knowledge.js` - Validation script
- `scripts/vectorize-docs.js:239-273` - Ledger indexing with boost

### Commands

```bash
npm run knowledge:validate  # Validate articles
npm run vectorize  # Index adopted articles
npm run search "[topic]"  # Search decisions
```

## Validation

- ✅ Validation catches invalid articles
- ✅ Status filtering works (proposed excluded)
- ✅ 1.5x boost applied to ledger results
- ✅ Cross-references validated

---

**Created**: 2025-10-11
