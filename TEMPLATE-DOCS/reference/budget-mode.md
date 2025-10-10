# Budget Mode Playbook

**For Solo Developers on $20/month Plans**

**Version**: 2.0 | **Last Updated**: October 2025

---

## 🎯 Who This Is For

You are a solo developer managing enterprise-scale projects with:
- ✅ **$20 Claude Code plan** (~5M tokens/month)
- ✅ **Free Gemini tier** (60 requests/min, generous daily quota)
- ⚠️ **Optional: $20 ChatGPT plan** (for Codex MCP)

**This guide shows you how to maximize value from these limits.**

---

## 💰 Your Monthly Token Budget

### Claude Code ($20/month)
- **Allocation**: ~5M tokens/month
- **Daily average**: ~167K tokens/day (20 workdays)
- **Hourly rate**: ~21K tokens/hour (8-hour workday)

### Free Gemini
- **Allocation**: 60 requests/minute
- **Daily quota**: Very high (thousands of requests)
- **Cost**: $0

### Codex via ChatGPT ($20/month, optional)
- **Allocation**: Generous (exact limit varies)
- **Cost**: Minimal tokens for code generation

---

## 📊 Token Cost by Task Type

### Small Tasks (<10 files)

| Workflow | Tools Used | Token Cost | Budget Impact |
|----------|-----------|------------|---------------|
| Direct implementation | Codex MCP | ~5K tokens | 0.1% daily |

**Example**: "Add /health endpoint"
- **Cost**: 5K tokens
- **Tools**: Codex generates code, runs tests
- **Time**: 2 minutes
- **Daily capacity**: ~33 tasks like this

---

### Medium Tasks (10-50 files)

| Workflow | Tools Used | Token Cost | Budget Impact |
|----------|-----------|------------|---------------|
| `/scout_plan_build` (budget) | Gemini scout → Codex build | ~30K tokens | 0.6% daily |
| `/scout_plan_build` (standard) | Multi-agent scout → Claude plan → Hybrid build | ~80K tokens | 1.6% daily |

**Example**: "Add logging to all API endpoints"
- **Cost**: 30K tokens (budget mode)
- **Tools**: Gemini finds files (8K), Codex implements (22K)
- **Time**: 15 minutes
- **Daily capacity**: ~5 tasks like this

---

### Large Tasks (>50 files)

| Workflow | Tools Used | Token Cost | Budget Impact |
|----------|-----------|------------|---------------|
| Full workflow (budget) | Multi-agent scout → Claude plan → Hybrid build | ~90K tokens | 1.8% daily |
| Full workflow (standard) | Full with detailed plan/report | ~120K tokens | 2.4% daily |

**Example**: "Implement OAuth2 authentication"
- **Cost**: 90K tokens (budget mode)
- **Tools**: Gemini+Codex scout (10K), Claude plan (35K), Hybrid build (45K)
- **Time**: 45 minutes
- **Daily capacity**: ~1-2 tasks like this

---

## 🎯 Budget Mode Defaults

### What Budget Mode Does

1. **Plan Length = 350 words** (instead of 800)
   - Concise, actionable plans
   - Saves ~10K tokens per plan

2. **Vector Search Limit = 3** (instead of 10)
   - Top 3 most relevant docs only
   - Saves ~3K tokens per search

3. **Skips Secondary Searches**
   - Primary search only
   - Rerun with `standard` if needed

4. **Uses Codex-First Strategy**
   - Codex handles 70% of build tasks
   - Claude only for complex logic

### How To Enable

```bash
# Default: Always start with budget mode
/scout_plan_build "<prompt>" "" "budget"

# Escalate to standard only when needed
/scout_plan_build "<complex-task>" "<docs>" "standard"
```

---

## 📋 Budget Mode Checklist

When running any multi-agent command:

- [x] **Start with budget mode**: `/scout_plan_build "[task]" "" "budget"`
- [ ] **Review plan carefully**: Budget plans are concise, ensure completeness
- [ ] **Escalate to standard only when needed**:
  - New architectural patterns
  - High-risk changes
  - Unfamiliar codebase areas
- [ ] **Reuse artifacts**: Don't re-scout if you have recent results (<24hrs)
- [ ] **Break down large tasks**: Multiple budget tasks < one huge standard task
- [ ] **Use Gemini for all documentation reading**
- [ ] **Use Codex for all boilerplate/UI**
- [ ] **Track token usage weekly**

---

## 💡 Optimization Strategies

### Strategy 1: Task Decomposition

**Instead of**:
```bash
/scout_plan_build "Build complete user management system with RBAC" "docs" "standard"
# Cost: ~150K tokens
```

