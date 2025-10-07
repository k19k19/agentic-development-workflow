description: Execute implementation plan with optimal tool delegation
argument-hint: [plan_file_path]
model: claude-sonnet-4-5

# Build Phase: Implementation Execution

**Token Budget**: 50K (default, adjust based on plan)
**Purpose**: Execute plan with hybrid tool delegation for token efficiency

---

## Arguments

1. `PLAN_FILE_PATH`: Path to plan file from plan phase

---

## Pre-Build Validation

### Check 1: Verify Plan Exists

```
Read PLAN_FILE_PATH
Confirm required sections:
- [ ] Implementation phases defined
- [ ] Tasks with file paths
- [ ] Tool delegation strategy
- [ ] Token budget allocation
- [ ] Success criteria

If missing sections: ERROR and stop
```

### Check 2: Git Safety

```bash
# Check for uncommitted changes
git status --porcelain

# If dirty, warn user:
WARNING: You have uncommitted changes:
[list files]

Continue build anyway? (yes/no)
[Wait for user response]

# Create baseline for comparison
git diff --stat > ai-docs/builds/[timestamp]-baseline.txt
```

### Check 3: Dependency Validation

```bash
# Check if required tools available
- Verify gemini-mcp-tool configured
- Verify codex-mcp-tool configured
- Verify playwright-mcp if tests needed
- Verify shadcn if UI work needed

# Check package dependencies
npm list | grep [required-package] || echo "Missing: [package]"

# Validate environment
Check .env for required variables (if applicable)
```

### Check 4: Create Build Branch (for large changes)

```bash
# Extract task name from plan file
TASK_SLUG=$(grep "^# Implementation Plan:" $PLAN_FILE_PATH | sed 's/.*: //' | tr ' ' '-' | tr '[:upper:]' '[:lower:]')

# Create branch
git checkout -b build/${TASK_SLUG}-$(date +%Y%m%d-%H%M)

# Confirm
echo "Created branch: $(git branch --show-current)"
```

---

## Build Initialization

### Step 1: Setup Build Tracking

```bash
# Create build log directory
mkdir -p ai-docs/builds/$(date +%Y-%m-%d-%H-%M)-${TASK_SLUG}

# Initialize build log
cat > ai-docs/builds/[timestamp]/build.log <<EOF
Build Started: $(date)
Plan: $PLAN_FILE_PATH
Branch: $(git branch --show-current)
Token Budget: [from plan]

Tasks:
[extract from plan]
EOF
```

### Step 2: Parse Plan

```
Read plan file and extract:
1. All phases and tasks
2. Tool assignments for each task
3. File dependencies
4. Token estimates
5. Acceptance criteria

Create task checklist:
- [ ] Phase 1, Task 1.1: Database migration (Codex, 2K tokens)
- [ ] Phase 1, Task 1.2: Data model (Codex, 3K tokens)
- [ ] Phase 2, Task 2.1: Service class (Claude, 8K tokens)
...
```

---

## Task Execution Loop

For each task in plan:

### Pre-Task Actions

```markdown
1. **Mark in_progress**
   Update build log:
   - [⏳] Phase X, Task X.X: [description]

2. **Check dependencies**
   Verify all dependency tasks marked complete
   If not: SKIP and warn user

3. **Load context**
   Read files mentioned in task with offset/limit from plan
   Use Read tool (not full file, just relevant sections)
```

### Task Execution with Tool Delegation

**Decision Tree:**

```
Read task.tool from plan

IF tool == "Codex MCP":
  ├─ Use Task tool (general-purpose agent)
  ├─ Provide task description, file paths, minimal context
  ├─ Agent will use MCP Codex internally
  └─ Receive code/changes back

ELSE IF tool == "Gemini MCP":
  ├─ Use Task tool (general-purpose agent)
  ├─ Focus on documentation/summarization tasks
  ├─ Agent will use MCP Gemini internally
  └─ Receive generated docs/summaries back

ELSE IF tool == "Playwright MCP":
  ├─ Use Task tool (general-purpose agent)
  ├─ Provide test scenarios
  ├─ Agent will use MCP Playwright internally
  └─ Receive test files + results back

ELSE IF tool == "Shadcn MCP":
  ├─ Use Task tool (general-purpose agent)
  ├─ Provide component requirements
  ├─ Agent will use MCP Shadcn internally
  └─ Receive component files back

ELSE IF tool == "Claude" (self):
  ├─ Use Edit tool for modifications
  ├─ Use Write tool for new files
  ├─ Use Read tool for context
  └─ Execute complex multi-file logic

ELSE:
  └─ ERROR: Unknown tool, fallback to Claude
```

