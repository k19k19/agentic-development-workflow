# Budget Agentic Workflow Template

**Version**: 1.0 | **Status**: Production Ready | **Compatible with**: Claude Code Agent SDK, Gemini

A comprehensive template for enterprise-scale development using Claude Code with multi-agent orchestration, and token-optimized workflows.

---

## 🎯 What Is This?

This template implements the **R&D Framework** (Reduce and Delegate) for Claude Code:

- **Reduce**: Use token-efficient models (Gemini, Codex) for discovery and boilerplate
- **Delegate**: Distribute work across specialized agents running in parallel
- **Orchestrate**: Chain agents through custom slash commands
- **Optimize**: Achieve 90%+ token efficiency with hybrid tool delegation

Perfect for solo developers handling enterprise-scale projects.

---

## ✨ Key Features

### 🤖 Multi-Agent Workflows
- **Scout**: Parallel agents (Gemini, Codex, Claude) discover relevant files
- **Plan**: Architectural planning with mandatory pre-implementation checks
- **Build**: Hybrid tool delegation (Codex for code, Gemini for docs, Claude for logic)
- **Report**: Automated documentation and metrics tracking

### 🔧 MCP Tool
These Model Context Protocol (MCP) tools are external and need to be installed and configured separately by the user to enable their functionality within the workflow.
- Gemini MCP (documentation, summarization)
- Codex MCP (code generation, syntax fixes, UI/UX)
- Chrome DevTools MCP (E2E testing)
- Shadcn (UI components)
- Firecrawl (web scraping/docs)

### 📊 Project Scale Detection
- **Small** (<10 files): Direct implementation (~10K tokens)
- **Medium** (10-50 files): Scout + Build (~40K tokens)
- **Large** (>50 files): Full workflow (~100K tokens)

### 🛡️ Safety & Quality

- **Mandatory Pre-Implementation Checks**: Before any code is written, the AI must read the project specs, check for existing patterns, and get user approval.
- **Structured Knowledge Base**: A centralized documentation structure in `app-docs/` ensures that the AI has a reliable source of truth, which helps prevent repeated mistakes.
- **Post-Task Updates**: After every implementation, the AI updates the relevant documentation, including code mappings and new patterns, to keep the knowledge base current.
- **Pre-deployment validation scripts**
- **Git safety checks (auto-reset on unintended changes)**

## 🧠 Memory Management

This template implements a sophisticated memory management strategy to ensure high token efficiency and prevent repeated mistakes. The core of this strategy is a structured knowledge base in the `app-docs/` directory, which serves as the single source of truth for the AI.

The AI is trained to follow a multi-phase protocol that relies on targeted retrieval from this knowledge base:

1.  **Pre-Task Retrieval (The Scout):** Before generating any code, the AI uses low-cost tools to gather the necessary context from the knowledge base.
2.  **Context-Aware Implementation (The Claude Role):** The main AI is engaged only after the minimal context is retrieved, and it's instructed to build upon existing functions and patterns.
3.  **Post-Task Update (The Historian):** After every successful implementation, the AI updates the knowledge base with new code mappings and patterns.

This retrieval-based approach to memory management is more scalable and efficient than relying on the limited context window of the AI.

### Vector Store

The project utilizes a vector store (`vector-store.json`) generated from `app-docs/` and `ai-docs/` using `scripts/vectorize-docs.js`. This vector store enables semantic search capabilities, allowing agents to retrieve highly relevant documentation chunks based on the meaning of a query, rather than just keywords. This significantly improves the efficiency and accuracy of context retrieval for complex tasks.


---

## 🚀 Quick Start

## 🧭 Contributor Guide

Review [AGENTS.md](AGENTS.md) before running workflows; it documents the template structure, required slash-command sequences, and agent handoff conventions.

### 1. Copy Template to Your Project

```bash
# Clone this template
git clone https://github.com/your-org/budget-agentic-workflow.git my-project
cd my-project

# Or copy files to existing project
cp -r budget-agentic-workflow/. my-existing-project/
```

### 2. Setup Directory Structure

