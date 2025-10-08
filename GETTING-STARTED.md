# Getting Started - Visual Guide

**Choose your path based on what you need:**

---

## 🎯 I Want To...

### → Set Up User Memory (Global, One-Time)

**What:** Universal principles for ALL your projects
**Time:** 5 minutes
**Frequency:** Once (update quarterly)

```bash
# 1. Copy user memory template
cp USER-MEMORY-CLAUDE.md ~/claude-user-memory.md

# 2. Add to Claude Code settings
# - Open Claude Code
# - Settings → User Memory
# - Paste contents from USER-MEMORY-CLAUDE.md

# 3. Done! This now works across ALL projects
```

**You get:** Tool delegation rules, workflows, standards for every project

---

### → Use This Template in a New Project

**What:** Start fresh project with agentic workflow
**Time:** 10 minutes
**Frequency:** Once per new project

```bash
# 1. Clone/copy template
git clone [template-repo] my-new-project
cd my-new-project

# 2. Setup MCP tools
cp .env.example .env
# Edit .env - add your API keys

# 3. Customize project memory
cp CLAUDE-TEMPLATE.md CLAUDE.md
# Edit CLAUDE.md:
# - Replace [Project Name]
# - Update architecture section

# 4. Detect scale
node scripts/detect-project-scale.js

# 5. Start coding!
# In Claude Code, try:
/scout_plan_build "Add health check endpoint" ""
```

**You get:** Full workflow template ready to use

---

### → Add Template to Existing Project

**What:** Bring agentic workflow to existing codebase
**Time:** 15 minutes
**Frequency:** Once per existing project

```bash
# 1. Copy template files to existing project
cd ~/my-existing-project
cp -r ~/agentic-workflow-template/ai-docs ./
cp -r ~/agentic-workflow-template/app-docs ./
cp -r ~/agentic-workflow-template/scripts ./
cp -r ~/agentic-workflow-template/.claude ./
cp ~/agentic-workflow-template/.gitignore ./.gitignore-template
cp ~/agentic-workflow-template/.env.example ./

# 2. Merge .gitignore
cat .gitignore-template >> .gitignore

# 3. Setup MCP
cp .env.example .env
# Add your API keys to .env

# 4. Create project memory
cp ~/agentic-workflow-template/CLAUDE-TEMPLATE.md ./CLAUDE.md
# Edit CLAUDE.md with your project details

# 5. Detect scale
node scripts/detect-project-scale.js

# 6. Organize existing docs (optional)
mv docs/* app-docs/  # or organize manually

# 7. Try first workflow
# In Claude Code:
/scout "Find all API endpoints" "2"
```

**You get:** Template integrated with your existing code

---

### → Understand What Goes Where

**What:** Learn user memory vs project memory
**Time:** 5 minutes

**Read:** [MEMORY-COMPARISON.md](MEMORY-COMPARISON.md)

**Quick answer:**
- **User Memory** (global): Tool rules, workflows, standards
- **Project CLAUDE.md**: Architecture, file locations, commands

**Visual:**
```
User Memory (ONE copy, global)
    ↓
    Applies to ALL projects
    ↓
┌───────────────┬───────────────┬───────────────┐
│  Project A    │  Project B    │  Project C    │
│  CLAUDE.md    │  CLAUDE.md    │  CLAUDE.md    │
│  (A-specific) │  (B-specific) │  (C-specific) │
└───────────────┴───────────────┴───────────────┘
```

---

### → Try a Simple Task First

**What:** Test the workflow with minimal task
**Time:** 5 minutes

**Small project example:**
```
In Claude Code, just describe:
"Add a /health endpoint that returns { status: 'ok' }"

Claude will:
- Detect project is small
- Use Codex MCP directly
- Generate endpoint
- ~5-10K tokens
```

**Medium project example:**
```bash
/scout_plan_build "Add logging to all API routes" ""

# Scout: Finds routes (10K)
# Plan: Documents approach (30K)
# Build + Report: Implements changes and summarizes results (40K)
```

**Large project example:**
```bash
/scout_plan_build "Add JWT authentication" "https://jwt.io"

# Scout: Multi-agent search (10K)
# Plan: Architecture + YOUR APPROVAL (30K)
# Build + Report: Implementation plus summary (55K)
```

