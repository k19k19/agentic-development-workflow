# Cross-Session Workflow Guide

**Working with Small Context Windows**

**Version**: 2.0 | **Last Updated**: October 2025

---

## 🎯 Why Cross-Session Work Matters

With a $20 Claude Code plan, you're working within:
- **Context window limits**: Can't load entire large projects at once
- **Token budget constraints**: Need to spread work strategically
- **Mental bandwidth**: Breaking work into sessions aids focus and review

**This guide shows you how to work effectively across multiple Claude Code sessions.**

---

## 📊 Understanding Session State

### What Persists Between Sessions

✅ **Saved automatically**:
- Scout results in `ai-docs/scout-results/[timestamp]/`
- Implementation plans in `specs/[timestamp]-[feature].md`
- Build logs in `ai-docs/builds/[timestamp]/`
- Test outputs in `ai-docs/builds/[timestamp]/test-output.txt`
- Failure reports in `ai-docs/failures/[timestamp]-[feature].md`
- Session logs in `ai-docs/sessions/[feature-id]/`

❌ **Does NOT persist**:
- Claude's current context window (resets on exit)
- In-progress conversations (cleared)
- Uncommitted code changes (unless you commit before exiting)

### How Claude Resumes Context

When you start a new session, Claude can:
1. **Read saved artifacts** from previous session (FREE - just file reads)
2. **Load session logs** that track feature progress
3. **Continue from any workflow phase** without re-scouting

**Token cost to resume**: Near-zero (just reading a few markdown files)

---

## 🚀 Cross-Session Workflow Patterns

### Pattern 1: Scout → Review → Build

**Best for**: Medium to large tasks that benefit from human review

#### Session 1: Scout & Plan (20-30 min)

```bash
# Start feature
/start "FEAT-123-oauth2"

# Multi-agent scout
/scout "OAuth2 authentication files" "4"
# Saves to: ai-docs/scout-results/20251009-143022/

# Generate plan
/plan "Implement OAuth2" "https://oauth.net/2/"
# Saves to: specs/20251009-143022-oauth2.md

# Exit Claude Code
exit
```

**Tokens used**: ~45K (scout 10K + plan 35K)

#### Between Sessions: Human Review (30-60 min)

```bash
# Review scout results
cat ai-docs/scout-results/20251009-143022/files-collection.txt

# Review implementation plan
cat specs/20251009-143022-oauth2.md

# Think through approach
# Identify any concerns
# Prepare questions or adjustments
```

**Tokens used**: 0 (offline review)

#### Session 2: Build (30-45 min)

```bash
# Start Claude Code
claude-code

# Claude auto-detects session context from /start
# or you can explicitly load:
/build "specs/20251009-143022-oauth2.md"

# Build executes with hybrid tool delegation
# Saves to: ai-docs/builds/20251009-143022/

# Exit when build completes
exit
```

**Tokens used**: ~50K (hybrid build)

#### Session 3: Test & Deploy (15-20 min)

```bash
# Start Claude Code
claude-code

# Run tests (reads build log automatically)
/test

# If tests pass:
/deploy_staging

# Check staging environment
/uat

# If UAT passes:
/finalize "FEAT-123-oauth2"

# Exit
exit
```

**Tokens used**: ~10K (finalize docs)

**Total**: ~105K tokens across 3 sessions
**Bonus**: Time for review, testing, thinking between sessions

---

### Pattern 2: Incremental Build

**Best for**: Large features that can be broken into smaller pieces

#### Session 1: Foundation (30 min)

```bash
/start "FEAT-123-oauth2"
/scout "OAuth2 files" "4"

# Build just the foundation
/plan "OAuth2: Create user model and database schema" ""
/build "specs/20251009-143022-oauth2-schema.md"
/test

# Commit foundation
git add .
git commit -m "feat: Add OAuth2 user model and schema"

exit
```

**Tokens**: ~45K
**Deliverable**: Database schema ready

#### Session 2: Core Logic (45 min)

