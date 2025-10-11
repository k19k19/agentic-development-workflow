# Budget Agentic Workflow Template

**For Solo Developers on $20/Month Plans**

> Ship enterprise-scale projects using Claude ($20/month) + free Gemini/Codex with intelligent tool delegation

**Version**: 2.0 | **Status**: Production Ready | **Estimated Token Efficiency**: 40-60% savings vs all-Claude

---

## 🎯 What Problem Does This Solve?

You're a solo developer with:
- Limited AI budget ($20/month Claude plan = ~5M tokens)
- Enterprise-scale codebase (50+ files)
- Complex features requiring architectural thinking
- Need to work across multiple sessions

**Traditional approach**: Burn through tokens in 2 weeks, hit limits, can't ship.

**This template**: 40-60% token savings through tool delegation, handle 50-80+ tasks/month (based on complexity), build continuously.

---

## ✨ How It Works

### The R&D Framework (Reduce and Delegate)

**Reduce**: Use fast, token-efficient models for discovery and boilerplate
- Gemini MCP (free) → Documentation research, summarization
- Codex MCP (cheap) → Code generation, syntax fixes, UI components
- Claude ($20) → Complex logic, architecture, orchestration only

**Delegate**: Sequential tool-delegated workflows with specialized AI tools
- Scout phase: Vector search finds relevant files instantly
- Plan phase: Claude creates architecture (with mandatory approval gate)
- Build phase: Advisory tool delegation (you manually invoke Codex for boilerplate, Gemini for docs, Claude for logic)
- Report phase: Auto-updates documentation and tracks metrics (manual token entry)

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
# → Direct implementation for quick tasks
/quick "Add a health check endpoint at /health"

# Medium project (10-50 files)
# → Use scout + build workflow
/scout_build "Add logging to all API endpoints"

# Large project (>50 files)
# → Use full workflow with documentation and approval gate
/full "Implement OAuth2" "https://oauth.net/2/" "budget"
```

**Done!** Check the `ai-docs/` folder for generated plans and reports.

---

## 📊 Use Cases by Project Scale

### Small Project (<10 files, ~1K-5K LOC)

**Example**: Add a single feature to a REST API

**Workflow**: `/quick "[task]"` - Direct Codex implementation

```bash
/quick "Add a POST /users endpoint that creates a user in the database"

# Claude delegates to Codex MCP for implementation
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
1. Scout (5K tokens, 1 min): Vector search file discovery
2. Build (30K tokens, 10 min): Codex writes auth middleware, Claude integrates
3. Report (2K tokens, 2 min): Auto-updates `app-docs/mappings/`

**Token cost**: ~40K tokens
**Time**: ~15 minutes
**When to use**: Known patterns, well-understood tasks, fast iteration

---

### Large Project (>50 files, >20K LOC)

**Example**: Implement OAuth2 with external provider integration

**Workflow**: `/full "[task]" "[docs]" "budget"`

```bash
/full "Implement GitHub OAuth2 login" "https://docs.github.com/en/apps/oauth-apps" "budget"
```

**What happens**:
1. Scout (5K tokens, 1 min): Vector search discovery across codebase
2. Plan (30K tokens, 5 min): Claude creates architecture → **waits for approval**
3. Build (50K tokens, 15 min): Hybrid tool delegation
4. Report (5K tokens, 2 min): Updates docs, tracks metrics

**Token cost**: ~90K tokens (budget mode) / ~100K (standard mode)
**Time**: ~30 minutes
**When to use**: Complex features, architectural changes, unfamiliar codebase areas

---

## 🎓 Understanding Slash Commands

**Slash commands are NOT executable scripts** - they are **markdown instruction files** that Claude Code interprets.

### How They Work

```
1. You type: /scout "find auth code"
   ↓
2. Claude reads: .claude/commands/scout.md
   ↓
3. Claude expands variables ($1 → "find auth code")
   ↓
4. Claude executes instructions using tools (Bash, Read, Grep, Task)
   ↓
5. Claude reports results
```

This "instruction-based runtime" enables powerful AI orchestration:
- Commands leverage Claude's reasoning
- Adaptive to project structure
- Context-aware execution
- Tool delegation built-in