#### Example: Codex Task Execution

```
Use Task tool:
  subagent_type: general-purpose
  description: "Generate database migration with Codex"
  prompt: |
    TASK: Create database migration for feature table

    TOOL: Use Codex MCP (via codex CLI or MCP server)

    REQUIREMENTS:
    - Table name: feature_data
    - Columns: id, user_id, name, created_at, updated_at
    - Indexes: user_id
    - Foreign keys: user_id -> users.id

    DELIVERABLE:
    - File: migrations/YYYY-MM-DD-add-feature-table.js
    - Must include: up() and down() methods
    - Must be idempotent

    PATTERN: Follow existing migrations in migrations/ directory

    Return complete file content.
```

#### Example: Claude Task Execution

```
For complex service class:

1. Read existing services for patterns
2. Use Edit tool to create new file with class structure
3. Implement methods one by one
4. Add error handling with try/catch
5. Add logging calls
6. Add JSDoc comments
7. Verify syntax with Codex if needed
```

#### Example: Playwright Task Execution

```
Use Task tool:
  subagent_type: general-purpose
  description: "Generate E2E tests with Playwright"
  prompt: |
    TASK: Create E2E tests for authentication API

    TOOL: Use Playwright MCP

    TEST SCENARIOS:
    1. Successful login
    2. Failed login (wrong password)
    3. Token refresh
    4. Logout

    DELIVERABLE:
    - File: tests/e2e/auth.spec.js
    - Use Playwright best practices
    - Include assertions for status codes and response bodies

    Return complete test file.
```

### Post-Task Validation

```markdown
1. **Syntax check**
   ```bash
   # Run linter if available
   npm run lint path/to/modified-file.js

   # If errors: Use Codex MCP to fix syntax
   ```

2. **Git diff review**
   ```bash
   git diff path/to/file

   # Verify:
   - Only intended changes
   - No accidental deletions
   - Proper formatting
   ```

3. **Quick functional test** (if applicable)
   ```bash
   # For API: quick curl test
   # For service: run specific unit test
   # For UI: visual check in browser
   ```

4. **Mark complete**
   Update build log:
   - [✅] Phase X, Task X.X: [description] (Actual: YK tokens)
```

### Token Tracking

```markdown
After each task:

1. Estimate tokens used
2. Log to ai-docs/builds/[timestamp]/token-usage.jsonl:
   ```json
   {
     "task": "Phase 1, Task 1.1",
     "tool": "Codex MCP",
     "estimated": 2000,
     "actual": 1800,
     "variance": -10
   }
   ```

3. Calculate running total
4. If 80% of budget consumed:
   ```
   WARNING: Token budget 80% consumed

   Used: 40K / 50K
   Remaining tasks: 5
   Average per task: 2K (exceeds remaining budget)

   Options:
   a) Continue (may exceed budget)
   b) Simplify remaining tasks
   c) Pause and get more budget
   ```
```

---

## Parallel Task Execution

### When to Parallelize

```
Check task dependencies in plan:

IF task1.dependencies AND task2.dependencies are disjoint:
  └─ Execute in parallel

Example:
- Task 2.1: Create service class
- Task 2.2: Create service tests

IF 2.2 depends on 2.1:
  └─ Sequential execution

BUT IF task structure allows:
- Task 3.1: Create endpoint A
- Task 3.2: Create endpoint B (independent)
  └─ Parallel execution ✅
```

### Parallel Execution Pattern

```
Use multiple Task tool calls in single message:

Task 1 (Codex):
  Create endpoint A in api/endpoint-a.js

Task 2 (Codex):
  Create endpoint B in api/endpoint-b.js

Task 3 (Gemini):
  Generate API docs for both endpoints

[All three run in parallel]
[Wait for all to complete]
[Validate all outputs]
[Mark all complete]
```

---

## Error Handling

### Tool Failures

#### Codex MCP Timeout
```
ERROR: Codex MCP timeout on Task X.X

Action:
1. Log failure
2. Retry once with simplified prompt
3. If fails again → Escalate to Claude:
   "Claude, implement Task X.X (Codex failed)"
4. Update build log with tool change
```

#### Syntax Errors from MCP Tool
```
ERROR: Syntax error in generated code

File: [path]
Error: [error message]

Action:
1. Run linter to identify exact issue
2. Use Codex MCP to fix:
   "Fix this syntax error: [error] in [file]"
3. Re-validate
4. If still fails → Claude manual fix
```

