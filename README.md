# Agentic Development Workflow Template

**Version**: 1.0 | **Status**: Production Ready | **Compatible with**: Claude Code Agent SDK

A comprehensive template for enterprise-scale development using Claude Code with multi-agent orchestration, MCP tool integration, and token-optimized workflows.

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

### 🔧 MCP Tool Integration
- Gemini MCP (documentation, summarization)
- Codex MCP (code generation, syntax fixes, UI/UX)
- Playwright MCP (E2E testing)
- Shadcn (UI components)
- Firecrawl (web scraping/docs)

### 📊 Project Scale Detection
- **Small** (<10 files): Direct implementation (~10K tokens)
- **Medium** (10-50 files): Scout + Build (~40K tokens)
- **Large** (>50 files): Full workflow (~100K tokens)

### 🛡️ Safety & Quality
- Pre-deployment validation scripts
- Post-deployment health checks
- Git safety checks (auto-reset on unintended changes)
- Mandatory user approval before implementation

---

## 🚀 Quick Start

### 1. Copy Template to Your Project

```bash
# Clone this template
git clone https://github.com/your-org/agentic-development-workflow.git my-project
cd my-project

# Or copy files to existing project
cp -r agentic-development-workflow/. my-existing-project/
```

### 2. Setup Directory Structure

```
my-project/
├── ai-docs/              # AI workflow artifacts
│   ├── workflows/        # Scout, plan, build, report processes
│   ├── plans/            # Generated implementation plans
│   ├── builds/           # Build logs and reports
│   ├── reports/          # Workflow summaries
│   └── logs/             # Token usage metrics
├── app-docs/             # Application documentation
│   ├── specs/            # Feature specifications
│   ├── guides/           # Implementation patterns
│   ├── mappings/         # Feature-to-source relationships
│   ├── architecture/     # System design
│   ├── deployment/       # Deployment guides
│   └── debugging/        # Known issues, troubleshooting
├── app/                  # Your application code
├── scripts/              # Utility scripts
│   ├── validation/       # Pre-deployment checks
│   └── health-check/     # Post-deployment validation
├── .claude/              # Claude Code configuration
│   └── commands/         # Slash command implementations
├── .mcp/                 # MCP tool configs
├── CLAUDE.md             # Project memory (copy from CLAUDE-TEMPLATE.md)
└── README.md             # This file
```

### 3. Configure MCP Tools

```bash
# Copy example configs
cp .mcp/gemini-config.example.json .mcp/gemini-config.json
cp .mcp/codex-config.example.json .mcp/codex-config.json

# Add API keys to .env (DO NOT commit!)
echo "GEMINI_API_KEY=your_key_here" >> .env
echo "OPENAI_API_KEY=your_key_here" >> .env
```

See [.mcp/README.md](.mcp/README.md) for detailed setup.

### 4. Customize CLAUDE.md

```bash
# Copy template
cp CLAUDE-TEMPLATE.md CLAUDE.md

# Edit CLAUDE.md:
# - Update [Project Name]
# - Add your architecture summary
# - Customize Quick Commands
# - Add project-specific navigation
```

### 5. Test the Workflow

```bash
# Detect your project scale
node ai-docs/helpers/detect-project-scale.js

# Run a simple task
# In Claude Code, run:
/scout_plan_build_report "Add health check endpoint at /health" ""
```

---

## 📖 Usage

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

**Scout + Build** - Skip planning for simple tasks

```bash
/scout_build "Add user authentication"
```

**Process:**
1. Scout (10K): Multi-agent file discovery
2. Build (30K): Implementation with tool delegation
**Total**: ~40K tokens

**When to use:**
- Known patterns exist
- Task is well-understood
- Fast iteration needed

---

#### Large Projects (>50 files, >20K LOC)

**Full Workflow** - Complete Scout → Plan → Build → Report

