# Quick Reference - One Page

**Everything you need to know in 2 minutes.**

---

## Where Do Files Go?

```
Human writes specs       → app-docs/specs/[feature].md
AI generates plans       → ai-docs/plans/[timestamp]-[feature]/plan.md
AI builds code           → ai-docs/builds/[timestamp]-[feature]/
AI updates mappings      → app-docs/mappings/feature-to-source.md

Your project guides      → app-docs/guides/
Template workflow guides → TEMPLATE-DOCS/workflow-guides/ (reference only)
```

---

## What Gets Copied to My Project?

### ✅ Copied from Template
```
.claude/              Slash commands
scripts/              Helper scripts
app-docs/             Empty folders + READMEs
CLAUDE.md             Auto-generated config
```

### ❌ NOT Copied (Reference Only)
```
TEMPLATE-DOCS/        Setup guides (GitHub reference)
ai-docs/              Created empty, populated when you run workflows
```

---

## Common Workflows

### Small Task (< 10 files)
```bash
"Add a health check endpoint"
# Direct implementation, ~5K tokens
```

### Medium Task (10-50 files)
```bash
/scout_build "Add logging to all endpoints"
# Scout + Build, ~40K tokens
```

### Large Task (> 50 files)
```bash
/scout_plan_build "Add OAuth2" "https://oauth.net/2/" "budget"
# Scout + Plan + Build, ~90K tokens with approval gate
```

---

## Directory Structure (After Setup)

```
your-project/
├── README.md
├── CLAUDE.md                    Generated from template
├── app-docs/                    Human knowledge (commit to git)
│   ├── specs/                   Feature specs you write
│   ├── guides/                  Your project patterns (empty by default)
│   ├── architecture/            System design docs
│   ├── debugging/               Troubleshooting guides
│   ├── mappings/                Auto-updated code navigation
│   └── operations/              Data fixes, runbooks
│
├── ai-docs/                     AI artifacts (gitignored)
│   ├── plans/                   AI-generated plans
│   ├── builds/                  Build reports
│   ├── sessions/                Session logs
│   ├── failures/                Failure analysis
│   └── logs/                    Token metrics
│
├── .claude/                     Slash commands
└── scripts/                     Helper scripts
```

---

## Workflow: Spec → Plan → Build

```
1. You write:    app-docs/specs/oauth.md
2. AI scouts:    /scout "OAuth2" → ai-docs/scout/files.txt
3. AI plans:     /plan → ai-docs/plans/[date]-oauth/plan.md
4. You approve:  Review the plan
5. AI builds:    /build → ai-docs/builds/[date]-oauth/report.md
6. AI updates:   app-docs/mappings/feature-to-source.md
```

---

## Git Strategy

### ✅ Commit These
```
app-docs/           Your knowledge
.claude/            Slash commands
scripts/            Helper scripts
CLAUDE.md           Project config
```

### ❌ Don't Commit These
```
ai-docs/plans/      AI-generated (regenerable)
ai-docs/builds/     Build outputs (ephemeral)
ai-docs/logs/       Metrics (personal)
node_modules/       Dependencies
.env                Secrets
```

---

## Common Questions

**Q: Where are the template workflow guides?**
A: `TEMPLATE-DOCS/workflow-guides/` in the template repo (not copied to your project)

**Q: Should I modify budget-mode.md or WORKFLOW.md?**
A: No. Reference them from template repo. Add YOUR patterns to `app-docs/guides/`

**Q: Where do AI plans go?**
A: `ai-docs/plans/` (gitignored, ephemeral)

**Q: Where do I write feature specs?**
A: `app-docs/specs/` (committed to git)

**Q: What's the difference between app-docs and ai-docs?**
A:
- `app-docs/` = Human knowledge (committed)
- `ai-docs/` = AI artifacts (gitignored)

---

## Next Steps

1. **Just starting?** → Read [GETTING-STARTED.md](GETTING-STARTED.md) (5 minutes)
2. **Upgrading?** → Read [MIGRATION-GUIDE.md](MIGRATION-GUIDE.md)
3. **Need workflow details?** → See [workflow-guides/](workflow-guides/)

---

**Version**: 2.0
**Last Updated**: October 2025
