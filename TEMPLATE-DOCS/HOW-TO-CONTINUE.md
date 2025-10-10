# How to Continue in Another Session

**Quick Guide**: What to do when starting a new Claude Code session on this template.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Open Template Directory
```bash
cd /Users/williamchong/Development/budget-agentic-workflow
claude-code  # or: claude
```

### Step 2: AI Should Run Vector Search FIRST
```bash
npm run search "session history"
npm run search "critical issues"
npm run search "next steps"
```

**Why**: Finds `SESSION-HISTORY.md`, `CRITICAL-ISSUE-*.md`, and understands context from past sessions.

### Step 3: Read START-HERE.md
```bash
cat TEMPLATE-DOCS/START-HERE.md
```

**Or tell the AI**: "Read TEMPLATE-DOCS/START-HERE.md and active/SESSION-HISTORY.md"

---

## 📋 What AI Should Do (Protocol)

### Before Making Any Changes

1. **Run vector search**:
   ```bash
   npm run search "what was done"
   npm run search "current issues"
   ```

2. **Read key files**:
   - `TEMPLATE-DOCS/START-HERE.md` - Next steps
   - `TEMPLATE-DOCS/active/SESSION-HISTORY.md` - Past work
   - `TEMPLATE-DOCS/active/CRITICAL-ISSUE-*.md` - Known problems

3. **Check current status**:
   ```bash
   npm run manage-knowledge -- list
   # Shows what's active vs archived
   ```

---

## 🎯 Current Priority (As of Oct 10, 2025)

### URGENT: Fix Scout Parameter Mismatch

**What**: Scout workflows pass unused "scale" parameter
**Impact**: Core feature (vector search) works by accident, not by design
**File**: `TEMPLATE-DOCS/active/CRITICAL-ISSUE-VECTOR-SEARCH.md`

**Fix** (20 minutes):
1. Edit `.claude/commands/full.md` - Remove `"2"` and `"4"` from scout calls
2. Edit `.claude/commands/scout_build.md` - Remove `"2"` from scout call
3. Update README.md - Remove "parallel agents" references
4. Test: `/scout "test"` should call `npm run search "test"`

---

## 📚 Key Files to Know

### Entry Point
- `TEMPLATE-DOCS/START-HERE.md` - Read this first

### Current Work (active/)
- `SESSION-HISTORY.md` - Everything that's happened
- `CRITICAL-ISSUE-VECTOR-SEARCH.md` - Scout parameter problem
- `TWO-VECTOR-STORES.md` - Template vs user vector stores
- `MIGRATION-COMPLETE.md` - Recent structure migration

### Reference Guides (reference/)
- `GETTING-STARTED.md` - User onboarding
- `QUICK-REFERENCE.md` - One-page cheat sheet
- `budget-mode.md` - Budget optimization
- `WORKFLOW.md` - Workflow phases

---

## 🔍 How to Find Information

### Using Vector Search (Recommended)
```bash
# Find past decisions
npm run search "why did we do this"

# Find current issues
npm run search "broken" OR npm run search "critical"

# Find implementation details
npm run search "scout command"
npm run search "vector store"
```

### Manual Reading
```bash
# See what's being worked on
ls TEMPLATE-DOCS/active/

# See reference guides
ls TEMPLATE-DOCS/reference/

# See what's been completed
ls TEMPLATE-DOCS/archive/
```

---

## 🛠️ Common Tasks

### 1. After Fixing an Issue

```bash
# Archive the issue document
npm run manage-knowledge -- archive CRITICAL-ISSUE-VECTOR-SEARCH.md

# Update session history
vim TEMPLATE-DOCS/active/SESSION-HISTORY.md
# Add: "Session YYYY-MM-DD: Fixed scout parameter mismatch"

# Rebuild vector store
npm run vectorize
```

### 2. Starting New Work

```bash
# Create new active document
vim TEMPLATE-DOCS/active/NEW-FEATURE-IMPLEMENTATION.md

# Rebuild vector store (so it's searchable)
npm run vectorize
```

### 3. Creating Reference Guide

```bash
# Add to reference
vim TEMPLATE-DOCS/reference/new-guide.md

# Rebuild vector store
npm run vectorize
```

