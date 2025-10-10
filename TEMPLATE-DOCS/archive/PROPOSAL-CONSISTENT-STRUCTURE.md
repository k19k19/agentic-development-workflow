# Proposal: Consistent Active/Archive/Reference Structure

**Date**: October 10, 2025
**Status**: Proposed (awaiting approval)

---

## Current Problem

**Inconsistent organization:**

```
app-docs/specs/
├── active/          ✅ Lifecycle-based
├── archive/         ✅ Lifecycle-based
└── reference/       ✅ Lifecycle-based

TEMPLATE-DOCS/
└── workflow-guides/ ❌ Flat structure (no lifecycle)
    ├── budget-mode.md
    ├── WORKFLOW.md
    ├── COMMAND-MAPPING.md
    ├── CROSS-SESSION-GUIDE.md
    ├── implementation-guidelines.md
    ├── VECTOR-STORE-IMPLEMENTATION.md
    └── VECTOR-STORE-STRATEGY.md
```

**Issues:**
- User docs follow active/archive/reference pattern
- Template docs don't follow the same pattern
- Inconsistent mental model

---

## Proposed Structure

**Apply same pattern everywhere:**

```
TEMPLATE-DOCS/
├── active/                    # Current template development work
│   ├── SESSION-HISTORY.md     # Ongoing session notes
│   ├── CRITICAL-ISSUE-VECTOR-SEARCH.md
│   └── TWO-VECTOR-STORES.md
│
├── archive/                   # Completed/resolved template work
│   └── (empty for now)
│
├── reference/                 # Evergreen template guides
│   ├── GETTING-STARTED.md     # User onboarding
│   ├── QUICK-REFERENCE.md     # User cheat sheet
│   ├── budget-mode.md
│   ├── WORKFLOW.md
│   ├── COMMAND-MAPPING.md
│   ├── CROSS-SESSION-GUIDE.md
│   ├── implementation-guidelines.md
│   ├── VECTOR-STORE-IMPLEMENTATION.md
│   └── VECTOR-STORE-STRATEGY.md
│
└── START-HERE.md              # Entry point (stays at root)

app-docs/specs/
├── active/                    # User's current features
├── archive/                   # User's completed features
└── reference/                 # User's templates/examples
```

---

## Benefits

### 1. Consistent Mental Model
- **Same pattern everywhere**: active → archive → reference
- **Easier to understand**: "Where does this go? Is it active work or reference?"
- **Predictable**: Users and AI know the structure

### 2. Better Vector Store Management
- **Template vector store**: Index `TEMPLATE-DOCS/active/` + `reference/`
- **User vector store**: Index `app-docs/specs/active/` + `reference/`
- **Same logic**: Skip archive in both cases

### 3. Clearer Lifecycle Management

**Template development workflow:**
```bash
# Working on fixing scout issue
vim TEMPLATE-DOCS/active/CRITICAL-ISSUE-VECTOR-SEARCH.md

# After fixing
npm run manage-knowledge -- archive CRITICAL-ISSUE-VECTOR-SEARCH.md
# Moves to: TEMPLATE-DOCS/archive/CRITICAL-ISSUE-VECTOR-SEARCH.md
```

**User workflow:**
```bash
# Working on OAuth feature
vim app-docs/specs/active/round5-oauth.md

# After shipping
npm run manage-knowledge -- archive round5-oauth.md
# Moves to: app-docs/specs/archive/round5-oauth.md
```

**Same pattern!**

### 4. Search Quality

**Before** (current):
```bash
npm run search "workflow guide"
# Returns: All 7 workflow guides (always)
```

**After** (proposed):
```bash
npm run search "critical issue"
# Returns: Only ACTIVE critical issues
# Not archived/resolved ones
```

---

## Implementation Plan

### Step 1: Create New Structure

```bash
mkdir -p TEMPLATE-DOCS/active
mkdir -p TEMPLATE-DOCS/archive
mkdir -p TEMPLATE-DOCS/reference
```

### Step 2: Move Files

**Active template work** (current issues):
```bash
mv TEMPLATE-DOCS/SESSION-HISTORY.md → TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/CRITICAL-ISSUE-VECTOR-SEARCH.md → TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/TWO-VECTOR-STORES.md → TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/NEXT-SESSION-CHECKLIST.md → TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/SESSION-2025-10-10-SUMMARY.md → TEMPLATE-DOCS/active/
```

