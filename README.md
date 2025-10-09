# Budget Agentic Workflow Template

**For Solo Developers on $20/Month Plans**

> Ship enterprise-scale projects using Claude ($20/month) + free Gemini/Codex with intelligent multi-agent orchestration

**Version**: 2.0 | **Status**: Production Ready | **Token Efficiency**: 90%+

---

## 🎯 What Problem Does This Solve?

You're a solo developer with:
- Limited AI budget ($20/month Claude plan = ~5M tokens)
- Enterprise-scale codebase (50+ files)
- Complex features requiring architectural thinking
- Need to work across multiple sessions

**Traditional approach**: Burn through tokens in 2 weeks, hit limits, can't ship.

**This template**: 90%+ token efficiency, handle 80+ tasks/month, build continuously.

---

## ✨ How It Works

### The R&D Framework (Reduce and Delegate)

**Reduce**: Use fast, token-efficient models for discovery and boilerplate
- Gemini MCP (free) → Documentation research, summarization
- Codex MCP (cheap) → Code generation, syntax fixes, UI components
- Claude ($20) → Complex logic, architecture, orchestration only

**Delegate**: Multi-agent workflows spread work across specialized tools
- Scout phase: 2-4 parallel agents find relevant files
- Plan phase: Claude creates architecture (with mandatory approval gate)
- Build phase: Codex writes code, Gemini writes docs, Claude handles logic
- Report phase: Auto-updates documentation and tracks metrics

**Result**: 40-60% token savings vs. all-Claude approach

---

## 🚀 Quick Start (5 Minutes)

### Step 1: One-Command Setup (1 minute)

```bash
# From your project directory
cd /path/to/your/project

# Run the init script
bash /path/to/template/scripts/init-agentic-workflow.sh
```

**What it does**:
- ✅ Copies template files (`.claude/`, `app-docs/`, `scripts/`)
- ✅ Merges configs (`package.json`, `.gitignore`)
- ✅ Auto-generates `CLAUDE.md` with your project name
- ✅ Installs dependencies
- ✅ Initializes vector store
- ✅ Detects your project scale
- ✅ Shows next steps

**No manual file operations required.**

### Step 2: Customize CLAUDE.md (2 minutes)

```bash
# Open CLAUDE.md
open CLAUDE.md  # or: code CLAUDE.md

# Update these sections:
# - Architecture (describe your project structure)
# - Key Files (where important code lives)
# - Custom Commands (project-specific shortcuts)
```

### Step 3: Run Your First Task (2 minutes)

Choose based on your project scale (detected in Step 1):

```bash
# Small project (<10 files)
# → Just describe the task, Claude uses direct implementation
"Add a health check endpoint at /health"

# Medium project (10-50 files)
# → Use scout + build workflow
/scout_build "Add logging to all API endpoints"

# Large project (>50 files)
# → Use full workflow with documentation
/scout_plan_build "Implement OAuth2" "https://oauth.net/2/"
```

**Done!** Check the `ai-docs/` folder for generated plans and reports.

---

## 📊 Use Cases by Project Scale

### Small Project (<10 files, ~1K-5K LOC)

**Example**: Add a single feature to a REST API

**Workflow**: Direct implementation (no slash commands)

```
User: "Add a POST /users endpoint that creates a user in the database"

Claude: [reads relevant files, uses Codex MCP for boilerplate]
✅ Done in ~5K tokens (5 minutes)
```

**Token cost**: 5K tokens
**When to use**: Single-file changes, quick bug fixes, simple features

---

### Medium Project (10-50 files, ~5K-20K LOC)

**Example**: Add user authentication to an existing app

**Workflow**: `/scout_build "[task]"` (scout → build, skip full planning)

```bash
/scout_build "Add JWT-based authentication to all API endpoints"
```

**What happens**:
1. Scout (10K tokens, 3 min): Multi-agent file discovery
2. Build (30K tokens, 10 min): Codex writes auth middleware, Claude integrates
3. Report (2K tokens, 2 min): Auto-updates `app-docs/mappings/`

**Token cost**: ~40K tokens
**Time**: ~15 minutes
**When to use**: Known patterns, well-understood tasks, fast iteration

---

### Large Project (>50 files, >20K LOC)

**Example**: Implement OAuth2 with external provider integration

**Workflow**: `/scout_plan_build "[task]" "[docs]"`

```bash
/scout_plan_build "Implement GitHub OAuth2 login" "https://docs.github.com/en/apps/oauth-apps"
```