---

## ⚠️ Important Rules

### DO:
- ✅ Run vector search BEFORE making changes
- ✅ Read `SESSION-HISTORY.md` for context
- ✅ Update `SESSION-HISTORY.md` after completing work
- ✅ Run `npm run vectorize` after adding/moving files
- ✅ Archive completed work to `archive/`

### DON'T:
- ❌ Add files to `app-docs/` (that's for users, not template)
- ❌ Skip vector search (that's why we built it!)
- ❌ Guess what was done before (search for it)
- ❌ Modify files in `reference/` without good reason (they're stable)

---

## 🧪 Testing Changes

### After Any Changes

```bash
# 1. Rebuild vector store
npm run vectorize

# 2. Test search
npm run search "your query"

# 3. Verify structure
npm run manage-knowledge -- list
```

---

## 💡 Example Session Start

**User**: "Continue working on the template"

**AI Should Do**:
```bash
# 1. Find context
npm run search "session history"
npm run search "next steps"
npm run search "critical issues"

# 2. Read key files
# Reads: SESSION-HISTORY.md, START-HERE.md, CRITICAL-ISSUE-*.md

# 3. Tell user what was found
"I found that the last session completed the directory structure migration.
The next priority is fixing the scout parameter mismatch in the workflow commands.
Shall I proceed with that?"

# 4. Wait for user confirmation
# Then start work
```

---

## 📊 Session Handoff Checklist

### Before Ending Session

- [ ] Update `SESSION-HISTORY.md` with what was done
- [ ] Archive any completed issues
- [ ] Run `npm run vectorize` to index changes
- [ ] Create summary in active/ if major work done
- [ ] Test that vector search finds new content

### Starting New Session

- [ ] Run vector search to find context
- [ ] Read `SESSION-HISTORY.md`
- [ ] Read `START-HERE.md`
- [ ] Check `active/` for current issues
- [ ] Ask user to confirm priority

---

## 🎓 Why This Matters

**The Problem**: AI has no memory between sessions. User has to repeat everything.

**The Solution**: Vector search + structured documentation
1. AI runs `npm run search` to find past work
2. Reads indexed documents (SESSION-HISTORY.md, CRITICAL-ISSUE-*.md)
3. Understands context automatically
4. No user reminders needed

**Current Status**:
- ✅ Vector store configured correctly
- ✅ Template docs indexed (active + reference)
- ✅ Search finds session history
- ⚠️ AI needs to USE vector search (this is the critical part!)

---

## 🚨 If Vector Search Doesn't Work

### Check 1: Is vector store built?
```bash
ls -lh vector-store.json
# Should be ~68-70KB with template docs
```

### Check 2: Are files indexed?
```bash
cat vector-store.json | jq -r '.[].source' | grep SESSION-HISTORY
# Should see: TEMPLATE-DOCS/active/SESSION-HISTORY.md
```

### Check 3: Does search work?
```bash
npm run search "session history"
# Should return results
```

### If all fail:
```bash
npm run vectorize
# Rebuild from scratch
```

---

## 📞 Quick Commands Reference

```bash
# Find context
npm run search "query"

# See current work
npm run manage-knowledge -- list

# Archive completed work
npm run manage-knowledge -- archive filename.md

# Rebuild vector store
npm run vectorize

# Read entry point
cat TEMPLATE-DOCS/START-HERE.md

# Read session history
cat TEMPLATE-DOCS/active/SESSION-HISTORY.md
```

---

## 🎯 Success Indicators

**You're doing it right when:**
- ✅ AI runs vector search before asking questions
- ✅ AI references past session decisions
- ✅ AI knows what was done last time
- ✅ You don't have to repeat yourself

**Warning signs:**
- ❌ AI asks "What should I work on?" without searching
- ❌ AI doesn't know about past issues
- ❌ You have to explain what was done before
- ❌ AI creates duplicate work

---

**Remember**: Vector search is the solution to AI memory gaps. Use it every session!

---

**Created**: October 10, 2025
**Last Updated**: October 10, 2025
**Location**: `TEMPLATE-DOCS/HOW-TO-CONTINUE.md`
