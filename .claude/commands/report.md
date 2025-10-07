description: Generate summary report and update documentation
argument-hint: [build_report_path]
model: gemini-2.5-flash

# Report Phase: Build Summary & Documentation

**Token Budget**: 5K (Gemini for fast summarization)
**Model**: gemini-2.5-flash (delegated via MCP)
**Purpose**: Summarize build, update docs, generate next steps

---

## Arguments

1. `BUILD_REPORT_PATH`: Path to build report from build phase

---

## Report Generation

### Step 1: Read Build Artifacts (1K tokens)

**Use Task tool with Gemini MCP:**

```
Use Task tool:
  subagent_type: general-purpose
  description: "Read and parse build artifacts"
  prompt: |
    TOOL: Use Gemini MCP for efficient reading

    READ these files:
    1. {BUILD_REPORT_PATH}
    2. ai-docs/plans/[corresponding-plan].md (extract from report)
    3. Git log: last commit if committed

    EXTRACT:
    - Task completion status
    - Files changed (count and paths)
    - Test results
    - Token usage (planned vs actual)
    - Tool performance metrics
    - Known issues discovered
    - Deviations from plan

    RETURN: Structured summary (JSON format preferred)
```

### Step 2: Generate Executive Summary (2K tokens)

**Use Task tool with Gemini MCP:**

```
Use Task tool:
  subagent_type: general-purpose
  description: "Generate executive summary"
  prompt: |
    TOOL: Use Gemini MCP for summarization

    INPUT: [Structured summary from Step 1]

    GENERATE: Executive summary following this format:

    # Build Summary: [Task Name]

    ## Status: ✅ Success / ⚠️ Partial / ❌ Failed

    **Completed**: [date/time]
    **Duration**: [actual time]
    **Token Efficiency**: [actual/planned]%

    ### What Was Built
    - [3-5 bullet points of user-facing changes]

    ### Quality Metrics
    - Files: [count] modified ([additions], [deletions] lines)
    - Tests: [passing]/[total] ([percentage]% coverage)
    - Linting: [pass/fail]
    - Build: [pass/fail]
    - Performance: [metrics]

    ### Token Usage
    | Phase | Planned | Actual | Efficiency |
    |-------|---------|--------|------------|
    | Scout | [X]K | [Y]K | [Z]% |
    | Plan | [X]K | [Y]K | [Z]% |
    | Build | [X]K | [Y]K | [Z]% |
    | Report | [X]K | [Y]K | [Z]% |
    | **Total** | **[X]K** | **[Y]K** | **[Z]%** |

    ### Tool Performance
    - Codex MCP: [tasks], [success rate]%, [avg tokens/task]
    - Gemini MCP: [tasks], [success rate]%, [avg tokens/task]
    - Claude: [tasks], [success rate]%, [avg tokens/task]
    - Other tools: [summary]

    Keep it concise (max 300 words).
```

### Step 3: Update Documentation (1.5K tokens)

**Use Task tool with Gemini MCP for doc updates:**

```
Use Task tool:
  subagent_type: general-purpose
  description: "Update project documentation"
  prompt: |
    TOOL: Use Gemini MCP

    BASED ON: Build report from {BUILD_REPORT_PATH}

    UPDATE these files:

    1. app-docs/mappings/feature-to-source.md
       - Add new feature mappings
       - Format: | Feature | API | Database | Files |
       - Extract from build report's "Files Modified" section

    2. app-docs/architecture/[relevant-doc].md (if structural changes)
       - Update architecture diagrams (describe changes)
       - Document new patterns introduced

    3. app-docs/debugging/known-issues.md
       - Add any issues from build report's "Known Issues" section
       - Include workarounds

    RETURN: List of updated files with summaries of changes
```

**Implementation:**

After receiving Gemini's response, use Edit tool to apply updates:

```markdown
For each file to update:

1. Read current file
2. Apply Gemini's suggested changes using Edit tool
3. Verify format consistency
4. Mark as updated
```

