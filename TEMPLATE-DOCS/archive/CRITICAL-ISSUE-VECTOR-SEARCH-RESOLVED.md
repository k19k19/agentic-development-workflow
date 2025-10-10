# CRITICAL ISSUE: Vector Search Not Integrated Into Workflows

## ✅ RESOLUTION (October 10, 2025)

**Status**: ✅ **FIXED** - Scout parameter mismatch resolved
**Fixed**: October 10, 2025
**Commits**:
- `22dfb98` - Fix scout parameter mismatch and update documentation
- `4bfb4d2` - Reorganize template documentation and update knowledge management

**Solution Implemented**: Option 1 (Remove Scale Parameter)
- Removed scale parameter from all workflow calls
- Updated README.md, CLAUDE.md, budget-mode.md
- Fixed token cost estimates (scout now 5K, not 10K)
- All documentation now accurately reflects vector search implementation

---

## ORIGINAL ISSUE REPORT

**Status**: 🔴 **BROKEN** - Template claims to use vector search but workflows don't actually call it
**Discovered**: October 10, 2025
**Impact**: HIGH - Core feature (memory management) is non-functional

---

## The Problem

### What the README Claims

From `README.md`:
```markdown
### 🧠 Automated Memory Management

**Vector store**: Semantic search across all documentation
- Lifecycle-based spec management
- Archiving old specs improves search quality by 40%
- Reduces token usage
```

### What Actually Happens

**Scout command** (`.claude/commands/scout.md`):
```yaml
description: Use vector search to find files and context relevant to task
argument-hint: [user_prompt]
```

**Workflow implementation** (`.claude/commands/full.md`):
```bash
/scout "[USER_PROMPT]" "4"    # ❌ Passes "scale" parameter
/scout "[USER_PROMPT]" "2"    # ❌ Scout command only accepts 1 argument
```

**Result**: The "scale" parameter is ignored, and there's a mismatch between:
1. Scout command spec (uses `npm run search` - vector search)
2. Workflow calls (trying to pass scale parameter for multi-agent search)

---

## Root Cause Analysis

### Historical Context

Based on `CLAUDE.md` and `MIGRATION-GUIDE.md`, the template underwent migration from:
- **Old SDK**: Custom multi-agent orchestration with parallel agent spawning
- **New Agent SDK**: Uses Task tool for agent orchestration

**During migration, two scout approaches got mixed:**

1. **Vector Search Approach** (scout.md):
   - Uses `npm run search`
   - Fast, token-efficient
   - Leverages vector store

2. **Multi-Agent Search Approach** (old system):
   - Spawns N parallel agents (scale 2-4)
   - Each agent searches independently
   - Aggregates results

**The workflows still reference the multi-agent approach but scout.md implements vector search.**

---

## Evidence

### 1. Scout Command Definition

File: `.claude/commands/scout.md`

```markdown
## Workflow
1. Take the `USER_PROMPT` provided by the user.
2. Construct the shell command: `npm run search -- "[USER_PROMPT]"`.
3. Execute the command using `run_shell_command`.
4. The standard output of this command is your result.
```

**Only accepts 1 argument**: `USER_PROMPT`

### 2. Workflow Calls

File: `.claude/commands/full.md:30`

```bash
/scout "[USER_PROMPT] [BUDGET MODE]" "2"    # Passes 2 arguments
/scout "[USER_PROMPT]" "4"                   # Passes 2 arguments
```

File: `.claude/commands/scout_build.md:15`

```bash
/scout "[TASK]" "2"    # Passes 2 arguments
```

**All workflows pass 2 arguments, but scout.md only accepts 1.**

### 3. Vector Store Implementation

The vector store is correctly implemented:
- ✅ `scripts/vectorize-docs.js` - Indexes active specs
- ✅ `scripts/manage-knowledge.js` - Lifecycle management
- ✅ `scripts/search-docs.js` - Semantic search CLI
- ❌ **NOT CALLED BY ANY WORKFLOW COMMAND**

---

## Impact Assessment

### What Works
- ✅ Vector store creation (`npm run vectorize`)
- ✅ Manual search (`npm run search "query"`)
- ✅ Archive/restore specs (`npm run manage-knowledge`)

