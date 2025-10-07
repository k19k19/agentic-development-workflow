description: Multi-agent parallel search to identify files needed for the task
argument-hint: [user_prompt] [scale]
model: claude-sonnet-4-5

# Scout Phase: Multi-Agent File Discovery

**Token Budget**: 10K
**Purpose**: Find relevant files using parallel agents with different models

---

## Arguments

1. `USER_PROMPT`: Task description (what you want to implement)
2. `SCALE`: Number of parallel agents (1-5)
   - 1 = Gemini Flash only
   - 2 = Gemini Flash + Gemini Flash Lite
   - 3 = Above + Codex
   - 4 = Above + Claude Sonnet
   - 5 = Above + Claude with thinking

---

## Pre-Scout Actions

### Step 1: Parse Arguments
```
USER_PROMPT = $1
SCALE = $2 (default: 4)
```

### Step 2: Create Output Directory
```
Create: ai-docs/scout-results/YYYY-MM-DD-HH-MM-[task-slug]/
```

### Step 3: Baseline Git Status
```bash
git diff --stat > ai-docs/scout-results/[timestamp]/baseline.txt
```

---

## Scout Execution

### Launch Parallel Agents

**IMPORTANT**: Use Claude Agent SDK `Task` tool to launch agents in parallel.

**Agent Configuration by Scale:**

#### Scale >= 1: Gemini Flash
```
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Gemini Flash"
  prompt: |
    You are a code search agent using Gemini Flash for speed.

    TASK: Find files relevant to: {USER_PROMPT}

    INSTRUCTIONS:
    1. Use Grep and Glob tools to search the codebase
    2. Focus on finding:
       - Related feature implementations
       - Similar patterns
       - Dependencies
       - Configuration files
    3. Return structured list in this EXACT format:
       <path/to/file.js> (offset: START_LINE, limit: NUM_LINES)
    4. If multiple sections in same file, list separately
    5. Limit to 20 most relevant files
    6. Timeout: 3 minutes

    EXAMPLE OUTPUT:
    app/services/auth.js (offset: 1, limit: 50)
    app/services/auth.js (offset: 120, limit: 30)
    app/api/login.js (offset: 1, limit: 100)
```

#### Scale >= 2: Gemini Flash Lite
```
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Gemini Flash Lite"
  prompt: |
    You are a fast code search agent using Gemini Flash Lite.

    TASK: Find files relevant to: {USER_PROMPT}

    Same instructions as above, but prioritize speed over depth.
    Focus on obvious matches and direct dependencies.
```

#### Scale >= 3: Codex (via MCP)
```
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Codex"
  prompt: |
    You are a code search agent specializing in code patterns.

    TASK: Find files relevant to: {USER_PROMPT}

    Use your code understanding to find:
    - Function/method implementations
    - Class definitions
    - Type definitions
    - Test files

    Same output format as Gemini agents.
```

#### Scale >= 4: Claude Sonnet
```
Use Task tool:
  subagent_type: general-purpose
  description: "Scout with Claude Sonnet"
  prompt: |
    You are a comprehensive code search agent.

    TASK: Find files relevant to: {USER_PROMPT}

    Use architectural understanding to find:
    - All related components
    - Integration points
    - Configuration dependencies
    - Documentation files

    Same output format.
```

#### Scale >= 5: Claude with Extended Thinking
```
Use Task tool:
  subagent_type: general-purpose
  description: "Deep scout with thinking"
  prompt: |
    You are a deep analysis code search agent.

    TASK: Find files relevant to: {USER_PROMPT}

    Use extended thinking to:
    - Understand full architectural context
    - Find indirect dependencies
    - Identify potential edge cases
    - Locate related documentation

    Same output format.
```

### Execution Pattern

```
1. Launch all agents in parallel using multiple Task tool calls
2. Set 3-minute timeout for each agent
3. Collect results as they complete
4. Skip any agent that times out or errors
5. Continue with successful responses
```

---

## Post-Scout Actions

### Step 1: Aggregate Results

