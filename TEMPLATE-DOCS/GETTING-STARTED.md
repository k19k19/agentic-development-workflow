# Getting Started - Do This Now

**5 minutes to setup, then start building.**

---

## Step 1: Run Setup (1 minute)

```bash
cd /path/to/your/project
bash /path/to/budget-agentic-workflow/scripts/init-agentic-workflow.sh
```

**What it does:**
- ✅ Copies slash commands, scripts, and placeholders
- ✅ Generates CLAUDE.md for your project
- ✅ Creates directory structure
- ✅ Installs dependencies
- ✅ Detects your project scale

**Done!** Your project is ready.

---

## Step 2: What Do You Want to Do?

### I want to add a feature

```bash
/scout_plan_build "your feature description" "" "budget"
```

**Example:**
```bash
/scout_plan_build "Add user authentication with JWT" "" "budget"
```

**What happens:**
1. AI scouts your codebase (finds relevant files)
2. AI creates a plan (you review and approve)
3. AI builds the feature (implements the plan)
4. AI writes a report (updates documentation)

---

### I want to fix a bug

```bash
/scout_build "fix: bug description"
```

**Example:**
```bash
/scout_build "fix: login timeout after 30 seconds"
```

**What happens:**
1. AI scouts for relevant code
2. AI fixes the bug
3. AI runs tests

---

### I want to understand the structure

Read: [QUICK-REFERENCE.md](QUICK-REFERENCE.md) (1 page, 2 minutes)

**Shows you:**
- Where files go
- What gets copied
- Common workflows
- Directory structure

---

### I want to customize workflows

Browse: [workflow-guides/](workflow-guides/)

**Available guides:**
- `budget-mode.md` - Token optimization for $20/month plans
- `WORKFLOW.md` - Complete workflow phases
- `COMMAND-MAPPING.md` - All slash commands explained
- `CROSS-SESSION-GUIDE.md` - Working across multiple sessions
- `implementation-guidelines.md` - AI coding standards

**Pick what you need. No need to read everything.**

---

## Step 3: Customize CLAUDE.md (Optional)

```bash
open CLAUDE.md  # or: code CLAUDE.md
```

**Update:**
- Architecture summary (your tech stack)
- Key files (where important code lives)
- Project-specific commands

**Later, not now.** The defaults work fine.

---

## Common First-Time Issues

### Slash commands not appearing?

**Solution:**
- Use macOS Terminal (not VS Code integrated terminal)
- Restart Claude Code CLI session:
  ```bash
  exit
  cd /your/project
  claude-code
  ```

### Token budget concerns?

**Solution:**
- Always use `"budget"` flag for large tasks
- Example: `/scout_plan_build "task" "" "budget"`
- See `workflow-guides/budget-mode.md` for details

### Don't know which command to use?

**Rule of thumb:**
- **Small task** (< 10 files): Just describe it naturally
- **Medium task** (10-50 files): `/scout_build "task"`
- **Large task** (> 50 files): `/scout_plan_build "task" "" "budget"`

---

## What NOT to Do

❌ Don't read all documentation before starting
❌ Don't copy template workflow guides to your project
❌ Don't modify files in TEMPLATE-DOCS/
❌ Don't commit ai-docs/ to git

✅ Do: Try a small task first
✅ Do: Read QUICK-REFERENCE.md (1 page)
✅ Do: Ask questions as you go
✅ Do: Use budget mode for large tasks

---

## Directory Structure (What You Got)

```
your-project/
├── CLAUDE.md                    Your project config
├── app-docs/                    Your documentation (commit to git)
│   ├── specs/                   Write feature specs here
│   ├── guides/                  Add YOUR patterns here
│   ├── architecture/            System design docs
│   ├── debugging/               Troubleshooting guides
│   ├── mappings/                Auto-updated (don't edit manually)
│   └── operations/              Data fixes, runbooks
│
├── ai-docs/                     AI outputs (gitignored, ephemeral)
│   ├── plans/                   AI-generated plans appear here
│   ├── builds/                  Build reports appear here
│   └── logs/                    Token usage metrics
│
├── .claude/                     Slash commands (use them, don't edit)
└── scripts/                     Helper scripts
```

---

## Next Steps

1. **Try it now:** Run `/scout_build "add health check endpoint"`
2. **Read if needed:** [QUICK-REFERENCE.md](QUICK-REFERENCE.md) (1 page)
3. **Explore workflows:** [workflow-guides/](workflow-guides/) (when needed)
4. **Get help:** Template issues → [GitHub Issues](https://github.com/your-org/budget-agentic-workflow/issues)

---

## That's It!

You're ready to build. Questions will be answered as you work.

**Remember:** Start small, ask questions, scale up.

---

**Version**: 2.0 | **Style**: BMAD (Be Minimal, Ask Direct) | **Last Updated**: October 2025