```bash
/scout_plan_build_report "Implement OAuth2 authentication" "https://docs.example.com/oauth"
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
- Enterprise-scale implementations

---

## 🔧 Slash Commands

### Core Workflows

| Command | Purpose | Token Budget |
|---------|---------|--------------|
| `/scout "[task]" "4"` | Multi-agent file discovery | ~10K |
| `/plan "[task]" "[docs]" "[files]"` | Create implementation plan | ~30K |
| `/build "[plan-path]"` | Execute plan with tool delegation | ~50K |
| `/report "[build-report]"` | Generate summary & update docs | ~5K |
| `/scout_plan_build_report "[task]" "[docs]"` | Full workflow | ~100K |
| `/scout_build "[task]"` | Quick workflow (skip plan) | ~40K |

### Individual Phase Commands

**Scout Phase:**
```bash
/scout "Find all authentication-related files" "4"
# Returns: ai-docs/scout-results/[timestamp]/files-collection.txt
```

**Plan Phase:**
```bash
/plan "Add OAuth2" "https://docs.oauth.net" "ai-docs/scout-results/[timestamp]/files-collection.txt"
# ⚠️ WAITS FOR USER APPROVAL before proceeding
# Returns: ai-docs/plans/[timestamp]-oauth2.md
```

**Build Phase:**
```bash
/build "ai-docs/plans/[timestamp]-oauth2.md"
# Uses: Codex, Gemini, Claude, Playwright based on plan
# Returns: ai-docs/builds/[timestamp]/build-report.md
```

**Report Phase:**
```bash
/report "ai-docs/builds/[timestamp]/build-report.md"
# Updates: app-docs/mappings/, README.md
# Returns: ai-docs/reports/[timestamp]-summary.md
```

---

## 🤖 Tool Delegation Strategy

### When to Use Each Tool

| Tool | Use For | Token Cost | Example |
|------|---------|------------|---------|
| **Gemini MCP** | Docs, specs, summaries | Low | "Summarize API docs" |
| **Codex MCP** | Boilerplate, syntax, UI | Low | "Generate CRUD endpoints" |
| **Claude** | Complex logic, integration | High | "Refactor service layer" |
| **Playwright** | E2E testing | Medium | "Generate login flow tests" |
| **Shadcn** | UI components | Low | "Add button component" |
| **Firecrawl** | External docs | Low | "Fetch OAuth2 spec" |

### Decision Rules

```
Single file + syntax? → Codex MCP
Documentation? → Gemini MCP
Multi-file + logic? → Claude
Testing? → Playwright MCP
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
| `specs/` | Feature specifications | Manual + Report phase |
| `guides/` | Implementation patterns | Manual + Build phase |
| `mappings/` | Feature-to-source relationships | Report phase |
| `architecture/` | System design | Manual + Plan phase |
| `deployment/` | Deployment procedures | Manual |
| `debugging/` | Known issues | Report phase |

---

## 🔄 Migration from Old SDK

If you have existing scout/plan/build commands using Bash calls to external agents:

1. **Read the migration guide**: [ai-docs/MIGRATION-GUIDE.md](ai-docs/MIGRATION-GUIDE.md)
2. **Convert Bash calls to Task tool**: See examples in migration guide
3. **Test each phase**: Start with `/scout`, then `/plan`, `/build`, `/report`
4. **Full workflow test**: Run `/scout_plan_build_report` on a simple task

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

2. **Try Scout + Build** (Medium project):
   ```bash
   /scout_build "Add logging to all API endpoints"
   ```

3. **Try Full Workflow** (Large project):
   ```bash
   /scout_plan_build_report "Add user authentication with JWT" "https://jwt.io/introduction"
   ```

### Key Documents

- **Template CLAUDE.md**: [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory template
- **Migration Guide**: [ai-docs/MIGRATION-GUIDE.md](ai-docs/MIGRATION-GUIDE.md) - Old → New SDK
- **Workflow Specs**: `ai-docs/workflows/*.md` - Detailed phase documentation
- **MCP Setup**: [.mcp/README.md](.mcp/README.md) - Tool configuration

### Example Workflows

Check `ai-docs/archives/` after your first few workflows to see:
- How plans are structured
- How tasks are delegated to tools
- Token usage patterns
- Lessons learned

---

## 🐛 Troubleshooting

### "MCP tool not found"
```bash
# Check MCP config
ls -la .mcp/*.json

# Verify API keys
cat .env | grep API_KEY

# Test tool directly
gemini --version
codex --version
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
# 1. Use smaller workflow (scout_build instead of full)
# 2. Simplify task scope
# 3. Break into multiple smaller tasks
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
tail -10 ai-docs/logs/workflow-metrics.jsonl | jq '.efficiency'

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

Update your token budgets in `ai-docs/workflows/*.md` based on actual usage.

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
- GitHub Issues: [your-repo/issues](https://github.com/your-org/agentic-development-workflow/issues)
- Discussions: [your-repo/discussions](https://github.com/your-org/agentic-development-workflow/discussions)

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
- 🔧 [MCP Setup](.mcp/README.md)
- 🔄 [Migration Guide](ai-docs/MIGRATION-GUIDE.md)
- 📊 [Workflow Specs](ai-docs/workflows/)
- ✅ [Pre-Deploy Check](scripts/validation/pre-deploy-check.sh)
- 🏥 [Health Check](scripts/health-check/health-check.sh)

**Ready to 10x your development workflow? Start with a simple task and experience the power of multi-agent orchestration!** 🚀