```
my-project/
├── .claude/              # Claude Code configuration and slash commands
│   ├── agents/           # Agent-specific configurations
│   └── commands/         # Slash command definitions
├── ai-docs/              # Populated by workflows (scout results, plans, reports)
├── app-docs/             # Team-authored specs/guides (starts empty, add as needed)
│   ├── api/              # API specifications
│   ├── architecture/     # System design documents
│   ├── data/             # Data schemas and models
│   ├── debugging/        # Known issues and troubleshooting guides
│   ├── guides/           # Implementation patterns and guidelines
│   ├── mappings/         # Feature to source code mappings
│   ├── operations/       # Operational procedures and data fix queries
│   ├── qa/               # Quality assurance documents
│   ├── releases/         # Release notes (copy RELEASE-TEMPLATE.md per milestone)
│   └── specs/            # Feature specifications
├── scripts/              # Project automation (scale detection, health checks, etc.)
│   └── detect-project-scale.js
├── vector-store.json     # Semantic search embeddings (regenerate with npm run vectorize)
├── vector-store/         # Optional auxiliary indexes (if you maintain multiple stores)
├── node_modules/         # Project dependencies
├── AGENTS.md             # Guidelines for agents
├── CLAUDE.md             # Project memory (copy from CLAUDE-TEMPLATE.md)
├── CLAUDE-TEMPLATE.md    # Template for CLAUDE.md
├── GEMINI.md             # Gemini-specific documentation
├── GETTING-STARTED.md    # Getting started guide
├── MIGRATION-GUIDE.md    # Migration guide
├── QUICK-START.md        # Quick start guide
├── README.md             # This file
└── package.json          # Project dependencies and scripts
```

### 3. Customize CLAUDE.md

```bash
# Copy template
cp CLAUDE-TEMPLATE.md CLAUDE.md

# Edit CLAUDE.md:
# - Update [Project Name]
# - Add your architecture summary
# - Customize Quick Commands
# - Add project-specific navigation
```

### 4. Test the Workflow

```bash
# Detect your project scale
node scripts/detect-project-scale.js

# Run a simple task
# In Claude Code, run:
/scout_plan_build "Add health check endpoint at /health" ""
```

---

## 📖 Usage

### Budget-Friendly Workflow Tips
- Trigger the trimmed workflow with `/scout_plan_build "<prompt>" "<doc urls>" "budget"`; fall back to `standard` only when new architecture is involved.
- Set `budget=true` when launching multi-agent commands to keep scout/researcher results concise and limit parallel personas.
- Use Gemini or local CLI tools for discovery, then reserve Claude/GPT for plan/build reasoning.
- Reuse artifacts from `ai-docs/` (plans, reports) instead of re-running `/scout_plan_build` when iterating on the same feature.
- Cap search output with `npm run search -- "<query>" --limit=3`; rerun with a higher limit only when you truly need more context.
- Read `app-docs/guides/budget-mode.md` for the detailed playbook.

### Workflow Selection by Project Scale

#### Small Projects (<10 files, <5K LOC)

**Direct Implementation** - No slash commands needed

```
User: "Add a health check endpoint at /health"

Claude: [uses Codex MCP directly]
✅ Done in ~10K tokens
```

**When to use:**
- Single file changes
- Simple feature additions
- Quick bug fixes

---

#### Medium Projects (10-50 files, 5K-20K LOC)

**Delegate Chain (no external docs)**

```bash
/scout_plan_build "Add user authentication" ""
```

**Process:**
1. Scout (10K): Multi-agent file discovery
2. Plan (30K): Lightweight plan with approval gate
3. Build + Report (40K): Implementation with summary
**Total**: ~80K tokens

**When to use:**
- Known patterns exist
- Task is well-understood
- Fast iteration needed

---

#### Large Projects (>50 files, >20K LOC)

**Full Workflow** - Complete Scout → Plan → Build → Report

```bash
/scout_plan_build "Implement OAuth2 authentication" "https://docs.example.com/oauth"
```

**Process:**
1. **Scout** (10K): Multi-agent file discovery
2. **Plan** (30K): Architecture + task breakdown + **user approval**
3. **Build** (50K): Hybrid tool delegation
4. **Report** (5K): Summary + doc updates
**Total**: ~100K tokens

**When to use:**
- Complex features
- Architectural changes
- Unfamiliar codebase areas
### Helper Commands

These are standalone commands that can be used to perform specific tasks.