```
For each agent response:
1. Parse output for file paths with offset/limit
2. Validate format: <path> (offset: N, limit: M)
3. If invalid format, skip that agent's output
4. Deduplicate files (merge overlapping ranges)
5. Sort by relevance (files mentioned by multiple agents ranked higher)
```

### Step 2: Git Safety Check

```bash
# Check if any agents modified files
git diff --stat > ai-docs/scout-results/[timestamp]/post-scout.txt

# Compare to baseline
diff ai-docs/scout-results/[timestamp]/baseline.txt \
     ai-docs/scout-results/[timestamp]/post-scout.txt

# If differences found:
echo "WARNING: Agents modified files! Resetting..."
git reset --hard HEAD
git clean -fd
```

### Step 3: Generate Scout Report

Write to: `ai-docs/scout-results/[timestamp]/scout-report.md`

```markdown
# Scout Report

**Task**: {USER_PROMPT}
**Scale**: {SCALE} agents
**Timestamp**: YYYY-MM-DD HH:MM:SS

## Agents Used
- [x] Gemini Flash (completed in 45s)
- [x] Gemini Flash Lite (completed in 30s)
- [x] Codex (completed in 60s)
- [ ] Claude Sonnet (timeout)
- [x] Claude Extended (completed in 120s)

## Files Discovered

### High Confidence (mentioned by 3+ agents)
- app/services/auth.js (offset: 1, limit: 50)
- app/api/login.js (offset: 1, limit: 100)

### Medium Confidence (mentioned by 2 agents)
- app/middleware/auth-check.js (offset: 1, limit: 80)

### Low Confidence (mentioned by 1 agent)
- app/utils/token.js (offset: 20, limit: 40)

## Summary
- Total files found: 15
- High confidence: 5
- Medium confidence: 6
- Low confidence: 4
- Total lines to read: ~2,500

## Agent Performance
| Agent | Duration | Files Found | Success |
|-------|----------|-------------|---------|
| Gemini Flash | 45s | 12 | ✅ |
| Gemini Lite | 30s | 8 | ✅ |
| Codex | 60s | 10 | ✅ |
| Claude Sonnet | timeout | 0 | ❌ |
| Claude Extended | 120s | 14 | ✅ |

## Token Usage
- Estimated: 8K tokens
- Actual: [to be filled by report phase]

## Next Steps
- Review high confidence files first
- Use plan phase to create implementation strategy
- Estimated plan tokens: 25K
```

### Step 4: Create Files Collection

Write to: `ai-docs/scout-results/[timestamp]/files-collection.txt`

```
# One file per line with offset/limit
app/services/auth.js (offset: 1, limit: 50)
app/services/auth.js (offset: 120, limit: 30)
app/api/login.js (offset: 1, limit: 100)
app/middleware/auth-check.js (offset: 1, limit: 80)
...
```

---

## Output

Return to calling slash command:

```
Scout completed successfully!

Files discovered: 15
Report: ai-docs/scout-results/[timestamp]/scout-report.md
Collection: ai-docs/scout-results/[timestamp]/files-collection.txt

Use collection path in /plan phase:
/plan "{USER_PROMPT}" "[docs]" "ai-docs/scout-results/[timestamp]/files-collection.txt"
```

---

## Error Handling

### All Agents Failed
```
ERROR: All scout agents failed or timed out.

Possible causes:
- Network issues
- API key problems
- Codebase too large

Suggested actions:
1. Check MCP tool configurations
2. Verify API keys in .env
3. Try lower scale (1-2 agents)
4. Use manual file selection
```

### Git Changes Detected
```
WARNING: Agents modified files (reset applied)

Changed files:
[list from git diff]

Agents should be read-only. Check:
1. Agent prompts (should not modify files)
2. MCP tool permissions
3. Report issue to agent maintainer
```

### Invalid Output Format
```
WARNING: Agent [name] returned invalid format

Expected: <path> (offset: N, limit: M)
Received: [actual output]

Action: Skipped this agent's output
Impact: Fewer files in collection
```

---

## Integration with Plan Phase

The plan phase will:
1. Read `files-collection.txt`
2. Load each file with specified offset/limit
3. Use loaded context for planning
4. Reference scout report for confidence levels