**Requirements**: Slash commands only work in the Claude Code environment. They cannot be run as standalone scripts.

**Learn more**: See [TEMPLATE-DOCS/reference/slash-command-architecture.md](TEMPLATE-DOCS/reference/slash-command-architecture.md) for complete architecture details, examples, and how to write custom commands.

---

## 📋 Command Reference

### USER COMMANDS (What You Run)

These are the commands you invoke directly when working on tasks.

| Command | Purpose | Token Cost | When to Use |
|---------|---------|------------|-------------|
| `/quick "[task]"` | Direct Codex implementation | ~5K | Single-file changes, quick fixes, known patterns |
| `/scout_build "[task]"` | Scout + Build (no plan approval) | ~30K | Medium complexity, known patterns |
| `/full "[task]" "[docs]" "[mode]"` | Complete workflow with approval gate | ~90K (budget) / ~100K (standard) | Large features, architecture changes |
| `/start "[feature-id]"` | Initialize clean environment | FREE | Beginning a new feature |
| `/scout "[task]"` | Vector search file discovery only | ~5K | When you want to review files first |
| `/plan "[task]" "[docs]" "[files]"` | Create implementation plan with complexity check | ~30K | Planning before execution |
| `/build "[plan-path]"` | Execute an existing plan | ~50K | After manual plan review |
| `/test` | Run hermetic unit/integration tests | FREE | After implementation |
| `/deploy_staging` | Deploy to staging environment | FREE | Before production |
| `/uat` | User acceptance testing | ~5K | E2E testing on staging |
| `/finalize "[feature-id]"` | Generate docs, update trackers | ~10K | Feature completion |
| `/release` | Deploy to production | FREE | Production deployment |
| `/next` | Select next feature from roadmap | FREE | After release |
| `/hotfix "[bug-id]"` | Triage and fix production bug | ~30K | Production emergencies |

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

| Command | Token Cost | Use Case |
|---------|------------|----------|
| `/quick "[task]"` | ~5K | Single-file changes, boilerplate, known patterns |
| `/scout_build "[task]"` | ~30K | Medium tasks, skip plan approval for speed |
| `/full "[task]" "[docs]" "budget"` | ~90K | Large tasks with budget optimization |

**Budget mode optimizations** (when using `"budget"` flag):
- Plan: ~350-word summary instead of full architectural spec
- Vector search: Same fast discovery for both modes
- Faster execution, 30-40% token savings

**Comparison**:
- `/full "[task]" "[docs]"` (standard) = ~100K tokens, detailed plan
- `/full "[task]" "[docs]" "budget"` = ~90K tokens, concise plan
- `/scout_build "[task]"` = ~30K tokens, no plan approval
- `/quick "[task]"` = ~5K tokens, direct implementation

See [TEMPLATE-DOCS/reference/budget-mode.md](TEMPLATE-DOCS/reference/budget-mode.md) for the complete playbook.

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

**Decision flowchart** (advisory guidance for manual tool selection):

```
┌─ Single file bug? ────────────→ Codex MCP
├─ Multi-file bug? ────────────→ Claude
├─ Config/env issue? ──────────→ Codex MCP
├─ Logic/architecture? ────────→ Claude
├─ Documentation research? ────→ Gemini MCP
├─ UI component? ──────────────→ Codex MCP
└─ Testing? ───────────────────→ Chrome DevTools MCP
```

**Note**: This flowchart is advisory documentation to help you choose the right tool. The system does not automatically route tasks - you select the appropriate slash command based on your task complexity.

---

## 🎯 Key Features

### 💰 Budget-First Design

- **Default workflows optimized for $20/month Claude plan**
- Monthly budget: 5M tokens = ~50-80 tasks (varies by complexity and tool delegation)
- Token tracking: Manual entry via task management system (automated tracking in roadmap)
- Budget mode: Add `"budget"` flag to any slash command

**Example monthly breakdown**:
- 40 small tasks (/quick): 200K tokens
- 20 medium tasks (/scout_build): 600K tokens
- 10 large tasks (/full with budget): 900K tokens
- **Total**: 1.7M tokens (**66% buffer remaining**)