#### Test Failures
```
ERROR: Tests failing after Task X.X

Failed tests:
- [test1]: [error]
- [test2]: [error]

Action:
1. Identify root cause (code bug vs test bug)
2. If code bug:
   - Use appropriate tool to fix (Codex for simple, Claude for complex)
3. If test bug:
   - Use Playwright MCP or Codex to fix tests
4. Re-run tests
5. Mark complete only when all pass
```

### Build Failures

#### Integration Errors
```
ERROR: Multi-file integration issue

Files modified:
- [file1.js]
- [file2.js]

Error: [integration error message]

Action:
1. Use Claude (not MCP tools) for integration debugging
2. Read all involved files
3. Identify integration point failure
4. Fix with Edit tool
5. Re-validate integration
```

#### Token Budget Exceeded
```
ERROR: Token budget exceeded

Planned: 50K
Used: 52K (104%)
Remaining tasks: 3

Options:

a) Continue with reduced scope
   - Skip non-critical tasks
   - Mark as "partial implementation"

b) Pause and resume later
   - Save progress
   - Create resume plan
   - User can restart when ready

c) Get budget increase
   - Request user approval
   - Update plan with new budget
   - Continue implementation

User choice: [wait for input]
```

---

## Post-Build Validation

### Step 1: Automated Tests

```bash
# Run test suite
echo "Running tests..."
npm test 2>&1 | tee ai-docs/builds/[timestamp]/test-output.txt

# Check exit code
if [ $? -ne 0 ]; then
  echo "❌ Tests failed - see test-output.txt"
  # Mark build as failed
else
  echo "✅ All tests passing"
fi
```

### Step 2: Linting

```bash
# Run linter
echo "Running linter..."
npm run lint 2>&1 | tee ai-docs/builds/[timestamp]/lint-output.txt

# If errors, offer to fix
if [ $? -ne 0 ]; then
  echo "⚠️ Linting errors found"
  echo "Fix with Codex? (yes/no)"
  # If yes: delegate to Codex MCP
fi
```

### Step 3: Build Check

```bash
# If project has build step
echo "Running build..."
npm run build 2>&1 | tee ai-docs/builds/[timestamp]/build-output.txt

if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  # Analyze errors, delegate fixes
else
  echo "✅ Build successful"
fi
```

### Step 4: Git Safety Final Check

```bash
# Compare to baseline
git diff --stat > ai-docs/builds/[timestamp]/final-diff.txt

# Show summary
echo "Files changed:"
git diff --stat

# Verify only intended files changed
echo "Review changes above. All expected? (yes/no)"
# Wait for user confirmation
```

---

## Build Report Generation

### Create Report File

Write to: `ai-docs/builds/[timestamp]/build-report.md`

