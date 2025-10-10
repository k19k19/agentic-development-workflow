# Slash Command Architecture

## Overview

Slash commands in this template are **not executable scripts**. They are **markdown instruction files** interpreted by Claude Code's `SlashCommand` tool.

This architecture enables a powerful "instruction-based runtime" where prompts with variable substitution orchestrate complex AI workflows.

---

## How Slash Commands Work

### Execution Flow

```
1. User types: /scout "find auth code"
   ↓
2. Claude Code reads: .claude/commands/scout.md
   ↓
3. Claude Code expands variables:
   - $1 → "find auth code"
   - ${TASK} → "find auth code"
   ↓
4. Claude executes instructions using available tools:
   - Bash (npm run search)
   - Read (file operations)
   - Grep (code search)
   - Task (launch subagents)
   ↓
5. Claude reports results to user
```

### Key Characteristics

1. **Prompt-Based**: Commands are prompts, not code
2. **Variable Substitution**: Arguments passed via `$1`, `$2`, `${VAR_NAME}`
3. **Tool Orchestration**: Commands invoke Claude's tools (Bash, Read, Edit, Task)
4. **Nested Execution**: Commands can call other commands
5. **Context-Aware**: Full access to project files and git state

---

## Command Structure

### Basic Template

```markdown
## Variables
TASK: $1

## Workflow
1. Run npm run search -- "[TASK]"
2. Read the results
3. Format output for user
```

### Variable Syntax

**Positional Arguments**:
- `$1` - First argument
- `$2` - Second argument
- `$3` - Third argument

**Named Variables**:
- `${TASK}` - Explicitly named for clarity
- `${DOC_URLS}` - Multi-word variable names
- `${MODE}` - Optional parameters

**Quoting Rules**:
- Arguments must be quoted: `/scout "my task"`
- Nested quotes become single quotes: `"/full \"task\" \"mode\""`

---

## Example: Scout Command

### Command File (`.claude/commands/scout.md`)

```markdown
## Variables
TASK: $1
SCALE: $2 (default: 4)

## Instructions
1. Search vector store: `npm run search -- "[TASK]"`
2. Parse results to extract file paths
3. Format as structured output:
   - path/to/file.js (offset: 0, limit: 50)
   - path/to/other.js (offset: 100, limit: 30)
```

### Invocation

```bash
/scout "authentication flow"
```

### Expansion

```markdown
## Variables
TASK: authentication flow
SCALE: 4

## Instructions
1. Search vector store: `npm run search -- "authentication flow"`
2. Parse results to extract file paths
3. Format as structured output...
```

### Claude's Execution

```
[Claude uses Bash tool]
npm run search -- "authentication flow"

[Claude reads output]
Found: app/auth/login.js, app/auth/session.js

[Claude formats response]
app/auth/login.js (offset: 0, limit: 50)
app/auth/session.js (offset: 0, limit: 100)
```

---

## Chaining Commands

### Sequential Workflow

Commands can invoke other commands:

```markdown
## /full command workflow
1. Call /scout to find files
2. Call /plan with scout results
3. Wait for user approval
4. Call /build with plan path
5. Call /report to generate summary
```

### Implementation

```markdown
## Variables
USER_PROMPT: $1
DOC_URLS: $2
MODE: $3

## Workflow
1. Execute: /scout "[USER_PROMPT]"
   - Capture output: RELEVANT_FILES
2. Execute: /plan "[USER_PROMPT]" "[DOC_URLS]" "[RELEVANT_FILES]"
   - Capture output: PLAN_PATH
3. WAIT for user approval
4. Execute: /build "[PLAN_PATH]"
```

**Critical**: Commands execute sequentially, not in parallel. Each step must complete before the next begins.

---

## Tool Usage in Commands

### Available Tools

Commands can instruct Claude to use these tools:

| Tool | Purpose | Example |
|------|---------|---------|
| `Bash` | Run shell commands | `npm run search`, `git diff` |
| `Read` | Read file contents | Read scout results, Read plan file |
| `Write` | Create new files | Generate reports, Create summaries |
| `Edit` | Modify existing files | Update mappings, Patch code |
| `Grep` | Search code patterns | Find function calls, Search imports |
| `Task` | Launch subagents | Parallel scouts, Background builds |
| `SlashCommand` | Call other commands | Chain workflows |

### Example: Using Task Tool

```markdown
## Launch parallel scouts
Use the Task tool to launch 4 parallel scouts:

1. Scout 1: Search app-docs/specs/
2. Scout 2: Search app-docs/guides/
3. Scout 3: Search app/
4. Scout 4: Search tests/

Wait for all to complete, then merge results.
```

---

## Budget Mode

Commands support budget optimization:

