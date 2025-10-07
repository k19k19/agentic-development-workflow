# Build Workflow

**Token Budget**: 50K (Hybrid delegation across Gemini, Codex, Claude)
**Model**: claude-sonnet-4-5 (orchestrator)
**Purpose**: Execute implementation plan with optimal tool delegation

---

## Input Requirements

1. `PLAN_FILE_PATH`: Path to plan file created by plan phase
2. Implicit: Access to all MCP tools (gemini, codex, playwright, shadcn, firecrawl)

---

## Pre-Build Validation (MANDATORY)

**Before ANY code changes:**

1. **Verify Plan Exists**
   ```
   - Read plan file from PLAN_FILE_PATH
   - Confirm all phases are defined
   - Check token budget allocation
   ```

2. **Git Safety Check**
   ```bash
   git status --porcelain
   # If dirty: warn user about uncommitted changes
   git diff --stat
   # Baseline for post-build comparison
   ```

3. **Dependency Check**
   ```bash
   # Check if required tools are available
   - Verify MCP tools in .mcp/ config
   - Check package.json for dependencies
   - Validate environment variables if needed
   ```

4. **Create Build Branch** (for large changes)
   ```bash
   git checkout -b build/[task-slug]-$(date +%Y%m%d-%H%M)
   ```

---

## Build Process

### Phase 0: Setup (2K tokens)

1. **Initialize Build Tracking**
   ```
   - Create ai-docs/builds/YYYY-MM-DD-HH-MM-[task-slug].log
   - Start token counter
   - Initialize task checklist
   ```

2. **Load Context from Plan**
   ```
   - Parse implementation phases
   - Extract tool delegation strategy
   - Identify file dependencies
   ```

### Phase 1-N: Execute Implementation Tasks

For each task in plan:

#### Task Execution Loop

1. **Pre-Task Check**
   ```
   - Mark task as in_progress in build log
   - Verify dependencies completed
   - Load required files (with offset/limit from plan)
   ```

2. **Tool Selection & Delegation**

   **Option A: Codex MCP** (for syntax, boilerplate, UI/UX)
   ```bash
   # Use MCP tool for Codex
   <use codex-mcp-tool>
   Task: [specific task description]
   Files: [files to modify]
   Context: [minimal context from plan]
   </use>
   ```

   **Option B: Gemini MCP** (for docs, configs, simple transformations)
   ```bash
   # Use MCP tool for Gemini
   <use gemini-mcp-tool>
   Task: [specific task description]
   Model: gemini-2.5-flash (for speed) or gemini-2.5-pro (for complexity)
   Context: [documentation summaries]
   </use>
   ```

   **Option C: Claude (self)** (for complex logic, multi-file integration)
   ```
   - Use Edit tool for precise changes
   - Use Write tool for new files
   - Use Read tool for context
   - Maintain full architectural awareness
   ```

   **Option D: Playwright MCP** (for testing)
   ```bash
   # Generate and run tests
   <use playwright-mcp-tool>
   Test: [test scenario]
   Component: [component to test]
   </use>
   ```

   **Option E: Shadcn** (for UI components)
   ```bash
   # Add/modify UI components
   <use shadcn-mcp-tool>
   Component: [component name]
   Variant: [variant if needed]
   </use>
   ```

3. **Validation After Each Task**
   ```
   - Syntax check (linter if available)
   - Quick manual test if applicable
   - Git diff to verify changes
   - Mark task as completed in build log
   ```

4. **Token Tracking**
   ```
   - Log actual tokens used
   - Compare to plan estimate
   - Alert if 80% of budget consumed
   ```

---

## Tool Delegation Decision Tree

```
START
  ↓
Is it a single file syntax fix?
  YES → Codex MCP
  NO → Continue
  ↓
Is it documentation or config?
  YES → Gemini MCP
  NO → Continue
  ↓
Is it UI component work?
  YES → Codex MCP (UI/UX specialty) + Shadcn MCP
  NO → Continue
  ↓
Is it multi-file with complex logic?
  YES → Claude (self)
  NO → Continue
  ↓
Is it testing?
  YES → Playwright MCP + Codex MCP
  NO → Default to Claude
```

---

## Parallel vs Sequential Execution