**Reference guides** (evergreen):
```bash
mv TEMPLATE-DOCS/workflow-guides/* → TEMPLATE-DOCS/reference/
rmdir TEMPLATE-DOCS/workflow-guides/
mv TEMPLATE-DOCS/GETTING-STARTED.md → TEMPLATE-DOCS/reference/
mv TEMPLATE-DOCS/QUICK-REFERENCE.md → TEMPLATE-DOCS/reference/
mv TEMPLATE-DOCS/MIGRATION-GUIDE.md → TEMPLATE-DOCS/reference/
```

**Keep at root**:
```bash
# TEMPLATE-DOCS/START-HERE.md stays at root (entry point)
```

### Step 3: Update Vector Store Config

```javascript
// scripts/vectorize-docs.js
const DOCS_DIRECTORIES = isTemplateRepo
  ? [
      'TEMPLATE-DOCS/active',      // Current template work
      'TEMPLATE-DOCS/reference',   // Evergreen guides
      // Skip TEMPLATE-DOCS/archive
    ]
  : [
      'app-docs/specs/active',
      'app-docs/specs/reference',
      'app-docs/guides',
      'app-docs/architecture',
      'app-docs/mappings',
      'app-docs/operations',
    ];
```

### Step 4: Update manage-knowledge.js

**Add template support:**

```javascript
// Support both app-docs and TEMPLATE-DOCS
const REPO_ROOT = path.join(__dirname, '..');
const isTemplateRepo = fs.existsSync(path.join(REPO_ROOT, 'TEMPLATE-DOCS'));

const SPECS_ROOT = isTemplateRepo
  ? path.join(REPO_ROOT, 'TEMPLATE-DOCS')
  : path.join(REPO_ROOT, 'app-docs', 'specs');

const ACTIVE_DIR = path.join(SPECS_ROOT, 'active');
const ARCHIVE_DIR = path.join(SPECS_ROOT, 'archive');
const REFERENCE_DIR = path.join(SPECS_ROOT, 'reference');
```

**Usage:**
```bash
# In template repo
npm run manage-knowledge -- archive CRITICAL-ISSUE-VECTOR-SEARCH.md
# Moves: TEMPLATE-DOCS/active/ → TEMPLATE-DOCS/archive/

# In user project
npm run manage-knowledge -- archive round5-oauth.md
# Moves: app-docs/specs/active/ → app-docs/specs/archive/
```

### Step 5: Update All Documentation Links

**Files to update:**
- `README.md` - Update all TEMPLATE-DOCS/workflow-guides/ → TEMPLATE-DOCS/reference/
- `START-HERE.md` - Update paths
- `NEXT-SESSION-CHECKLIST.md` - Update file locations
- All files in TEMPLATE-DOCS/active/ - Update cross-references

---

## File Mapping

### Current → Proposed

**Active work:**
```
TEMPLATE-DOCS/SESSION-HISTORY.md
→ TEMPLATE-DOCS/active/SESSION-HISTORY.md

TEMPLATE-DOCS/CRITICAL-ISSUE-VECTOR-SEARCH.md
→ TEMPLATE-DOCS/active/CRITICAL-ISSUE-VECTOR-SEARCH.md

TEMPLATE-DOCS/TWO-VECTOR-STORES.md
→ TEMPLATE-DOCS/active/TWO-VECTOR-STORES.md
```

**Reference guides:**
```
TEMPLATE-DOCS/workflow-guides/budget-mode.md
→ TEMPLATE-DOCS/reference/budget-mode.md

TEMPLATE-DOCS/workflow-guides/WORKFLOW.md
→ TEMPLATE-DOCS/reference/WORKFLOW.md

TEMPLATE-DOCS/GETTING-STARTED.md
→ TEMPLATE-DOCS/reference/GETTING-STARTED.md
```

---

## Comparison

### Before (Current)

```
TEMPLATE-DOCS/
├── START-HERE.md
├── SESSION-HISTORY.md              # Flat
├── CRITICAL-ISSUE-*.md             # Flat
├── GETTING-STARTED.md              # Flat
├── QUICK-REFERENCE.md              # Flat
└── workflow-guides/                # Nested, but no lifecycle
    ├── budget-mode.md
    └── WORKFLOW.md
```

**Mental model**: "Where does this file go? Is it a guide? Is it a session note?"

---

### After (Proposed)

```
TEMPLATE-DOCS/
├── START-HERE.md                   # Entry point
├── active/                         # Current work
│   ├── SESSION-HISTORY.md
│   ├── CRITICAL-ISSUE-VECTOR-SEARCH.md
│   └── TWO-VECTOR-STORES.md
├── archive/                        # Resolved issues
│   └── (files moved here after completion)
└── reference/                      # Evergreen guides
    ├── GETTING-STARTED.md
    ├── QUICK-REFERENCE.md
    ├── budget-mode.md
    ├── WORKFLOW.md
    └── COMMAND-MAPPING.md
```

