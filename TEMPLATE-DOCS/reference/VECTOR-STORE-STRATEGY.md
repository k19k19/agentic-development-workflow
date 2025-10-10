# Vector Store Strategy - Long-Term Memory Management

## Current Problem

### Issue Identified
**Vector store indexes EVERYTHING in `app-docs/` and `ai-docs/`**

```javascript
// vectorize-docs.js line 6
const DOCS_DIRECTORIES = ['app-docs', 'ai-docs'];
```

### What This Means

**After 10 features:**
```
app-docs/specs/
├── round1-feature1.md
├── round2-feature2.md
├── round3-feature3.md
├── round4-feature4.md
├── round5-feature5.md
├── round6-feature6.md
├── round7-feature7.md
├── round8-feature8.md
├── round9-feature9.md
└── round10-feature10.md

ai-docs/builds/
├── 2025-10-01-feature1/build-report.md
├── 2025-10-02-feature2/build-report.md
├── 2025-10-03-feature3/build-report.md
... (10 build reports)
```

**Vector store contains:**
- All 10 feature specs (even if features are done)
- All 10 build reports (ephemeral artifacts)
- All plans, sessions, failures (noise)

**Problem:**
- Scout returns OLD, completed feature context
- New feature gets distracted by irrelevant past features
- Vector store grows indefinitely
- No way to "forget" completed work

---

## Root Cause Analysis

### 1. Mixing Ephemeral + Persistent Memory

**Current indexing:**
```
app-docs/      ← Persistent knowledge (should be indexed)
ai-docs/       ← Ephemeral artifacts (should NOT be indexed)
```

**Why indexing `ai-docs/` is wrong:**
- Build reports are one-time outputs
- Plans are specific to one feature implementation
- Sessions are workflow execution logs
- None of these are "long-term knowledge"

### 2. No Archive/Lifecycle Strategy

**Current:** Keep everything forever
**Problem:** No distinction between:
- Active features (working on now)
- Completed features (done, shipped)
- Historical features (archived for reference)

### 3. Vector Store Treats All Content Equally

**Current:** All chunks have equal weight
**Problem:** Can't prioritize:
- Current architecture over old specs
- Active patterns over deprecated ones
- Recent conventions over old ones

---

## Proposed Solution: Lifecycle-Based Strategy

### Principle
**"Vector store = Current project memory, not complete history"**

---

## Strategy 1: Stop Indexing `ai-docs/`

### Change
```javascript
// vectorize-docs.js
const DOCS_DIRECTORIES = ['app-docs'];  // Remove 'ai-docs'
```

**Rationale:**
- ai-docs/ is ephemeral workflow artifacts
- Plans/builds are for ONE feature, not general knowledge
- Scout should find patterns/architecture, not old build logs

**Benefits:**
- ✅ Cleaner search results
- ✅ Smaller vector store
- ✅ Faster vectorization
- ✅ No noise from old builds

---

## Strategy 2: Archive Completed Features

### Directory Structure

```
app-docs/
├── specs/
│   ├── active/          # Features being worked on
│   │   └── round5-new-feature.md
│   └── archive/         # Completed features
│       ├── round1-auth.md
│       ├── round2-payments.md
│       ├── round3-caching.md
│       └── round4-notifications.md
│
├── guides/              # Always indexed (current patterns)
├── architecture/        # Always indexed (current design)
├── debugging/           # Always indexed (current issues)
├── mappings/            # Always indexed (current code map)
└── operations/          # Always indexed (current runbooks)
```

### Vectorization Config

```javascript
// vectorize-docs.js
const DOCS_DIRECTORIES = ['app-docs'];
const EXCLUDED_PATHS = [
  'app-docs/specs/archive',    // Don't index archived specs
  'ai-docs',                   // Don't index ephemeral artifacts
];
```

### Workflow

**During development:**
```
app-docs/specs/active/round5-new-feature.md  ← Indexed, scout finds it
```

**After shipping:**
```bash
# Move to archive
mv app-docs/specs/active/round5-new-feature.md app-docs/specs/archive/

# Re-vectorize
npm run vectorize
```

**Result:**
- Scout no longer finds old feature
- Focus on current work
- History preserved but not indexed

---

## Strategy 3: Time-Based Cleanup

### Automatic Cleanup Script

**Create `scripts/cleanup-memory.js`:**

```javascript
// Clean up old specs/builds after N days
const ARCHIVE_AFTER_DAYS = 90;  // 3 months

async function cleanup() {
  const now = Date.now();
  const cutoff = now - (ARCHIVE_AFTER_DAYS * 24 * 60 * 60 * 1000);

  // Move old specs to archive
  const specs = await fs.readdir('app-docs/specs/active');
  for (const spec of specs) {
    const stats = await fs.stat(`app-docs/specs/active/${spec}`);
    if (stats.mtimeMs < cutoff) {
      await fs.rename(
        `app-docs/specs/active/${spec}`,
        `app-docs/specs/archive/${spec}`
      );
      console.log(`Archived: ${spec}`);
    }
  }

  // Delete old ai-docs artifacts (older than 30 days)
  const builds = await fs.readdir('ai-docs/builds');
  for (const build of builds) {
    const stats = await fs.stat(`ai-docs/builds/${build}`);
    if (stats.mtimeMs < (now - 30 * 24 * 60 * 60 * 1000)) {
      await fs.rm(`ai-docs/builds/${build}`, { recursive: true });
      console.log(`Deleted old build: ${build}`);
    }
  }

  console.log('Cleanup complete. Run `npm run vectorize` to update search.');
}
```

**Add to package.json:**
```json
"scripts": {
  "cleanup-memory": "node scripts/cleanup-memory.js"
}
```