---

### → Migrate from Old Workflow

**What:** Update from Bash agent calls to Agent SDK
**Time:** 30 minutes

**Read:** [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)

**Quick summary:**

**OLD:**
```bash
gemini -p "[prompt]" --model gemini-2.5-flash
```

**NEW:**
```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Gemini"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: [task]
```

**Migration checklist:**
- [ ] Read migration guide
- [ ] Convert Bash calls to Task tool
- [ ] Update slash commands
- [ ] Test each phase
- [ ] Verify parallel execution

---

### → Understand Token Savings

**What:** See how template saves 40-60% tokens
**Time:** 2 minutes

**Without template (All Claude):**
```
Scout: 25K (Claude reading everything)
Plan:  40K (Claude analyzing everything)
Build: 80K (Claude writing everything)
────────────────────────────────────────
Total: 145K tokens
```

**With template (Hybrid):**
```
Scout:  8K (Gemini fast search)
Plan:  28K (Claude architecture only)
Build: 48K (Codex boilerplate + Claude logic)
Report: 4K (Gemini summary)
────────────────────────────────────────
Total: 88K tokens

SAVINGS: 57K tokens (39% less!)
```

**Key to savings:**
- Gemini MCP: Fast, cheap for docs/search
- Codex MCP: Efficient for boilerplate
- Claude: Only for complex logic

---

### → See Full Workflow in Action

**What:** Complete walkthrough of large project workflow
**Time:** 10 minutes (to read), 30 minutes (to execute)

**Read:** [README.md](README.md) → "Usage" section

**Try it yourself:**

1. **Prepare:**
   ```bash
   # Write a spec
   cat > app-docs/specs/rate-limiting.md <<EOF
   # Rate Limiting

   ## Purpose
   Prevent API abuse with rate limiting

   ## Requirements
   - 100 requests per 15 minutes per IP
   - Return 429 Too Many Requests when exceeded
   - Use Redis for distributed rate limiting
   EOF
   ```

2. **Execute workflow:**
   ```bash
   /scout_plan_build "Add rate limiting to API" "https://expressjs.com/en/advanced/best-practice-security.html"
   ```

3. **What happens:**
   - Scout: 4 agents find relevant files (2 min)
   - Plan: Creates implementation plan (5 min)
   - **⏸️ STOPS: Asks for your approval**
   - You: Review plan, approve
   - Build + Report: Implements with tool delegation and records the summary (16 min)

4. **Review results:**
   ```bash
   # Check build report
   cat ai-docs/builds/[latest]/build-report.md

   # Verify changes
   git diff

   # Run tests
   npm test
   ```

---

### → Check Token Efficiency

**What:** Monitor how well you're using tokens
**Time:** 2 minutes

```bash
# View recent efficiency scores
cat ai-docs/logs/workflow-metrics.jsonl | jq '.efficiency' | tail -5

# Calculate average
cat ai-docs/logs/workflow-metrics.jsonl | jq -s 'map(.efficiency) | add/length'

# Target: >90% average
```

**If efficiency is low (<85%):**
- Review tool delegation in build reports
- Are you using Codex for boilerplate?
- Are you using Gemini for docs?
- Check if scout scale is too high

---

### → Customize for My Tech Stack

**What:** Adapt template to your specific technologies
**Time:** 30 minutes

**For Node.js/TypeScript:**
- ✅ Template ready to use as-is
- Update `package.json` scripts
- Add TypeScript linting rules

**For Python:**
```bash
# Add Python-specific docs
echo "## Python Setup" >> CLAUDE.md
echo "pytest" >> CLAUDE.md
echo "ruff for linting" >> CLAUDE.md

# Update validation scripts
sed -i 's/npm test/pytest/' scripts/validation/pre-deploy-check.sh
```

**For Go:**
```bash
# Add Go-specific patterns
echo "## Go Setup" >> CLAUDE.md
echo "go test ./..." >> CLAUDE.md
echo "golangci-lint" >> CLAUDE.md
```

**For React/Vue/Angular:**
- Already supported by Codex MCP (UI specialty)
- Add component patterns to `app-docs/guides/`
- Configure Shadcn for UI components

---

### → Deploy to Production

**What:** Use validation scripts before deployment
**Time:** 5 minutes