**Do this**:
```bash
# Task 1: User model (small)
"Create user model and basic CRUD"
# Cost: 5K tokens (direct implementation)

# Task 2: RBAC (medium)
/scout_plan_build "Add role-based permissions" "" "budget"
# Cost: 30K tokens

# Task 3: Apply permissions (medium)
/scout_plan_build "Add permission checks to all routes" "" "budget"
# Cost: 30K tokens

# Task 4: Admin UI (medium)
/scout_plan_build "Add admin UI for user management" "" "budget"
# Cost: 30K tokens

# Total: 95K tokens
# Savings: 55K tokens (37%)
# Bonus: Each piece is tested and reviewed separately
```

---

### Strategy 2: Artifact Reuse

**Scout results are saved** and can be reused:

```bash
# Day 1: Scout once
/scout "authentication files"
# Saves to: ai-docs/scout-results/20251009-auth/

# Use results multiple times (same day)
# Task 1
/plan_w_docs "Add login endpoint" "" "ai-docs/scout-results/20251009-auth/files-collection.txt"
/build "specs/20251009-login.md"

# Task 2 (reuse scout results)
/plan_w_docs "Add logout endpoint" "" "ai-docs/scout-results/20251009-auth/files-collection.txt"
/build "specs/20251009-logout.md"

# Token savings: 5K (skipped second scout)
```

---

### Strategy 3: Cross-Session Work

Break expensive tasks across Claude Code sessions:

**Session 1** (Morning - 20 min):
```bash
/start "FEAT-123"
/scout "OAuth2 files"
/plan "Implement OAuth2" "https://oauth.net/2/"
# Cost: 40K tokens
# Exit and review plan offline
```

**Session 2** (Afternoon - 30 min):
```bash
# Claude auto-loads session context (FREE)
/build "specs/20251009-oauth2.md"
# Cost: 50K tokens
```

**Session 3** (Next day - 10 min):
```bash
# Context still available (FREE)
/test
/deploy_staging
# Cost: ~5K tokens
```

**Total**: 95K tokens across 3 sessions
**Bonus**: Time to review and think between sessions

---

### Strategy 4: Gemini-First Research

**Before spending Claude tokens on reading docs**:

Use Gemini MCP to summarize external documentation:

```
User: "Use Gemini MCP to summarize https://stripe.com/docs/api and extract key patterns for payment integration"

Gemini: [Returns concise 500-word summary - FREE]

User: /plan "Add Stripe payment processing" ""
# Claude uses Gemini's summary
# Saves: 15-20K tokens vs Claude reading full docs
```

---

### Strategy 5: Codex-First Implementation

**For standard CRUD, UI, configs - use direct implementation**:

```bash
# These don't need /scout_plan_build:
"Create user CRUD endpoints"     # Codex handles it (5K)
"Add form validation"            # Codex handles it (5K)
"Create API response types"      # Codex handles it (5K)

# Reserve multi-agent workflow for complex logic:
/scout_plan_build "Implement payment processing with retries and webhooks" "" "budget"
# Cost: 30K tokens
```

**Savings**: 15K → 30K total vs treating all as medium tasks

---

## 📈 Monthly Planning

### Sample Monthly Budget (88 tasks)

**Scenario**: Solo developer, full-stack SaaS project

| Task Type | Count | Tokens Each | Total Tokens | % of Budget |
|-----------|-------|-------------|--------------|-------------|
| Small (quick fixes) | 40 | 5K | 200K | 4% |
| Medium (features) | 30 | 30K | 900K | 18% |
| Large (complex) | 8 | 90K | 720K | 14% |
| Bug fixes | 10 | 30K | 300K | 6% |
| **Subtotal** | **88** | - | **2.12M** | **42%** |
| **Buffer** | - | - | **2.88M** | **58%** |
| **Total** | - | - | **5M** | **100%** |

**Result**: Comfortable margin for unexpected work, refactoring, learning.

---

### Weekly Tracking

Use the metrics log to track usage:

```bash
# Check this week's usage
cat ai-docs/logs/workflow-metrics.jsonl | \
  grep "2025-10-" | \
  jq -s 'map(.tokens | .scout + .plan + .build + .report) | add'

# Example output: 856000
# Week 1: 856K / 1.25M target ✅ On track
```

**Targets**:
- Week 1: ~1.25M tokens (25%)
- Week 2: ~2.5M tokens (50%)
- Week 3: ~3.75M tokens (75%)
- Week 4: ~5M tokens (100%, with buffer)

---

## 🚨 When to Upgrade

### Signs You Need More Than $20/month

1. **Consistently hitting token limits**
   - Week 3 and already at 4.5M+ tokens
   - Frequently waiting for limit reset

2. **Complex enterprise features dominate**
   - >50% of tasks are "large" category
   - Constant architectural refactoring

3. **Working on multiple large projects**
   - 2+ enterprise codebases simultaneously
   - Each requires deep context

4. **Rapid prototyping/experimentation**
   - Building 5+ MVPs per month
   - Heavy trial-and-error iteration

### Upgrade Options

