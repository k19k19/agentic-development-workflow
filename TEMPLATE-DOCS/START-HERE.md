# START HERE - Next Session Guide

**Welcome back!** This template has **2 critical issues** that need fixing before it can work as described.

---

## 🚨 Read These 3 Documents (10 minutes)

1. **This file** (START-HERE.md) - Overview
2. **TWO-VECTOR-STORES.md** - Understanding the dual vector store problem
3. **CRITICAL-ISSUE-VECTOR-SEARCH.md** - Scout parameter mismatch

---

## ⚡ Quick Context

### What Works ✅
- Vector store lifecycle (archive/active/reference structure)
- `npm run manage-knowledge` script
- Init script (correctly doesn't copy template vector-store)
- Documentation structure (TEMPLATE-DOCS vs app-docs)

### What's Broken 🔴
1. **Template vector store** - Indexes app-docs (empty) instead of TEMPLATE-DOCS (where docs are)
2. **Scout workflows** - Pass unused "scale" parameter, vector search works by accident

---

## 🎯 Your Mission (If You Choose to Accept)

### Task 1: Fix Template Vector Store (30 min)

**Goal**: Make `npm run search "session history"` find `SESSION-HISTORY.md`

**File to edit**: `scripts/vectorize-docs.js`

**Add this at line 5-14** (replace existing DOCS_DIRECTORIES):

```javascript
const fs = require('fs').promises;
const path = require('path');

// Detect if running in template repo or user project
const isTemplateRepo = fs.existsSync(path.join(__dirname, '..', 'TEMPLATE-DOCS'));

// Configure directories based on environment
const DOCS_DIRECTORIES = isTemplateRepo
  ? [
      // Template development mode: Index design docs
      'TEMPLATE-DOCS/workflow-guides',
      'TEMPLATE-DOCS',  // SESSION-HISTORY.md, CRITICAL-ISSUE-*.md, etc.
    ]
  : [
      // User project mode: Index their documentation
      'app-docs/specs/active',
      'app-docs/specs/reference',
      'app-docs/guides',
      'app-docs/architecture',
      'app-docs/mappings',
      'app-docs/operations',
    ];

// Adjust excluded files based on environment
const EXCLUDED_FILES = isTemplateRepo
  ? new Set(['GETTING-STARTED.md', 'QUICK-REFERENCE.md'])  // Skip user-facing docs
  : new Set(['feature-to-source.md']);  // Skip auto-generated files
```

**Test**:
```bash
npm run vectorize
cat vector-store.json | jq -r '.[].source' | grep -i session
# Should see: TEMPLATE-DOCS/SESSION-HISTORY.md

npm run search "critical issue"
# Should find: CRITICAL-ISSUE-VECTOR-SEARCH.md
```

---

### Task 2: Fix Scout Parameter Mismatch (20 min)

**Goal**: Remove unused "scale" parameter from workflow calls

**Files to edit**:

1. `.claude/commands/full.md` (line 30-31):
   ```diff
   - /scout "[USER_PROMPT] [BUDGET MODE]" "2"
   + /scout "[USER_PROMPT] [BUDGET MODE]"

   - /scout "[USER_PROMPT]" "4"
   + /scout "[USER_PROMPT]"
   ```

2. `.claude/commands/scout_build.md` (line 15):
   ```diff
   - /scout "[TASK]" "2"
   + /scout "[TASK]"
   ```

**Test**:
```bash
# In template repo, no need to test workflows yet
# Just verify files are updated correctly
grep "/scout" .claude/commands/full.md
grep "/scout" .claude/commands/scout_build.md
# Should NOT see scale parameters anymore
```

---

### Task 3: Update Documentation (15 min)

**Files to update**:

1. **README.md** - Remove "parallel agents" references:
   ```diff
   - Scout phase: 2-4 parallel agents find relevant files
   + Scout phase: Vector search finds relevant files instantly

   - Budget mode: Scale 2 agents instead of 4
   + Budget mode: Same scout, but concise 350-word plan
   ```

2. **CLAUDE.md** - Update scout description:
   ```diff
   - Multi-agent parallel search (scale 2-4)
   + Vector search using semantic embeddings
   ```

3. **SESSION-HISTORY.md** - Mark issues resolved:
   ```markdown
   ### Issue 3: Vector search NOT used in workflows
   **Status**: ✅ FIXED (session YYYY-MM-DD)
   **Solution**: Removed scale parameter, updated docs
   ```

---

## 📝 Verification Checklist

After completing all 3 tasks:

### Template Vector Store
- [ ] `npm run vectorize` completes without errors
- [ ] `npm run search "session history"` finds SESSION-HISTORY.md
- [ ] `npm run search "critical issue"` finds CRITICAL-ISSUE-VECTOR-SEARCH.md
- [ ] `cat vector-store.json | jq length` shows 10-15 vectors (not just 5)

### Scout Workflows
- [ ] No "2" or "4" parameters in `/scout` calls
- [ ] Scout.md still has correct `npm run search` implementation
- [ ] README no longer mentions "parallel agents"

### Documentation
- [ ] All broken links fixed
- [ ] No references to "scale 2 vs scale 4"
- [ ] SESSION-HISTORY updated with fix notes

---

## 🧪 End-to-End Test (Optional)

If you want to verify the full workflow works:

1. **Create test spec**:
   ```bash
   echo "# Test Feature
   This is a test specification for OAuth2 implementation.
   " > app-docs/specs/active/test-oauth.md
   ```

2. **Vectorize**:
   ```bash
   npm run vectorize
   ```

3. **Test search**:
   ```bash
   npm run search "oauth"
   # Should find: test-oauth.md
   ```

4. **Test scout** (when ready):
   ```bash
   /scout "implement oauth"
   # Should internally call: npm run search "implement oauth"
   # Should return: test-oauth.md as relevant file
   ```

5. **Cleanup**:
   ```bash
   rm app-docs/specs/active/test-oauth.md
   npm run vectorize
   ```

---

## 📊 Expected Outcomes

### Before Your Session
```bash
npm run search "session history"
# Returns: No results (SESSION-HISTORY.md not indexed)

/scout "add feature" "2"
# Scale "2" parameter ignored, works by accident
```

### After Your Session
```bash
npm run search "session history"
# Returns: TEMPLATE-DOCS/SESSION-HISTORY.md (found!)

/scout "add feature"
# No scale parameter, works by design
```

---

## 🚫 What NOT to Do

- ❌ Don't add files to `app-docs/` (that's for users)
- ❌ Don't skip the vector search test (critical to verify fix)
- ❌ Don't modify scout.md command (it's already correct)
- ❌ Don't copy vector-store.json anywhere (init script handles it)

