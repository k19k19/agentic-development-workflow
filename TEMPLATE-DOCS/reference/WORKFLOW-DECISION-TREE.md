# Workflow Decision Tree

**Quick reference for choosing the right command at each stage**

---

## 🚀 Starting a New Task

### What to do?
Ask yourself: **How big is this task?**

```
├─ Small (<10 files, <1 hour)
│  └─ /quick "[task]"
│     └─ Done! (~5K tokens)
│
├─ Medium (10-50 files, 1-3 hours)
│  └─ /scout_build "[task]"
│     └─ Review changes → Commit or fix
│     └─ /test → /deploy_staging
│
└─ Large (>50 files, >3 hours, complex)
   └─ /full "[task]" "[docs]" "budget"
      └─ Review plan → Approve
      └─ AI builds automatically
      └─ /test → /deploy_staging
```

---

## 📊 Command Flow Diagram

```
START
  │
  ├─ New Feature ───────────────────────────────────────────┐
  │                                                          │
  │  Small: /quick "[task]"                                 │
  │         ↓                                                │
  │         Tests pass? ────Yes──→ /deploy_staging          │
  │         ↓ No                      ↓                      │
  │         Fix & retry               /uat                   │
  │                                   ↓                      │
  │  Medium: /scout_build "[task]"    Pass? ─Yes→ /finalize │
  │          ↓                        ↓ No                   │
  │          Review build             Fix & /uat again       │
  │          ↓                                                │
  │          /test ──→ Pass? ─Yes→ /deploy_staging          │
  │          ↓ No                                            │
  │          Fix & /test again                               │
  │                                                          │
  │  Large: /full "[task]" "[docs]" "budget"                │
  │         ↓                                                │
  │         /scout (auto) → finds files                      │
  │         ↓                                                │
  │         /plan (auto) → creates plan                      │
  │         ↓                                                │
  │         USER APPROVAL GATE                               │
  │         ↓ Approved                                       │
  │         /build_w_report (auto) → implements              │
  │         ↓                                                │
  │         Review session summary                           │
  │         ↓                                                │
  │         /test → /deploy_staging → /uat → /finalize      │
  │                                                          │
  ├─ Bug Fix ───────────────────────────────────────────────┤
  │                                                          │
  │  /hotfix "[bug-id]"                                      │
  │  ↓                                                       │
  │  AI triages → analyzes root cause                        │
  │  ↓                                                       │
  │  Implements fix                                          │
  │  ↓                                                       │
  │  /test → Pass? ─Yes→ /release (production hotfix)       │
  │  ↓ No                                                    │
  │  Fix & /test again                                       │
  │                                                          │
  └─ Continue Existing Work ────────────────────────────────┘
     │
     Check status:
     - Review: ai-docs/sessions/SESSION-*.md
     - Last plan: ai-docs/plans/*/plan.md
     - Build status: ai-docs/builds/*/build-report.md
     │
     Resume at appropriate phase:
     - Have plan? → /build "[path-to-plan]"
     - Built code? → /test
     - Tests pass? → /deploy_staging
     - Staging OK? → /uat
     - UAT pass? → /finalize "[feature-id]"
```

---

## ✅ After Each Command

### After `/quick "[task]"`
**Next steps:**
```bash
# Option 1: Tests pass
/deploy_staging

# Option 2: Tests fail
# Fix issues manually or ask AI to fix, then:
npm test
/deploy_staging
```

---

### After `/scout "[task]"`
**Next steps:**
```bash
# Use scout results for planning
/plan "[task]" "[docs-urls]" "[scout-results-path]"

# Scout results saved to: ai-docs/scout-results/[timestamp]/
```

---

### After `/plan "[task]" "[docs]" "[files]"`
**Next steps:**
```bash
# Review the generated plan, then:

# Option 1: Plan looks good
/build "[path-to-plan]"

# Option 2: Plan needs revision
# Edit the plan manually, then:
/build "[path-to-plan]"

# Plan saved to: ai-docs/plans/[timestamp]-[feature]/plan.md
```

---

### After `/build "[path-to-plan]"` or `/build_w_report "[path-to-plan]"`
**Next steps:**
```bash
# Check git diff and session summary
git diff --stat
cat ai-docs/sessions/SESSION-*.md  # Latest session

# Option 1: Build successful
/test

# Option 2: Build had issues
# Fix manually or ask AI to fix, then:
/test

# Session summary saved to: ai-docs/sessions/SESSION-[date]-[feature].md
```

---

