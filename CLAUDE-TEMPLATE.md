# CLAUDE.md - [Project Name]

**Version**: 1.0 | **Last Updated**: [Date] | **Purpose**: Agentic development workflow orchestration

---

## 🚨 CRITICAL: Read This First

### Project Scale: [Small / Medium / Large]

**Small Projects** (<10 files, <5K LOC):
- Skip scout phase
- Use direct implementation with Codex/Gemini
- Minimal documentation overhead

**Medium Projects** (10-50 files, 5K-20K LOC):
- Use `/scout` → `/build` (skip plan for simple tasks)
- Generate focused documentation
- Selective tool delegation

**Large Projects** (>50 files, >20K LOC):
- **Full workflow required**: `/scout` → `/plan` → `/build` → `/report`
- Comprehensive documentation
- Mandatory pre-implementation checks

---

## 🤖 Mandatory Pre-Implementation Checks

**BEFORE Claude implements ANY code, execute these steps:**

### Step 1: Read Specifications (Gemini MCP - 2K tokens)

```
Use gemini-mcp-tool to summarize:
1. app-docs/specs/[round-type]-[feature].md
2. app-docs/guides/implementation-guidelines.md
3. app-docs/mappings/feature-to-source.md (create if missing)
```

**Questions to answer:**
- Does this feature already exist?
- What patterns should be followed?
- Are there known constraints?

### Step 2: Check Existing Patterns (Grep - 0 tokens)

```bash
# Search for similar implementations
grep -r "similar_pattern" app/
grep -r "related_feature" app-docs/mappings/
```

### Step 3: Confirm Approach with User

**Present to user:**
```
📋 Implementation Approach:

Files to modify:
- [file1.js] - [what changes]
- [file2.js] - [what changes]

New files to create:
- [file3.js] - [purpose]

Architectural pattern:
- [Pattern name from app-docs/guides/]

Estimated token usage:
- Scout: [X]K
- Plan: [Y]K
- Build: [Z]K
- Total: [Total]K

Risks identified:
- [Risk 1]: [Mitigation]

Proceed? (yes/no)
```

**Wait for user approval before ANY code changes.**

---

## 📚 Navigation Hub

