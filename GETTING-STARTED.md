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

# 2. Customize project memory
cp CLAUDE-TEMPLATE.md CLAUDE.md
# Edit CLAUDE.md:
# - Replace [Project Name]
# - Update architecture section

# 3. Detect scale
node scripts/detect-project-scale.js

# 4. Start coding!
# In Claude Code, try:
/scout_plan_build "Add health check endpoint" ""
```

**You get:** Full workflow template ready to use

---

### → Add Template to Existing Project

**What:** Bring agentic workflow to existing codebase
**Time:** ~5-10 minutes (automated)
**Frequency:** Once per existing project

To integrate the template into your existing project, navigate to your project's root directory and run the automated setup script:

```bash
# 1. Navigate to your existing project's root directory
cd /path/to/your/existing-project

# 2. Copy the init-agentic-workflow.sh script into your project's scripts directory
#    (Assuming you have a 'scripts' directory, if not, create one or adjust path)
mkdir -p scripts # Ensure scripts directory exists
cp /path/to/budget-agentic-workflow/scripts/init-agentic-workflow.sh scripts/

# 3. Run the setup script
#    This script will copy necessary files, merge configurations, and install dependencies.
bash scripts/init-agentic-workflow.sh
```

**What the script does:**
- Copies core template files (ai-docs/, app-docs/, .claude/, .eslintrc.js, .prettierrc.js, etc.).
- Merges template-specific scripts and devDependencies into your `package.json`.
- Merges template-specific ignore patterns into your `.gitignore`.
- Installs Node.js dependencies.
- Initializes `CLAUDE.md` from `CLAUDE-TEMPLATE.md`.

**After running the script, follow these crucial steps:**
1.  **Customize `CLAUDE.md`:** Open `CLAUDE.md` in your project root. Update `[Project Name]` and fill in your project's architecture, key file locations (e.g., where your `src/` and `tests/` folders are), and custom commands. This is vital for the AI agents to understand your project's context.
2.  **Organize Existing Documentation:** Review any existing project documentation (e.g., in a `docs/` folder). Move or adapt relevant parts into the `app-docs/` directory for AI consumption. Refer to `app-docs/guides/MEMORY-MANAGEMENT-DOCUMENT-TYPES.md` for guidance on structuring AI-readable documentation.
3.  **Set up User Memory (if not already done):** Refer to the "→ Set Up User Memory (Global, One-Time)" section in this document for instructions.
4.  **Detect Project Scale:** Run `node scripts/detect-project-scale.js` to get workflow recommendations tailored to your project.
5.  **Start Developing!** You are now ready to use the agentic workflow. Try a slash command, e.g., `/scout_plan_build "Add a health check endpoint" "" "budget"` to stay in Budget Mode by default.

**You get:** An automated integration of the agentic workflow template with your existing codebase, ready for AI-powered development.

**Need backend + frontend structure?**
- Keep coordination and playbook docs in the repository root (`CLAUDE.md`, `GEMINI.md`, etc.).
- Place runtime code under `app/`, splitting surfaces into folders such as `app/backend/`, `app/frontend/`, and `app/shared/` for cross-cutting utilities.
- Co-locate surface-specific docs inside `app-docs/` (for example, `app-docs/specs/backend/...` and `app-docs/specs/frontend/...`) while keeping generated reports in `ai-docs/`.
- Leave `scripts/init-agentic-workflow.sh` unchanged; it bootstraps the workflow but does not rearrange your existing code so you can adapt the layout manually without surprises.

---

### → Understand What Goes Where

**What:** Learn user memory vs project memory
**Time:** 5 minutes

**Read:** [MEMORY-COMPARISON.md](app-docs/guides/MEMORY-COMPARISON.md)

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
- Read: [MEMORY-COMPARISON.md](app-docs/guides/MEMORY-COMPARISON.md)
- Read: Slash command prompts in `.claude/commands/`
- Review: Example in [README.md](README.md)

---

## 🎓 Recommended Learning Path

### Day 1: Setup (1 hour)
- [ ] Set up user memory (5 min)
- [ ] Copy template to test project (10 min)
- [ ] Try simple task (10 min)
- [ ] Review results (5 min)
- [ ] Read app-docs/guides/MEMORY-COMPARISON.md (10 min)

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
- [MEMORY-COMPARISON.md](app-docs/guides/MEMORY-COMPARISON.md) - What goes where

**Complete Reference:**
- [README.md](README.md) - Full documentation


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