```bash
# Resume same feature (context from session log)
# No need to re-scout (reuse from Session 1)

/plan "OAuth2: Implement token generation and validation" "ai-docs/scout-results/20251009-143022/files-collection.txt"
# Note: Reusing scout results from Session 1

/build "specs/20251009-143030-oauth2-tokens.md"
/test

git add .
git commit -m "feat: Add OAuth2 token generation"

exit
```

**Tokens**: ~40K (no re-scout, reused files)
**Deliverable**: Token system working

#### Session 3: Integration (30 min)

```bash
/plan "OAuth2: Integrate with existing auth middleware" "ai-docs/scout-results/20251009-143022/files-collection.txt"

/build "specs/20251009-143045-oauth2-integration.md"
/test

git add .
git commit -m "feat: Integrate OAuth2 with middleware"

exit
```

**Tokens**: ~35K
**Deliverable**: Full integration complete

#### Session 4: Polish (20 min)

```bash
# Final session: documentation and deployment
/finalize "FEAT-123-oauth2"
/deploy_staging
/uat
/release

exit
```

**Tokens**: ~10K

**Total**: ~130K tokens across 4 sessions
**Bonus**: Each session delivers working, tested code

---

### Pattern 3: Morning/Afternoon Split

**Best for**: Daily workflow with natural break points

#### Morning Session: Discovery & Planning (2 hours)

```bash
# 8:00 AM - Start work
/start "FEAT-124-payments"

# 8:05 AM - Scout
/scout "payment processing files" "4"

# 8:15 AM - External research
"Use Gemini MCP to summarize https://stripe.com/docs/api"

# 8:20 AM - Plan
/plan "Add Stripe payment processing" ""

# 8:50 AM - Review plan, take notes
# Exit for morning break or meetings
exit
```

**Tokens**: ~45K
**Mental state**: Fresh, good for planning

#### Afternoon Session: Implementation (3 hours)

```bash
# 1:00 PM - Resume work
claude-code

# 1:05 PM - Build
/build "specs/20251009-143022-payments.md"

# 2:30 PM - Build completes
/test

# 3:00 PM - Tests pass
/deploy_staging

# 3:15 PM - Manual staging tests
# Exit for end of day
exit
```

**Tokens**: ~55K
**Mental state**: Energy dip handled by having clear plan

**Total**: ~100K tokens
**Bonus**: Natural break between planning and coding

---

### Pattern 4: Emergency Hotfix

**Best for**: Production bugs that need quick iteration

#### Session 1: Triage (10 min)

```bash
# Production is down, need quick diagnosis
/hotfix "BUG-789-rate-limit-failures"

# Claude triages bug
# Saves diagnosis to: app-docs/debugging/BUG_REPORT_789.md

# Review diagnosis
cat app-docs/debugging/BUG_REPORT_789.md

# Make decision: Can we fix quickly?
# Yes: Continue to Session 2
# No: exit and escalate

exit
```

**Tokens**: ~8K (targeted triage)

#### Session 2: Quick Fix (15 min)

```bash
claude-code

# Skip scout, go straight to build (bug already triaged)
# Bug report has exact file and line number
/build "app-docs/debugging/BUG_REPORT_789.md"

# Quick test
/test

# If pass:
/deploy_staging

exit
```

**Tokens**: ~20K (targeted fix)

#### Session 3: Validation & Rollout (10 min)

```bash
claude-code

# Staging validated externally
/uat  # Quick checks

# If pass:
/release

# Update bug tracker
/finalize "BUG-789"

exit
```

**Tokens**: ~5K

**Total**: ~33K tokens across 3 sessions (30-45 min total)
**Bonus**: Each session has clear exit point for stakeholder updates

---

## 🎓 Best Practices for Cross-Session Work

### DO ✅

1. **Always use `/start "[feature-id]"` to initialize**
   - Creates session log
   - Makes resumption automatic

