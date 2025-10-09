# Command Mapping to WORKFLOW.md

**Version**: 2.0 | **Last Updated**: October 2025

This document maps slash commands to the workflow phases defined in [WORKFLOW.md](WORKFLOW.md), with clear separation between USER commands and AI-INTERNAL commands.

---

## 🎯 Command Categories

### USER COMMANDS (What You Run)

These are the commands YOU type in Claude Code to drive the workflow.

| User Command | WORKFLOW.md Phase | Budget Mode | Purpose |
|--------------|-------------------|-------------|---------|
| `/start "[feature-id]"` | **Step 0: Init** | ✅ Free | Initialize clean environment for new feature |
| `/scout "[task]"` | **Step 1: Discovery** | ✅ Gemini | Multi-agent parallel file discovery |
| `/plan "[task]" "[docs]"` | **Step 2: Strategy** | ⚠️ Claude | Create implementation plan with complexity check |
| `/build "[plan-path]"` | **Step 3: Build** | 🔄 Hybrid | Implement code with continuous vetting |
| `/test` | **Step 4: Internal V&V** | ✅ Free | Run hermetic unit/integration tests |
| `/deploy_staging` | **Step 5: Staging** | ✅ Free | Deploy to staging environment |
| `/uat` | **Step 6: UAT** | ✅ Free | Run user acceptance tests |
| `/finalize "[feature-id]"` | **Step 7: Finalize** | ⚠️ Claude | Generate documentation and update trackers |
| `/release` | **Step 8: Publication** | ✅ Free | Deploy to production |
| `/next` | **Step 9: Loop** | ✅ Free | Select next feature from roadmap |
| `/hotfix "[bug-id]"` | **Auxiliary: Hotfix** | 🔄 Hybrid | Triage and fix production bug |

### AI-INTERNAL COMMANDS (What Claude Runs)

These commands are triggered automatically by Claude during workflow execution. You don't run these manually.

| AI Command | Triggered By | Purpose |
|------------|--------------|---------|
| `/verify_scout` | After `/scout` | **Step 1.5: Verification** - Self-assess information quality |
| `/pause_feature` | During `/plan` | **Step 2 Decision** - Pause if complexity > threshold |
| `/wait_for_review` | After `/build` | **Step 3.5: Review Gate** - Generate critique, wait for approval |
| `/report_failure` | Test failure | **Auxiliary: Learning** - Document failure for next iteration |
| `/restart_feature "[id]"` | After failure | **Auxiliary: Learning** - Jump back to Step 1 with lessons |
| `/triage_bug` | After `/hotfix` | **Auxiliary: Hotfix** - Analyze bug root cause |

### BUDGET-OPTIMIZED SHORTCUTS

These are convenience commands that chain multiple phases with budget optimization.

| Shortcut Command | Executes | Budget Impact | When to Use |
|------------------|----------|---------------|-------------|
| `/quick "[task]"` | Direct Codex → Test | ~5K tokens | **Small projects** (<10 files, simple changes) |
| `/scout_build "[task]"` | Scout → Build → Test | ~30K tokens | **Medium projects** (10-50 files, known patterns) |
| `/full "[task]" "[docs]"` | Scout → Plan → **[APPROVAL]** → Build → Test → Finalize | ~90K tokens | **Large projects** (>50 files, complex features) |

---

## 📋 Detailed Command Reference

### USER COMMAND: `/start`

**Format**: `/start "[feature-id]"`

**Maps to**: WORKFLOW.md Step 0 - Init/Hermeticism

**What it does**:
1. Clears Claude's context window
2. Loads feature details from `app-docs/specs/[feature-id].md`
3. Initializes clean, containerized environment
4. Creates session log in `ai-docs/sessions/[feature-id]/`

**Budget**: FREE (no AI calls)

**Example**:
```bash
/start "FEAT-001-oauth2"
```

**Output**:
```
✅ Environment initialized for FEAT-001-oauth2
📄 Loaded spec: app-docs/specs/FEAT-001-oauth2.md
📂 Session log: ai-docs/sessions/FEAT-001-oauth2/
🎯 Next: Run /scout to discover relevant files
```

---

### USER COMMAND: `/scout`

**Format**: `/scout "[task]" "[scale]"`

**Maps to**: WORKFLOW.md Step 1 - Discovery