**Claude Pro** (~$45/month):
- ~10M tokens/month
- 2x capacity

**Enterprise API Access**:
- Pay-per-token pricing
- Unlimited scale
- Custom rate limits

---

## 🎓 Budget Mode Best Practices

### DO ✅

1. **Start every task with budget mode**
   ```bash
   /scout_plan_build "[task]" "" "budget"
   ```

2. **Review budget plans carefully**
   - Concise ≠ incomplete
   - Ask questions if unclear

3. **Escalate to standard when**:
   - New architectural patterns needed
   - High-risk production changes
   - Complexity threshold exceeded

4. **Reuse scout results** within 24 hours

5. **Break down large tasks** into smaller chunks

6. **Use Gemini for all documentation reading**

7. **Use Codex for all boilerplate/UI**

8. **Track token usage weekly**

9. **Work across sessions** for large features

10. **Maintain artifact reuse discipline**

### DON'T ❌

1. **Don't use standard mode by default**
   - Budget mode works for 80% of tasks
   - Escalate only when necessary

2. **Don't re-scout unnecessarily**
   - Cached results valid for 24 hours
   - Update only if codebase changed significantly

3. **Don't use Claude for simple tasks**
   - Direct implementation exists for a reason
   - Save Claude tokens for complex logic

4. **Don't ignore the approval gate**
   - It catches problems before expensive builds
   - Review plans even in budget mode

5. **Don't batch everything into one huge task**
   - Multiple small tasks < one large task
   - Better incremental progress and testing

6. **Don't read full external docs with Claude**
   - Use Gemini to summarize first
   - Claude uses the summary

7. **Don't re-plan when you have recent plans**
   - Reuse plans from ai-docs/
   - Update only if requirements changed

---

## 📊 Token Efficiency Metrics

### Measuring Efficiency

After each workflow, check build report for delegation breakdown:

```markdown
## Token Efficiency: 92%

**Tool Delegation**:
- Gemini: 8K tokens (reading docs, scout)
- Codex: 15K tokens (boilerplate, tests)
- Claude: 22K tokens (complex logic only)

**Total**: 45K tokens

**Efficiency Score**: 92%
(Optimal delegation, minimal waste)
```

**Target**: >85% efficiency

**Calculation**:
```
Efficiency = ((GeminiTokens * 0.1) + (CodexTokens * 0.5) + ClaudeTokens) / TotalClaudeTokensCharged * 100

Explanation:
- Gemini is free (weight: 0.1 for tracking only)
- Codex is cheap (weight: 0.5)
- Claude is expensive (weight: 1.0)
```

---

### Improving Efficiency

**If efficiency < 85%**:

1. **Check tool delegation**:
   - Is Claude being used for simple tasks?
   - Can Codex handle more of the build?

2. **Review plan verbosity**:
   - Are budget plans detailed enough?
   - Or too detailed (wasting tokens)?

3. **Examine vector search**:
   - Are you getting relevant results with limit=3?
   - Or need to increase limit?

---

## 🛠️ Budget Mode Configuration

### Default Settings

Budget mode uses these defaults (defined in slash commands):

```markdown
## Budget Mode Defaults

- Plan length: 350 words max (vs 800 in standard)
- Vector search limit: 3 results (vs 10 in standard)
- Tool preference: Codex > Gemini > Claude
- Skip secondary searches: yes
- Approval gates: maintained (safety first)
```

### Per-Command Overrides

You can override defaults when needed:

```bash
# Use standard mode for one complex task
/scout_plan_build "Major refactoring" "docs" "standard"
```

---

## 📚 Related Resources

- [COMMAND-MAPPING.md](COMMAND-MAPPING.md) - Complete command reference
- [CROSS-SESSION-GUIDE.md](CROSS-SESSION-GUIDE.md) - Multi-session workflows
- [WORKFLOW.md](WORKFLOW.md) - Complete workflow specification
- [MEMORY-MANAGEMENT-STRATEGY.md](MEMORY-MANAGEMENT-STRATEGY.md) - Long-term memory

---

## 🎯 Quick Budget Mode Summary

**Your mantra**: *"Start budget, escalate when needed"*

1. **Every task**: Begin with budget mode by default
2. **Review plan**: Is it detailed enough for safe implementation?
3. **If yes**: Proceed with build
4. **If no**: Rerun with `"standard"` mode
5. **Track weekly**: Are you under 1.25M tokens/week target?
6. **Adjust**: Increase budget mode usage if trending high

**Target Distribution**:
- 80% of tasks: Budget mode
- 15% of tasks: Standard mode
- 5% of tasks: Direct implementation (no workflow)

**Result**: Stay well under 5M tokens/month with 2-3M buffer for experiments

---

**Last Updated**: October 2025
**Template Version**: 2.0
**For**: Solo developers on $20/month plans
**Maintainer**: Budget Agentic Workflow Template