### Quick Start
- **README.md**: Installation and setup
- **app-docs/specs/**: Feature specifications
- **app-docs/guides/**: Implementation patterns
- **.claude/commands/**: Slash-command prompts for scout, plan, build, report

### Active Development
- **Current work**: [Link to active plan in ai-docs/plans/]
- **Latest build**: [Link to latest build report]
- **Known issues**: [app-docs/debugging/known-issues.md]

### Workflow Documents
- 🔍 **Scout**: [.claude/commands/scout.md](.claude/commands/scout.md) - Multi-agent file discovery (10K tokens)
- 📋 **Plan**: [.claude/commands/plan_w_docs.md](.claude/commands/plan_w_docs.md) - Documentation-aware planning (30K tokens)
- 🔨 **Build**: [.claude/commands/build.md](.claude/commands/build.md) - Implementation (50K tokens)
- 📊 **Report**: [.claude/commands/build_w_report.md](.claude/commands/build_w_report.md) - Summary & next steps (5K tokens)

---

## 🏗️ Architecture Summary

**[Describe your project architecture here]**

Example:
```
Backend: Node.js/Express + SQLite
Frontend: React + TypeScript + Vite
Real-time: WebSocket (Socket.io)
Testing: Jest (backend), Vitest (frontend)
Deployment: Docker + nginx
```

**Key patterns:**
- [Pattern 1]: [Description]
- [Pattern 2]: [Description]

**Service boundaries:**
- [Service 1]: [Responsibility]
- [Service 2]: [Responsibility]

---

## 🤖 AI Tool Selection (Token Optimization)

### Tool Routing Matrix

| Task Type | Tool | Token Cost | When to Use |
|-----------|------|------------|-------------|
| Read/summarize docs | Gemini MCP | Low | Always for documentation |
| Syntax fixes | Codex MCP | Low | Single file, no context needed |
| Boilerplate code | Codex MCP | Low | Configs, simple functions |
| UI/UX work | Codex MCP | Medium | Component styling, layouts |
| Complex logic | Claude | High | Multi-file integration |
| Architectural decisions | Claude | High | Strategic, long-term impact |
| Testing | Playwright + Codex | Medium | E2E + unit tests |
| Web scraping | Firecrawl MCP | Low | External docs, research |
| UI components | Shadcn MCP | Low | Standard UI patterns |

### Decision Rules

```
Single file + syntax? → Codex MCP
Documentation task? → Gemini MCP
Multi-file + logic? → Claude
Testing? → Playwright MCP + Codex MCP
UI components? → Shadcn MCP + Codex MCP
External research? → Firecrawl MCP
```

---

## 🎯 Workflow Execution

### Option 1: Full Workflow (Large projects)

```bash
/scout_plan_build "[task description]" "[doc-urls]"
```

**Executes:**
1. Scout (10K tokens) - Find relevant files
2. Plan (30K tokens) - Create implementation plan
3. Build (50K tokens) - Execute with tool delegation
4. Report (5K tokens) - Summarize and update docs

**Total**: ~100K tokens

### Option 2: Delegate Chain (Medium projects, no external docs)

```bash
/scout_plan_build "[task description]" ""
```

**Executes:**
1. Scout (10K tokens)
2. Plan (30K tokens)
3. Build + Report (40K tokens)

**Total**: ~80K tokens

### Option 3: Direct Implementation (Small projects)

```bash
# No slash commands, just describe task
# Claude will use Codex/Gemini MCP directly
```

**Total**: ~10K tokens

---

## 📁 Project Structure

```
project-root/
├── ai-docs/                    # Workflow artifacts (populated after runs)
│   ├── scout-results/          # Generated by /scout (on demand)
│   ├── reports/                # Build summaries (on demand)
│   └── logs/                   # Token usage, metrics (optional)
│
├── app-docs/                   # Application documentation (starts empty)
│   ├── specs/                  # Feature specifications in the format `[round-type]-[feature].md`
│   ├── guides/                 # Implementation guidelines and common patterns
│   ├── mappings/               # Feature-to-source relationships
│   │   └── feature-to-source.md (create when documenting features)
│   ├── architecture/           # System design, diagrams
│   ├── deployment/             # Deployment guides, configs
│   └── debugging/              # Known issues, troubleshooting
│       └── known-issues.md
│
├── app/                        # Application source code
│   ├── [your app structure]
│   └── ...
│
├── scripts/                    # Utility scripts (scale detection, health checks)
│   └── detect-project-scale.js
│
├── .claude/                    # Claude Code configuration
│   ├── commands/               # Slash command implementations
│   │   ├── scout_plan_build.md
│   │   ├── scout.md
│   │   ├── plan_w_docs.md
│   │   ├── quick-plan.md
│   │   ├── build.md
│   │   └── build_w_report.md
│   └── settings.local.json
│
├── .mcp/                       # MCP tool configs
│   ├── gemini-config.json
│   ├── codex-config.json
│   └── playwright-config.json
│
├── CLAUDE.md                   # This file (project memory)
├── README.md                   # Project documentation
└── package.json                # Dependencies
```

---

## ⚡ Quick Commands

### Development
```bash
# [Add your project-specific commands]
npm run dev          # Start development server
npm test             # Run tests
npm run build        # Build for production
```

### Workflow
```bash
# Full workflow

/scout_plan_build "Add user authentication" "https://docs.example.com/auth"

# Partial workflow
/scout "Fix login bug" "4"
/plan_w_docs "Plan authentication refactor" "https://..." "[files]"
/build "[plan-file-path]"
/build_w_report "[plan-file-path]"

# Lightweight planning
/quick-plan "Add tooltip" "[files]"
```



---

## 🎯 Task-Specific Navigation

### "Implement new feature"
1. ✅ **Read**: app-docs/specs/[feature].md (Gemini MCP)
2. ✅ **Check**: app-docs/mappings/feature-to-source.md for patterns (create if missing)
3. ✅ **Confirm**: Approach with user
4. 🚀 **Execute**: `/scout_plan_build "[feature]" "[docs]"`

### "Fix bug"
1. ✅ **Check**: app-docs/debugging/known-issues.md
2. 🔍 **Search**: Grep for error message
3. 🔧 **Fix**: Codex MCP for syntax, Claude for logic
4. ✅ **Test**: Validate fix

### "Refactor code"
1. 📋 **Plan**: Architectural impact analysis (Claude)
2. 🔍 **Scout**: Find all affected files
3. 🔨 **Build**: Incremental refactoring
4. ✅ **Validate**: Tests pass, no regressions

### "Add tests"
1. 🎯 **Target**: Identify component to test
2. 🤖 **Generate**: Playwright MCP + Codex MCP
3. ✅ **Run**: Verify all tests pass
4. 📊 **Report**: Coverage metrics

---

## 📊 Token Budget Templates

### Small Task (Single file, simple change)
- Direct implementation: ~5K tokens
- Tool: Codex MCP

### Medium Task (Few files, moderate complexity)
- Scout: 5K
- Build: 15K
- **Total**: ~20K tokens
- Tools: Gemini (scout), Codex (build)

### Large Task (Multi-file, complex logic)
- Scout: 10K
- Plan: 30K
- Build: 50K
- Report: 5K
- **Total**: ~95K tokens
- Tools: All (Gemini, Codex, Claude, MCP tools)

### Enterprise Task (Architectural changes)
- Scout: 15K
- Plan: 50K
- Build: 100K
- Validate: 10K
- Report: 5K
- **Total**: ~180K tokens
- Tools: Primarily Claude with MCP delegation

---

## 🔒 Security Checklist

- [ ] No secrets in repository (.env + .gitignore)
- [ ] Input validation on user inputs
- [ ] Parameterized queries (prevent SQL injection)
- [ ] Authentication on protected routes
- [ ] Rate limiting on APIs
- [ ] HTTPS in production
- [ ] Regular dependency updates
- [ ] Least privilege access

---

## ⚠️ Current Project State

**Phase**: [Current development phase]
**Status**: [Active/On-hold/Complete]

**Recent Changes**:
- [Date]: [Change description]
- [Date]: [Change description]

**Active Branches**:
- `main`: [Status]
- `develop`: [Status]
- `feature/[name]`: [Status]

**Known Issues**:
→ See [app-docs/debugging/known-issues.md](app-docs/debugging/known-issues.md)

---

## 🛠️ Debugging Protocol

### Quick Diagnosis (No AI)

1. **Check logs**
   ```bash
   tail -f logs/[service].log
   ```

2. **Check status**
   ```bash
   [status command for your app]
   ```

3. **Verify config**
   ```bash
   cat .env | grep [VARIABLE]
   ```

### Targeted Debugging (Codex for syntax, Claude for logic)

1. **Identify scope**
   - Single file bug? → Codex MCP
   - Multi-file bug? → Claude
   - Config issue? → Codex MCP

2. **Gather minimal context**
   - Read ONLY affected files
   - Use grep for searches
   - Check app-docs/debugging/

3. **Execute fix**
   - Codex: Syntax, configs
   - Claude: Logic, integration

4. **Validate**
   - Run tests
   - Check health endpoints
   - Review logs

---

## 📝 Documentation Standards

### When to Update Docs

**Automatically updated by report phase:**
- app-docs/mappings/feature-to-source.md (create if missing)
- app-docs/architecture/[changed docs]
- README.md (if commands changed)

**Manually update:**
- app-docs/specs/ (new feature specs)
- app-docs/guides/ (new patterns introduced)
- app-docs/debugging/known-issues.md (bugs found)

### Documentation Format

**Specifications** (app-docs/specs/):
```markdown
# Feature Name

## Purpose
[What problem does this solve?]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Implementation
- API endpoints: [list]
- Database tables: [list]
- Components: [list]

## Testing
- Unit tests: [files]
- Integration tests: [scenarios]
```

**Guides** (app-docs/guides/):
```markdown
# Pattern Name

## When to Use
[Scenarios where this pattern applies]

## Implementation
[Code examples]

## Examples in Codebase
- [file1.js:123] - [description]
- [file2.js:456] - [description]
```

---

## 💡 Workflow Optimization Tips

### Maximize Token Efficiency

1. **Use Gemini MCP for reading**
   - Documentation summarization
   - File content analysis
   - Pattern extraction

2. **Use Codex MCP for writing**
   - Boilerplate generation
   - Syntax fixes
   - UI component code

3. **Use Claude for thinking**
   - Architecture decisions
   - Complex debugging
   - Multi-file integration

### Parallel Execution

```bash
# Good: Independent tasks in parallel
Task 1: Add endpoint A (Codex MCP) ║ Task 2: Add endpoint B (Codex MCP)

# Bad: Dependent tasks in parallel
Task 1: Update schema ║ Task 2: Update model (depends on Task 1) ❌
```

### Error Recovery

```
Error in build?
  → Check build log in ai-docs/builds/
  → Identify failing task
  → Retry with appropriate tool
  → If still failing, escalate to Claude
```

---

## 🚀 Next Steps After Setup

1. **Initialize Project Structure**
   ```bash
   # Copy this template as CLAUDE.md to your project
   # Update [Project Name], [Architecture], [Commands]
   ```

2. **Configure MCP Tools**
   ```bash
   # Setup .mcp/ configs for your tools
   # See ai-docs/mcp-configs/ for templates
   ```

3. **Create Initial Documentation**
   ```bash
   # Add specs to app-docs/specs/
   # Add implementation guides to app-docs/guides/
   # Create feature-to-source.md mapping if it does not exist
   ```

4. **Test Workflow**
   ```bash
   # Run a simple task through full workflow
   /scout_plan_build "Add health check endpoint" ""
   ```

5. **Refine Token Budgets**
   ```bash
   # After a few builds, review ai-docs/logs/workflow-metrics.jsonl
   # Adjust token budgets in workflow docs if needed
   ```

---

**Last Updated**: [Date]
**Project**: [Project Name]
**Template Version**: 1.0
**Maintained By**: Claude Code Agentic Workflow