2. **Commit code at session boundaries**
   ```bash
   git add .
   git commit -m "WIP: OAuth2 schema (session 1 complete)"
   exit
   ```

3. **Review saved artifacts between sessions**
   - Read plans offline
   - Think through approach
   - Prepare questions

4. **Reuse scout results within 24 hours**
   ```bash
   # Session 1: Scout once
   /scout "auth files" "4"

   # Session 2, 3, 4: Reuse results
   /plan "task" "ai-docs/scout-results/[timestamp]/files-collection.txt"
   ```

5. **Break at natural boundaries**
   - After scout → Review results
   - After plan → Review approach
   - After build → Test manually
   - After staging → Validate with stakeholders

6. **Use session logs to track progress**
   ```bash
   cat ai-docs/sessions/FEAT-123/session.log
   ```

7. **Name features clearly for easy resumption**
   ```bash
   /start "FEAT-123-oauth2-tokens"  # Clear what feature is
   ```

### DON'T ❌

1. **Don't leave code uncommitted**
   - Risk losing work if you forget to commit
   - Session exit doesn't auto-commit

2. **Don't re-scout unnecessarily**
   - Wastes tokens
   - Results valid for 24 hours

3. **Don't try to do too much in one session**
   - Context window will overflow
   - Better to split into smaller pieces

4. **Don't skip the `/start` initialization**
   - Session state won't be tracked
   - Resumption will be manual

5. **Don't forget to exit cleanly**
   ```bash
   # Good
   /finalize "FEAT-123"
   exit

   # Bad
   # Just closing terminal without exit
   ```

6. **Don't mix multiple features in one session**
   - Keep sessions focused on one `/start` feature
   - Finish or pause before starting another

---

## 📋 Session State Checklist

### Before Exiting a Session

- [ ] Code changes committed to git
- [ ] Artifacts saved (scout results, plans, build logs)
- [ ] Session log updated (automatic if using `/start`)
- [ ] Known next steps documented (in plan or session log)
- [ ] Tests run and status known (passing or failing)

### When Resuming a Session