**What it does**:
1. Spawns parallel agents (Gemini, Codex, Claude) based on scale
2. Each agent searches for relevant files using different strategies
3. Prioritizes reading FAILURE_REPORT and BUG_REPORT if they exist
4. Aggregates results into `ai-docs/scout-results/[timestamp]/files-collection.txt`
5. Automatically triggers `/verify_scout` for quality check

**Budget**:
- Scale 2: ~5K tokens (Gemini-heavy)
- Scale 4: ~10K tokens (Gemini + Codex)

**Parameters**:
- `task`: What to search for (e.g., "authentication files")
- `scale`: Number of parallel agents (2, 4, 6) - default: 4

**Example**:
```bash
/scout "Find all API rate limiting code" "4"
```

**Output**:
```
🔍 Scouting with 4 parallel agents...
✅ Agent 1 (Gemini): Found 8 files
✅ Agent 2 (Codex): Found 5 files
✅ Agent 3 (Gemini): Found 12 files
✅ Agent 4 (Claude): Found 3 files

📊 Verification: Confidence 85% (PASS)
📂 Results: ai-docs/scout-results/20251009-143022/files-collection.txt
🎯 Next: Run /plan to create implementation strategy
```

---

### AI-INTERNAL: `/verify_scout`

**Triggered by**: Automatic after `/scout` completes

**Maps to**: WORKFLOW.md Step 1.5 - Verification Gate

**What it does**:
1. Analyzes scout results for completeness
2. Calculates confidence score (0-100%)
3. Identifies unanswered questions
4. If confidence < 70%: Triggers targeted re-scout
5. Generates `SCOUTING_VERDICT.md`

**Budget**: ~2K tokens (Gemini)

**You don't run this** - Claude runs it automatically.

**Output** (you see this in chat):
```
📋 Scout Verification:
- Confidence Score: 85%
- Files Found: 28
- Unanswered Questions: 2
  1. "Where is rate limit storage configured?"
  2. "Which middleware handles rate limit errors?"

✅ PASS - Proceeding to plan phase
```

---

### USER COMMAND: `/plan`

**Format**: `/plan "[task]" "[docs]"`

**Maps to**: WORKFLOW.md Step 2 - Strategy

**What it does**:
1. **Complexity Check**: Assesses difficulty (Low/Medium/High)
2. If complexity > threshold: Executes `/pause_feature` and suggests breaking down task
3. If complexity OK: Generates detailed implementation plan
4. Reads latest scout results automatically
5. Incorporates external documentation URLs
6. **WAITS FOR YOUR APPROVAL** before saving plan
7. Saves approved plan to `specs/[timestamp]-[task].md`

**Budget**:
- Low complexity: ~15K tokens (Gemini drafts, Claude reviews)
- Medium complexity: ~30K tokens (Claude primary)
- High complexity: ~50K tokens (Claude + external docs)

**Parameters**:
- `task`: Feature description
- `docs`: External documentation URLs (comma-separated, or empty "")

**Example**:
```bash
/plan "Add Redis-based rate limiting to all API routes" "https://redis.io/docs/manual/patterns/rate-limiter/"
```

**Output**:
```
🔍 Complexity Assessment: MEDIUM
📚 Reading external docs...
📝 Generating implementation plan...

═══════════════════════════════════════
📋 IMPLEMENTATION PLAN

## Overview
Add Redis-based rate limiting middleware to protect API endpoints from abuse.

## Complexity: MEDIUM
- Estimated Time: 4-6 hours
- Files to Modify: 8
- New Files: 3
- Risk Level: Medium (requires Redis dependency)

## Tasks
1. Install redis package and configure connection
2. Create rate-limiter middleware (app/middleware/rate-limiter.js)
3. Add rate limit config (app/config/rate-limits.js)
4. Apply middleware to API routes
5. Add rate limit headers to responses
6. Create unit tests (app/middleware/rate-limiter.test.js)
7. Add integration tests
8. Update API documentation

## Files to Modify
- app/server.js (add middleware)
- app/routes/api.js (apply rate limiting)
- package.json (add redis dependency)
... [8 files total]

## New Files
- app/middleware/rate-limiter.js
- app/config/rate-limits.js
- app/middleware/rate-limiter.test.js

## Risks & Mitigations
⚠️ Risk: Redis connection failure
   ✅ Mitigation: Graceful degradation (allow requests if Redis down)

⚠️ Risk: Rate limit bypass via IP spoofing
   ✅ Mitigation: Use X-Forwarded-For with validation

## Token Estimate
- Build Phase: ~40K tokens (hybrid delegation)
- Test Phase: ~5K tokens
- Total: ~45K tokens

═══════════════════════════════════════

⚠️ **APPROVAL REQUIRED**
Do you approve this plan? (yes/no/revise)
```