```markdown
## Variables
MODE: $3

## Budget Behavior
IF MODE == "budget":
  - Use scale 2 scouts (not 4)
  - Generate ~350 word plan (not 1000)
  - Skip detailed report (summary only)
ELSE:
  - Standard workflow
```

### Token Allocation

**Budget Mode**:
- Scout: ~5K tokens
- Plan: ~15K tokens
- Build: ~20K tokens
- **Total: ~40K tokens**

**Standard Mode**:
- Scout: ~10K tokens
- Plan: ~30K tokens
- Build: ~50K tokens
- Report: ~10K tokens
- **Total: ~100K tokens**

---

## Writing New Commands

### Step 1: Create Command File

```bash
touch .claude/commands/my-command.md
```

### Step 2: Define Variables

```markdown
## Variables
FEATURE_NAME: $1
OUTPUT_PATH: $2 (default: ./output.md)
```

### Step 3: Write Instructions

```markdown
## Workflow
1. Search for feature: `npm run search -- "[FEATURE_NAME]"`
2. Read relevant files
3. Generate documentation
4. Save to [OUTPUT_PATH]
```

### Step 4: Add to Command Mapping

Update `app-docs/guides/COMMAND-MAPPING.md`:

```markdown
| /my-command | `$1` feature name, `$2` output path | Generate feature docs |
```

### Step 5: Test

```bash
/my-command "authentication" "docs/auth.md"
```

---

## Common Patterns

### Pattern 1: Search and Read

```markdown
1. Run: npm run search -- "[QUERY]"
2. Parse results for file paths
3. Use Read tool on each file
4. Aggregate information
5. Return summary
```

### Pattern 2: Plan and Execute

```markdown
1. Generate plan document
2. Save to ai-docs/plans/[timestamp]-[slug]/plan.md
3. Display plan to user
4. WAIT for approval
5. Execute plan steps
```

### Pattern 3: Validate and Deploy

```markdown
1. Run: npm test
2. Check: All tests pass?
3. Run: git status
4. Check: Working directory clean?
5. IF all checks pass:
   - Proceed with deployment
   ELSE:
   - Report errors, halt workflow
```

---

## Debugging Commands

### View Command Contents

```bash
cat .claude/commands/scout.md
```

### Trace Execution

Commands should include logging:

```markdown
## Workflow
1. Log: "Starting scout phase..."
2. Run: npm run search
3. Log: "Found N results"
4. Log: "Scout complete"
```

### Test in Isolation

Break complex commands into smaller testable units:

```bash
# Instead of /full (which chains 5 commands)
# Test each step independently:
/scout "test query"
/plan "test task" "" "manual-file-list"
/build "path/to/test-plan.md"
```

---

## Limitations

### What Slash Commands CANNOT Do

1. **Run outside Claude Code**: Commands require the Claude Code environment
2. **Access user secrets**: No access to environment variables or credentials
3. **Execute arbitrary code**: Limited to Claude's approved tool set
4. **Parallel execution**: Commands run sequentially, not concurrently*
5. **Persistent state**: No memory between command invocations

*Exception: Task tool can launch parallel subagents, but the command itself executes linearly.

### Workarounds

**Need parallel execution?** Use the Task tool:

```markdown
Use Task tool to launch parallel agents:
- Agent 1: Process files 1-100
- Agent 2: Process files 101-200
Wait for all agents to complete.
```

**Need persistent state?** Write to files:

```markdown
1. Save intermediate results to ai-docs/temp/state.json
2. Next command reads ai-docs/temp/state.json
3. Resume from saved state
```

---

## Best Practices

### 1. Clear Variable Names

**Bad**:
```markdown
TASK: $1
VAR: $2
X: $3
```

**Good**:
```markdown
USER_PROMPT: $1
DOCUMENTATION_URLS: $2
EXECUTION_MODE: $3
```

### 2. Explicit Instructions

**Bad**:
```markdown
Search for files and do stuff
```

**Good**:
```markdown
1. Run: npm run search -- "[TASK]"
2. Parse output to extract file paths
3. For each file, read lines 1-50
4. Return structured list: path (offset: N, limit: M)
```

### 3. Guard Clauses

```markdown
## Preconditions
CHECK: Is git working directory clean?
  - Run: git status
  - IF modified files exist: HALT with error

CHECK: Does plan file exist?
  - Run: test -f "[PLAN_PATH]"
  - IF not found: HALT with error
```

### 4. User Feedback

```markdown
1. Log: "🔍 Searching for relevant files..."
2. Run search
3. Log: "✅ Found 5 relevant files"
4. Log: "📄 Reading file contents..."
5. Log: "✅ Build complete"
```

