# Claude Code - User Memory (Global Settings)

**Version**: 3.0 | **Last Updated**: October 2025 | **Scope**: All Projects

---

## 🎯 Core Philosophy

**Shift Knowledge from Context to Retrieval**—making all project intelligence persistent, structured, and instantly accessible via targeted retrieval (scouting/planning agents) rather than relying on the limited AI context window.

**R&D Framework** (Reduce and Delegate):
- Use token-efficient models for discovery and boilerplate
- Delegate to specialized tools (Gemini, Codex, Chrome DevTools)
- Reserve Claude for complex logic and architecture
- Achieve 90%+ token efficiency
- Default multi-agent workflows to budget mode; escalate to standard only when lean output is insufficient

---

## 🤖 Tool Delegation Strategy (Universal)

### Task Routing Matrix

| Task Type | Tool | Rationale |
|-----------|------|-----------|
| Read docs, summarize | Gemini MCP | Fast, cheap tokens |
| Boilerplate, configs | Codex MCP | Quick syntax, no context needed |
| Fix syntax bugs | Codex MCP | Immediate, no architectural context |
| UI/UX work | Codex MCP | Specializes in component code |
| Complex debugging (multi-file) | Claude | Requires architectural understanding |
| Architectural decisions | Claude | Strategic, long-term impact |
| Security/performance review | Claude | Critical, requires deep analysis |
| E2E testing | Chrome DevTools MCP | Testing specialty |

### Decision Tree

```
Step 1: Identify scope
  - Single file bug? → Codex MCP
  - Multi-file bug? → Claude
  - Config/env issue? → Codex MCP
  - Logic/architecture? → Claude

Step 2: Choose workflow by project scale
  - Small (<10 files): Direct implementation or `/scout_plan_build "<task>" "" "budget"` when you need extra context
  - Medium (10-50 files): `/scout_plan_build "<task>" "" "budget"` (upgrade to `standard` only if architecture changes)
  - Large (>50 files): `/scout_plan_build "<task>" "<docs>" "budget"`; rerun with `standard` after review if more depth is required

Step 3: Execute with minimal context
  - Read ONLY affected files
  - Use grep for targeted searches
  - Avoid reading entire directories
```

---

## 🚨 CRITICAL: Pre-Implementation Protocol

**BEFORE ANY CODE CHANGES, Claude must:**

1. ✅ **Read project documentation** (via Gemini MCP)
   - `app-docs/specs/[round-type]-[feature].md` if exists
   - `app-docs/guides/implementation-guidelines.md`
   - `app-docs/mappings/feature-to-source.md` (create if missing)

2. ✅ **Check existing patterns**
   ```bash
   # Search for similar implementations
   grep -r "pattern_keyword" app/
   grep -r "related_feature" app-docs/mappings/
   ```

3. ✅ **Confirm approach with user**
   ```markdown
   📋 Implementation Approach:

   Files to modify: [list]
   New files: [list]
   Pattern: [from app-docs/guides/]
   Token estimate: [breakdown]
   Risks: [identified risks + mitigation]

   Proceed? (yes/no)
   ```

4. ⏸️ **WAIT for explicit user approval**

**Never skip this for "efficiency" - it saves tokens by preventing wrong approaches.**

---

## 🛠️ Development Workflow (Universal)

### Workflow Selection by Project Scale

**Small Projects** (<10 files, <5K LOC):
```
User: "Add health check endpoint"
Claude: [uses Codex MCP directly]
✅ Done in ~10K tokens
```

**Medium Projects** (10-50 files, 5K-20K LOC):
```bash
/scout_plan_build "Add user authentication" "" "budget"  # drop "budget" for full plan
# Scout (10K) → Plan (30K) → Build + Report (40K) = ~80K total
```

**Large Projects** (>50 files, >20K LOC):
```bash
/scout_plan_build "Implement OAuth2" "https://oauth.net/2/" "budget"  # rerun with "standard" if more detail needed
# Scout (10K) → Plan (30K) → Build (50K) → Report (5K) = ~95K total
```



