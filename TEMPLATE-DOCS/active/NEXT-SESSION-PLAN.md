# Next Session: End-to-End Template Test

**Date Planned**: Next session
**Purpose**: Validate template delivers on promises (low token usage, multi-agent, memory retention)

---

## 🎯 Test Objective

Use the template's own workflow to implement a real feature, measuring:
1. **Token efficiency** - Should achieve 90%+ efficiency vs manual approach
2. **Multi-agent coordination** - Scout → Plan → Build workflow
3. **Memory retention** - Vector search finds relevant context automatically
4. **Documentation accuracy** - Workflow matches documented behavior

---

## 📋 Test Task: Add Environment Detection

**Feature**: Auto-detect if running in template repo vs user project, then index appropriate docs

**File to modify**: `scripts/vectorize-docs.js`

**Implementation**:
```javascript
const isTemplateRepo = fs.existsSync(path.join(__dirname, '..', 'TEMPLATE-DOCS'));

const DOCS_DIRECTORIES = isTemplateRepo
  ? ['TEMPLATE-DOCS']  // Template dev: index design docs
  : [                   // User project: index their docs
      'app-docs/specs/active',
      'app-docs/specs/reference',
      'app-docs/guides',
      'app-docs/architecture',
      'app-docs/mappings',
      'app-docs/operations'
    ];
```

**Why This Tests Everything**:
- ✅ Scout must find `vectorize-docs.js` and related docs via vector search
- ✅ Plan must reference past session decisions (SESSION-HISTORY.md, TWO-VECTOR-STORES.md)
- ✅ Build must implement without duplicating existing code
- ✅ Multi-agent coordination across phases
- ✅ Token usage should be minimal (scout ~5K, plan ~30K, build ~40K = ~75K total)

---

## 🚀 Execution Steps (Next Session)

### Step 1: Run Scout Phase
```bash
/scout "Add environment detection to vectorize-docs.js"
```

**Expected**:
- Finds `scripts/vectorize-docs.js`
- Finds `TEMPLATE-DOCS/reference/TWO-VECTOR-STORES.md` (has implementation details)
- Finds `TEMPLATE-DOCS/active/SESSION-HISTORY.md` (context on why this is needed)
- **Token cost**: ~5K

### Step 2: Run Plan Phase
```bash
/plan "Add environment detection to vectorize-docs.js to auto-switch between TEMPLATE-DOCS and app-docs based on repo type" "" "[scout-results-path]"
```

**Expected**:
- References past session decisions from SESSION-HISTORY.md
- Proposes implementation matching TWO-VECTOR-STORES.md design
- Includes test plan (verify template indexes TEMPLATE-DOCS, user projects index app-docs)
- **Token cost**: ~30K

### Step 3: User Approval Gate
**CRITICAL TEST**: Does plan demonstrate memory of:
- ✅ Past session context (why this is needed)
- ✅ Existing code structure
- ✅ Design decisions from TWO-VECTOR-STORES.md

If plan requires reminders → **Template memory system failed**
If plan references past docs correctly → **Template memory system works**

### Step 4: Run Build Phase
```bash
/build "[plan-path]"
```

**Expected**:
- Implements environment detection
- Updates only necessary code
- No duplication, no placeholders
- Tests verify both modes work
- **Token cost**: ~40K

### Step 5: Run Report Phase
**Expected**:
- Auto-updates relevant docs
- Shows token usage metrics
- Validates 90%+ efficiency achieved

---

## 📊 Success Metrics

### Token Efficiency
- **Target**: <80K total tokens (scout + plan + build)
- **Baseline** (manual): ~150K tokens (no scout, reading full files)
- **Efficiency**: Should achieve >47% savings

### Memory Retention
- [ ] Scout finds TWO-VECTOR-STORES.md automatically
- [ ] Plan references SESSION-HISTORY.md context
- [ ] No need to manually specify relevant files
- [ ] AI doesn't ask "what is environment detection?" (context from docs)