### Step 4: Generate Next Steps (0.5K tokens)

**Use Task tool with Gemini MCP:**

```
Use Task tool:
  subagent_type: general-purpose
  description: "Generate actionable next steps"
  prompt: |
    TOOL: Use Gemini MCP

    BASED ON: Build report and plan file

    GENERATE: Prioritized next steps in 3 categories

    ### Immediate (Required before deployment)
    - [ ] [Action item with specific details]
    - [ ] [Action item]

    ### Short-term (This week)
    - [ ] [Action item]
    - [ ] [Action item]

    ### Long-term (Backlog)
    - [ ] [Action item based on known issues]
    - [ ] [Optimization opportunity]

    CRITERIA:
    - Immediate: Blockers, critical tests, security
    - Short-term: Enhancements, additional tests
    - Long-term: Optimizations, refactoring

    Max 10 items total.
```

---

## Workflow Efficiency Analysis

### Calculate Metrics

```json
{
  "workflow_id": "[task-slug]-[timestamp]",
  "task": "[task description]",
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",

  "duration_minutes": {
    "scout": 5,
    "plan": 12,
    "build": 52,
    "report": 3,
    "total": 72
  },

  "tokens": {
    "scout": { "planned": 10000, "actual": 8500, "efficiency": 85 },
    "plan": { "planned": 30000, "actual": 28200, "efficiency": 94 },
    "build": { "planned": 50000, "actual": 48500, "efficiency": 97 },
    "report": { "planned": 5000, "actual": 4200, "efficiency": 84 },
    "total": { "planned": 95000, "actual": 89400, "efficiency": 94 }
  },

  "tools": {
    "codex": { "tasks": 5, "success": 5, "tokens": 14400, "avg_per_task": 2880 },
    "gemini": { "tasks": 2, "success": 2, "tokens": 5700, "avg_per_task": 2850 },
    "claude": { "tasks": 1, "success": 1, "tokens": 9200, "avg_per_task": 9200 },
    "playwright": { "tasks": 1, "success": 1, "tokens": 5200, "avg_per_task": 5200 }
  },

  "quality": {
    "files_changed": 9,
    "lines_added": 861,
    "lines_deleted": 0,
    "tests_total": 30,
    "tests_passing": 30,
    "coverage_percent": 87,
    "linting_passed": true,
    "build_passed": true
  },

  "success": true,
  "issues_found": 1,
  "deviations_from_plan": 1
}
```

### Append to Workflow Log

```bash
# Add to ai-docs/logs/workflow-metrics.jsonl
echo '[JSON from above]' >> ai-docs/logs/workflow-metrics.jsonl
```

---

## Archive Workflow Files

### Create Archive

```bash
# Create archive directory
ARCHIVE_DIR="ai-docs/archives/$(date +%Y-%m-%d)-[task-slug]"
mkdir -p $ARCHIVE_DIR

# Move workflow files
mv ai-docs/scout-results/[timestamp]/ $ARCHIVE_DIR/scout/
mv ai-docs/plans/[plan-file].md $ARCHIVE_DIR/
mv ai-docs/builds/[timestamp]/ $ARCHIVE_DIR/build/

# Copy summary to reports (keep for quick access)
cp $ARCHIVE_DIR/build/build-report.md ai-docs/reports/[timestamp]-summary.md

# Update archive index
echo "$(date): [Task Name] - $ARCHIVE_DIR" >> ai-docs/archives/INDEX.md
```

---

## Generate Final Report

### Write Summary Report

Save to: `ai-docs/reports/[timestamp]-[task-slug]-summary.md`