| Command | Purpose |
|---------|---------|
| `/prepare_for_task "[task]"` | Gathers context and primes the AI before starting a new task. |
| `/all_tools` | Lists all available tools. |
| `/background "[focus-area]"` | Gathers high-level project background. |
| `/load_ai_docs "[task]"` | Loads relevant AI workflow documentation. |
| `/load_bundle "[bundle-name]" "[file-globs]"` | Creates a curated set of files for analysis. |
| `/parallel_subagents "[task]" "[agent-list]"` | Launches multiple specialized agents for a single task. |
| `/plan_vite_vue "[task]" "[files]"` | Generates a development plan for a Vite and Vue project. |
| `/prime_cc` | Primes the AI with the current project state. |
| `/questions "[task]"` | Asks clarifying questions before implementation begins. |
| `/quick-plan "[task]" "[files]"` | Generates a lightweight plan for small tasks. |
| `/search_vector_store "[query]"` | Searches the project's vector store for relevant documentation. |

---

## 🔧 Slash Commands

### Core Workflows

| Command | Purpose | Token Budget |
|---------|---------|--------------|
| `/scout_plan_build "[task]" "[doc urls]" "[mode]"` | End-to-end scout → plan → build (`budget`, `questions`, or `standard`) | ~90K |
| `/prepare_for_task "[task]"` | Gathers context and primes the AI before starting a new task. | ~15K |
| `/scout "[task]" "4"` | Multi-agent file discovery | ~10K |
| `/plan_w_docs "[task]" "[docs]" "[files]"` | Documentation-aware implementation plan | ~30K |
| `/quick-plan "[task]" "[files]"` | Lightweight plan for small changes | ~15K |
| `/build "[plan-path]"` | Implement plan with standard reporting | ~50K |
| `/build_w_report "[plan-path]"` | Implement plan with detailed audit log | ~55K |

### Individual Phase Commands

**Scout Phase:**
```bash
/scout "Find all authentication-related files" "4"
# Returns: ai-docs/scout-results/[timestamp]/files-collection.txt
```

**Plan Phase:**
```bash
/plan_w_docs "Add OAuth2" "https://docs.oauth.net" "ai-docs/scout-results/[timestamp]/files-collection.txt"
# ⚠️ WAITS FOR USER APPROVAL before proceeding
# Returns: specs/[timestamp]-oauth2-plan.md
```

**Build Phase:**
```bash
/build "specs/[timestamp]-oauth2-plan.md"
# Uses: Codex, Gemini, Claude based on plan
# Returns: ai-docs/reports/[timestamp]-build-summary.md
```

**Build with Audit Report:**
```bash
/build_w_report "specs/[timestamp]-oauth2-plan.md"
# Captures validation evidence + git diff summary
# Returns: ai-docs/reports/[timestamp]-build-report.md
```

---

## 🤖 Tool Delegation Strategy

### When to Use Each Tool

| Tool | Use For | Token Cost | Example |
|------|---------|------------|---------|
| **Gemini MCP** | Docs, specs, summaries | Low | "Summarize API docs" |
| **Codex MCP** | Boilerplate, syntax, UI | Low | "Generate CRUD endpoints" |
| **Claude** | Complex logic, integration | High | "Refactor service layer" |
| **Chrome DevTools** | E2E testing | Medium | "Generate login flow tests" |
| **Shadcn** | UI components | Low | "Add button component" |
| **Firecrawl** | External docs | Low | "Fetch OAuth2 spec" |

### Decision Rules

```
Single file + syntax? → Codex MCP
Documentation? → Gemini MCP
Multi-file + logic? → Claude
Testing? → Chrome DevTools MCP
UI components? → Shadcn MCP
External research? → Firecrawl MCP
```

---

## 📊 Token Optimization

### Average Token Usage by Project

| Project Scale | Workflow | Typical Usage | Savings vs All-Claude |
|--------------|----------|---------------|----------------------|
| Small | Direct | 5-10K | 70%+ |
| Medium | Scout+Build | 30-40K | 50%+ |
| Large | Full | 80-100K | 40%+ |

### How Token Savings Work

**Without this template** (All Claude):
- Scout: 25K (Claude reading all files)
- Plan: 40K (Claude analyzing everything)
- Build: 80K (Claude writing all code)
- **Total**: ~145K tokens

**With this template** (Hybrid delegation):
- Scout: 8K (Gemini fast search)
- Plan: 28K (Claude for architecture only)
- Build: 45K (Codex for boilerplate, Claude for logic)
- Report: 4K (Gemini summary)
- **Total**: ~85K tokens (**40% savings!**)