### What's Broken
- ❌ `/scout` command receives extra parameter it doesn't use
- ❌ Vector search never called during workflows
- ❌ Memory management (archive/active) has no effect on scout results
- ❌ Token savings from focused search: **NOT REALIZED**
- ❌ 40% search quality improvement: **NOT REALIZED**

### User Experience Impact

**User runs:**
```bash
/full "Add OAuth2" "" "budget"
```

**Expected behavior:**
1. Scout runs `npm run search "Add OAuth2"`
2. Returns results from `app-docs/specs/active/` only (not archive)
3. Focused context = better planning

**Actual behavior:**
1. Scout receives `"Add OAuth2"` and `"2"` as arguments
2. Second argument ignored (not in scout.md spec)
3. Runs `npm run search "Add OAuth2"` (correctly)
4. **BUT** vector search happens to work by accident (first arg is correct)

**Verdict**: It works by accident, but the "scale" concept is broken.

---

## The "Scale" Parameter Mystery

### What "Scale" Was Supposed to Mean

Based on `CLAUDE.md`:
```markdown
Scout Phase: Multi-agent parallel search
- Scale parameter determines number of parallel agents
- Scale 2 = 2 agents
- Scale 4 = 4 agents
```

### What It Actually Does Now

**Nothing.** The scout.md command:
1. Takes only `USER_PROMPT`
2. Runs `npm run search "$USER_PROMPT"`
3. Ignores any second parameter

### The Confusion

**Old system** (pre-migration):
```bash
# Spawned multiple Task agents in parallel
/scout "query" "4"  # Spawn 4 parallel agents
```

**New system** (post-migration):
```bash
# Uses vector search
/scout "query"      # Run semantic search on vector store
```

**Current broken state**:
```bash
# Workflows call old syntax, command ignores it
/scout "query" "2"  # Second param does nothing
```

---

## Proposed Solutions

### Option 1: Remove Scale Parameter (Simplest)

**Change workflows to match scout.md:**

`.claude/commands/full.md`:
```diff
- /scout "[USER_PROMPT]" "4"
+ /scout "[USER_PROMPT]"
```

`.claude/commands/scout_build.md`:
```diff
- /scout "[TASK]" "2"
+ /scout "[TASK]"
```

**Pros:**
- ✅ Aligns with current scout.md implementation
- ✅ No changes to scout command needed
- ✅ Vector search already works

**Cons:**
- ❌ Loses ability to control search depth/breadth
- ❌ No budget vs standard mode differentiation in scout

---

### Option 2: Make Scout Respect Scale Parameter

**Update scout.md to accept scale:**

`.claude/commands/scout.md`:
```yaml
argument-hint: [user_prompt] [max_results]
```

```markdown
## Variables
USER_PROMPT: $1
MAX_RESULTS: $2 (default: 5)

## Workflow
1. Take the `USER_PROMPT` and `MAX_RESULTS`.
2. Construct: `npm run search -- "[USER_PROMPT]" --limit [MAX_RESULTS]`
3. Execute the command.
```

**Update search-docs.js:**
```javascript
// Add --limit flag support
const limit = process.argv.find(arg => arg.startsWith('--limit='))
  ?.split('=')[1] || 10;
```

**Pros:**
- ✅ Gives meaning to scale parameter
- ✅ Budget mode can request fewer results (scale 2 = limit 3)
- ✅ Standard mode gets more results (scale 4 = limit 10)
- ✅ Maintains budget optimization concept

**Cons:**
- ⚠️ Requires changes to both scout.md and search-docs.js

---

### Option 3: Hybrid - Vector Search First, Then Targeted Agents

**Use vector search to find areas, then spawn agents to explore:**

```markdown
## Workflow
1. Run `npm run search "[USER_PROMPT]"` to get top 5 files
2. For each file, spawn a Task agent to extract relevant sections
3. Scale parameter = max concurrent agents (2 or 4)
4. Aggregate results
```

**Pros:**
- ✅ Combines vector search (fast, focused) + agent exploration (thorough)
- ✅ Scale parameter has meaning
- ✅ Best of both worlds

**Cons:**
- ❌ Most complex to implement
- ❌ Higher token cost
- ❌ May not align with budget-first philosophy

---

## Recommended Solution