**You respond**: `yes`

**Claude continues**:
```
✅ Plan approved and saved
📂 Location: specs/20251009-143022-rate-limiting.md
🎯 Next: Run /build "specs/20251009-143022-rate-limiting.md"
```

---

### AI-INTERNAL: `/pause_feature`

**Triggered by**: During `/plan` if complexity > threshold

**Maps to**: WORKFLOW.md Step 2 Decision - Pause

**What it does**:
1. Commits current work
2. Marks feature as "Paused" in session log
3. Suggests breaking down into smaller tasks
4. Switches context via `/next`

**Budget**: FREE (no AI calls)

**Example output**:
```
⚠️ COMPLEXITY THRESHOLD EXCEEDED

This task is too complex to implement safely in one pass.

Suggested breakdown:
1. FEAT-001a: Redis connection setup (Low complexity)
2. FEAT-001b: Basic rate limiter middleware (Medium complexity)
3. FEAT-001c: Advanced features (IP validation, custom limits) (Medium complexity)

📂 Current work saved to: ai-docs/sessions/FEAT-001/paused.md
🎯 Recommend: Run /start "FEAT-001a" to begin with simpler subtask
```

---

### USER COMMAND: `/build`

**Format**: `/build "[plan-path]"`

**Maps to**: WORKFLOW.md Step 3 - Build

**What it does**:
1. Reads implementation plan
2. Breaks down into atomic tasks
3. Implements each task using optimal tool:
   - **Codex MCP**: Boilerplate, configs, CRUD, UI components
   - **Gemini MCP**: Reading docs, simple transforms
   - **Claude**: Complex logic, multi-file refactoring, architecture
4. **Continuous Vetting**: Runs linting/tests after EVERY commit
5. If checks fail: Self-initiates debugging loop
6. Automatically triggers `/wait_for_review` at end
7. Saves build log to `ai-docs/builds/[timestamp]/build-log.md`

**Budget**:
- Small tasks: ~20K tokens (Codex-heavy)
- Medium tasks: ~40K tokens (hybrid)
- Large tasks: ~60K tokens (Claude-heavy for complex parts)

**Example**:
```bash
/build "specs/20251009-143022-rate-limiting.md"
```

**Output**:
```
📖 Reading plan: specs/20251009-143022-rate-limiting.md
🎯 8 tasks identified

═══════════════════════════════════════
Task 1/8: Install redis package
Tool: Codex MCP (simple dependency)
═══════════════════════════════════════
✅ Added redis@4.6.0 to package.json
✅ npm install completed
✅ Linting: PASS
✅ Committed: "feat: Add redis dependency"

═══════════════════════════════════════
Task 2/8: Create rate-limiter middleware
Tool: Claude (complex logic with error handling)
═══════════════════════════════════════
📝 Creating app/middleware/rate-limiter.js...
✅ Implemented Redis-based token bucket algorithm
✅ Added graceful degradation for Redis failures
✅ Linting: PASS
✅ Tests: PASS (3/3)
✅ Committed: "feat: Add rate limiter middleware with Redis"

... [continues for all 8 tasks]

═══════════════════════════════════════
✅ ALL TASKS COMPLETED
═══════════════════════════════════════

📊 Summary:
- Tasks: 8/8 completed
- Files Modified: 8
- Files Created: 3
- Tests: 15/15 passing
- Linting: ✅ PASS
- Build: ✅ PASS

💰 Token Usage:
- Codex: 15K tokens (boilerplate, tests)
- Claude: 22K tokens (middleware logic)
- Gemini: 3K tokens (doc reading)
- Total: 40K tokens

📂 Build log: ai-docs/builds/20251009-143022/build-log.md

🎯 Next: Triggering code review...
```

---

### AI-INTERNAL: `/wait_for_review`