### Multi-Agent Coordination
- [ ] Scout → Plan handoff includes file paths
- [ ] Plan → Build handoff includes design decisions
- [ ] Each phase uses appropriate tools (vector search, Task agents)
- [ ] No redundant searches or duplicate work

### Code Quality
- [ ] Implementation matches TWO-VECTOR-STORES.md design
- [ ] No placeholders or TODOs
- [ ] Tests verify both template and user modes
- [ ] Git diff shows only intended changes

---

## 🧪 Validation Tests

After build completes, run these tests:

### Test 1: Template Mode
```bash
# Should index TEMPLATE-DOCS
npm run vectorize
npm run search "session history"
# Should find: SESSION-HISTORY.md (from TEMPLATE-DOCS/active/)
```

### Test 2: User Project Mode (Simulation)
```bash
# Temporarily rename TEMPLATE-DOCS
mv TEMPLATE-DOCS TEMPLATE-DOCS.bak

# Should index app-docs
npm run vectorize
npm run search "session history"
# Should NOT find: SESSION-HISTORY.md (not in app-docs/)

# Restore
mv TEMPLATE-DOCS.bak TEMPLATE-DOCS
npm run vectorize
```

### Test 3: Vector Search Quality
```bash
npm run search "environment detection implementation"
# Should find: TWO-VECTOR-STORES.md, vectorize-docs.js
# Should rank implementation details higher than unrelated docs
```

---

## 📈 Expected Token Breakdown

| Phase | Token Budget | What It Does |
|-------|--------------|--------------|
| Scout | ~5K | Vector search finds 3-5 relevant files |
| Plan | ~30K | Reviews found files, proposes implementation |
| Build | ~40K | Implements, tests, validates |
| Report | ~5K | Updates docs, metrics |
| **Total** | **~80K** | **47% savings vs manual 150K** |

**Budget Mode** (if used): ~60K total (plan ~20K instead of 30K)

---

## 🎯 What This Proves

If this test succeeds:
1. ✅ **Template works as advertised** - Low token usage achieved
2. ✅ **Vector search is effective** - Finds context automatically
3. ✅ **Multi-agent coordination works** - Scout → Plan → Build seamless
4. ✅ **Memory system works** - AI remembers past sessions via vectorization
5. ✅ **Ready for production** - Can handle real development tasks efficiently

If this test fails:
- ❌ Identify which phase broke (scout/plan/build)
- ❌ Measure actual token usage vs budget
- ❌ Fix issues before declaring production-ready

---

## 🔄 Session Preparation

**Before starting next session, AI should**:
1. Run `npm run search "environment detection"` to load context
2. Run `npm run search "session history"` to understand past work
3. Read this file (NEXT-SESSION-PLAN.md) for test objectives
4. Begin with `/scout "Add environment detection to vectorize-docs.js"`

**DO NOT**:
- ❌ Skip scout phase and manually read files
- ❌ Implement without plan approval
- ❌ Ignore past session context from SESSION-HISTORY.md
- ❌ Use more than 80K tokens total

---

## 📝 Success Criteria Summary

**MUST ACHIEVE**:
- [x] Total tokens <80K (scout + plan + build)
- [x] Plan demonstrates memory of past sessions
- [x] Scout finds relevant files via vector search (no manual hints)
- [x] Build produces working implementation
- [x] Tests verify both template and user modes

**NICE TO HAVE**:
- [ ] Total tokens <60K (budget mode)
- [ ] Plan approval on first attempt (no revisions)
- [ ] Zero manual file specification needed

---

**Status**: Ready for next session
**Priority**: HIGH - Critical validation of template capabilities
**Estimated Duration**: 1 hour
**Expected Outcome**: Template proven production-ready OR issues identified for fixing

---

**Created**: October 10, 2025
**Test Type**: End-to-end validation
**Feature**: Environment detection for vectorize-docs.js
