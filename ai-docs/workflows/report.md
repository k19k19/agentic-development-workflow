# Report Workflow

**Token Budget**: 5K (Gemini for summarization)
**Model**: gemini-2.5-flash (fast summary)
**Purpose**: Summarize build results, update documentation, generate next steps

---

## Input Requirements

1. `BUILD_REPORT_PATH`: Path to build report from build phase
2. Implicit: Access to plan file, build logs, git history

---

## Report Generation Process

### Step 1: Gather Build Artifacts (1K tokens)

**Using Gemini MCP for efficient reading:**

1. **Read Build Report**
   ```
   - Parse BUILD_REPORT_PATH
   - Extract key metrics (token usage, files changed, tests)
   - Identify deviations from plan
   ```

2. **Check Git Status**
   ```bash
   git diff --stat HEAD~1  # Compare to before build
   git log -1 --stat        # Last commit if committed
   ```

3. **Collect Test Results**
   ```
   - Parse test output if available
   - Count passing/failing tests
   - Extract coverage metrics
   ```

### Step 2: Generate Executive Summary (2K tokens)

**Use Gemini MCP to create:**

```markdown
# Build Summary: [Task Name]

## Status: ✅ Success | ⚠️ Partial | ❌ Failed

**Completed**: YYYY-MM-DD HH:MM
**Duration**: [Actual time]

### What Was Built
- [Bullet point summary of changes]
- [User-facing features added/modified]

### Files Changed
- [Count] files modified
- [Count] files added
- [Count] files deleted
- [Total] lines changed (+[additions], -[deletions])

### Quality Metrics
- Tests: [passing]/[total] passing ([percentage]%)
- Linting: ✅ Pass / ❌ Fail
- Build: ✅ Success / ❌ Failed
- Token efficiency: [actual tokens] vs [planned tokens] ([percentage]% of budget)

### Tool Performance
- Codex MCP: [tasks completed] ([success rate]%)
- Gemini MCP: [tasks completed] ([success rate]%)
- Claude: [tasks completed] ([success rate]%)
- Other tools: [summary]
```

### Step 3: Update Project Documentation (1.5K tokens)

**Delegate to Gemini MCP:**

1. **Update Feature Mapping**
   ```
   If new features added:
   - Update app-docs/mappings/feature-to-source.md
   - Add feature name → file paths mapping
   - Document API endpoints/database tables affected
   ```

2. **Update Architecture Docs**
   ```
   If structural changes made:
   - Update app-docs/architecture/[relevant-doc].md
   - Add diagrams if needed (describe for user to create)
   - Document new patterns introduced
   ```

3. **Update README**
   ```
   If new commands/setup steps added:
   - Update installation instructions
   - Add new scripts to command reference
   - Update feature list
   ```

4. **Log Known Issues**
   ```
   If issues discovered:
   - Add to app-docs/debugging/known-issues.md
   - Include workarounds
   - Link to relevant code
   ```

### Step 4: Generate Next Steps (0.5K tokens)

**Intelligent recommendations:**

```markdown
## Recommended Next Steps

### Immediate (Required)
- [ ] Manual testing of [specific features]
- [ ] Review [specific files] for [specific concern]
- [ ] Update [documentation] with [specific info]

### Short-term (This week)
- [ ] Add integration tests for [feature]
- [ ] Performance testing of [component]
- [ ] User acceptance testing

### Long-term (Backlog)
- [ ] Consider refactoring [component] for [reason]
- [ ] Explore optimization of [feature]
- [ ] Document [pattern] for future reference
```

---

## Output Format

### Console Output (for user)

```
✅ Build completed successfully!

📊 Summary:
- 8 tasks completed
- 12 files modified (+450, -120 lines)
- 15/15 tests passing
- Token usage: 45K/50K (90% efficiency)

🔧 Tools Used:
- Codex: 5 tasks (boilerplate, UI fixes)
- Gemini: 2 tasks (documentation)
- Claude: 1 task (complex integration)

📝 Documentation Updated:
- app-docs/mappings/feature-to-source.md
- README.md

⚠️ Known Issues:
- None discovered

🎯 Next Steps:
- Manual testing recommended for [feature X]
- Consider adding integration tests

📂 Reports Saved:
- Plan: ai-docs/plans/[plan-file].md
- Build: ai-docs/builds/[build-file]-report.md
- Summary: ai-docs/reports/[summary-file].md
```

### File Output

Write to: `ai-docs/reports/YYYY-MM-DD-HH-MM-[task-slug]-summary.md`