**Triggered by**: Automatic after `/build` completes

**Maps to**: WORKFLOW.md Step 3.5 - Review Gate

**What it does**:
1. Analyzes code for complexity, adherence to standards, risks
2. Generates **Code Critique Summary**
3. **PAUSES** and waits for your review

**Budget**: ~5K tokens (Claude)

**Example output**:
```
═══════════════════════════════════════
📋 CODE CRITIQUE SUMMARY
═══════════════════════════════════════

## Complexity Analysis
✅ Functions: Average 15 lines (target: <30)
✅ Cyclomatic Complexity: Average 3 (target: <10)
⚠️ app/middleware/rate-limiter.js: One function at 45 lines (consider splitting)

## Standards Adherence
✅ ESLint: All rules passed
✅ Code formatting: Consistent
✅ Error handling: Proper try-catch blocks
✅ Logging: Appropriate log levels

## Risk Assessment
🟢 Low Risk: Well-tested, follows established patterns
⚠️ Medium Risk: New Redis dependency (ensure proper monitoring)

## Recommendations
1. Consider splitting getRateLimitKey() into smaller helpers
2. Add Redis connection health check to /health endpoint
3. Monitor Redis memory usage in production

═══════════════════════════════════════
⚠️ **HUMAN REVIEW REQUIRED**

Please review:
1. Code changes: git diff
2. Test coverage: cat ai-docs/builds/20251009-143022/test-output.txt
3. Above critique

Approve to merge? (yes/no/revise)
```

**You respond**: `yes`

**Claude continues**:
```
✅ Review approved
🎯 Next: Run /test to validate in hermetic environment
```

---

### USER COMMAND: `/test`

**Format**: `/test`

**Maps to**: WORKFLOW.md Step 4 - Internal V&V

**What it does**:
1. Runs hermetic unit tests in isolated environment
2. Runs integration tests with mock data
3. If failures detected: Triggers `/report_failure` and learning loop
4. Saves test output to `ai-docs/builds/[latest]/test-output.txt`

**Budget**: FREE (just running tests)

**Example**:
```bash
/test
```

**Output**:
```
🧪 Running hermetic tests in isolated environment...

Unit Tests:
✅ rate-limiter.test.js (3/3)
✅ redis-client.test.js (2/2)
✅ api-routes.test.js (10/10)

Integration Tests:
✅ rate-limiting-integration.test.js (5/5)

═══════════════════════════════════════
✅ ALL TESTS PASSED (20/20)
═══════════════════════════════════════

Coverage: 94%
Build: ✅ PASS

📂 Test output: ai-docs/builds/20251009-143022/test-output.txt
🎯 Next: Run /deploy_staging to deploy to staging environment
```

**If tests fail**:
```
❌ TESTS FAILED (18/20 passing)

Failed tests:
❌ rate-limiter.test.js: "should handle Redis connection failure"
❌ rate-limiter.test.js: "should reset counter after time window"

🔄 Triggering learning loop...
📋 Generating FAILURE_REPORT.md...
🎯 Restarting from /scout phase with failure context...
```

---

### AI-INTERNAL: `/report_failure`

**Triggered by**: Test failure in `/test` phase

**Maps to**: WORKFLOW.md Auxiliary - Failure and Learning Loop

**What it does**:
1. Analyzes test failure root cause
2. Generates structured `FAILURE_REPORT.md`
3. Documents what went wrong and why
4. Automatically triggers `/restart_feature`

**Budget**: ~5K tokens (Claude)

**Example output**:
```
📋 Generating failure report...

═══════════════════════════════════════
FAILURE REPORT
═══════════════════════════════════════

## Failure Summary
2/20 tests failed during hermetic testing phase

## Root Cause
Rate limiter middleware does not properly handle Redis connection failures.
Mock Redis client in tests does not simulate connection errors correctly.

## Failed Tests
1. rate-limiter.test.js: "should handle Redis connection failure"
   - Expected: Request allowed (degraded mode)
   - Actual: 500 Internal Server Error

2. rate-limiter.test.js: "should reset counter after time window"
   - Expected: Counter resets after 60s
   - Actual: Counter persists indefinitely

## Analysis
The graceful degradation code exists but is not triggered because
Redis client throws synchronously, not via Promise rejection.

## Lessons Learned
- Redis client error handling requires both sync and async error catches
- Mock setup needs to match production Redis client error behavior
- Integration tests needed alongside unit tests

## Next Steps
1. Restart from /scout to find existing error handling patterns
2. Update implementation plan with better error handling strategy
3. Implement fix with proper sync/async error handling
4. Add integration test with real Redis container

═══════════════════════════════════════

📂 Saved: ai-docs/failures/20251009-143022-rate-limiting.md
🎯 Triggering /restart_feature...
```