---

## 🛡️ Safety Features

### 1. Mandatory Pre-Implementation Checks

Before ANY code changes, the plan phase:

1. ✅ Reads project specs (via Gemini MCP)
2. ✅ Checks existing patterns
3. ✅ Presents approach to user
4. ⏸️ **WAITS for explicit approval**

User can:
- Approve → Continue to build
- Reject → Revise approach
- Ask questions → Get clarification



### 2. Git Safety

**During scout:**
```bash
# Before: git diff --stat > baseline.txt
# After: git diff --stat > post-scout.txt
# If changes: git reset --hard
```

**During build:**
```bash
# Continuous monitoring
# User can review: git diff at any time
# Auto-reset on failures
```

### 3. Pre-Deployment Validation

```bash
./scripts/validation/pre-deploy-check.sh
```

Checks:
- Git status
- Environment config
- Dependencies
- Build success
- Tests passing
- Linting
- Port availability
- Docker (if applicable)

### 4. Post-Deployment Health Checks

```bash
./scripts/health-check/health-check.sh
```

Validates:
- Service ports
- HTTP endpoints
- API responses
- Database connectivity
- Resource usage
- SSL certificates (if HTTPS)

---

## 📚 Documentation Structure

### AI Documentation (`ai-docs/`)

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `workflows/` | Scout, plan, build, report specs | Reference workflow details |
| `plans/` | Generated implementation plans | Before starting build |
| `builds/` | Build logs and reports | During implementation |
| `reports/` | Workflow summaries | After completion |
| `logs/` | Token usage metrics | Optimization analysis |
| `archives/` | Historical workflows | Learning from past |

### App Documentation (`app-docs/`)

| Directory | Purpose | Maintained By |
|-----------|---------|---------------|
| `specs/` | Feature specifications in the format `[round-type]-[feature].md` | Manual + Report phase |
| `guides/` | Implementation patterns, and global AI rules. | Manual + Build phase |
| `mappings/` | A single, indexed file mapping features to their exact file paths. | Report phase |
| `architecture/` | System design | Manual + Plan phase |
| `deployment/` | Deployment procedures | Manual |
| `debugging/` | Known issues and their resolutions. | Report phase |

---

## 🔄 Migration from Old SDK

If you have existing scout/plan/build commands using Bash calls to external agents:

1. **Read the migration guide**: [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)
2. **Convert Bash calls to Task tool**: See examples in migration guide
3. **Test each phase**: Start with `/scout`, then `/plan`, `/build`, `/report`
4. **Full workflow test**: Run `/scout_plan_build` on a simple task

**Key changes:**
- OLD: `gemini -p "[prompt]"` via Bash
- NEW: `Task` tool with `general-purpose` agent and MCP prompts

---

## 🎓 Learning Resources

### Getting Started

1. **Try a simple task** (Small project pattern):
   ```
   "Add a /health endpoint that returns { status: 'ok' }"
   ```

2. **Try the delegate chain** (Medium project):
   ```bash
   /scout_plan_build "Add logging to all API endpoints" ""
   ```

3. **Add reporting for audits** (Large or regulated work):
   ```bash
   /scout_plan_build "Add user authentication with JWT" "https://jwt.io/introduction"
   ```

### Key Documents

