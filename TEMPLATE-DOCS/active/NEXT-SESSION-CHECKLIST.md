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

## 🔴 URGENT PRIORITY ORDER

### 1. FIRST: Fix Template Vector Store (30 min)
**File**: `TEMPLATE-DOCS/TWO-VECTOR-STORES.md`

**Problem**: Template vector store indexes `app-docs/` (empty) instead of `TEMPLATE-DOCS/` (where SESSION-HISTORY.md lives)

**Impact**: AI can't find past session notes via search, must rely on user reminders

**Fix**: Add environment detection to `scripts/vectorize-docs.js`

### 2. SECOND: Fix Scout Integration (30 min)
**File**: `TEMPLATE-DOCS/CRITICAL-ISSUE-VECTOR-SEARCH.md`

**Problem**: Scout command doesn't actually use vector search. Workflows call:
```bash
/scout "[task]" "2"    # ❌ Second parameter ignored
```

But `.claude/commands/scout.md` only accepts 1 argument.

**Fix** (Option 1 - Recommended):
1. Edit `.claude/commands/full.md` - remove `"2"` and `"4"` from scout calls
2. Edit `.claude/commands/scout_build.md` - remove `"2"` from scout call
3. Update README.md - remove "2-4 parallel agents" references
4. Test: Run `/scout "test"` and verify it calls `npm run search`

**Estimated time**: 30 minutes
**Impact**: Fixes core feature (vector search memory management)

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

**What's Broken**:
- ❌ Scout workflows don't use vector search correctly
- ❌ Scale parameter mismatch
- ❌ README claims features that don't work

**Priority**: Fix vector search integration FIRST

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