---

### AI-INTERNAL: `/restart_feature`

**Triggered by**: After `/report_failure`

**Maps to**: WORKFLOW.md Auxiliary - Restart Feature

**What it does**:
1. Jumps back to Step 1 (/scout)
2. **Prioritizes** reading FAILURE_REPORT.md for context
3. Incorporates lessons learned into next planning cycle

**Budget**: Restarts full cycle (varies by project size)

**Example output**:
```
🔄 Restarting feature with failure context...

📖 Reading FAILURE_REPORT.md...
✅ Lessons learned incorporated

🔍 Re-running /scout with focus on error handling patterns...
[Scout phase begins again, but smarter this time]
```

---

### USER COMMAND: `/hotfix`

**Format**: `/hotfix "[bug-id]"`

**Maps to**: WORKFLOW.md Auxiliary - Hotfix and Bug Triage

**What it does**:
1. Pulls external bug report data (if integrated with issue tracker)
2. Creates internal `BUG_REPORT_[ID].md`
3. Triggers `/triage_bug` for focused analysis
4. Jumps to /plan or /build phase with high priority
5. Finalizes by updating external bug ticket

**Budget**: ~30K tokens (targeted, skips broad scout)

**Example**:
```bash
/hotfix "BUG-456"
```

**Output**:
```
🐛 Ingesting bug report BUG-456...
✅ Created: app-docs/debugging/BUG_REPORT_456.md

═══════════════════════════════════════
BUG REPORT: Users getting 429 errors incorrectly
═══════════════════════════════════════

Reporter: customer-support
Priority: P1 (High)
Affected: Production API
Description: Legitimate users hitting rate limits after only 3 requests

🔍 Triggering /triage_bug...
```

---

### AI-INTERNAL: `/triage_bug`

**Triggered by**: After `/hotfix` ingests bug

**Maps to**: WORKFLOW.md Auxiliary - Triage Bug

**What it does**:
1. Highly focused analysis to pinpoint bug location
2. Proposes fix strategy
3. Skips broad scout, jumps directly to /plan or /build

**Budget**: ~8K tokens (Gemini + Claude targeted search)

**Example output**:
```
🔍 Triaging bug...

Root Cause Analysis:
📍 File: app/middleware/rate-limiter.js:23
🐛 Issue: Rate limit key uses sessionId instead of userId
       This causes separate sessions from same user to share limits

Proposed Fix:
✅ Change key from `session:${sessionId}` to `user:${userId}`
✅ Add fallback to IP address if user not authenticated
✅ Update tests

Severity: HIGH (affects user experience)
Complexity: LOW (1-line fix + tests)

🎯 Skipping to /build phase (simple fix)...
```

---

### SHORTCUT: `/quick`

**Format**: `/quick "[task]"`

**Executes**: Direct Codex implementation → Test

**Maps to**: Small project workflow (bypasses scout/plan)

**Budget**: ~5K tokens

**When to use**:
- Simple, single-file changes
- Well-understood patterns
- Small projects (<10 files)

**Example**:
```bash
/quick "Add /health endpoint that returns { status: 'ok' }"
```

**Output**:
```
🚀 Quick mode: Using Codex MCP directly...

✅ Created: app/routes/health.js
✅ Updated: app/server.js (registered route)
✅ Created: app/routes/health.test.js

🧪 Running tests...
✅ Tests: 3/3 passing

📊 Token usage: 4.2K tokens
🎯 Done! Try: curl http://localhost:3000/health
```

---

### SHORTCUT: `/scout_build`

**Format**: `/scout_build "[task]"`

**Executes**: Scout → Build → Test (skips plan/approval)

**Maps to**: Medium project workflow

**Budget**: ~30K tokens

**When to use**:
- Known patterns exist
- Task well-understood
- Medium projects (10-50 files)

