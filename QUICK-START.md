# Quick Start Guide

Get up and running with the agentic development workflow in 5 minutes.

---

## 1. Setup (2 minutes)

### Copy API Keys

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your keys:
# - GEMINI_API_KEY
# - OPENAI_API_KEY
```

### Configure MCP Tools

```bash
# Copy MCP configs
cp .mcp/gemini-config.example.json .mcp/gemini-config.json
cp .mcp/codex-config.example.json .mcp/codex-config.json

# Verify configs are valid JSON
cat .mcp/gemini-config.json | jq .
```

### Customize Project Memory

```bash
# Copy template
cp CLAUDE-TEMPLATE.md CLAUDE.md

# Edit CLAUDE.md:
# 1. Replace [Project Name] with your project name
# 2. Update "Architecture Summary" section
# 3. Customize "Quick Commands" for your project
```

---

## 2. Detect Your Project Scale (30 seconds)

```bash
# Run scale detector
node ai-docs/helpers/detect-project-scale.js

# Example output:
# 📊 Project Scale: MEDIUM
# 💡 Recommended: /scout_build "[task]"
# 🎯 Token Budget: ~40K
```

**Based on result:**
- **SMALL**: Use direct implementation (no slash commands)
- **MEDIUM**: Use `/scout_build "[task]"`
- **LARGE**: Use `/scout_plan_build_report "[task]" "[docs]"`

---

## 3. Run Your First Workflow (2 minutes)

### Small Project Example

```
User: "Add a health check endpoint at /health that returns { status: 'ok' }"

Claude: [uses Codex MCP to generate endpoint]
         [creates file: app/api/health.js]
         [writes simple route]

✅ Done in ~5K tokens
```

### Medium Project Example

In Claude Code, run:

```bash
/scout_build "Add logging to all API endpoints"
```

**What happens:**
1. Scout agents find all API files (10K tokens)
2. Build phase adds logging with Codex (25K tokens)
3. Total: ~35K tokens

### Large Project Example

In Claude Code, run:

```bash
/scout_plan_build_report "Add user authentication with JWT" "https://jwt.io/introduction"
```

**What happens:**
1. Scout: Multi-agent file discovery (10K)
2. Plan: Architecture + **user approval required** (30K)
3. Build: Hybrid tool delegation (50K)
4. Report: Summary + doc updates (5K)
5. Total: ~95K tokens

---

## 4. Review Results (1 minute)

### Check Build Report

```bash
# Find latest build report
ls -lt ai-docs/builds/

# View report
cat ai-docs/builds/[latest]/build-report.md
```

### Verify Changes

```bash
# See what was changed
git status
git diff

# Run tests
npm test

# Check health (if you added /health)
curl http://localhost:3000/health
```

---

## 5. Next Steps

### Learn the Workflows

- **Small project workflow**: Just describe tasks to Claude
- **Medium workflow**: Read [.claude/commands/scout.md](.claude/commands/scout.md) and [.claude/commands/build.md](.claude/commands/build.md)
- **Large workflow**: Read full workflow in [.claude/commands/scout_plan_build_report.md](.claude/commands/scout_plan_build_report.md)

### Customize for Your Project

1. **Add specs**: Create `app-docs/specs/[feature].md` for planned features
2. **Document patterns**: Add to `app-docs/guides/implementation-guidelines.md`
3. **Map features**: Update `app-docs/mappings/feature-to-source.md`

### Optimize Token Usage

```bash
# After a few workflows, check metrics
cat ai-docs/logs/workflow-metrics.jsonl | jq '.efficiency'

# Average should be >85%
# If lower, review tool delegation in build reports
```

---

## Common Issues

### "MCP tool not found"

```bash
# Check configs exist
ls -la .mcp/*.json

# Verify API keys set
cat .env | grep API_KEY

# Expected: Keys should be set (not "your_key_here")
```

**Fix**: Add real API keys to `.env`

### "Scout phase failed"

```bash
# Try with fewer agents (scale=2 instead of 4)
/scout "[task]" "2"

# Or manually list files and skip to plan
/plan "[task]" "" "[manual file list]"
```

### "Tests failing"

```bash
# Review build report for details
cat ai-docs/builds/[latest]/build-report.md

# Check test output
cat ai-docs/builds/[latest]/test-output.txt

# Fix and re-run tests
npm test
```

---

## Tips for Success

### 1. Start Small
- Don't use `/scout_plan_build_report` for trivial tasks
- Let project scale detection guide you
- Build confidence with simple tasks first

### 2. Trust the Process
- **Plan phase user approval**: Review carefully, it's there to save tokens
- **Tool delegation**: Codex for boilerplate is intentional
- **Token budgets**: Based on real usage, they work

### 3. Iterate and Improve
- Review `ai-docs/reports/` after each workflow
- Check "Lessons Learned" section
- Update token budgets if needed

### 4. Document as You Go
- Add specs BEFORE features (saves tokens in plan phase)
- Keep `feature-to-source.md` updated
- Document patterns for reuse

---

## Example Session

```bash
# Detect scale
$ node ai-docs/helpers/detect-project-scale.js
📊 Project Scale: LARGE
💡 Recommended: /scout_plan_build_report

# Run workflow
$ # In Claude Code:
/scout_plan_build_report "Add rate limiting to API endpoints" "https://expressjs.com/en/advanced/best-practice-security.html"

# Scout phase (10K tokens, 2 minutes)
✅ Found 12 relevant files

# Plan phase (28K tokens, 5 minutes)
📋 Implementation Plan:
   - Middleware: app/middleware/rate-limiter.js
   - Config: app/config/rate-limits.js
   - Tests: app/middleware/rate-limiter.test.js

⚠️ WAITING FOR USER APPROVAL
Proceed? (yes/no)

$ yes

# Build phase (45K tokens, 15 minutes)
✅ 3 tasks completed
✅ 12/12 tests passing
✅ Linting passed

# Report phase (4K tokens, 1 minute)
✅ Documentation updated
📊 Token efficiency: 92%

# Total: 87K tokens, 23 minutes
# vs. All-Claude approach: ~140K tokens, 30+ minutes
# Savings: 38%!

# Verify
$ npm test
✅ All tests passing

$ curl -X POST http://localhost:3000/api/test
# (make many requests...)
❌ HTTP 429 Too Many Requests
✅ Rate limiting works!
```

---

## Ready to Go!

You're now set up with:
- ✅ MCP tools configured
- ✅ Project memory (CLAUDE.md) customized
- ✅ Project scale detected
- ✅ First workflow completed

**Next**: Try a real task from your backlog!

For detailed documentation, see:
- [README.md](README.md) - Full documentation
- [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory template
- [ai-docs/MIGRATION-GUIDE.md](ai-docs/MIGRATION-GUIDE.md) - Migrating from old SDK

---

**Questions?**
- Check [README.md](README.md) Troubleshooting section
- Review workflow docs in `ai-docs/workflows/`
- Open GitHub issue for template bugs

**Happy coding! 🚀**