```bash
# 1. Pre-deployment validation
./scripts/validation/pre-deploy-check.sh

# If all pass:
✅ ALL CHECKS PASSED
🚀 Ready to deploy!

# 2. Deploy (your method)
# docker-compose up -d
# or ./deploy.sh
# or git push heroku main

# 3. Post-deployment health check
./scripts/health-check/health-check.sh

# If all pass:
✅ ALL CHECKS PASSED
🎉 Application is healthy!
```

**If checks fail:**
- Review script output
- Fix identified issues
- Re-run validation
- Never skip validation for "speed"

---

### → Get Help

**What:** Find answers to common questions
**Time:** 5 minutes

**Template issues:**
- Check: [README.md](README.md) → Troubleshooting
- Check: [QUICK-START.md](QUICK-START.md) → Common Issues
- Open: GitHub issue on template repo

**Claude Code issues:**
- Docs: https://docs.claude.com/claude-code
- Issues: https://github.com/anthropics/claude-code/issues

**Workflow questions:**
- Read: [MEMORY-COMPARISON.md](MEMORY-COMPARISON.md)
- Read: Slash command prompts in `.claude/commands/`
- Review: Example in [README.md](README.md)

---

## 🎓 Recommended Learning Path

### Day 1: Setup (1 hour)
- [ ] Set up user memory (5 min)
- [ ] Copy template to test project (10 min)
- [ ] Configure MCP tools (10 min)
- [ ] Try simple task (10 min)
- [ ] Review results (5 min)
- [ ] Read MEMORY-COMPARISON.md (10 min)

### Day 2: Practice (2 hours)
- [ ] Run `/scout_plan_build "<medium task>" ""` (30 min)
- [ ] Spot-check the generated plan before implementation (15 min)
- [ ] Check token efficiency (5 min)
- [ ] Add pattern to app-docs/guides/ (10 min)
- [ ] Read migration guide (30 min)

### Day 3: Full Workflow (3 hours)
- [ ] Write feature spec (30 min)
- [ ] Run `/scout_plan_build "<complex task>" "<doc urls>"` (1 hour)
- [ ] Review all artifacts (30 min)
- [ ] Update project CLAUDE.md (15 min)
- [ ] Document lessons learned (15 min)

### Week 2: Optimization (Ongoing)
- [ ] Review workflow metrics
- [ ] Optimize token budgets
- [ ] Add reusable patterns
- [ ] Try on real project
- [ ] Share results with team

---

## 📚 Documentation Index

**Start Here:**
- [QUICK-START.md](QUICK-START.md) - 5-minute setup
- [MEMORY-COMPARISON.md](MEMORY-COMPARISON.md) - What goes where

**Complete Reference:**
- [README.md](README.md) - Full documentation
- [TEMPLATE-SUMMARY.md](TEMPLATE-SUMMARY.md) - What's included

**Templates:**
- [USER-MEMORY-CLAUDE.md](USER-MEMORY-CLAUDE.md) - Global memory
- [CLAUDE-TEMPLATE.md](CLAUDE-TEMPLATE.md) - Project memory

**Workflows:**
- [.claude/commands/scout_plan_build.md](.claude/commands/scout_plan_build.md)
- [.claude/commands/scout.md](.claude/commands/scout.md)
- [.claude/commands/plan_w_docs.md](.claude/commands/plan_w_docs.md)
- [.claude/commands/build.md](.claude/commands/build.md)

**Migration:**
- [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)

---

## ✅ Quick Checklist

**I'm ready to start when:**
- [ ] User memory set up in Claude Code
- [ ] Template copied to project
- [ ] API keys added to `.env`
- [ ] CLAUDE.md customized for project
- [ ] Project scale detected
- [ ] First simple task completed successfully

**My workflow is optimized when:**
- [ ] Token efficiency >90%
- [ ] Pre-approval catches issues
- [ ] Tests pass after builds
- [ ] Documentation stays in sync
- [ ] Patterns documented and reused
- [ ] Can handle multiple projects

---

## 🎉 You're Ready!

Pick your starting point from the options above, and you'll be up and running in minutes.

**Most common path:**
1. Set up user memory (5 min)
2. Try on existing project (15 min)
3. See token savings (immediate!)

**Questions?** Check the documentation index above.

**Let's go!** 🚀
