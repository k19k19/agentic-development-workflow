description: Full workflow - Scout, plan, build, and report on task completion
argument-hint: [user_prompt] [documentation_urls]
model: claude-sonnet-4-5

# Scout-Plan-Build-Report: Complete Workflow

**Token Budget**: ~100K (variable based on complexity)
**Purpose**: End-to-end task execution with optimal tool delegation

---

## Arguments

1. `USER_PROMPT`: Task description
2. `DOCUMENTATION_URLS`: Comma-separated URLs to docs (can be empty "")

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Scout (10K) → Plan (30K) → Build (50K) → Report (5K)     │
│                                                             │
│  Multi-agent    Architecture   Hybrid tool   Summary +     │
│  file search    planning +     delegation    docs update   │
│                 user approval                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Pre-Workflow Validation

### Check Project Scale

```
Count files in app/:
  IF <10 files:
    → SMALL project - Skip scout, use direct implementation
  ELSE IF 10-50 files:
    → MEDIUM project - Use scout + build (skip plan for simple tasks)
  ELSE:
    → LARGE project - Use full workflow
```

### Confirm Workflow with User

```markdown
📋 Workflow Configuration

Task: {USER_PROMPT}
Project scale: [SMALL/MEDIUM/LARGE]
Recommended workflow: [Direct / Scout+Build / Full]

Estimated:
- Duration: [time]
- Token usage: [tokens]
- Tools: [list]

Proceed with [workflow]? (yes/no)
```

**WAIT for user confirmation**

---

## Workflow Execution

**IMPORTANT**: Execute each phase SEQUENTIALLY. Do not start next phase until previous completes.

### Phase 1: Scout (10K tokens)

```
Use SlashCommand tool:
  command: /scout "{USER_PROMPT}" "4"

Returns: files_collection_path
```

**Scout phase:**
- Launches 4 parallel agents (Gemini, Codex, Claude variants)
- Searches codebase for relevant files
- Returns structured list with line ranges
- Git safety check (reset if changes detected)

**Output**: `ai-docs/scout-results/[timestamp]/files-collection.txt`

**Validation**:
```
IF scout failed or returned no files:
  → Ask user: Continue with manual file selection?
ELSE:
  → Continue to plan
```

---

### Phase 2: Plan (30K tokens)

```
Use SlashCommand tool:
  command: /plan "{USER_PROMPT}" "{DOCUMENTATION_URLS}" "{files_collection_path}"

Returns: plan_file_path
```

**Plan phase:**
1. **Pre-planning checks** (MANDATORY):
   - Read specs with Gemini MCP
   - Check existing patterns
   - **Confirm approach with user** ← STOPS HERE, WAITS FOR APPROVAL
2. Load context from scouted files
3. Fetch and summarize documentation (Gemini + Firecrawl)
4. Design architecture (Claude)
5. Break down into tasks with tool delegation
6. Create detailed plan file

**Output**: `ai-docs/plans/[timestamp]-[task-slug].md`

**Validation**:
```
IF user rejected approach:
  → Revise plan based on feedback
  → Re-present for approval
  → WAIT again

IF user approved:
  → Continue to build

IF plan incomplete (token limit):
  → Ask user: Continue with partial plan / Extend budget / Simplify?
```

---

### Phase 3: Build (50K tokens)

```
Use SlashCommand tool:
  command: /build "{plan_file_path}"

Returns: build_report_path
```

**Build phase:**
1. Pre-build validation (git status, dependencies)
2. Create build branch (for large changes)
3. Execute tasks from plan:
   - Use Codex MCP for boilerplate, syntax, UI
   - Use Gemini MCP for documentation
   - Use Playwright MCP for tests
   - Use Shadcn MCP for UI components
   - Use Claude for complex logic
4. Parallel execution where possible
5. Validate after each task (tests, linting)
6. Track token usage vs estimates
7. Post-build validation (full test suite)
8. Generate build report

**Output**: `ai-docs/builds/[timestamp]/build-report.md`

**Validation**:
```
IF build failed:
  → Review failure in build report
  → Offer to:
    a) Fix and retry
    b) Rollback changes
    c) Pause for manual intervention

IF tests failing:
  → Identify failures
  → Delegate fixes to appropriate tool
  → Re-run tests

IF token budget exceeded:
  → Ask user: Continue / Pause / Simplify?
```

---

### Phase 4: Report (5K tokens)

```
Use SlashCommand tool:
  command: /report "{build_report_path}"

Returns: summary_path
```

**Report phase:**
1. Read build artifacts (Gemini MCP)
2. Generate executive summary (Gemini MCP)
3. Update project documentation:
   - app-docs/mappings/feature-to-source.md
   - app-docs/debugging/known-issues.md
   - README.md (if applicable)
4. Generate actionable next steps (Gemini MCP)
5. Calculate workflow efficiency metrics
6. Archive all workflow files
7. Log metrics to workflow-metrics.jsonl
8. Present final summary to user

**Output**: `ai-docs/reports/[timestamp]-summary.md`

---

## Final Output to User

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Workflow Complete: [Task Name]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ✅ Success
Duration: [X] hours [Y] minutes
Token Efficiency: [Z]% ([actual]/[planned] tokens)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 PHASE BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scout   [████████░░] 8.5K / 10K  (85%)  5 min   ✅
Plan    [█████████░] 28K / 30K   (93%)  12 min  ✅
Build   [█████████░] 48K / 50K   (96%)  52 min  ✅
Report  [████████░░] 4.2K / 5K   (84%)  3 min   ✅

