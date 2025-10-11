---
id: KL-005
title: Session Summaries for Cross-Session Memory
status: adopted
date: 2025-10-11
replaces: null
links: [KL-003]
tags: [memory, sessions, cross-session]
---

## Summary

Auto-generate session summaries in `ai-docs/sessions/SESSION-*.md` after each build, then vectorize them. This makes past work searchable and enables context-free session resumption.

## Rationale

Explicit session summaries solve the "context loss" problem when working across multiple sessions. Agents can search past sessions via vector search instead of re-reading entire codebases.

## Implementation

### Files

- `.claude/commands/build.md:15-29` - Auto-generates session summaries
- `scripts/vectorize-docs.js:25` - Indexes `ai-docs/sessions/`
- `ai-docs/sessions/` - Session summary storage

### Commands

```bash
# After build, automatically runs:
npm run vectorize  # Indexes new session
```

## Validation

- ✅ Session summaries generated for all builds
- ✅ Searchable via `npm run search "past feature"`
- ✅ Cross-session resumption working

---

**Created**: 2025-10-11