### Budget Mode Defaults
- Start every multi-agent run with `/scout_plan_build "<task>" "<docs>" "budget"` unless the user explicitly asks for a full plan.
- Expect scout scale 2 and a ~350-word plan; escalate to `standard` only when the lean summary is insufficient.
- Cap vector search output at 3 results and avoid secondary `rg` passes unless the primary search fails.
- Reference `app-docs/guides/budget-mode.md` inside each repo for the detailed checklist.

### Pre-Flight Checks (Before ANY deployment)

```bash
# Always run before deployment
./scripts/validation/pre-deploy-check.sh

# Checks:
# - Git status
# - Environment config
# - Dependencies
# - Build success
# - Tests passing
# - Linting
# - Port availability
```

### Post-Deployment Validation

```bash
# Always run after deployment
./scripts/health-check/health-check.sh

# Validates:
# - Service ports
# - HTTP endpoints
# - Database connectivity
# - Resource usage
```

---

## 📋 Code Quality Standards (Universal)

### Testing Requirements
- **Unit tests**: >80% coverage on business logic
- **Integration tests**: API, database, external services
- **E2E tests**: Critical user flows (use Chrome DevTools MCP)

### Security Checklist
- [ ] No secrets in version control (.env + .gitignore)
- [ ] Input validation on all user inputs
- [ ] Parameterized queries (prevent SQL injection)
- [ ] Authentication on protected routes
- [ ] Rate limiting on public APIs
- [ ] HTTPS in production
- [ ] Regular dependency audits (`npm audit`)
- [ ] Principle of least privilege

### Code Organization Principles
- **File size**: Target 300-500 lines per file
- **DRY**: Reuse patterns, don't reinvent
- **Separation of concerns**: Data, logic, presentation
- **Named constants**: No magic numbers
- **Complete solutions**: No placeholders or TODOs without issues

---

## 🎯 Documentation Standards (Universal)

### Required Documentation