**Option 1: Remove Scale Parameter**

**Rationale:**
1. Vector search is fast and efficient
2. Template is budget-focused - don't need parallel agents
3. Simplest fix that works with existing implementation
4. Archive/active distinction already provides focus

**Implementation:**

1. Update `.claude/commands/full.md`:
   ```diff
   - /scout "[USER_PROMPT] [BUDGET MODE]" "2"
   + /scout "[USER_PROMPT] [BUDGET MODE]"

   - /scout "[USER_PROMPT]" "4"
   + /scout "[USER_PROMPT]"
   ```

2. Update `.claude/commands/scout_build.md`:
   ```diff
   - /scout "[TASK]" "2"
   + /scout "[TASK]"
   ```

3. Update `README.md` to remove references to "scale":
   ```diff
   - Scout phase: 2-4 parallel agents find relevant files
   + Scout phase: Vector search finds relevant files instantly
   ```

4. Update `TEMPLATE-DOCS/workflow-guides/budget-mode.md`:
   ```diff
   - Scout: 2 agents instead of 4
   + Scout: Vector search (same for budget and standard)
   ```

---

## Migration Plan

### Phase 1: Fix Immediate Issue (Now)
1. Remove scale parameter from workflow calls
2. Update documentation to remove "parallel agents" references
3. Test vector search integration

### Phase 2: Enhance Vector Search (Later)
1. Add `--limit` flag support to `search-docs.js`
2. Make scout accept optional max_results parameter
3. Update budget mode to request fewer results

### Phase 3: Document Best Practices (Later)
1. Add "How Vector Search Works" guide
2. Document when to archive specs
3. Add search query optimization tips

---

## Testing Plan

### Before Fix
```bash
# Run this to see current broken behavior
/full "Add authentication" "" "budget"
# Observe: scale parameter is ignored
```

### After Fix
```bash
# 1. Archive an old spec
echo "Old feature spec" > app-docs/specs/active/old-feature.md
npm run vectorize
npm run manage-knowledge -- archive old-feature.md

# 2. Create active spec
echo "New feature spec" > app-docs/specs/active/new-feature.md
npm run vectorize

# 3. Test scout finds only active
/scout "feature"
# Should find: new-feature.md
# Should NOT find: old-feature.md (archived)

# 4. Test full workflow
/full "Implement feature" "" "budget"
# Should use vector search results
# Should respect active/archive distinction
```

---

## Documentation Updates Needed

1. **README.md**:
   - Remove "2-4 parallel agents" references
   - Update token cost estimates (vector search is cheaper)
   - Clarify how scout works

2. **TEMPLATE-DOCS/workflow-guides/budget-mode.md**:
   - Remove scale parameter differences
   - Explain budget mode focuses on concise planning, not scout

3. **TEMPLATE-DOCS/workflow-guides/WORKFLOW.md**:
   - Document scout phase uses vector search
   - Explain active/archive impact on results

4. **CLAUDE.md**:
   - Remove multi-agent orchestration references
   - Update to reflect vector search approach

---

## Related Files

**Implementation:**
- `.claude/commands/scout.md` - Scout command (correct implementation)
- `.claude/commands/full.md` - Full workflow (broken call)
- `.claude/commands/scout_build.md` - Scout+Build workflow (broken call)
- `scripts/search-docs.js` - Vector search implementation (works)
- `scripts/vectorize-docs.js` - Vector store creation (works)

**Documentation:**
- `README.md` - Claims parallel agents (outdated)
- `CLAUDE.md` - References old multi-agent approach (outdated)
- `TEMPLATE-DOCS/workflow-guides/budget-mode.md` - Scale differences (misleading)

---

## Next Steps

**Immediate** (this session or next):
1. Implement Option 1 (remove scale parameter)
2. Test vector search integration
3. Update all documentation

**Follow-up** (future sessions):
1. Consider Option 2 (add --limit flag) for enhanced control
2. Add vector search best practices guide
3. Create examples of good vs bad search queries

---

**Status**: 🔴 Documented, awaiting fix
**Priority**: HIGH - Core feature broken
**Effort**: LOW - Simple fix (Option 1)
**Owner**: Next session implementer

---

**Last Updated**: October 10, 2025