**Mental model**: "Is it current work? → active/. Is it reference material? → reference/. Is it done? → archive/"

---

## Vector Store Impact

### Template Vector Store

**Current (after fixing)**:
```javascript
const DOCS_DIRECTORIES = ['TEMPLATE-DOCS'];
```
Indexes everything in TEMPLATE-DOCS (no discrimination)

**Proposed**:
```javascript
const DOCS_DIRECTORIES = [
  'TEMPLATE-DOCS/active',
  'TEMPLATE-DOCS/reference',
];
```
Only indexes active work + reference guides (skips archive)

**Search quality improvement:**
- ✅ Finds current issues (active)
- ✅ Finds evergreen guides (reference)
- ❌ Doesn't pollute with resolved issues (archive)

---

## Migration Script

```bash
#!/bin/bash
# migrate-template-structure.sh

echo "Creating new directory structure..."
mkdir -p TEMPLATE-DOCS/active
mkdir -p TEMPLATE-DOCS/archive
mkdir -p TEMPLATE-DOCS/reference

echo "Moving active work..."
mv TEMPLATE-DOCS/SESSION-HISTORY.md TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/CRITICAL-ISSUE-VECTOR-SEARCH.md TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/TWO-VECTOR-STORES.md TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/NEXT-SESSION-CHECKLIST.md TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/SESSION-2025-10-10-SUMMARY.md TEMPLATE-DOCS/active/
mv TEMPLATE-DOCS/PROPOSAL-CONSISTENT-STRUCTURE.md TEMPLATE-DOCS/active/

echo "Moving reference guides..."
mv TEMPLATE-DOCS/workflow-guides/* TEMPLATE-DOCS/reference/
rmdir TEMPLATE-DOCS/workflow-guides
mv TEMPLATE-DOCS/GETTING-STARTED.md TEMPLATE-DOCS/reference/
mv TEMPLATE-DOCS/QUICK-REFERENCE.md TEMPLATE-DOCS/reference/
mv TEMPLATE-DOCS/MIGRATION-GUIDE.md TEMPLATE-DOCS/reference/

echo "Updating vector store config..."
# (manual edit required)

echo "✅ Migration complete!"
echo "Next steps:"
echo "1. Update vectorize-docs.js (see TEMPLATE-DOCS/active/PROPOSAL-CONSISTENT-STRUCTURE.md)"
echo "2. Update manage-knowledge.js to support TEMPLATE-DOCS"
echo "3. Update README.md links"
echo "4. Run: npm run vectorize"
```

---

## Questions & Considerations

### Q1: Should START-HERE.md stay at root?

**Yes** - It's the entry point, should be easy to find.

**Alternative**: Move to active/ but less discoverable.

**Recommendation**: Keep at TEMPLATE-DOCS/START-HERE.md (root of template docs)

### Q2: What goes in archive/?

**Examples:**
- Resolved critical issues
- Completed feature implementation notes
- Old session summaries (after merging into main history)

**Not archived:**
- Reference guides (always relevant)
- Getting started guide (always needed)

### Q3: Does this affect init script?

**No** - Init script copies from template to user project:
- Copies `.claude/`, `scripts/`, `app-docs/`
- Does NOT copy `TEMPLATE-DOCS/` (template-only)

**No changes needed to init script.**

### Q4: Does manage-knowledge work for both?

**Needs enhancement** - Currently hardcoded to `app-docs/specs/`

**Proposed enhancement** (see Step 4 above):
- Auto-detect template vs user project
- Use `TEMPLATE-DOCS/` in template repo
- Use `app-docs/specs/` in user projects

---

## Success Criteria

After migration:
- [ ] `TEMPLATE-DOCS/active/`, `archive/`, `reference/` directories exist
- [ ] All files moved to correct locations
- [ ] `npm run vectorize` indexes active + reference only
- [ ] `npm run search "critical issue"` finds files in active/
- [ ] `npm run manage-knowledge -- archive [file]` works for template
- [ ] All README links updated
- [ ] No broken references

---

## Recommendation

**Approve and implement this proposal** because:

1. ✅ **Consistency**: Same pattern everywhere (active/archive/reference)
2. ✅ **Clarity**: Obvious where files belong
3. ✅ **Scalability**: As template grows, structure remains clear
4. ✅ **Vector store alignment**: Same indexing logic for template and user docs
5. ✅ **User mental model**: Users already understand active/archive from their specs

**Estimated effort**: 1-2 hours (migration + testing + doc updates)

**Risk**: Low (mostly moving files and updating paths)

---

**Status**: Awaiting approval
**Next steps**: If approved, run migration script and update configs