### After `/test`
**Next steps:**
```bash
# Option 1: All tests pass ✅
/deploy_staging

# Option 2: Tests fail ❌
# Review test output: ai-docs/builds/[timestamp]/test-output.txt
# Fix issues, then:
/test  # Re-run tests

# Option 3: Tests fail repeatedly
/report_failure "[feature-id]"  # Document issue for review
```

---

### After `/deploy_staging`
**Next steps:**
```bash
# Deployment successful, now validate:
/uat

# Staging URL usually: http://staging.yourapp.com
# Check logs: tail -f logs/staging.log
```

---

### After `/uat`
**Next steps:**
```bash
# Option 1: UAT passes ✅
/finalize "[feature-id]"

# Option 2: UAT fails ❌
# Document issues, fix, redeploy:
/deploy_staging
/uat  # Re-test

# Option 3: Major issues found
/report_failure "[feature-id]"  # Escalate
```

---

### After `/finalize "[feature-id]"`
**Next steps:**
```bash
# Feature complete! Documentation updated.

# Option 1: Deploy to production
/release

# Option 2: Work on next feature
/next  # Pick next feature from roadmap

# Option 3: Start specific feature
/full "[new-task]" "[docs]" "budget"
```

---

### After `/release`
**Next steps:**
```bash
# Production deployment complete!

# Monitor production:
# - Check metrics dashboard
# - Review error logs
# - Monitor user feedback

# Next feature:
/next  # Auto-select from roadmap
```

---

### After `/hotfix "[bug-id]"`
**Next steps:**
```bash
# Hotfix implemented, now test:
/test

# If tests pass:
/release  # Deploy directly to production (skip staging for hotfixes)

# Monitor production after hotfix
```

---

## 🔄 Cross-Session Workflows

### Resuming Work After Break

```bash
# Find your last session
npm run search "session history"
ls -lt ai-docs/sessions/ | head -5

# Check last state
cat ai-docs/sessions/SESSION-*.md  # Latest

# Resume at appropriate phase:
# - Have plan? → /build "[path-to-plan]"
# - Built code? → /test
# - Staging deployed? → /uat
```

---

### Emergency Scenarios

```bash
# Build failed unexpectedly
/report_failure "[feature-id]"  # Document for review
/restart_feature "[feature-id]"  # Start fresh with learnings

# Feature too complex
/pause_feature "[feature-id]"  # Save state, escalate

# Need human review before continuing
/wait_for_review  # Pause for approval
```

---

## 🎯 Command Cheat Sheet

| Command | When to Use | Next Command(s) |
|---------|-------------|-----------------|
| `/quick "[task]"` | Small tasks (<10 files) | `/deploy_staging` |
| `/scout "[task]"` | Find relevant files | `/plan` |
| `/plan "[task]" "[docs]" "[files]"` | Create implementation plan | `/build` or `/build_w_report` |
| `/build "[plan]"` | Execute plan | `/test` |
| `/build_w_report "[plan]"` | Execute + detailed report | `/test` |
| `/test` | Run test suite | `/deploy_staging` or fix issues |
| `/deploy_staging` | Deploy to staging env | `/uat` |
| `/uat` | User acceptance testing | `/finalize` or fix issues |
| `/finalize "[id]"` | Complete feature | `/release` or `/next` |
| `/release` | Deploy to production | Monitor, then `/next` |
| `/hotfix "[bug]"` | Emergency bug fix | `/test` → `/release` |
| `/scout_build "[task]"` | Medium tasks (skip plan) | `/test` |
| `/full "[task]" "[docs]" "budget"` | Large tasks (complete flow) | Auto-chains to `/test` |
| `/next` | Auto-select next feature | Depends on feature size |

---

## 💡 Pro Tips

### Token Efficiency
```bash
# Always start with smallest viable workflow:
1. Try /quick first (if <10 files)
2. Use /scout_build (if 10-50 files)
3. Use /full "budget" mode (if >50 files)
4. Only use /full "standard" if budget insufficient
```

### Memory Persistence
```bash
# After any build, session summary is auto-created
# Find it with:
npm run search "session [feature-name]"

# Or directly:
ls -lt ai-docs/sessions/
```

### When Stuck
```bash
# Check documentation:
cat TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md  # This file

# Search past sessions:
npm run search "similar feature name"

# Ask for help:
# Describe your goal, AI will recommend workflow
```

---

## 📚 Related Documentation

- [COMMAND-MAPPING.md](COMMAND-MAPPING.md) - Complete command reference
- [CROSS-SESSION-GUIDE.md](../TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Working across sessions
- [budget-mode.md](budget-mode.md) - Token optimization strategies
- [QUICK-REFERENCE.md](../TEMPLATE-DOCS/reference/QUICK-REFERENCE.md) - Quick template overview

---

**Last Updated**: October 2025