**Every project needs:**
1. **CLAUDE.md** (from template) - Project memory
2. **README.md** - Setup, usage, quick reference
3. **app-docs/specs/** - Feature specifications
4. **app-docs/guides/** - Implementation patterns
5. **app-docs/mappings/feature-to-source.md** (create if missing) - File locations

### Documentation Workflow

**Before implementation:**
- Write spec in `app-docs/specs/[feature].md`
- Run `/plan` which reads spec automatically
- Get user approval

**After implementation:**
- `/report` phase auto-updates:
  - `app-docs/mappings/feature-to-source.md` (create if missing)
  - `README.md` (if needed)
  - Architecture docs (if structural changes)

**Never:**
- Duplicate information across docs
- Write docs without testing first
- Let docs get out of sync (use pre-commit hooks)

---

## 💡 Debugging Protocol (Universal)

### Step 1: Identify Scope (30 seconds, no AI)

```
Single file? → Codex MCP
Multi-file? → Claude
Config issue? → Codex MCP
Logic error? → Claude
```

### Step 2: Gather Minimal Context

```
- Read ONLY affected files
- Use grep for targeted searches
- Check app-docs/debugging/known-issues.md
- Review recent git commits
```

### Step 3: Execute Fix

```
Codex MCP:
  - Syntax errors
  - Type mismatches
  - Config file edits
  - Simple logic fixes

Claude:
  - Complex integration bugs
  - Architectural issues
  - Multi-file refactoring
  - Performance optimization
```

### Step 4: Validate

```bash
# Run tests
npm test

# Check linting
npm run lint

# Manual testing
curl http://localhost:3000/[endpoint]

# Review git diff
git diff --stat
```

---

## 🚀 Token Optimization Rules

1.  **Token Budget Detection**: Run a project scale check on every new task to determine the appropriate workflow (Small  Direct, Medium  /scout_build, Large  /scout_plan_build_report).
2.  **CRITICAL Pre-Implementation Protocol**: **NEVER skip the pre-approval phase.** This is the primary token gate. The AI must present its **Files to modify, Pattern, Token estimate, and Risks** and **WAIT for explicit user approval** before touching code.
3.  **Delegate Documentation Reading**: Use cheaper tools (like Gemini MCP) to summarize or read documentation and specs. **Do not waste Claude's tokens on reading large documentation files.**
4.  **Avoid Directory Reading**: The AI should **never** read an entire directory (e.g., src/). It must rely exclusively on the **scouting phase** and the **feature-to-source.md mapping file** to find the minimal required context.

---

## 📊 Metrics & Continuous Improvement

### Track Token Usage

All workflows log to: `ai-docs/logs/workflow-metrics.jsonl`

```bash
# Check efficiency weekly
cat ai-docs/logs/workflow-metrics.jsonl | jq '.efficiency' | tail -10

# Target: >90% average efficiency
# If lower, review tool delegation strategy
```

### Learn from Each Workflow

After every workflow, check report for:
- ✅ What worked well
- ⚠️ What could improve
- 🚀 Try next time

**Update your patterns:**
- Add successful patterns to `app-docs/guides/`
- Document common bugs in `app-docs/debugging/`
- Adjust token budgets based on actual usage

---

## 🏢 Multi-Tenant & Enterprise Patterns

### When Planning SaaS Features

1. **Business requirements first**
   - Tenant isolation strategy
   - Pricing tiers
   - Data residency

2. **Technical architecture**
   - Database design (shared vs isolated)
   - API authentication (tenant context)
   - Row-level security

3. **Security checklist**
   - [ ] Tenant data isolation (automated tests)
   - [ ] Audit logging (with tenant ID)
   - [ ] Compliance documentation (SOC 2, GDPR)
   - [ ] Rate limiting (per tenant)
   - [ ] Cross-tenant data leakage prevention

---

## 🔒 Git & Version Control

### Commit Standards

```
feat: Add user authentication (spec: app-docs/specs/auth.md)

Implementation plan: ai-docs/plans/2025-10-07-auth.md
Build report: ai-docs/builds/2025-10-07-auth/build-report.md

- Added JWT token generation
- Implemented login/logout endpoints
- 15/15 tests passing

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**Format:**
- **Type**: feat, fix, refactor, docs, test, chore
- **Description**: What changed (not how)
- **Reference**: Link to plan/spec
- **Details**: Bullet points of key changes
- **Credit**: Claude Code attribution



### Git Safety Rules

- ✅ Check `git diff --stat` after scout phase
- ✅ Review all changes before committing
- ✅ Run tests before committing
- ✅ Never commit secrets (.env in .gitignore)
- ✅ Use feature branches for large changes
- ❌ Never force push to main/master
- ❌ Never skip pre-commit hooks (unless emergency)

---

## 🎓 Learning & Adaptation

### When Starting New Project Type

```
1. Copy template: budget-agentic-workflow
2. Customize CLAUDE.md for tech stack
3. Run 2-3 small tasks to learn patterns
4. Document patterns in app-docs/guides/
5. Run full workflow on medium feature
6. Review metrics and optimize
```

### When Joining Existing Project

```
1. Run: node scripts/detect-project-scale.js
2. Read: app-docs/guides/ (existing patterns)
3. Read: app-docs/mappings/feature-to-source.md (when available)
4. Start with small bug fix (learn codebase)
5. Then try medium feature (use /scout_plan_build with empty doc list)
6. Add new patterns to app-docs/guides/
```

### When Learning New Technology

```
1. Use Firecrawl MCP to fetch official docs
2. Use Gemini MCP to summarize key concepts
3. Use Codex MCP for boilerplate examples
4. Use Claude for architectural guidance
5. Document learnings in app-docs/guides/
```

---

## 🚫 What NOT to Do

### DON'T Use AI For

**Manual tasks that are faster:**
- Checking port availability (`lsof -i :80`)
- Validating JSON syntax (`jq . < file.json`)
- Counting files (`find app/ -type f | wc -l`)
- Git operations (`git status`, `git diff`)

**One-time setups:**
- Environment variable configuration (edit .env manually)
- API key management (don't share with AI)
- Simple file renames (use `mv` command)

### DON'T Skip Steps

**Never skip pre-approval:**
- Even for "simple" tasks
- Saves tokens by catching wrong approaches
- User knows their project better than AI

**Never skip testing:**
- Run test suite after changes
- Manual testing for user-facing features
- Performance testing for critical paths

**Never skip documentation:**
- Update README if commands changed
- Update app-docs/mappings/ for new features
- Add to app-docs/debugging/ if issues found

---

## 🛠️ Tool-Specific Guidelines

### Gemini MCP
**Best for:**
- Reading/summarizing documentation
- Quick code searches
- Format conversions
- Initial drafts of specs

**Not for:**
- Complex logic (use Claude)
- Production code (use Codex or Claude)

### Codex MCP
**Best for:**
- CRUD endpoints
- Database models
- React components
- Config files
- Test boilerplate

**Not for:**
- Architectural decisions (use Claude)
- Complex algorithms (use Claude)

### Chrome DevTools MCP
**Best for:**
- E2E test generation
- User flow testing
- Visual regression tests

**Not for:**
- Unit tests (use Codex)
- Backend API tests (use Codex)

### Claude
**Best for:**
- Multi-agent orchestration
- Architectural planning
- Complex multi-file refactoring
- Strategic decisions
- Security reviews

**Not for:**
- Simple boilerplate (use Codex)
- Documentation reading (use Gemini)

---

## 📞 When Things Go Wrong

### Token Budget Exceeded

```
1. Check: ai-docs/logs/workflow-metrics.jsonl
2. Identify: Which phase used most tokens?
3. Optimize:
   - Scout: Reduce scale (4 → 2 agents)
   - Plan: Simplify scope
   - Build: More Codex/Gemini, less Claude
4. Retry with adjusted approach
```

### Tests Failing After Build

```
1. Don't retry immediately
2. Read: ai-docs/builds/[latest]/build-report.md
3. Identify: Which specific task caused failure
4. Fix: Use appropriate tool for that task
5. Re-run: Only that task, not entire build
```

### Scout Found No Files

```
1. Lower scale: /scout "[task]" "2"
2. Or manual: List files yourself
3. Skip to plan: /plan_w_docs "[task]" "" "[manual-files]"
4. Learn: Add patterns to app-docs/guides/
```

### User Rejected Plan

```
1. Good! Pre-approval working as intended
2. Ask user: What to change?
3. Revise approach based on feedback
4. Re-run plan phase
5. Document: Why original approach was wrong
```

---

## 🎯 Success Metrics

**You're using this correctly when:**

✅ Token efficiency >90% across all workflows
✅ Pre-approval catches issues before coding
✅ Documentation stays in sync automatically
✅ Patterns are reused across projects
✅ You can handle 3+ enterprise projects simultaneously
✅ Weekly token limits are sufficient
✅ Clear audit trail for all changes

**Warning signs:**

⚠️ Frequently hitting token limits
⚠️ Tests failing after builds
⚠️ Documentation out of sync
⚠️ Repeating same work across projects
⚠️ Pre-approval usually gets rejected
⚠️ Not using MCP tools (all Claude)

---

## 🔄 Quarterly Review

**Every 3 months, review:**

1. **Token efficiency trends**
   ```bash
   cat ai-docs/logs/workflow-metrics.jsonl | \
     jq '.efficiency' | \
     awk '{sum+=$1; count++} END {print sum/count}'
   ```

2. **Most effective tools**
   - Which tool has highest success rate?
   - Which saves most tokens?
   - Are we using the right tool for each task?

3. **Pattern reuse**
   - What patterns were added to app-docs/guides/?
   - Are they being reused?
   - What new patterns are needed?

4. **Update this document**
   - New learnings from past 3 months
   - Tool delegation strategy changes
   - Updated best practices

---

## 📚 Reference

**Template location:**
- GitHub: [your-template-repo]
- Local: `~/templates/budget-agentic-workflow/`

**Key documents:**
- [README.md](README.md) - Complete template docs
- [GETTING-STARTED.md](GETTING-STARTED.md) - 5-minute setup guide
- [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md) - Old SDK → New

**Support:**
- Claude Code: https://docs.claude.com/claude-code
- Template issues: [GitHub issues]

---

**User Memory Version**: 3.0
**Scope**: All projects (universal principles)
**Last Updated**: October 2025
**Owner**: [Your Name]

---

## 🎉 Remember

> "The best code is no code. The second best is code written by the right tool for the job."

- Use Gemini for reading
- Use Codex for writing
- Use Claude for thinking
- Achieve 90%+ efficiency
- Ship faster, spend less

**Now go build amazing things!** 🚀
