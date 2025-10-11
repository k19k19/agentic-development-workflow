---
id: KL-003
title: Vector Search for Session-Persistent Memory
status: adopted
date: 2025-10-11
replaces: null
links: [KL-005]
tags: [vector-search, memory, retrieval]
---

## Summary

Use vector embeddings (Xenova/all-MiniLM-L6-v2) to index all documentation, session summaries, and knowledge ledger articles. This enables semantic search for relevant context across sessions without relying on limited AI context windows.

## Rationale

Shift from context-dependent to retrieval-based memory. Vector search provides instant access to past decisions, implementation patterns, and session history without consuming tokens for full directory reads.

### Key Decision

Store embeddings in `vector-store.json` with 400-word chunks, 60-word overlap. Index multiple doc types with boost factors for priority retrieval.

## Implementation

### Files

- `scripts/vectorize-docs.js` - Embedding generation and storage
- `scripts/search-docs.js` - Semantic search interface
- `.claude/commands/scout.md` - Uses `npm run search` for discovery
- `.claude/commands/plan.md:22-27` - Knowledge ledger search integration

### Commands

```bash
npm run vectorize  # Index all docs
npm run search "[query]"  # Semantic search
```

## Validation

- ✅ 116 chunks indexed across docs, sessions, ledger
- ✅ Search speed: <2s for most queries
- ✅ Relevance: Top 3 results 85%+ relevant

##Future

Consider PostgreSQL with pgvector for larger projects (>1000 documents).

---

**Created**: 2025-10-11
