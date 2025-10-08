# Migration Guide: Old SDK → New Claude Agent SDK

**Version**: 1.0 | **Last Updated**: October 2025

This guide helps you migrate from the old external agent calling pattern to the new Claude Agent SDK with the `Task` tool.

---

## What Changed?

### Old Pattern (External Bash Calls)

```markdown
# scout.md (OLD)
- Write a prompt for agents to run via Bash:
  - `gemini -p "[prompt]" --model gemini-2.5-flash`
  - `codex exec -m gpt-5-codex "[prompt]"`
  - `claude -p "[prompt]" --model sonnet-4.5`
```

**Problems:**
- Direct Bash calls to external CLI tools
- No standardized interface
- Harder to manage errors
- Limited to CLI tools only
- No MCP integration

### New Pattern (Claude Agent SDK + Task Tool)

```markdown
# scout.md (NEW)
Use Task tool with general-purpose agents:
  subagent_type: general-purpose
  description: "Scout with Gemini"
  prompt: |
    Use Gemini MCP for fast code search.
    Find files relevant to: {task}
    Return structured list.
```

**Benefits:**
- ✅ Unified `Task` tool interface
- ✅ MCP server integration
- ✅ Better error handling
- ✅ Parallel agent execution
- ✅ Access to all Claude Code tools
- ✅ Standardized agent communication

---

## Migration Steps

### Step 1: Identify External Agent Calls

**Old pattern to find:**

```bash
# In your slash commands:
gemini -p "..."
codex exec -m "..." "..."
claude -p "..." --model "..."
```

**Replace with:**

```
Task tool calls with appropriate prompts
```

### Step 2: Convert to Task Tool Format

#### Example 1: Gemini Scout Agent

**OLD:**
```markdown
Use Bash tool to run:
  gemini -p "Search codebase for authentication files. Return structured list with line ranges." --model gemini-2.5-flash
```

**NEW:**
```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Scout for auth files with Gemini"
  prompt: |
    You are a code search agent.

    TOOL: Use Gemini MCP (gemini-mcp-tool) for efficient search

    TASK: Search codebase for authentication-related files

    INSTRUCTIONS:
    1. Use Grep and Glob tools to find relevant files
    2. Focus on: login, auth, session, token files
    3. Return structured list:
       <path/to/file.js> (offset: LINE, limit: COUNT)

    Timeout: 3 minutes
```

#### Example 2: Codex Code Generation

**OLD:**
```bash
codex exec -m gpt-5-codex -s read-only "Generate API endpoint for user login"
```

**NEW:**
```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Generate login endpoint with Codex"
  prompt: |
    You are a code generation agent.

    TOOL: Use Codex MCP (codex-mcp-tool)

    TASK: Generate Express.js API endpoint for user login

    REQUIREMENTS:
    - Route: POST /api/auth/login
    - Input validation (email, password)
    - JWT token generation
    - Error handling

    PATTERN: Follow existing patterns in app/api/

    Return complete code for new file.
```

#### Example 3: Claude Deep Analysis

**OLD:**
```bash
claude -p "Analyze service architecture and suggest improvements" --model sonnet-4.5 --thinking
```

**NEW:**
```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Architectural analysis with Claude"
  prompt: |
    You are an architectural analysis agent.

    TASK: Analyze service architecture in app/services/

    FOCUS:
    - Service dependencies
    - Coupling and cohesion
    - Potential improvements
    - Refactoring opportunities

    DELIVERABLE: Structured analysis report with recommendations

    Use extended thinking for deep analysis.
```

---

## Pattern Conversion Reference

### 1. Scout Phase Migration

**OLD scout.md:**
```markdown
description: Search codebase
argument-hint: [user_prompt] [scale]

## Instructions
- Kick off parallel agents using Bash:
  - gemini -p "[prompt]" --model gemini-2.5-flash
  - codex exec "[prompt]"
  - claude -p "[prompt]"
```

**NEW scout.md:**
```markdown
description: Search codebase
argument-hint: [user_prompt] [scale]

## Instructions
- Launch parallel agents using Task tool:

#### Agent 1: Gemini Flash
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Gemini Flash"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: Find files for {USER_PROMPT}
    FORMAT: <path> (offset: N, limit: M)

#### Agent 2: Codex
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Codex"
  prompt: |
    TOOL: Use Codex MCP
    TASK: Find code patterns for {USER_PROMPT}
    FORMAT: <path> (offset: N, limit: M)
```