---

## ✅ Session Completion Criteria

You're done when:

1. ✅ Template vector store indexes TEMPLATE-DOCS/
2. ✅ `npm run search` finds session history docs
3. ✅ Scout workflows don't pass unused parameters
4. ✅ Documentation updated (no "parallel agents")
5. ✅ SESSION-HISTORY.md updated with completion notes

---

## 📞 If You Get Stuck

**Before starting**, run vector search:
```bash
npm run search "template structure"
npm run search "scout command"
npm run search "vector store"
```

**During work**, check these files:
- `TWO-VECTOR-STORES.md` - Vector store design
- `CRITICAL-ISSUE-VECTOR-SEARCH.md` - Scout problem details
- `SESSION-HISTORY.md` - Past decisions

**After fixing**, update:
- `SESSION-HISTORY.md` - Add completion notes
- Run `npm run vectorize` - So next session finds your work

---

## 🎉 Why This Matters

**User's concern**: "I am actually worried if this template will work as you described."

**Your fix proves**:
- ✅ Template CAN work as described
- ✅ Vector search WILL address AI memory gaps
- ✅ Archive/active distinction WILL improve search quality
- ✅ Template development WILL benefit from vector search too

**After your session**: Template will be production-ready, not just documented.

---

**Estimated time**: 1-1.5 hours
**Difficulty**: Medium (straightforward edits, testing critical)
**Impact**: HIGH (fixes core features)

**Good luck! 🚀**

---

**Created**: October 10, 2025
**Last Updated**: October 10, 2025
**Status**: Awaiting next session implementer