**Usage:**
```bash
# Every sprint/month
npm run cleanup-memory
npm run vectorize
```

---

## Strategy 4: Metadata-Based Filtering

### Enhanced Vector Store Metadata

```javascript
// When vectorizing, add lifecycle metadata
vectorStore.push({
  id: `${relativePath}::${index}`,
  source: relativePath,
  lifecycle: determineLifecycle(relativePath),  // NEW
  lastModified: stats.mtime,                     // NEW
  docType,
  // ... rest
});

function determineLifecycle(filePath) {
  if (filePath.includes('/archive/')) return 'archived';
  if (filePath.includes('/specs/')) return 'active';
  if (filePath.includes('/guides/')) return 'evergreen';
  if (filePath.includes('/architecture/')) return 'evergreen';
  return 'unknown';
}
```

### Search with Lifecycle Filter

```javascript
// search-docs.js
// Boost active/evergreen, deprioritize archived
function calculateScore(similarity, metadata) {
  let score = similarity;
  if (metadata.lifecycle === 'archived') score *= 0.1;  // Heavy penalty
  if (metadata.lifecycle === 'evergreen') score *= 1.2; // Slight boost
  return score;
}
```

---

## Recommended Implementation

### Phase 1: Stop Indexing ai-docs/ (Immediate)

**Change:**
```javascript
// vectorize-docs.js
const DOCS_DIRECTORIES = ['app-docs'];  // Remove 'ai-docs'
```

**Result:**
- Vector store only contains persistent knowledge
- Scout finds patterns/architecture, not build logs

### Phase 2: Add Archive Directory (Next)

**Create:**
```bash
mkdir -p app-docs/specs/active
mkdir -p app-docs/specs/archive
mv app-docs/specs/*.md app-docs/specs/active/  # Move existing specs
```

**Update vectorize-docs.js:**
```javascript
const EXCLUDED_PATHS = ['app-docs/specs/archive'];

function shouldIndexFile(filePath) {
  // Existing checks...

  // Skip archived files
  for (const excluded of EXCLUDED_PATHS) {
    if (filePath.includes(excluded)) return false;
  }

  return true;
}
```

### Phase 3: Add Cleanup Script (Later)

**Create `scripts/cleanup-memory.js`** (as shown above)

**Add cron/reminder:**
```bash
# Every month
npm run cleanup-memory && npm run vectorize
```

---

## User Workflow (After Changes)

### Starting New Feature

```bash
# 1. Create spec for new feature
vim app-docs/specs/active/round6-notifications.md

# 2. Re-vectorize (picks up new spec)
npm run vectorize

# 3. Start workflow
/scout_plan_build "Add push notifications" "" "budget"
```

**Scout will find:**
- ✅ Current architecture
- ✅ Current patterns
- ✅ Active feature specs
- ❌ NOT old completed features
- ❌ NOT build reports

### After Shipping Feature

```bash
# 1. Move spec to archive
mv app-docs/specs/active/round6-notifications.md app-docs/specs/archive/

# 2. Re-vectorize (removes from search)
npm run vectorize
```

**Scout will no longer find this feature.**

### Monthly Cleanup

```bash
# Auto-archive old specs, delete old builds
npm run cleanup-memory

# Update vector store
npm run vectorize
```

---

## Benefits

### Before (Current Problem)
- Vector store has 100+ documents after 6 months
- Scout finds 10 old feature specs when searching for "authentication"
- Build reports pollute search results
- No way to focus on current work

### After (Proposed Solution)
- Vector store has 20-30 active documents
- Scout finds current architecture + active features only
- Build reports NOT indexed (ephemeral)
- Clean focus on current release cycle

---

## Migration Path

### For Existing Projects

```bash
# 1. Update vectorize-docs.js
# Remove 'ai-docs' from DOCS_DIRECTORIES

# 2. Create archive structure
mkdir -p app-docs/specs/active
mkdir -p app-docs/specs/archive

# 3. Decide what's active vs archived
mv app-docs/specs/old-feature-*.md app-docs/specs/archive/
mv app-docs/specs/current-feature-*.md app-docs/specs/active/

# 4. Re-vectorize
npm run vectorize

# 5. Test search
npm run search "authentication"
# Should only return current patterns, not old specs
```

---

## Open Questions

### Q1: Should we keep some "landmark" features indexed?

**Scenario:** OAuth implementation from Round 1 is reference architecture

**Options:**
- A. Move to archive (not searchable)
- B. Extract patterns to `app-docs/guides/oauth-pattern.md` (searchable)
- C. Add `app-docs/specs/reference/` directory (always indexed)

**Recommendation:** B (extract to guides)

### Q2: How often to cleanup?

**Options:**
- A. Manual (user runs when needed)
- B. Monthly cron job
- C. After each feature ships

**Recommendation:** A + reminder in GETTING-STARTED.md

### Q3: What about app-docs/debugging/?

**Problem:** Old bugs accumulate

**Solution:** Archive pattern:
```
app-docs/debugging/
├── current/
│   └── known-issues.md
└── resolved/
    └── 2025-Q1-bugs.md
```

---

## Conclusion

**Current:** Vector store = complete project history (overwhelming)
**Proposed:** Vector store = current project memory (focused)

**Key Changes:**
1. Stop indexing `ai-docs/` (ephemeral artifacts)
2. Add `app-docs/specs/active/` vs `/archive/` (lifecycle)
3. Add cleanup script (maintenance)

**Result:** Scout finds relevant context for NEW features, not old completed work.

---

**Next Steps:**
1. Approve this strategy
2. Implement Phase 1 (stop indexing ai-docs)
3. Test with real project
4. Add archive structure
5. Document in TEMPLATE-DOCS/workflow-guides/

**Should we proceed with Phase 1 implementation?**