Full structured report including:
- Executive summary
- Detailed task breakdown
- Tool performance analysis
- Documentation updates made
- Next steps with priorities
- Lessons learned (for workflow improvement)

---

## Workflow Efficiency Analysis

### Token Usage Review

**Generate insights for future optimization:**

```markdown
## Workflow Efficiency Report

### Token Budget vs Actual
| Phase | Planned | Actual | Variance | Efficiency |
|-------|---------|--------|----------|------------|
| Scout | 10K | [actual] | [+/- amount] | [percentage]% |
| Plan | 30K | [actual] | [+/- amount] | [percentage]% |
| Build | 50K | [actual] | [+/- amount] | [percentage]% |
| Report | 5K | [actual] | [+/- amount] | [percentage]% |
| **Total** | **100K** | **[actual]** | **[+/- amount]** | **[percentage]%** |

### Tool Delegation Success
- Codex tasks: [count] ([success rate]%)
  - Most successful: [task type]
  - Least successful: [task type]
- Gemini tasks: [count] ([success rate]%)
  - Most successful: [task type]
  - Least successful: [task type]
- Claude tasks: [count] ([success rate]%)
  - Most successful: [task type]
  - Least successful: [task type]

### Recommendations for Future
- ✅ Worked well: [what worked]
- ⚠️ Could improve: [what could be better]
- 🚀 Try next time: [suggestions]
```

### Lessons Learned

**Capture for workflow improvement:**

1. **Scout Phase**
   - Were the right files identified?
   - Did scouts return proper format?
   - Were any critical files missed?

2. **Plan Phase**
   - Was the plan accurate?
   - Were token estimates close?
   - Were risks properly identified?

3. **Build Phase**
   - Were tools delegated optimally?
   - Did parallel execution work?
   - Were there unexpected blockers?

4. **Report Phase**
   - Was documentation updated correctly?
   - Were next steps actionable?

---

## Archive and Cleanup

### Step 1: Archive Workflow Files

```bash
# Create archive directory for this build
mkdir -p ai-docs/archives/YYYY-MM-DD-[task-slug]/

# Move workflow files
mv ai-docs/plans/[plan-file].md ai-docs/archives/YYYY-MM-DD-[task-slug]/
mv ai-docs/builds/[build-file]*.md ai-docs/archives/YYYY-MM-DD-[task-slug]/
cp ai-docs/reports/[summary-file].md ai-docs/archives/YYYY-MM-DD-[task-slug]/

# Keep summary in reports for quick access
# Keep archives for historical reference
```

### Step 2: Update Workflow Metrics

```
Append to ai-docs/logs/workflow-metrics.jsonl:
{
  "timestamp": "YYYY-MM-DDTHH:MM:SSZ",
  "task": "[task-slug]",
  "tokens": {
    "scout": [actual],
    "plan": [actual],
    "build": [actual],
    "report": [actual],
    "total": [actual]
  },
  "tools": {
    "codex": { "tasks": [count], "success": [count] },
    "gemini": { "tasks": [count], "success": [count] },
    "claude": { "tasks": [count], "success": [count] }
  },
  "duration_minutes": [actual],
  "files_changed": [count],
  "tests_added": [count],
  "success": true/false
}
```

### Step 3: Cleanup Temporary Files

```bash
# Remove temporary build logs if build succeeded
rm -f ai-docs/builds/*.tmp
rm -f ai-docs/builds/*.log

# Keep only final report
```

---

## Integration Points

### With Scout Phase
- References initial file discovery results
- Compares actual files modified vs scouted files

### With Plan Phase
- Evaluates plan accuracy
- Reports token estimate accuracy
- Identifies planning improvements

### With Build Phase
- Summarizes build execution
- Analyzes tool delegation effectiveness
- Documents deviations from plan

### With User
- Provides clear, actionable summary
- Suggests next steps
- Archives all artifacts for reference

---

## Error Handling

### Build Failed
```
- Generate failure report
- Identify failure point
- Suggest recovery steps
- Preserve all logs for debugging
```

### Documentation Update Failed
```
- Log warning
- Provide manual update instructions
- Don't block report generation
```

### Archive Failed
```
- Keep files in original locations
- Log warning
- Continue with report
```

---

## Success Criteria

Report phase is successful when:
- ✅ Executive summary generated
- ✅ Documentation updated (or manual steps provided)
- ✅ Next steps are clear and actionable
- ✅ All artifacts archived
- ✅ Workflow metrics logged
- ✅ User has clear understanding of what was done
