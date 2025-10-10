# Next Session Checklist

**START HERE** when beginning a new session on this template.

---

## ⚠️ CRITICAL: Read This First

### 1. Run Vector Search for Context
```bash
npm run search "session history"
npm run search "critical issues"
npm run search "template structure"
```

**Why**: Finds `SESSION-HISTORY.md` and `CRITICAL-ISSUE-VECTOR-SEARCH.md` with past decisions.

---

## ✅ RESOLVED ISSUES (October 10, 2025)

### ✅ Scout Integration Fixed (Commit 22dfb98)
**Was**: Scout command parameter mismatch - workflows passed scale param that was ignored
**Fixed**: Removed scale parameter from all workflow calls (full.md, scout_build.md)
**Status**: Complete and verified

### ✅ Documentation Updated
**Fixed**: README.md, CLAUDE.md, budget-mode.md now accurately reflect vector search
**Status**: Complete

## 🔄 CURRENT PRIORITIES

### 1. Template Vector Store Configuration (Optional Enhancement)
**File**: `TEMPLATE-DOCS/reference/TWO-VECTOR-STORES.md`

**Context**: Template can index either TEMPLATE-DOCS (for template development) or app-docs (for user projects)

**Current State**: Works correctly for user projects (indexes app-docs/)

**Optional**: Add environment detection to auto-switch based on repo type

**Priority**: LOW - Current implementation works for intended use case

---

## 📁 Directory Structure Rules

### TEMPLATE-DOCS/
**Purpose**: Template development documentation (NOT copied to user projects)

**Contents**:
- `workflow-guides/` - All implementation guides
- `SESSION-HISTORY.md` - Development history
- `CRITICAL-ISSUE-*.md` - Known issues
- `GETTING-STARTED.md` - User onboarding
- `QUICK-REFERENCE.md` - User cheat sheet

### app-docs/
**Purpose**: User project documentation (empty in template)

**Rule**: ⚠️ **DO NOT add template files here**

**In template**: Should only have empty directories with README.md placeholders

**In user projects**: Users populate with their own specs, guides, architecture

---

## ✅ Pre-Action Checklist

Before making ANY changes:

- [ ] Run `npm run search` to find related past work
- [ ] Check `SESSION-HISTORY.md` for principles
- [ ] Check `CRITICAL-ISSUE-*.md` for known problems
- [ ] Verify file location:
  - Template docs? → `TEMPLATE-DOCS/workflow-guides/`
  - User docs? → Don't add (users add their own)
  - Session notes? → `TEMPLATE-DOCS/SESSION-HISTORY.md`

---

## 🎯 Current Status

**What Works**:
- ✅ Vector store creation (`npm run vectorize`)
- ✅ Manual search (`npm run search "query"`)
- ✅ Archive/restore (`npm run manage-knowledge`)
- ✅ Active/archive directory structure

**What's Fixed**:
- ✅ Scout workflows use vector search correctly
- ✅ Scale parameter removed (no mismatch)
- ✅ README accurately reflects implementation

**What's Working**: All core features operational and production-ready

---

## 📝 After Fixing Vector Search

### Test Plan
```bash
# 1. Create test specs
echo "Active spec" > app-docs/specs/active/test-active.md
echo "Archive spec" > app-docs/specs/archive/test-archive.md

# 2. Vectorize
npm run vectorize

# 3. Test search finds only active
npm run search "test"
# Should return: test-active.md
# Should NOT return: test-archive.md

# 4. Test scout uses search
/scout "test feature"
# Should call: npm run search "test feature"
# Should find: active specs only

# 5. Cleanup
rm app-docs/specs/active/test-active.md
rm app-docs/specs/archive/test-archive.md
npm run vectorize
```

### Documentation Updates After Fix
1. `README.md` - Remove "parallel agents", update scout description
2. `TEMPLATE-DOCS/workflow-guides/budget-mode.md` - Remove scale differences
3. `CLAUDE.md` - Update scout phase description
4. `SESSION-HISTORY.md` - Mark issue as resolved

---

## 🔄 Session Handoff Process

At end of session, update:

1. **SESSION-HISTORY.md**:
   ```markdown
   ## Session YYYY-MM-DD: [Summary]
   - What was implemented
   - What was fixed
   - New issues discovered
   - Lessons learned
   ```

2. **Run vectorize**:
   ```bash
   npm run vectorize
   ```

This ensures next session finds your work via vector search.

---

## 📚 Key Documents

**Start here**:
1. `NEXT-SESSION-CHECKLIST.md` (this file)
2. `SESSION-HISTORY.md` - What happened before
3. `CRITICAL-ISSUE-VECTOR-SEARCH.md` - Current blocker

**Reference**:
- `QUICK-REFERENCE.md` - Template overview (for users)
- `workflow-guides/` - Implementation guides

**Don't edit** (user-facing, finalized):
- `GETTING-STARTED.md` - User onboarding
- Most of `README.md` - Main documentation

---

**Last Updated**: October 10, 2025
**Next Action**: Fix vector search integration (see CRITICAL-ISSUE-VECTOR-SEARCH.md)