### Run in Parallel When:
- Tasks have no dependencies
- Working on different files
- Independent feature additions

```
Example:
Task 1: Add API endpoint A (file: api/endpoint-a.js)
Task 2: Add API endpoint B (file: api/endpoint-b.js)
→ Delegate both to Codex MCP in parallel
```

### Run Sequentially When:
- Task B depends on Task A output
- Modifying same file
- Database migration + code changes

```
Example:
Task 1: Update database schema
Task 2: Update model to reflect schema
→ Execute Task 1, then Task 2
```

---

## Error Handling

### Tool Failures

1. **Codex MCP timeout/error**
   ```
   - Log failure
   - Retry once with simplified prompt
   - If fails again → Escalate to Claude
   ```

2. **Gemini MCP error**
   ```
   - Fall back to Claude for documentation tasks
   - Use WebFetch as alternative for URL content
   ```

3. **Syntax errors from delegated tools**
   ```
   - Run linter
   - Use Codex MCP to fix syntax
   - Don't let Claude manually fix (delegate!)
   ```

### Build Failures

1. **Test failures**
   ```
   - Identify failing component
   - Re-run with Playwright MCP in debug mode
   - Fix and re-test
   ```

2. **Integration errors**
   ```
   - Review multi-file changes
   - Use Claude to analyze integration points
   - Fix with appropriate tool
   ```

3. **Token budget exceeded**
   ```
   - Stop build
   - Save progress to build log
   - Report to user with options:
     a) Continue with reduced scope
     b) Pause and resume later
     c) Simplify remaining tasks
   ```

---

## Post-Build Actions

### Step 1: Validation

1. **Automated Tests**
   ```bash
   npm test  # or pytest, or appropriate test command
   ```

2. **Linting**
   ```bash
   npm run lint  # or appropriate linter
   ```

3. **Build Check**
   ```bash
   npm run build  # verify build succeeds
   ```

4. **Git Safety**
   ```bash
   git diff --stat
   # Verify only intended files changed
   # No unintended modifications from MCP tools
   ```

### Step 2: Documentation Updates

Use Gemini MCP to update:
- `app-docs/mappings/` with new feature-to-source relationships
- `app-docs/architecture/` if structural changes made
- README.md if new commands/features added

### Step 3: Build Report

Write to: `ai-docs/builds/YYYY-MM-DD-HH-MM-[task-slug]-report.md`

```markdown
# Build Report: [Task Name]

**Completed**: YYYY-MM-DD HH:MM
**Duration**: [Actual time]
**Token Usage**: [Actual vs Planned]

## Summary
[2-3 sentences on what was built]

## Tasks Completed
- [x] Task 1 (Tool: Codex, Tokens: 2K)
- [x] Task 2 (Tool: Claude, Tokens: 8K)
- ...

## Files Modified
- path/to/file1.js (+50, -10)
- path/to/file2.js (+120, -5)

## Tests Added/Modified
- test/file1.test.js (12 tests, all passing)

## Deviations from Plan
- [Describe any changes from original plan]
- [Why deviations occurred]

## Token Budget
- Planned: 50K
- Actual: [Actual]
- Variance: [+/- percentage]

## Tool Usage Breakdown
| Tool | Tasks | Tokens | Success Rate |
|------|-------|--------|--------------|
| Codex MCP | 5 | 15K | 100% |
| Gemini MCP | 3 | 8K | 100% |
| Claude | 4 | 22K | 100% |
| Playwright | 2 | 5K | 100% |

## Known Issues
- [Any issues discovered during build]
- [Workarounds applied]

## Next Steps
- [ ] Manual testing
- [ ] User acceptance testing
- [ ] Deployment planning
```

### Step 4: Cleanup

1. **Reset if needed**
   ```bash
   # If build failed and user wants to reset:
   git reset --hard HEAD
   git clean -fd
   ```

2. **Commit if successful**
   ```bash
   # Only if user approves:
   git add [modified files]
   git commit -m "feat: [task summary]

   Implementation plan: ai-docs/plans/[plan-file]
   Build report: ai-docs/builds/[report-file]

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

---

## Integration with Report Phase

The report phase will:
1. Read this build report
2. Summarize for user (using Gemini MCP)
3. Generate next steps
4. Update project documentation
5. Archive plan and build files