**Example**:
```bash
/scout_build "Add logging to all API endpoints"
```

**Output**:
```
🔍 Scouting... (2 agents, budget mode)
✅ Found 15 API endpoint files

⚠️ Skipping approval gate (budget mode)
🏗️ Building... (using existing logging patterns)
✅ 15 files updated
✅ Tests: 28/28 passing

📊 Token usage: 28K tokens
```

---

### SHORTCUT: `/full`

**Format**: `/full "[task]" "[docs]"`

**Executes**: Scout → Plan → **[APPROVAL]** → Build → Test → Finalize

**Maps to**: Large project full workflow

**Budget**: ~90K tokens

**When to use**:
- Complex, unfamiliar features
- Architectural changes
- Large projects (>50 files)

**Example**:
```bash
/full "Implement OAuth2 authentication" "https://oauth.net/2/"
```

**Output**:
```
🔍 Scout phase... (4 agents)
✅ Found 42 relevant files

📋 Plan phase... (reading external docs)
✅ Implementation plan generated

⚠️ **APPROVAL GATE**
[Shows detailed plan]
Proceed? (yes/no)
```

**You respond**: `yes`

```
🏗️ Build phase... (hybrid delegation)
✅ 23 tasks completed

🧪 Test phase...
✅ All tests passing

📝 Finalize phase...
✅ Documentation updated

📊 Total: 87K tokens
```

---

## 🎯 Quick Reference: When to Use Which Command

### Start New Feature
1. `/start "FEAT-ID"` - Always start here
2. Choose your workflow:

**Simple change** (1-2 files):
→ `/quick "task"`

**Medium task** (known pattern):
→ `/scout_build "task"`

**Complex/new feature**:
→ `/full "task" "docs"`

### Continue Across Sessions

**Session 1**: Scout & Plan
```bash
/start "FEAT-123"
/scout "task"
/plan "task" "docs"
# Review plan, then exit
```

**Session 2**: Build
```bash
# Claude auto-loads session context
/build "specs/20251009-feat-123.md"
# Review code, then exit
```

**Session 3**: Test & Deploy
```bash
/test
/deploy_staging
/uat
# If all pass:
/release
```

### Fix Production Bug
```bash
/hotfix "BUG-456"
# Claude triages, proposes fix
# Review and approve
# Auto-closes ticket when done
```

---

## 💰 Budget Optimization Guide

### Free-Tier Maximization

**Gemini (Free)**: 60 requests/min
- Use for: Scout, doc reading, summaries
- Commands: `/scout`, `/verify_scout`

**Codex (Free with ChatGPT)**: Generous limits
- Use for: Boilerplate, UI, configs
- Commands: `/quick`, most of `/build`

**Claude ($20/month)**: ~5M tokens
- Use ONLY for: Plans, complex logic, architecture
- Commands: `/plan`, complex parts of `/build`

### Estimated Monthly Budget

Assuming 20 workdays, 4 tasks/day:

**Scenario: Mix of small/medium/large tasks**
- 40 small (`/quick`): 40 × 5K = 200K tokens
- 30 medium (`/scout_build`): 30 × 30K = 900K tokens
- 10 large (`/full`): 10 × 90K = 900K tokens
- **Total**: ~2M tokens/month

**Leaves 3M tokens buffer** for:
- Failed builds requiring restarts
- Complex debugging sessions
- Ad-hoc questions/refactoring

### Token Saving Tips

1. **Always start with smallest workflow**:
   - Try `/quick` first
   - Escalate to `/scout_build` if needed
   - Only use `/full` for truly complex tasks

2. **Reuse artifacts**:
   - Don't re-scout if you have recent results
   - Reference existing plans when building similar features

3. **Use budget mode** for shortcuts:
   - `/scout_build` uses scale=2 (fewer agents)
   - Skips approval gates (use with caution)

4. **Cross-session work**:
   - Break large tasks across sessions
   - Context is saved, no token cost to resume

---

## 📚 Related Documents

- [WORKFLOW.md](WORKFLOW.md) - Complete workflow specification
- [BUDGET-MODE.md](budget-mode.md) - Detailed budget optimization
- [CROSS-SESSION-GUIDE.md](CROSS-SESSION-GUIDE.md) - Working across sessions

---

**Last Updated**: October 2025
**Template Version**: 2.0
