# Two Vector Stores: Template vs User Project

**CRITICAL DISTINCTION**: Vector search serves TWO different purposes.

---

## The Two Use Cases

### 1. Template Development (THIS repository)
**Purpose**: Help AI remember template design decisions across sessions
**Location**: `/Users/williamchong/Development/budget-agentic-workflow/`
**Vector store**: `vector-store.json` (in template repo)

**What it indexes**:
- `TEMPLATE-DOCS/SESSION-HISTORY.md` - Past development work
- `TEMPLATE-DOCS/CRITICAL-ISSUE-*.md` - Known problems
- `TEMPLATE-DOCS/workflow-guides/` - Implementation guides

**Who uses it**: AI working on improving the TEMPLATE
**When used**: During template development sessions (like this one)
**Search queries**: "session history", "scout command", "template structure"

---

### 2. User Projects (After init script runs)
**Purpose**: Help AI find relevant code/specs in USER's project
**Location**: `/path/to/user-project/` (after copying template)
**Vector store**: `vector-store.json` (in user's repo)

**What it indexes**:
- `app-docs/specs/active/` - User's active feature specs
- `app-docs/specs/reference/` - User's reference docs
- `app-docs/guides/` - User's project patterns
- `app-docs/architecture/` - User's system design
- `app-docs/mappings/feature-to-source.md` - User's code map

**Who uses it**: AI working on USER's project features
**When used**: During `/scout` phase of user workflows
**Search queries**: "authentication pattern", "user service", "database schema"

---

## Current Problem: Only User Vector Store Exists

### What Works Now
✅ User projects can run:
```bash
npm run vectorize   # Builds vector store for their project
npm run search "auth"   # Finds their auth code
```

### What's Broken
❌ Template development has NO dedicated vector store strategy
❌ Template vector store indexes `app-docs/` (which should be empty)
❌ SESSION-HISTORY.md is NOT indexed (it's in TEMPLATE-DOCS/)

---

## Solution: Separate Vector Store Configs

### Template Vector Store (This Repo)

**File**: `scripts/vectorize-docs.js` (current)

Should index:
```javascript
const DOCS_DIRECTORIES = [
  'TEMPLATE-DOCS/workflow-guides',   // Implementation guides
  'TEMPLATE-DOCS',                    // SESSION-HISTORY.md, etc.
];
```

**NOT index**:
```javascript
// Don't index app-docs/ - it's for users, not template
// Don't index .claude/commands/ - those are already files
```

**Result**: `npm run vectorize` in template repo builds template knowledge base

---

### User Vector Store (After Init)

**File**: `scripts/vectorize-docs.js` (gets copied to user project)

Should index:
```javascript
const DOCS_DIRECTORIES = [
  'app-docs/specs/active',
  'app-docs/specs/reference',
  'app-docs/guides',
  'app-docs/architecture',
  'app-docs/mappings',
  'app-docs/operations',
];
```

**NOT index**:
```javascript
// Don't index TEMPLATE-DOCS/ - not copied to user projects
// Don't index ai-docs/ - ephemeral artifacts
```

**Result**: `npm run vectorize` in user project builds their project knowledge base

---

## Implementation Plan

### Step 1: Fix Template Vector Store (This Repo)

Update `scripts/vectorize-docs.js`:

```javascript
// Current (WRONG for template development)
const DOCS_DIRECTORIES = [
  'app-docs/specs/active',
  'app-docs/specs/reference',
  'app-docs/guides',
  'app-docs/architecture',
  'app-docs/mappings',
  'app-docs/operations',
];

// Should be (RIGHT for template development)
const DOCS_DIRECTORIES = [
  'TEMPLATE-DOCS',  // Includes SESSION-HISTORY.md, CRITICAL-ISSUE-*.md, etc.
];

// Exclude specific files if needed
const EXCLUDED_FILES = new Set([
  'GETTING-STARTED.md',  // User-facing, don't need for template dev
  'QUICK-REFERENCE.md',  // User-facing, don't need for template dev
]);
```

### Step 2: Create Separate User Config

**Option A**: Detect environment
```javascript
// scripts/vectorize-docs.js
const isTemplate = fs.existsSync('TEMPLATE-DOCS');

const DOCS_DIRECTORIES = isTemplate
  ? ['TEMPLATE-DOCS']  // Template development
  : [                   // User project
      'app-docs/specs/active',
      'app-docs/specs/reference',
      'app-docs/guides',
      'app-docs/architecture',
      'app-docs/mappings',
      'app-docs/operations',
    ];
```

**Option B**: Separate scripts (cleaner)
```bash
scripts/
├── vectorize-template.js   # For template development
└── vectorize-docs.js       # For user projects (gets copied)
```

Package.json in template:
```json
{
  "scripts": {
    "vectorize": "node scripts/vectorize-template.js",
    "vectorize:user": "node scripts/vectorize-docs.js"
  }
}
```

Package.json in user project (after init):
```json
{
  "scripts": {
    "vectorize": "node scripts/vectorize-docs.js"
  }
}
```

---

## Why This Matters

### For Template Development (Current Session)

**Before fix**:
```bash
npm run search "session history"
# Returns: nothing (SESSION-HISTORY.md not indexed)
```

**After fix**:
```bash
npm run search "session history"
# Returns: TEMPLATE-DOCS/SESSION-HISTORY.md with past decisions
```

---

### For User Projects

**Before fix** (current):
```bash
# User runs in their project
npm run vectorize
# Tries to index: app-docs/specs/active/ (exists)
# ✅ Works correctly
```

**After fix** (with detection):
```bash
# User runs in their project
npm run vectorize
# Detects: no TEMPLATE-DOCS/ directory
# Indexes: app-docs/ only
# ✅ Still works correctly
```

---

## Recommended Approach

**Option A (Environment Detection)** - RECOMMENDED

**Pros**:
- ✅ Single script, auto-detects context
- ✅ Works for both template dev and user projects
- ✅ No extra complexity

**Cons**:
- ⚠️ Slightly magical (not obvious from reading code)

**Implementation**:
```javascript
// scripts/vectorize-docs.js (line 5-14)
const isTemplateRepo = fs.existsSync(path.join(__dirname, '..', 'TEMPLATE-DOCS'));

const DOCS_DIRECTORIES = isTemplateRepo
  ? [
      // Template development mode
      'TEMPLATE-DOCS/workflow-guides',
      'TEMPLATE-DOCS',  // Includes SESSION-HISTORY.md, CRITICAL-ISSUE-*.md
    ]
  : [
      // User project mode
      'app-docs/specs/active',
      'app-docs/specs/reference',
      'app-docs/guides',
      'app-docs/architecture',
      'app-docs/mappings',
      'app-docs/operations',
    ];

// Also adjust excluded files
const EXCLUDED_FILES = isTemplateRepo
  ? new Set(['GETTING-STARTED.md', 'QUICK-REFERENCE.md'])  // Template: skip user-facing docs
  : new Set(['feature-to-source.md']);  // User: skip auto-generated
```

---

## Testing Plan

### Test Template Vector Store
```bash
# In template repo
npm run vectorize

# Verify indexes template docs
cat vector-store.json | jq -r '.[].source' | sort -u
# Should see:
# TEMPLATE-DOCS/SESSION-HISTORY.md
# TEMPLATE-DOCS/CRITICAL-ISSUE-VECTOR-SEARCH.md
# TEMPLATE-DOCS/workflow-guides/...

# Should NOT see:
# app-docs/... (empty in template)

# Test search
npm run search "critical issue"
# Should find: CRITICAL-ISSUE-VECTOR-SEARCH.md
```

### Test User Project Vector Store
```bash
# In user project (after init)
npm run vectorize

# Verify indexes user docs
cat vector-store.json | jq -r '.[].source' | sort -u
# Should see:
# app-docs/specs/active/...
# app-docs/guides/...
# app-docs/architecture/...

# Should NOT see:
# TEMPLATE-DOCS/... (not copied to user projects)

# Test search
npm run search "authentication"
# Should find user's auth specs/code
```

---

## Impact Summary

### For Template Development
- ✅ AI can find SESSION-HISTORY.md via search
- ✅ AI can find CRITICAL-ISSUE-*.md via search
- ✅ No more "I don't remember past sessions" problem

### For User Projects
- ✅ Still works exactly as designed
- ✅ Indexes only user's active project knowledge
- ✅ Archive/active distinction preserved

### For Workflows
- ⚠️ Still broken (scout parameter mismatch)
- ⚠️ Need to fix AFTER vector store config is correct
- ⚠️ See CRITICAL-ISSUE-VECTOR-SEARCH.md

---

## Init Script Considerations

### Current Behavior
**File**: `scripts/init-agentic-workflow.sh`

The init script copies files from template to user project:
```bash
cp -r .claude/ "$TARGET_DIR/"
cp -r scripts/ "$TARGET_DIR/"
cp -r app-docs/ "$TARGET_DIR/"
```

### Vector Store Handling

**Question**: Should init script copy template's `vector-store.json` to user project?

**Answer**: **NO** - Here's why:

1. **Template vector store contains**:
   - SESSION-HISTORY.md embeddings (template development)
   - CRITICAL-ISSUE-*.md embeddings (template development)
   - workflow-guides/ embeddings (already copied as files)

2. **User project needs**:
   - Empty vector store initially
   - User runs `npm run vectorize` after adding their first spec
   - Builds embeddings of THEIR docs, not template's

### Current Init Script - ✅ CORRECT

**Verified** (`scripts/init-agentic-workflow.sh:236-240`):
```bash
if [ ! -f "$PROJECT_ROOT/vector-store.json" ]; then
    echo '{"documents":[],"embeddings":[],"metadata":[]}' > "$PROJECT_ROOT/vector-store.json"
    log_success "Created empty vector-store.json"
else
    log_info "Preserved existing vector-store.json"
fi
```

**Result**: ✅ Creates empty vector-store.json, doesn't copy template's

**Gitignore** (`.gitignore:26-27`):
```
vector-store/
vector-store.json
```

**Result**: ✅ Vector store is gitignored (not committed)

### Recommended Approach

**Add to init script**:
```bash
# After copying files, initialize user's vector store
echo "Initializing vector store for your project..."
cd "$TARGET_DIR"
npm run vectorize

echo "✅ Vector store initialized with your project docs"
echo "   Run 'npm run vectorize' after adding new docs to update it"
```

**Add to .gitignore** (if not already there):
```
# Vector store (user-specific, rebuild on each machine)
vector-store.json
```

**Why**:
- Each user/machine should build their own vector store
- Embeddings depend on local transformers.js model
- File paths might be different (absolute vs relative)
- Vector store can be large (don't commit to git)

---

## Next Steps

1. **Check init script** (verify it doesn't copy vector-store.json)
2. **Fix template vector store config**
   - Add environment detection to `vectorize-docs.js`
   - Test template mode indexes TEMPLATE-DOCS/
   - Test user mode still works
3. **Update init script** (if needed)
   - Skip copying vector-store.json
   - Add .gitignore entry
   - Run `npm run vectorize` at end of init
4. **Then fix scout integration**
   - Remove scale parameter from workflows
   - Verify scout calls `npm run search`
   - Test end-to-end workflow
5. **Document for users**
   - Update QUICK-REFERENCE.md with vector search best practices
   - Add examples of good search queries
   - Explain when to vectorize

---

**Key Insight**: Vector search is a TOOL that serves TWO MASTERS:
1. Template developers (us) - finding design decisions
2. Project developers (users) - finding their code/specs

**Current state**: Only serves #2, doesn't serve #1
**Goal**: Serve both with environment detection

---

**Last Updated**: October 10, 2025
**Status**: Documented, awaiting implementation
**Priority**: HIGH - Needed before fixing scout integration