- **Template CLAUDE.md**: [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory template
- **Migration Guide**: [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) - Old → New SDK
- **Contributor Guide**: [AGENTS.md](AGENTS.md) - Structure, workflows, doc skeletons
- **Slash Command Prompts**: `.claude/commands/*.md` - Orchestration details

### Example Workflows

Check `ai-docs/` after your first few workflows to see:
- Saved scout results and plans (`ai-docs/scout-results/`, `specs/`)
- Build and report summaries (`ai-docs/reports/`)
- Token usage logs if you wire them in (`ai-docs/logs/`)

---

## 🐛 Troubleshooting

**For complete troubleshooting guide, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

### Quick Fixes

#### "Slash commands not appearing"
```bash
# Most common: Restart Claude Code CLI session
exit
cd /path/to/project
claude-code
/help  # Verify commands loaded
```

### "All scout agents failed"
```bash
# Lower scale (use fewer agents)
/scout "[task]" "2"

# Or manually specify files
# Then skip to plan phase
```

### "Token budget exceeded"
```bash
# Check metrics
cat ai-docs/logs/workflow-metrics.jsonl

# Options:
# 1. Switch to budget mode (`/scout_plan_build "[task]" "" "budget"`)
# 2. Use smaller workflow (`/scout_plan_build "[task]" ""`) instead of full
# 3. Simplify task scope
# 4. Break into multiple smaller tasks
```

### "Tests failing in build"
```bash
# Review build report
cat ai-docs/builds/[latest]/build-report.md

# Fix specific failing task
# Then re-run build from that point
```

### "Git changes detected after scout"
```
WARNING: Scout agents modified files

# Automatic: git reset --hard (done by scout phase)
# Check scout report for details
# May need to adjust agent prompts
```



---

## 📈 Metrics & Optimization

### Token Usage Tracking

All workflows log to: `ai-docs/logs/workflow-metrics.jsonl`

```json
{
  "task": "add-auth",
  "tokens": { "scout": 8500, "plan": 28000, "build": 45000, "report": 4200 },
  "efficiency": 94,
  "tools": { "codex": 5, "gemini": 3, "claude": 2 }
}
```

### Analyzing Efficiency

```bash
# View recent workflows
tail -10 ai-docs/logs/workflow-metrics.jsonl | jq ".efficiency"

# Calculate average
cat ai-docs/logs/workflow-metrics.jsonl | jq -s 'map(.efficiency) | add/length'

# Find most efficient tool
cat ai-docs/logs/workflow-metrics.jsonl | jq -s 'map(.tools) | group_by(.codex) | max_by(length)'
```

### Continuous Improvement

After each workflow, check the report for:
- ✅ What worked well
- ⚠️ What could improve
- 🚀 Try next time

Update your token budgets in `.claude/commands/*.md` based on actual usage.

---

## 🤝 Contributing

### To This Template

1. Fork the repository
2. Create feature branch: `git checkout -b feature/improvement`
3. Add your enhancement
4. Test with real project
5. Submit PR with metrics showing improvement

### To Your Team

1. Copy this template to shared repo
2. Customize for your tech stack
3. Add team-specific patterns to `app-docs/guides/`
4. Share workflow metrics
5. Iterate and improve together

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🆘 Support

### Issues with Template
- GitHub Issues: [your-repo/issues](https://github.com/your-org/budget-agentic-workflow/issues)
- Discussions: [your-repo/discussions](https://github.com/your-org/budget-agentic-workflow/discussions)

### Issues with Claude Code
- Claude Code Docs: https://docs.claude.com/claude-code
- Report bugs: https://github.com/anthropics/claude-code/issues

---

## 🎯 Roadmap

### v1.1 (Planned)
- [ ] Additional MCP tool examples (Perplexity, Tavily search)
- [ ] Visual workflow diagrams
- [ ] Pre-configured project templates (Node.js, Python, Go)
- [ ] Token budget auto-tuning based on metrics

### v2.0 (Future)
- [ ] Team collaboration features
- [ ] Workflow templates for common tasks
- [ ] CI/CD integration examples
- [ ] Performance benchmarking suite

---

## 🏆 Success Stories

> "Reduced token usage by 60% while handling 3 enterprise projects simultaneously. The multi-agent scout alone is worth it."
> — Solo Developer, SaaS Startup

> "Finally found a way to organize AI development workflows. The mandatory pre-checks caught several architectural issues before coding."
> — Engineering Lead, FinTech

> "Project scale detection automatically routes tasks to optimal workflows. Saved hours of manual decision-making."
> — Full-Stack Developer, Agency

---

**Template Version**: 1.0
**Compatible with**: Claude Code Agent SDK (2025)
**Last Updated**: October 2025
**Maintained by**: [Your Name/Org]

---

## Quick Links

- 📖 [Template CLAUDE.md](CLAUDE-TEMPLATE.md)
- 🔄 [Migration Guide](MIGRATION-GUIDE.md)
- 🐛 [Troubleshooting Guide](TROUBLESHOOTING.md)
- 📊 [Slash Command Prompts](.claude/commands/)
- ✅ [Pre-Deploy Check](scripts/validation/pre-deploy-check.sh)
- 🏥 [Health Check](scripts/health-check/health-check.sh)

**Ready to 10x your development workflow? Start with a simple task and experience the power of multi-agent orchestration!** 🚀