**What happens**:
1. Scout (10K tokens, 3 min): Multi-agent discovery across codebase
2. Plan (30K tokens, 5 min): Claude creates architecture → **waits for approval**
3. Build (50K tokens, 15 min): Hybrid tool delegation
4. Report (5K tokens, 2 min): Updates docs, tracks metrics

**Token cost**: ~95K tokens
**Time**: ~30 minutes
**When to use**: Complex features, architectural changes, unfamiliar codebase areas

---

## 📋 Command Reference

### USER COMMANDS (What You Run)

These are the commands you invoke directly when working on tasks.

| Command | Purpose | Token Cost | When to Use |
|---------|---------|------------|-------------|
| **Direct implementation** | Simple tasks without slash commands | ~5K | Single-file changes, quick fixes |
| `/quick "[task]"` | Skip scout/plan, go straight to Codex | ~10K | Known patterns, boilerplate work |
| `/scout_build "[task]"` | Scout + Build (no detailed plan) | ~40K | Medium complexity, known patterns |
| `/scout_plan_build "[task]" "[docs]"` | Full workflow with approval gate | ~95K | Large features, architecture changes |
| `/scout "[task]"` | Multi-agent file discovery only | ~10K | When you want to review files first |
| `/plan "[task]" "[docs]"` | Create implementation plan only | ~30K | Planning before execution |
| `/build "[plan-path]"` | Execute an existing plan | ~50K | After manual plan review |

### AI-INTERNAL COMMANDS (Auto-Triggered)

These commands are called automatically by the workflow. You don't run them manually.

| Command | When Triggered | Purpose |
|---------|---------------|---------|
| `/verify_scout` | After scout phase | Quality gate for file discovery |
| `/pause_feature` | When complexity threshold exceeded | Prompt user to break down task |
| `/wait_for_review` | After plan phase | Mandatory approval before build |
| `/report_failure` | When tests fail | Document failure for learning |
| `/restart_feature` | When build fails completely | Learning loop trigger |

### BUDGET SHORTCUTS

Optimized variants for $20/month plans:

| Command | Normal Cost | Budget Cost | Trade-off |
|---------|------------|-------------|-----------|
| `/scout_plan_build "[task]" "" "budget"` | 95K | ~60K | Scout scale 2, plan ~350 words |
| `/scout_build "[task]"` | 40K | ~30K | Skips detailed planning phase |
| `/quick "[task]"` | 10K | ~10K | Direct to Codex, minimal Claude |

**Budget mode defaults**:
- Scout: 2 agents instead of 4
- Plan: 350-word summary instead of full architectural spec
- Vector search: Limit 3 results instead of 10

See [app-docs/guides/budget-mode.md](app-docs/guides/budget-mode.md) for the complete playbook.

---

## 🛠️ Tool Delegation Matrix

**When to use which AI tool:**

| Task Type | Tool | Cost | Rationale |
|-----------|------|------|-----------|
| Read/summarize docs | **Gemini MCP** | Free | Fast, cheap tokens |
| Generate boilerplate | **Codex MCP** | Low | Quick syntax, no context needed |
| Fix syntax bugs | **Codex MCP** | Low | Immediate, no architectural context |
| Build UI components | **Codex MCP** | Low | Specializes in React/Vue/Svelte |
| Complex debugging (multi-file) | **Claude** | High | Requires architectural understanding |
| Architectural decisions | **Claude** | High | Strategic, long-term impact |
| Security/performance review | **Claude** | High | Critical, requires deep analysis |
| E2E testing | **Chrome DevTools MCP** | Medium | Testing specialty |

**Decision flowchart**:

```
┌─ Single file bug? ────────────→ Codex MCP
├─ Multi-file bug? ────────────→ Claude
├─ Config/env issue? ──────────→ Codex MCP
├─ Logic/architecture? ────────→ Claude
├─ Documentation research? ────→ Gemini MCP
├─ UI component? ──────────────→ Codex MCP
└─ Testing? ───────────────────→ Chrome DevTools MCP
```

---

## 🎯 Key Features

### 💰 Budget-First Design

- **Default workflows optimized for $20/month Claude plan**
- Monthly budget: 5M tokens = ~80 tasks at 60K avg
- Token tracking: Every workflow logs to `ai-docs/logs/workflow-metrics.jsonl`
- Budget mode: Add `"budget"` flag to any slash command

**Example monthly breakdown**:
- 40 small tasks (direct): 200K tokens
- 20 medium tasks (/scout_build): 800K tokens
- 12 large tasks (/scout_plan_build): 1.14M tokens
- **Total**: 2.14M tokens (**58% buffer remaining**)