### 5. Token Budgets

Document expected token usage:

```markdown
## Token Budget
- Search: ~2K tokens
- Read files: ~10K tokens
- Generate output: ~3K tokens
- **Total: ~15K tokens**
```

---

## Comparison: Commands vs Scripts

| Aspect | Slash Commands | Shell Scripts |
|--------|----------------|---------------|
| Runtime | Claude Code | Any shell |
| Language | Markdown (instructions) | Bash/Python/etc (code) |
| Execution | AI interprets | OS executes |
| Tools | Claude's tools | System commands |
| Context | Project + AI knowledge | Filesystem only |
| Flexibility | Adaptive (AI reasoning) | Fixed (deterministic) |
| Portability | Requires Claude Code | Portable across systems |

**When to use Commands**: Complex workflows requiring AI reasoning, context awareness, or tool orchestration.

**When to use Scripts**: Deterministic automation, CI/CD pipelines, or tasks requiring guaranteed reproducibility.

---

## Migration Guide: Scripts → Commands

### Before (Shell Script)

```bash
#!/bin/bash
# scripts/generate-docs.sh

FILES=$(find app/ -name "*.js")
for file in $FILES; do
  echo "Processing $file"
  # Complex logic here
done
```

### After (Slash Command)

```markdown
## /generate-docs command

## Workflow
1. Use Glob tool: app/**/*.js
2. For each file:
   - Read file contents
   - Extract JSDoc comments
   - Generate markdown
3. Save to docs/api.md
```

**Benefits**:
- AI handles complex logic
- No shell script maintenance
- Context-aware processing
- Adaptive to project structure

---

## Advanced: Dynamic Commands

### Conditionals

```markdown
## Workflow
1. Detect project scale
2. IF scale == "SMALL":
   - Use direct implementation
   ELSE IF scale == "MEDIUM":
   - Use scout + build
   ELSE:
   - Use full workflow with reporting
```

### Loops

```markdown
## Workflow
FOR each file in scout results:
  1. Read file contents
  2. Analyze with Gemini MCP
  3. Add analysis to report
```

### Error Handling

```markdown
## Workflow
1. TRY:
   - Run npm test
2. CATCH (if tests fail):
   - Read test output
   - Identify failing tests
   - Generate fix suggestions
   - Return error report
```

---

## Real-World Example: /full Command

### Command File

```markdown
## Variables
USER_PROMPT: $1
DOC_URLS: $2
MODE: $3 (default: "standard")

## Workflow

### Phase 1: Scout
1. Log: "📍 Phase 1: Scouting relevant files..."
2. Execute: /scout "[USER_PROMPT]"
3. Capture: RELEVANT_FILES (output from scout)

### Phase 2: Plan
4. Log: "📋 Phase 2: Creating implementation plan..."
5. Execute: /plan "[USER_PROMPT]" "[DOC_URLS]" "[RELEVANT_FILES]"
6. Capture: PLAN_PATH
7. Display plan to user
8. WAIT for user approval (CRITICAL: Do not proceed without approval)

### Phase 3: Build
9. Log: "🔨 Phase 3: Executing build..."
10. Execute: /build "[PLAN_PATH]"
11. Capture: BUILD_REPORT_PATH

### Phase 4: Report
12. Log: "📊 Phase 4: Generating report..."
13. Read: BUILD_REPORT_PATH
14. Display summary to user
15. Log: "✅ Workflow complete"

## Token Budget
IF MODE == "budget":
  - Total: ~40K tokens
ELSE:
  - Total: ~100K tokens
```

### Usage

```bash
# Standard mode
/full "Add user authentication" "https://auth0.com/docs"

# Budget mode
/full "Add health check endpoint" "" "budget"
```

---

## Summary

**Key Takeaways**:

1. ✅ Slash commands are **instructions**, not scripts
2. ✅ They leverage **Claude's tools** for execution
3. ✅ Commands **chain together** to create complex workflows
4. ✅ Variable substitution enables **dynamic behavior**
5. ✅ Budget mode enables **token optimization**
6. ✅ Commands are **context-aware** and **adaptive**

**Next Steps**:

- Read existing commands: `.claude/commands/*.md`
- Review command mapping: `app-docs/guides/COMMAND-MAPPING.md`
- Study workflow patterns: `app-docs/guides/WORKFLOW-DECISION-TREE.md`
- Write your first command: Follow "Writing New Commands" section above

---

**Questions?** See:
- [COMMAND-MAPPING.md](COMMAND-MAPPING.md) - Command reference
- [WORKFLOW-DECISION-TREE.md](WORKFLOW-DECISION-TREE.md) - When to use which command
- [budget-mode.md](budget-mode.md) - Token optimization guide