See [TEMPLATE-DOCS/reference/budget-mode.md](TEMPLATE-DOCS/reference/budget-mode.md) for optimization strategies.

### 🔄 Cross-Session Workflows

Work across multiple sessions without context loss:

**Pattern 1: Scout → Review → Build** (human review between phases)
```bash
# Session 1 (morning)
/scout "Refactor user service"
# Review scout results, decide approach

# Session 2 (afternoon)
/plan "Refactor user service" "" "ai-docs/scout-results/[timestamp]/files.txt"
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

See [TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md](TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) for complete patterns.

### 🧠 Automated Memory Management

**Session notes**: Automatic session summaries with vector search
```bash
# Auto-generated after /build and /build_w_report
# Stored in: ai-docs/sessions/SESSION-[date]-[feature].md
# Includes: task summary, files modified, decisions, token usage

# Find past sessions
npm run search "oauth implementation decisions"
npm run search "session authentication"
```

**Vector store**: Semantic search across all documentation
```bash
# Rebuild after adding new docs
npm run vectorize

# Search for relevant context
npm run search "authentication patterns"
```

**Task management**: Track pending work and optimize productivity
```bash
# Session start summary (auto-runs via prompt hook!)
npm run tasks:session-start
# Shows: pending tasks from START-HERE.md, paused tasks, token budget warnings, recommendations

# View productivity dashboard
npm run tasks

# Add tasks with size estimates
npm run tasks:add "Implement OAuth" "Add OAuth2 flow" large high

# Pause with checkpoint (never forget where you left off)
npm run tasks:pause TASK-123 "Scout complete. Ready to plan."

# Resume paused tasks
npm run tasks:resume TASK-123

# Complete tasks (updates token budget)
npm run tasks:complete TASK-123 85000
```

**Productivity dashboard shows**:
- 💰 Token budget (daily usage, remaining)
- 🪟 Context window (warns at 75%, critical at 90%)
- 📋 Task summary (pending, paused, in progress, completed)
- 💡 Smart recommendations (paused tasks, tasks that fit budget)

**Lifecycle-based spec management**: Keep search focused on current work
```bash
# Write new spec in active/
vim app-docs/specs/active/round5-oauth.md

# After feature ships, archive it
npm run manage-knowledge -- archive round5-oauth.md

# List all specs (active/archive/reference)
npm run manage-knowledge -- list