- [ ] Review previous session's artifacts
- [ ] Check git status (ensure clean or expected state)
- [ ] Load feature context (Claude does this automatically with `/start`)
- [ ] Verify assumptions still valid (code hasn't changed significantly)
- [ ] Continue from saved phase (plan → build → test → deploy)

---

## 🛠️ Session State Commands

### Checking Session State

```bash
# List all active feature sessions
ls ai-docs/sessions/

# View specific feature session log
cat ai-docs/sessions/FEAT-123/session.log

# Find latest scout results
ls -lt ai-docs/scout-results/ | head -5

# Find latest plans
ls -lt specs/ | head -5

# Check build status
cat ai-docs/builds/[latest]/build-report.md
```

### Resuming Work

```bash
# Explicit load (if Claude doesn't auto-detect)
# Not usually needed, but available if you need it

# Continue build from saved plan
/build "specs/20251009-143022-feature.md"

# Continue from failure
cat ai-docs/failures/20251009-feature.md
# Claude will incorporate lessons learned
```

---

## 💡 Advanced Cross-Session Patterns

### Pattern: Parallel Features

Work on multiple features by switching sessions:

```bash
# Morning: Feature A (Session 1)
/start "FEAT-123-oauth2"
/scout "OAuth2 files" "4"
/plan "OAuth2" "docs"
exit

# Afternoon: Feature B (Session 1)
/start "FEAT-124-payments"
/scout "payment files" "4"
/plan "Payments" "docs"
exit

# Next day morning: Feature A (Session 2)
/start "FEAT-123-oauth2"  # Auto-loads from previous session
/build "specs/[timestamp]-oauth2.md"
exit

# Next day afternoon: Feature B (Session 2)
/start "FEAT-124-payments"  # Auto-loads from previous session
/build "specs/[timestamp]-payments.md"
exit
```

**Benefit**: Progress on multiple features without context confusion

---

### Pattern: Spike → Full Implementation

Explore uncertainty before committing:

```bash
# Session 1: Spike (exploratory)
/start "SPIKE-new-db-pattern"
/scout "database files" "2"  # Budget mode

# Quick exploration (manual coding)
# Try different approaches
# Document findings in specs/spike-findings.md

git add specs/spike-findings.md
git commit -m "docs: Database pattern spike findings"
exit

# Session 2: Decision & Plan
# Review spike findings offline
# Make architecture decision

/start "FEAT-125-new-db-pattern"
/plan "Implement chosen DB pattern from spike" "specs/spike-findings.md"
exit

# Session 3: Build with confidence
/build "specs/[timestamp]-db-pattern.md"
/test
exit
```

**Benefit**: Reduce risk by exploring before committing tokens to full build

---

## 📊 Token Budgeting Across Sessions

### Monthly Calendar Example

**Week 1**: 4 medium features
- Monday: Scout & plan 2 features (90K tokens)
- Tuesday: Build feature 1 (50K), test & deploy (10K)
- Wednesday: Build feature 2 (50K), test & deploy (10K)
- Thursday: Scout & plan 2 more features (90K)
- Friday: Build feature 3 (50K), test & deploy (10K)
- **Week total**: ~360K tokens

**Week 2**: 2 large features + misc
- Monday: Scout & plan large feature 1 (70K)
- Tuesday: Build large feature 1 part 1 (50K)
- Wednesday: Build large feature 1 part 2 (50K), test (5K)
- Thursday: Scout & plan large feature 2 (70K)
- Friday: Build large feature 2 (60K), test (5K)
- **Week total**: ~310K tokens

**Week 3**: Hotfixes & small tasks
- Daily: 8 small tasks × 5K = 40K/day
- **Week total**: ~200K tokens

**Week 4**: Buffer & experimentation
- Exploratory work, refactoring, learning
- **Week total**: ~300K tokens

**Month total**: ~1.17M tokens (well under 5M limit)

---

## 🎯 Quick Reference

### Session Types by Duration

| Session Type | Duration | Typical Phase | Tokens |
|--------------|----------|---------------|--------|
| Quick triage | 10 min | Hotfix diagnosis | ~8K |
| Scout session | 20 min | Discovery | ~10K |
| Plan session | 30 min | Strategy | ~35K |
| Build session | 45 min | Implementation | ~50K |
| Test session | 15 min | Validation | ~5K |
| Deploy session | 10 min | Release | ~5K |

### Typical Multi-Session Workflows

| Workflow | Sessions | Total Time | Total Tokens |
|----------|----------|------------|--------------|
| Small feature | 1 | 30 min | ~30K |
| Medium feature | 2-3 | 2-3 hours | ~80K |
| Large feature | 4-5 | 4-6 hours | ~120K |
| Hotfix | 2-3 | 30-60 min | ~30K |

---

## 📚 Related Resources

- [COMMAND-MAPPING.md](COMMAND-MAPPING.md) - Command reference
- [budget-mode.md](budget-mode.md) - Token optimization
- [WORKFLOW.md](WORKFLOW.md) - Complete workflow specification

---

## 🎓 Summary

**Cross-session work is a feature, not a limitation:**

✅ **Natural review points** → Better code quality
✅ **Token budget spread** → Stay within limits
✅ **Mental breaks** → Better focus and decision-making
✅ **Incremental progress** → Deliver value continuously
✅ **Risk reduction** → Test and validate at each step

**Your mantra**: *"Break work into sessions, let artifacts persist"*

1. **Start with `/start`** → Session tracking enabled
2. **Commit at boundaries** → Save progress
3. **Review between sessions** → Offline thinking is free
4. **Reuse artifacts** → Don't re-scout, don't re-plan
5. **Resume confidently** → Context loads automatically

**Result**: Manage enterprise-scale projects comfortably within small context windows

---

**Last Updated**: October 2025
**Template Version**: 2.0
**For**: Solo developers managing large projects
**Maintainer**: Budget Agentic Workflow Template