See [app-docs/guides/budget-mode.md](app-docs/guides/budget-mode.md) for optimization strategies.

### 🔄 Cross-Session Workflows

Work across multiple sessions without context loss:

**Pattern 1: Scout → Review → Build** (human review between phases)
```bash
# Session 1 (morning)
/scout "Refactor user service"
# Review scout results, decide approach

# Session 2 (afternoon)
/plan_w_docs "..." "" "ai-docs/scout-results/[timestamp]/files.txt"
# Review plan, get approval

# Session 3 (next day)
/build "specs/[timestamp]-refactor-plan.md"
```

**Pattern 2: Incremental Build** (large features split across sessions)
```bash
# Session 1: Database layer
/scout_build "Add user preferences table and repository"

# Session 2: API layer
/scout_build "Add GET/PUT /users/:id/preferences endpoints"

# Session 3: UI layer
/scout_build "Add preferences page to dashboard"
```

See [app-docs/guides/CROSS-SESSION-GUIDE.md](app-docs/guides/CROSS-SESSION-GUIDE.md) for complete patterns.

### 🧠 Automated Memory Management

**Vector store**: Semantic search across all documentation
```bash
# Rebuild after adding new docs
npm run vectorize

# Search for relevant context
npm run search "authentication patterns"
```

**Feature-to-source mapping**: Auto-maintained by report phase
```
app-docs/mappings/feature-to-source.md
├── Authentication → src/auth/*, middleware/auth.js
├── User Management → src/users/*, models/user.js
└── Logging → utils/logger.js, middleware/logging.js
```

**Pre-implementation protocol**: Claude MUST read specs before coding
1. Check `app-docs/specs/[feature].md`
2. Check `app-docs/guides/implementation-guidelines.md`
3. Check `app-docs/mappings/feature-to-source.md`
4. Present approach and **wait for approval**

### 🛡️ Safety & Quality Gates

**Mandatory approval gates**:
- ✅ After plan phase (cannot start build without approval)
- ✅ After scout phase (review discovered files)
- ✅ Before deployment (pre-deploy validation script)

**Git safety**:
- Auto-check: `git diff --stat` after scout
- Auto-reset: If agents modified files unexpectedly
- Continuous monitoring during build

**Validation scripts**:
```bash
# Before deployment
./scripts/validation/pre-deploy-check.sh

# After deployment
./scripts/health-check/health-check.sh
```

---

## 📚 Documentation