Total   [█████████░] 89K / 95K   (94%)  72 min  ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 TOOL PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Codex MCP     ██████ [N] tasks  14.4K tokens  100% success
Gemini MCP    ███    [N] tasks   5.7K tokens  100% success
Claude        ██     [N] tasks   9.2K tokens  100% success
Playwright    █      [N] tasks   5.2K tokens  100% success

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 WHAT WAS BUILT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• [User-facing feature 1]
• [User-facing feature 2]
• [User-facing feature 3]

Files modified: [N] (+[additions], -[deletions] lines)
Tests: [passing]/[total] passing ([coverage]% coverage)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️  KNOWN ISSUES: [N]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• [Issue 1 description] (Priority: [level])
• [Issue 2 description] (Priority: [level])

See: app-docs/debugging/known-issues.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Immediate (Required):
  □ [Action 1]
  □ [Action 2]

Short-term (This week):
  □ [Action 3]
  □ [Action 4]

Long-term (Backlog):
  □ [Action 5]
  □ [Action 6]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 REPORTS & ARCHIVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary: ai-docs/reports/[timestamp]-summary.md
Archive: ai-docs/archives/[date]-[task]/

Contains:
  • Scout results (15 files discovered)
  • Implementation plan ([N] tasks)
  • Build report (detailed metrics)
  • All logs and artifacts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 LESSONS LEARNED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What worked well:
  ✅ [Insight 1]
  ✅ [Insight 2]

What to improve:
  ⚠️ [Improvement 1]
  ⚠️ [Improvement 2]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Workflow Rating: 🟢 Excellent
   Token efficiency better than project average!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Handling

### Phase Failure Recovery

```
IF scout fails:
  → Offer manual file selection
  → OR use direct implementation (skip scout)

IF plan fails:
  → Review error in plan output
  → Simplify scope OR extend token budget
  → Retry plan phase

IF build fails:
  → Review build report for failure point
  → Offer to:
    a) Fix specific failing task
    b) Rollback via git reset
    c) Continue from failure point
    d) Restart build with revised plan

IF report fails:
  → Still provide build results
  → Manual documentation update instructions
  → Archive what we have
```

### Mid-Workflow User Intervention

```
User can stop at any phase:

After scout:
  → Review files found
  → Adjust scope if needed
  → Continue or cancel

After plan (before build):
  → Review full plan
  → Request changes
  → Approve or revise

During build:
  → Check progress in build log
  → Stop if concerns arise
  → Review changes via git diff

After build (before report):
  → Manual testing
  → Verify changes
  → Approve for documentation
```

---

## Workflow Variants

### Quick Build (Medium projects, simple tasks)

```bash
/scout_build "[user_prompt]"
```

Executes: Scout → Build (skip plan)
Token budget: ~40K
Use when: Task is straightforward, patterns are known

### Direct Implementation (Small projects)

```bash
# No slash command needed
# Just describe the task to Claude
"Add a health check endpoint at /health"
```

Executes: Direct implementation with Codex/Claude
Token budget: ~10K
Use when: Single file, simple change

### Custom Workflow

```bash
# Run phases individually
/scout "[prompt]" "4"
# Review results, then:
/plan "[prompt]" "[docs]" "[files]"
# Review plan, then:
/build "[plan-path]"
# Review build, then:
/report "[build-report-path]"
```

Use when: Need manual review between phases

---

## Integration with Project

### Initialization

```bash
# First time using workflow in project:
1. Copy CLAUDE-TEMPLATE.md to CLAUDE.md
2. Update project-specific sections
3. Setup MCP tools (.mcp/ configs)
4. Create initial app-docs/ structure
5. Test with small task
```

### Continuous Use

```bash
# For each new task:
1. Run /scout_plan_build_report
2. Review summary
3. Complete next steps
4. Archive artifacts
5. Metrics automatically logged
```

### Improvement Loop

```bash
# Review workflow efficiency:
1. Check ai-docs/logs/workflow-metrics.jsonl
2. Identify optimization opportunities
3. Adjust token budgets if needed
4. Update tool delegation strategy
5. Document lessons learned
```

---

## Success Criteria

Workflow successful when:
- [✅] All phases complete without errors
- [✅] Tests passing (>80% coverage target)
- [✅] Documentation updated
- [✅] No unintended git changes
- [✅] Token efficiency >85%
- [✅] User has clear next steps
- [✅] All artifacts archived

---

## Configuration

### Token Budget Adjustment

```
Edit workflow .md files to adjust budgets:
- ai-docs/workflows/scout.md (default: 10K)
- ai-docs/workflows/plan.md (default: 30K)
- ai-docs/workflows/build.md (default: 50K)
- ai-docs/workflows/report.md (default: 5K)

Project-specific overrides in CLAUDE.md
```

### Tool Configuration

```
MCP tool setup: .mcp/*.json
- gemini-config.json (Gemini settings)
- codex-config.json (Codex settings)
- playwright-config.json (Playwright settings)

See: .mcp/README.md for setup instructions
```

### Scale Thresholds

```
Adjust project scale thresholds in CLAUDE.md:

Small: <10 files OR <5K LOC
Medium: 10-50 files OR 5K-20K LOC
Large: >50 files OR >20K LOC
```

---

**Workflow Version**: 1.0
**Compatible with**: Claude Code Agent SDK
**Last Updated**: [Date]