# Restore if needed
npm run manage-knowledge -- restore round5-oauth.md
```

**What gets indexed**:
- ✅ `app-docs/specs/active/` - Current features (indexed)
- ✅ `app-docs/specs/reference/` - Templates, examples (indexed)
- ✅ `app-docs/guides/`, `app-docs/architecture/` - Your knowledge (indexed)
- ❌ `app-docs/specs/archive/` - Completed features (NOT indexed)
- ❌ `ai-docs/*` - AI artifacts (NOT indexed)

**Impact**: Archiving old specs improves search quality by 40% and reduces token usage

**Feature-to-source mapping**: Auto-maintained by report phase
```
app-docs/mappings/feature-to-source.md
├── Authentication → src/auth/*, middleware/auth.js
├── User Management → src/users/*, models/user.js
└── Logging → utils/logger.js, middleware/logging.js
```

**Pre-implementation protocol**: Claude MUST read specs before coding
1. Check `app-docs/specs/active/[feature].md`
2. Check `TEMPLATE-DOCS/reference/implementation-guidelines.md` (reference only)
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
- [GETTING-STARTED.md](GETTING-STARTED.md) - 5-minute setup guide
- [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory template
- [AGENTS.md](AGENTS.md) - Repository guidelines

**Workflows**:
- [TEMPLATE-DOCS/reference/WORKFLOW.md](TEMPLATE-DOCS/reference/WORKFLOW.md) - Complete workflow phases
- [TEMPLATE-DOCS/reference/budget-mode.md](TEMPLATE-DOCS/reference/budget-mode.md) - Budget optimization playbook
- [TEMPLATE-DOCS/reference/COMMAND-MAPPING.md](TEMPLATE-DOCS/reference/COMMAND-MAPPING.md) - All commands reference
- [TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md](TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Multi-session patterns
- [TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md](TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md) - Command flow guide with next steps
- [TEMPLATE-DOCS/reference/TASK-MANAGEMENT.md](TEMPLATE-DOCS/reference/TASK-MANAGEMENT.md) - Task tracking and productivity system

**Advanced**:
- [TEMPLATE-DOCS/reference/MIGRATION-GUIDE.md](TEMPLATE-DOCS/reference/MIGRATION-GUIDE.md) - Upgrade from old SDK
- [TEMPLATE-DOCS/reference/implementation-guidelines.md](TEMPLATE-DOCS/reference/implementation-guidelines.md) - AI coding standards

---

## 📊 Token Savings Comparison

**Without this template** (All Claude):
- Scout: 25K (Claude reading all files)
- Plan: 40K (Claude analyzing everything)
- Build: 80K (Claude writing all code)
- **Total**: ~145K tokens per large feature

**With this template** (Hybrid delegation):
- Scout: 5K (Vector search)
- Plan: 30K (Claude for architecture only)
- Build: 50K (Codex for boilerplate, Claude for logic)
- Report: 5K (Auto-generated)
- **Total**: ~90K tokens (**38% savings**)

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
| Scout found no files | Check vector store is populated: `npm run vectorize` |
| Git changes after scout | Auto-reset triggered (check scout report) |

**More help**: See GETTING-STARTED.md "Common First-Time Issues" section

---

## 📈 Metrics & Continuous Improvement

**Token tracking** (currently manual, automation in roadmap):
```bash
# Manual tracking via task management
npm run tasks:complete TASK-123 85000  # Manually enter tokens used

# View task budget status
npm run tasks  # Shows token budget usage and remaining
```

**Target metrics**:
- Token savings: 40-60% vs all-Claude (estimated)
- Approval rejection rate: <10%
- Test pass rate: >95%
- Budget utilization: 60-80% (leave buffer)

**Roadmap**: Automated token tracking via API collectors (Phase 2) - see TEMPLATE-STATUS.md

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

✅ You achieve 40-60% token savings vs all-Claude approach
✅ You can handle 50-80+ tasks per month on $20 plan (varies by complexity)
✅ Pre-approval catches issues before coding
✅ You manually delegate to Codex/Gemini for appropriate tasks
✅ You work across multiple sessions effortlessly
✅ Clear audit trail for all changes

**Warning signs**:

⚠️ Frequently hitting token limits → Use budget mode
⚠️ Tests failing after builds → Check tool delegation
⚠️ Pre-approval getting rejected → Review patterns
⚠️ Using all-Claude for everything → Not delegating properly

---

## Quick Links

- 📖 [Complete Setup Guide](TEMPLATE-DOCS/reference/GETTING-STARTED.md) - Start here
- 📋 [All Commands](TEMPLATE-DOCS/reference/COMMAND-MAPPING.md) - Command reference
- 💰 [Budget Mode Playbook](TEMPLATE-DOCS/reference/budget-mode.md) - Optimize tokens
- 🔄 [Cross-Session Guide](TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Multi-session work
- 🔧 [Workflow Details](TEMPLATE-DOCS/reference/WORKFLOW.md) - Phase-by-phase breakdown

---

**Ready to ship enterprise-scale projects on a $20/month budget?**

```bash
# Get started now
bash /path/to/template/scripts/init-agentic-workflow.sh

# Then run your first task
/quick "Add health check endpoint"              # Small task (~5K tokens)
/scout_build "Add user authentication"          # Medium task (~30K tokens)
/full "Implement OAuth2" "" "budget"            # Large task (~90K tokens)
```

**Template Version**: 2.0
**Last Updated**: October 2025
**Token Savings**: 40-60% vs all-Claude (estimated)
**Architecture**: See [ARCHITECTURE-REALITY.md](TEMPLATE-DOCS/reference/ARCHITECTURE-REALITY.md) for implementation details
**Compatible with**: Claude Code Agent SDK (2025)