**Getting started**:
- [TEMPLATE-DOCS/GETTING-STARTED.md](TEMPLATE-DOCS/GETTING-STARTED.md) - 5-minute setup (action-oriented)
- [TEMPLATE-DOCS/QUICK-REFERENCE.md](TEMPLATE-DOCS/QUICK-REFERENCE.md) - One-page cheat sheet
- [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory template

**Workflows**:
- [TEMPLATE-DOCS/workflow-guides/WORKFLOW.md](TEMPLATE-DOCS/workflow-guides/WORKFLOW.md) - Complete workflow phases
- [TEMPLATE-DOCS/workflow-guides/budget-mode.md](TEMPLATE-DOCS/workflow-guides/budget-mode.md) - Budget optimization
- [TEMPLATE-DOCS/workflow-guides/COMMAND-MAPPING.md](TEMPLATE-DOCS/workflow-guides/COMMAND-MAPPING.md) - All commands
- [TEMPLATE-DOCS/workflow-guides/CROSS-SESSION-GUIDE.md](TEMPLATE-DOCS/workflow-guides/CROSS-SESSION-GUIDE.md) - Multi-session patterns

**Advanced**:
- [TEMPLATE-DOCS/MIGRATION-GUIDE.md](TEMPLATE-DOCS/MIGRATION-GUIDE.md) - Upgrade from old SDK
- [TEMPLATE-DOCS/workflow-guides/implementation-guidelines.md](TEMPLATE-DOCS/workflow-guides/implementation-guidelines.md) - AI coding standards

---

## 📊 Token Savings Comparison

**Without this template** (All Claude):
- Scout: 25K (Claude reading all files)
- Plan: 40K (Claude analyzing everything)
- Build: 80K (Claude writing all code)
- **Total**: ~145K tokens per large feature

**With this template** (Hybrid delegation):
- Scout: 10K (Gemini fast search)
- Plan: 30K (Claude for architecture only)
- Build: 50K (Codex for boilerplate, Claude for logic)
- Report: 5K (Gemini summary)
- **Total**: ~95K tokens (**35% savings**)

**Monthly comparison**:
- All-Claude: ~35 large features/month
- Hybrid template: ~52 large features/month (**49% more work**)

---

## 🔧 MCP Tools Integration

**Required MCP servers** (install separately):

| MCP Server | Purpose | Installation |
|------------|---------|--------------|
| **Gemini** | Free documentation research | [Setup guide](https://github.com/google/gemini-mcp) |
| **Codex** | Low-cost code generation | [Setup guide](https://github.com/openai/codex-mcp) |

**Optional MCP servers**:

| MCP Server | Purpose | When to Use |
|------------|---------|-------------|
| Chrome DevTools | E2E testing | User-facing features |
| Shadcn | UI components | React/Next.js projects |
| Firecrawl | Web scraping | External docs research |

**Configuration**: See [USER-MEMORY-CLAUDE.md](USER-MEMORY-CLAUDE.md) for MCP setup instructions.

---

## 🐛 Troubleshooting

**Common issues**:

| Issue | Quick Fix |
|-------|-----------|
| Slash commands not appearing | Use macOS Terminal (not VS Code), restart Claude Code CLI session |
| Token budget exceeded | Switch to budget mode: add `"budget"` flag |
| Tests failing after build | Check `ai-docs/builds/[latest]/build-report.md` |
| Scout found no files | Lower scale: `/scout "[task]" "2"` |
| Git changes after scout | Auto-reset triggered (check scout report) |

**More help**: See GETTING-STARTED.md "Common First-Time Issues" section

---

## 📈 Metrics & Continuous Improvement

**Token tracking** (automatic):
```bash
# View recent workflows
tail -10 ai-docs/logs/workflow-metrics.jsonl | jq ".efficiency"

# Calculate average efficiency
cat ai-docs/logs/workflow-metrics.jsonl | jq -s 'map(.efficiency) | add/length'
```

**Target metrics**:
- Token efficiency: >90%
- Approval rejection rate: <10%
- Test pass rate: >95%
- Budget utilization: 60-80% (leave buffer)

**Quarterly review**:
- Update token budgets based on actual usage
- Add successful patterns to `app-docs/guides/`
- Document common bugs in `app-docs/debugging/`
- Adjust tool delegation strategy

---

## 🤝 Contributing

**To this template**:
1. Fork the repository
2. Create feature branch: `git checkout -b feature/improvement`
3. Test with real project
4. Submit PR with before/after metrics

**To your team**:
1. Copy template to shared repo
2. Customize for your tech stack
3. Add team-specific patterns to `app-docs/guides/`
4. Share token efficiency metrics

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🆘 Support

**Template issues**: [GitHub Issues](https://github.com/your-org/budget-agentic-workflow/issues)
**Claude Code issues**: https://github.com/anthropics/claude-code/issues
**Discussions**: [GitHub Discussions](https://github.com/your-org/budget-agentic-workflow/discussions)

---

## 🎯 Success Criteria

**You're using this template correctly when**:

✅ Token efficiency >90% across all workflows
✅ You can handle 80+ tasks per month on $20 plan
✅ Pre-approval catches issues before coding
✅ Documentation stays in sync automatically
✅ You work across multiple sessions effortlessly
✅ Clear audit trail for all changes

**Warning signs**:

⚠️ Frequently hitting token limits → Use budget mode
⚠️ Tests failing after builds → Check tool delegation
⚠️ Pre-approval getting rejected → Review patterns
⚠️ Using all-Claude for everything → Not delegating properly

---

## Quick Links

- 📖 [Complete Setup Guide](GETTING-STARTED.md) - Start here
- 📋 [All Commands](app-docs/guides/COMMAND-MAPPING.md) - Command reference
- 💰 [Budget Mode Playbook](app-docs/guides/budget-mode.md) - Optimize tokens
- 🔄 [Cross-Session Guide](app-docs/guides/CROSS-SESSION-GUIDE.md) - Multi-session work
- 🔧 [Workflow Details](app-docs/guides/WORKFLOW.md) - Phase-by-phase breakdown

---

**Ready to ship enterprise-scale projects on a $20/month budget?**

```bash
# Get started now
bash /path/to/template/scripts/init-agentic-workflow.sh
```

**Template Version**: 2.0
**Last Updated**: October 2025
**Token Efficiency**: 90%+
**Compatible with**: Claude Code Agent SDK (2025)