### 2. Build Phase Migration

**OLD build.md:**
```markdown
# For boilerplate generation:
echo "Generate model class" | codex exec -
```

**NEW build.md:**
```markdown
# For boilerplate generation:
Use Task tool:
  subagent_type: general-purpose
  description: "Generate model with Codex"
  prompt: |
    TOOL: Use Codex MCP

    Generate database model class:
    - File: app/models/user.js
    - Fields: id, email, name, created_at
    - Pattern: Class-based with validators

    Return complete file content.
```

### 3. Documentation Phase Migration

**OLD:**
```bash
gemini -p "Summarize this code file" < app/service.js
```

**NEW:**
```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Generate docs with Gemini"
  prompt: |
    TOOL: Use Gemini MCP

    Read app/service.js and generate documentation:
    - Purpose of the service
    - Public methods
    - Dependencies
    - Usage examples

    Format: Markdown
```

---

## Parallel Execution Migration

### OLD: Sequential Bash Calls

```bash
# Run agents one by one
gemini -p "[prompt1]" > result1.txt
codex exec "[prompt2]" > result2.txt
claude -p "[prompt3]" > result3.txt

# Aggregate results
cat result1.txt result2.txt result3.txt > combined.txt
```

### NEW: Parallel Task Tool Calls

```markdown
# In a SINGLE message, make multiple Task tool calls:

Use Task tool (call 1):
  subagent_type: general-purpose
  description: "Agent 1 - Gemini search"
  prompt: | [prompt1]

Use Task tool (call 2):
  subagent_type: general-purpose
  description: "Agent 2 - Codex generation"
  prompt: | [prompt2]

Use Task tool (call 3):
  subagent_type: general-purpose
  description: "Agent 3 - Claude analysis"
  prompt: | [prompt3]

# All three run in parallel
# Claude Code aggregates results automatically
```

---

## Error Handling Migration

### OLD: Manual Error Checking

```bash
gemini -p "[prompt]" 2>&1 | tee output.txt

if grep -q "ERROR" output.txt; then
  echo "Agent failed"
  exit 1
fi
```

### NEW: Built-in Error Handling

```markdown
Use Task tool:
  subagent_type: general-purpose
  description: "Task with error handling"
  prompt: |
    TASK: [task description]

    If errors occur:
    - Log the error
    - Return partial results if possible
    - Indicate what failed

    Do not fail silently.

# Claude Code automatically handles:
# - Timeouts
# - Tool failures
# - Invalid responses
# - Returns structured error info
```

---

## Testing Your Migration

### 1. Test Individual Agent Calls

Create a test slash command:

```markdown
# .claude/commands/test-agent.md
description: Test agent migration
model: claude-sonnet-4-5

Use Task tool:
  subagent_type: general-purpose
  description: "Test Gemini MCP"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: List files in app/ directory
    Return: JSON array of file paths

# Run: /test-agent
# Verify: Agent returns expected format
```

### 2. Test Parallel Execution

```markdown
# .claude/commands/test-parallel.md
description: Test parallel agents
model: claude-sonnet-4-5

Use Task tool (Agent 1):
  subagent_type: general-purpose
  description: "Agent 1"
  prompt: | [simple task 1]

Use Task tool (Agent 2):
  subagent_type: general-purpose
  description: "Agent 2"
  prompt: | [simple task 2]

# Run: /test-parallel
# Verify: Both complete, neither blocked
```

### 3. Test Full Workflow

```bash
# Run full scout-plan-build-report workflow
/scout_plan_build "Add simple health endpoint" ""

# Verify:
# - Scout phase uses Task tool (not Bash)
# - All agents complete successfully
# - Results aggregated correctly
# - No calls to external CLIs
```

---

## Troubleshooting

### Issue: "Invalid response format"

**Cause:** Agent didn't follow output format

**Fix:**
1. Be more explicit in prompt about format
2. Provide examples in prompt
3. Add validation step after agent completes

### Issue: "Agents not running in parallel"

**Cause:** Multiple messages instead of single message

**Fix:**
Ensure all Task tool calls are in SAME response:

```markdown
❌ WRONG (sequential):
Message 1: Use Task tool (Agent 1)
[Wait for response]
Message 2: Use Task tool (Agent 2)

✅ CORRECT (parallel):
Message 1:
  Use Task tool (Agent 1):
    ...
  Use Task tool (Agent 2):
    ...
```

---

## Migration Checklist

### Before Migration
- [ ] Identify all external agent calls in slash commands
- [ ] Document current behavior and output format
- [ ] Set up MCP tool configurations
- [ ] Test MCP tools individually

### During Migration
- [ ] Convert Bash calls to Task tool calls
- [ ] Update prompts to reference MCP tools
- [ ] Enable parallel execution where applicable
- [ ] Add error handling to agent prompts
- [ ] Update documentation

### After Migration
- [ ] Test each slash command individually
- [ ] Test full workflow end-to-end
- [ ] Verify parallel execution works
- [ ] Check token usage (should be similar or lower)
- [ ] Update team documentation

### Cleanup
- [ ] Remove old Bash-based commands
- [ ] Archive old workflow files
- [ ] Update CLAUDE.md with new patterns
- [ ] Remove unused CLI tool dependencies

---

## Benefits Realized

After migration, you should see:

✅ **Better error handling**: Structured errors, not silent failures
✅ **Easier debugging**: Clear agent logs in Claude Code
✅ **More flexible**: Can use any MCP tool, not just CLI
✅ **Parallel execution**: True parallelism, faster workflows
✅ **Unified interface**: One `Task` tool for all agents
✅ **Better testing**: Can test agents in isolation
✅ **Token efficiency**: MCP tools optimized for Claude Code

---

## Example: Complete Migration

### Before (OLD)

```markdown
# .claude/commands/scout.md
description: Scout for files
argument-hint: [prompt] [scale]

# Instructions
- Run these agents in parallel:
  - gemini -p "Find files for {prompt}" --model gemini-2.5-flash
  - codex exec -m gpt-5-codex "Find files for {prompt}"
  - claude -p "Find files for {prompt}" --model sonnet-4.5

- Aggregate results manually
- Parse output with grep/awk
- Git reset if changes detected
```

### After (NEW)

```markdown
# .claude/commands/scout.md
description: Scout for files
argument-hint: [user_prompt] [scale]
model: claude-sonnet-4-5

# Scout Phase: Multi-Agent File Discovery

## Arguments
USER_PROMPT = $1
SCALE = $2

## Execution

Launch parallel agents using Task tool:

Use Task tool (Agent 1):
  subagent_type: general-purpose
  description: "Scout with Gemini Flash"
  prompt: |
    TOOL: Use Gemini MCP
    TASK: Find files relevant to: {USER_PROMPT}
    FORMAT: <path> (offset: N, limit: M)
    TIMEOUT: 3 minutes

Use Task tool (Agent 2):
  subagent_type: general-purpose
  description: "Scout with Codex"
  prompt: |
    TOOL: Use Codex MCP
    TASK: Find code patterns for: {USER_PROMPT}
    FORMAT: <path> (offset: N, limit: M)
    TIMEOUT: 3 minutes

Use Task tool (Agent 3):
  subagent_type: general-purpose
  description: "Scout with Claude"
  prompt: |
    TOOL: Use Claude's built-in tools (Grep, Glob)
    TASK: Comprehensive search for: {USER_PROMPT}
    FORMAT: <path> (offset: N, limit: M)
    TIMEOUT: 3 minutes

## Post-Execution
- Aggregate results (automatic in Claude Code)
- Git safety check: git diff --stat
- Save to ai-docs/scout-results/
```

---

## Additional Resources

- **Claude Agent SDK docs**: https://docs.anthropic.com/agent-sdk
- **Task tool documentation**: Built into Claude Code
- **MCP server specs**: Model Context Protocol documentation
- **Example migrations**: See `.claude/commands/` for full examples

---

## Support

If you encounter issues during migration:

1. Review this guide's troubleshooting section
2. Check agent logs in Claude Code
3. Test MCP tools individually
4. Simplify agent prompts and iterate

---

**Migration Guide Version**: 1.0
**Compatible with**: Claude Code Agent SDK (2025)
**Last Updated**: October 2025