```markdown
# Workflow Summary: [Task Name]

**Date**: YYYY-MM-DD
**Status**: ✅ Complete
**Duration**: 1h 12min
**Token Efficiency**: 94%

---

## Executive Summary

[From Step 2 - Gemini generated summary]

---

## Detailed Metrics

### Time Breakdown
- Scout: 5 min (parallel agents)
- Plan: 12 min (architecture + task breakdown)
- Build: 52 min (8 tasks across 4 phases)
- Report: 3 min (documentation updates)

### Token Economics
- **Total Used**: 89.4K / 95K planned (94% efficiency)
- **Cost Savings**: ~6K tokens under budget
- **Most Efficient**: Build phase (97% efficiency)
- **Least Efficient**: Report phase (84% efficiency) - still under budget

### Tool Delegation Success
- **Codex MCP**: 5/5 tasks (100% success, 14.4K tokens)
  - Best for: Boilerplate, config, tests
  - Avg efficiency: 2.9K tokens/task
- **Gemini MCP**: 2/2 tasks (100% success, 5.7K tokens)
  - Best for: Documentation, summarization
  - Avg efficiency: 2.9K tokens/task
- **Claude**: 1/1 task (100% success, 9.2K tokens)
  - Best for: Complex business logic
  - Used only when necessary
- **Playwright MCP**: 1/1 task (100% success, 5.2K tokens)
  - Best for: E2E testing

---

## Documentation Updates

Files updated by this workflow:
- [✅] app-docs/mappings/feature-to-source.md - Added feature mapping
- [✅] app-docs/debugging/known-issues.md - Added pagination note
- [✅] README.md - Documented new API endpoints

---

## Known Issues

### Issues Discovered
1. **Performance with large datasets** (Priority: Low)
   - Impact: fetchAll() may be slow with >10K records
   - Workaround: None currently
   - Future fix: Add pagination (backlog)

### Risks Mitigated
- ✅ Breaking changes - None introduced
- ✅ Auth integration - Feature-flagged, tested
- ✅ Database migration - Rollback tested

---

## Next Steps

[From Step 4 - Gemini generated next steps]

### Immediate (Required)
- [ ] Code review by team lead
- [ ] Manual testing of all endpoints
- [ ] Deploy to staging environment
- [ ] Validate in staging (smoke tests)

### Short-term (This Week)
- [ ] User acceptance testing
- [ ] Performance testing with realistic data
- [ ] Security audit (auth flows)
- [ ] Update monitoring dashboards

### Long-term (Backlog)
- [ ] Add pagination to fetchAll() method
- [ ] Explore caching strategy for read-heavy endpoints
- [ ] Consider rate limiting per user
- [ ] Add metrics/telemetry

---

## Lessons Learned

### What Worked Well ✅
1. **Multi-agent scout**: Found all relevant files efficiently
2. **Codex for boilerplate**: Saved significant Claude tokens
3. **Gemini for docs**: Fast and accurate documentation updates
4. **Pre-implementation approval**: Caught potential issue early

### What Could Improve ⚠️
1. **Plan phase token estimate**: Slightly underestimated service complexity (+1.2K tokens)
   - Future: Add 15% buffer for complex business logic
2. **Parallel execution**: Only 2 tasks ran in parallel (could have done more)
   - Future: Better identify independent tasks in plan

### Recommendations for Next Workflow 🚀
1. Use Codex MCP for all CRUD endpoints (proven efficient)
2. Keep Claude for complex integration logic only
3. Add 15% buffer to token estimates for new patterns
4. Identify more parallel execution opportunities in planning

---

## Workflow Efficiency Rating

**Overall**: 🟢 Excellent (94% token efficiency, 100% task success)

### Breakdown:
- ✅ Token efficiency: 94% (target: >90%)
- ✅ Task success rate: 100% (target: >95%)
- ✅ Quality metrics: 87% coverage (target: >80%)
- ✅ On-time delivery: Yes
- ✅ No major deviations: Yes

### Comparison to Previous Workflows
[If metrics available from ai-docs/logs/workflow-metrics.jsonl]:
- This workflow: 94% efficiency
- Project average: 89% efficiency
- **Improvement**: +5 percentage points ⬆️

---

## Archive Location

All workflow artifacts archived to:
`ai-docs/archives/YYYY-MM-DD-[task-slug]/`

Contents:
- `scout/` - Scout results and agent outputs
- `[plan-file].md` - Implementation plan
- `build/` - Build logs, reports, test outputs
- `summary.md` - This file (copy)

---

## Git Commit

[If build was committed]:

Commit: `abc123def`
Branch: `build/[task-slug]-[timestamp]`
Message:
```
feat: Add [feature name]