```markdown
# Build Report: [Task Name]

**Completed**: YYYY-MM-DD HH:MM:SS
**Duration**: [actual time]
**Status**: ✅ Success / ⚠️ Partial / ❌ Failed

## Summary
[2-3 sentences on what was built]

## Tasks Completed

### Phase 1: Database & Models
- [✅] Task 1.1: Database migration (Codex MCP, 1.8K tokens, 5 min)
- [✅] Task 1.2: Data model (Codex MCP, 2.5K tokens, 3 min)

### Phase 2: Business Logic
- [✅] Task 2.1: Service class (Claude, 9.2K tokens, 15 min)
- [✅] Task 2.2: Unit tests (Codex MCP, 4.5K tokens, 8 min)

### Phase 3: API Layer
- [✅] Task 3.1: API routes (Codex MCP, 3.8K tokens, 6 min)
- [✅] Task 3.2: Integration tests (Playwright MCP, 5.2K tokens, 10 min)

### Phase 4: Integration
- [✅] Task 4.1: Route registration (Codex MCP, 0.8K tokens, 2 min)
- [✅] Task 4.2: Documentation (Gemini MCP, 1.5K tokens, 3 min)

## Files Modified
- migrations/2025-01-15-add-feature.js (+45, -0)
- app/models/feature-model.js (+120, -0)
- app/services/feature-service.js (+250, -0)
- app/services/feature-service.test.js (+180, -0)
- app/api/feature-api.js (+90, -0)
- tests/e2e/feature.spec.js (+150, -0)
- app/routes/index.js (+3, -0)
- app-docs/mappings/feature-to-source.md (+15, -0)
- README.md (+8, -0)

**Total**: 9 files (+861, -0 lines)

## Tests
- Unit tests: 18/18 passing (100%)
- Integration tests: 8/8 passing (100%)
- E2E tests: 4/4 passing (100%)
- **Coverage**: 87% (target: >80% ✅)

## Quality Checks
- [✅] Linting passed
- [✅] Build successful
- [✅] Tests passing
- [✅] No security warnings

## Token Budget Analysis

| Phase | Planned | Actual | Variance | Efficiency |
|-------|---------|--------|----------|------------|
| Scout | 10K | 8.5K | -15% | 🟢 |
| Plan | 30K | 28.2K | -6% | 🟢 |
| Build P1 | 12K | 10.8K | -10% | 🟢 |
| Build P2 | 23K | 25.9K | +13% | 🟡 |
| Build P3 | 17K | 16.5K | -3% | 🟢 |
| Build P4 | 6K | 4.8K | -20% | 🟢 |
| **Total** | **98K** | **94.7K** | **-3%** | **🟢** |

## Tool Usage Breakdown

| Tool | Tasks | Tokens Used | Success Rate |
|------|-------|-------------|--------------|
| Codex MCP | 5 | 14.4K | 100% (5/5) |
| Gemini MCP | 1 | 1.5K | 100% (1/1) |
| Claude | 1 | 9.2K | 100% (1/1) |
| Playwright MCP | 1 | 5.2K | 100% (1/1) |

### Tool Performance Notes
- Codex MCP: Excellent for boilerplate, avg 2.9K tokens/task
- Gemini MCP: Very efficient for docs, 1.5K tokens
- Claude: Complex service class, 9.2K tokens (within estimate)
- Playwright: E2E tests, slightly over estimate but comprehensive

## Deviations from Plan

### Unplanned Changes
1. **Added input validation utility**
   - File: app/utils/validation.js (+40 lines)
   - Reason: Needed for API security
   - Tool: Codex MCP
   - Impact: +1K tokens

### Skipped Tasks
- None

### Modified Approach
- Task 2.1: Originally planned for 8K tokens, used 9.2K
  - Reason: Added more comprehensive error handling
  - Justification: Prevents production issues

## Known Issues

### Issues Discovered
1. **Performance consideration**
   - Service method `feature-service.fetchAll()` may be slow with >10K records
   - Recommendation: Add pagination in future iteration
   - Tracked in: app-docs/debugging/known-issues.md

### Workarounds Applied
- None

## Validation Results

### Manual Testing
- [✅] Feature creation works
- [✅] Feature retrieval works
- [✅] Feature update works
- [✅] Feature deletion works
- [✅] Auth checks enforced
- [✅] Error handling works

### Performance
- API response time: 45ms average (target: <100ms ✅)
- Database query time: 8ms average
- Memory usage: +12MB (acceptable)

## Documentation Updated
- [✅] app-docs/mappings/feature-to-source.md
- [✅] README.md (new API endpoints documented)
- [✅] API inline docs (JSDoc comments)

## Next Steps

### Immediate (Required)
- [ ] Code review by team
- [ ] Deploy to staging environment
- [ ] User acceptance testing

### Short-term (This Week)
- [ ] Add integration with admin panel
- [ ] Performance testing with 10K+ records
- [ ] Security audit

### Long-term (Backlog)
- [ ] Consider adding pagination to fetchAll()
- [ ] Explore caching for frequently accessed data
- [ ] Add metrics/monitoring

## Success Criteria Review

From original plan:
- [✅] All tests passing (>80% coverage) - Achieved 87%
- [✅] API endpoints functional - All working
- [✅] Documentation updated - Complete
- [✅] No breaking changes - Confirmed
- [✅] Performance acceptable (<100ms) - 45ms average

**Build Status: ✅ SUCCESS**
```

### Return to User

```
✅ Build completed successfully!

📊 Summary:
- 8 tasks completed in 52 minutes
- 9 files modified (+861 lines)
- 30/30 tests passing (87% coverage)
- Token usage: 94.7K/98K (97% efficiency)

🔧 Tools Used:
- Codex MCP: 5 tasks (boilerplate, tests)
- Gemini MCP: 1 task (documentation)
- Claude: 1 task (complex service)
- Playwright MCP: 1 task (E2E tests)

📝 Documentation Updated:
- app-docs/mappings/feature-to-source.md
- README.md

⚠️ Known Issues:
- Performance consideration for large datasets (pagination recommended)

🎯 Next Steps:
- Manual testing recommended
- Ready for code review
- Deploy to staging

📂 Reports:
- Build report: ai-docs/builds/[timestamp]/build-report.md
- Test output: ai-docs/builds/[timestamp]/test-output.txt

Continue to report phase:
/report "ai-docs/builds/[timestamp]/build-report.md"
```

---

## Integration with Report Phase

The report phase will:
1. Read this build report
2. Summarize with Gemini MCP
3. Update project documentation
4. Generate next steps
5. Archive all artifacts
6. Log metrics for future optimization