Implementation plan: ai-docs/archives/[date]-[task]/[plan-file].md
Build report: ai-docs/archives/[date]-[task]/build/build-report.md

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

---

**Report Generated**: YYYY-MM-DD HH:MM:SS
**Generator**: Gemini MCP via Claude Code Workflow
**Template Version**: 1.0
```

---

## Console Output (User-Facing)

```
📊 Workflow Complete!

✅ Status: Success
⏱️  Duration: 1h 12min
🎯 Token Efficiency: 94% (89.4K/95K used)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Summary:
• Scout: 8.5K tokens, 5 min - Found 15 files
• Plan: 28.2K tokens, 12 min - 8 tasks across 4 phases
• Build: 48.5K tokens, 52 min - 100% task success
• Report: 4.2K tokens, 3 min - Docs updated

🔧 Tool Performance:
• Codex MCP: 5 tasks ✅ (14.4K tokens, 2.9K avg)
• Gemini MCP: 2 tasks ✅ (5.7K tokens, 2.9K avg)
• Claude: 1 task ✅ (9.2K tokens, complex logic)
• Playwright: 1 task ✅ (5.2K tokens, E2E tests)

📝 Changes:
• 9 files modified (+861, -0 lines)
• 30/30 tests passing (87% coverage)
• Documentation updated

⚠️  Known Issues: 1
• Performance consideration for large datasets (backlog)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Next Steps:

Immediate:
  □ Code review
  □ Manual testing
  □ Deploy to staging

Short-term:
  □ UAT
  □ Performance testing
  □ Security audit

Long-term:
  □ Add pagination
  □ Explore caching
  □ Add metrics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📂 Files:
• Summary: ai-docs/reports/[timestamp]-summary.md
• Archive: ai-docs/archives/[date]-[task]/

💡 Lessons Learned:
✅ Codex excellent for boilerplate (saved tokens)
✅ Pre-approval prevented potential issues
⚠️  Could parallelize more tasks next time

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Workflow efficiency: 🟢 Excellent (94%)
   Better than project average (89%)!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Error Handling

### Build Report Not Found
```
ERROR: Build report not found at {BUILD_REPORT_PATH}

Possible causes:
- Build phase not completed
- Incorrect path
- File was deleted

Action: Cannot generate report without build results
Suggestion: Re-run build phase
```

### Documentation Update Failed
```
WARNING: Could not update documentation

File: app-docs/mappings/feature-to-source.md
Error: [error message]

Action: Continuing with report generation
Impact: Documentation must be updated manually

Manual update required:
[Provide specific changes needed]
```

### Metrics Log Failed
```
WARNING: Could not append to workflow-metrics.jsonl

Error: [error message]

Impact: Efficiency metrics not tracked for this workflow
Action: Metrics will be available in summary report only
```

---

## Integration Points

### Receives From Build Phase
- Build report with full details
- Test results
- Token usage breakdown
- Files changed

### Provides To User
- Executive summary
- Updated documentation
- Actionable next steps
- Efficiency metrics

### Archives
- All workflow artifacts
- Metrics for future analysis
- Historical reference

---

## Success Criteria

Report phase successful when:
- [✅] Executive summary generated
- [✅] Documentation updated (or manual instructions provided)
- [✅] Next steps are actionable
- [✅] Metrics logged
- [✅] Files archived
- [✅] User has clear completion status
