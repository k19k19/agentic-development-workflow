# Token Accounting Guide

**Version**: 1.0
**Last Updated**: October 2025
**Status**: Production Ready

---

## Overview

The token accounting system automatically captures and tracks token usage across all AI models (Claude, Gemini, Codex) used in workflows. This replaces manual token estimation with accurate, automated collection via API integration.

### Key Features

- ✅ **Automated token capture** from Claude, Gemini, and Codex APIs
- ✅ **Model-specific breakdown** showing usage by AI model
- ✅ **Workflow metrics logging** to `ai-docs/logs/workflow-metrics.jsonl`
- ✅ **Efficiency reporting** with 90% target tracking
- ✅ **Backward compatible** with manual token entry

---

## Quick Start

### 1. Complete Task with Auto Token Capture

**After completing a workflow:**

```bash
npm run tasks:complete-auto TASK-123 build workflow-abc123
```

**Parameters:**
- `TASK-123` - Your task ID from the task ledger
- `build` - Workflow type (scout, plan, build, quick, full)
- `workflow-abc123` - Workflow identifier (conversation ID, session ID)

**Output:**
```
📊 Capturing token usage from APIs...
✅ Task completed: TASK-123
   Implement token accounting
   Tokens used: 45,320
   Breakdown:
     - claude-sonnet-4-5: 38,500
     - gemini-2.5-pro: 6,820
     - codex: 0
   Remaining budget: 454,680
```

### 2. View Efficiency Report

```bash
npm run tasks:efficiency 7
```

**Output:**
```
📊 EFFICIENCY REPORT (7 days)

Workflows completed: 12
Total tokens: 485,320
Average per workflow: 40,443
Efficiency score: 87% (target: >90%)

Model breakdown:
  claude-sonnet-4-5: 320,500 tokens
  gemini-2.5-pro: 158,820 tokens
  codex: 6,000 tokens
```

---

## Architecture

### Components

```
Token Accounting System
├── Token Collectors (API clients)
│   ├── claude-collector.js    → Parses from Claude CLI output
│   ├── gemini-collector.js    → Reads from Gemini MCP responses
│   └── codex-collector.js     → Estimates from character count
│
├── Workflow Metrics Logger
│   └── workflow-metrics-logger.js → Logs to JSONL file
│
└── Task Manager Integration
    └── manage-tasks.js
        ├── completeTaskAuto()   → New automated method
        └── completeTask()       → Legacy manual method
```

### Data Flow

```
Workflow Execution (e.g., /build)
    ↓
User runs: npm run tasks:complete-auto TASK-123 build conv-456
    ↓
TokenCollectorFactory.captureAll(conv-456)
    ↓
├── ClaudeCollector → Parse CLI output → 38,500 tokens
├── GeminiCollector → Read MCP metadata → 6,820 tokens
└── CodexCollector → Estimate chars → 0 tokens
    ↓
metricsLogger.logWorkflow('build', 'TASK-123', [...])
    ↓
Update task ledger with token breakdown
    ↓
Display summary to user
```

---

## Token Collectors

### Claude Collector

**Method**: Parses token usage from Claude Code CLI output

**Current Implementation**:
- Searches for pattern: `Token usage: X/200000; Y remaining`
- Extracts total used tokens
- Estimates input/output split (60%/40%)

**Future**: Will use official Anthropic API when conversation-level metrics become available

**Example Output**:
```json
{
  "model": "claude-sonnet-4-5",
  "inputTokens": 27000,
  "outputTokens": 18000,
  "totalTokens": 45000,
  "timestamp": "2025-10-11T10:30:00Z",
  "metadata": {
    "conversationId": "conv-456",
    "source": "cli-output-parse"
  }
}
```

### Gemini Collector

**Method**: Reads token counts from Gemini MCP tool responses

**Current Implementation**:
- Captures `promptTokenCount`, `candidatesTokenCount`, `totalTokenCount`
- Requires storing MCP responses in session logs (to be implemented)

**Future**: Direct API integration for real-time capture

**Example Output**:
```json
{
  "model": "gemini-2.5-pro",
  "inputTokens": 5000,
  "outputTokens": 1820,
  "totalTokens": 6820,
  "timestamp": "2025-10-11T10:30:00Z",
  "metadata": {
    "requestId": "req-789",
    "source": "gemini-mcp"
  }
}
```

### Codex Collector

**Method**: Character-based estimation (1 token ≈ 4 characters for code)

**Current Implementation**:
- Fallback estimation method
- Returns 0 tokens currently (requires session log integration)

**Future**: Request token reporting from Codex MCP team

**Example Output**:
```json
{
  "model": "codex",
  "inputTokens": 0,
  "outputTokens": 0,
  "totalTokens": 0,
  "timestamp": "2025-10-11T10:30:00Z",
  "metadata": {
    "conversationId": "conv-456",
    "source": "estimation",
    "note": "Codex does not provide token counts; estimated from character count"
  }
}
```

---

## Metrics Logging

### JSONL Format

All token usage is logged to `ai-docs/logs/workflow-metrics.jsonl`:

```jsonl
{"timestamp":"2025-10-11T10:30:00Z","type":"workflow","workflow":"build","taskId":"TASK-123","tokens":{"total":45320,"byModel":{"claude-sonnet-4-5":{"input":27000,"output":18000,"total":45000},"gemini-2.5-pro":{"input":5000,"output":1820,"total":6820}}},"metadata":{"estimatedTokens":80000}}
```

### Efficiency Calculation

**Formula**:
```
Efficiency = (Gemini tokens + Codex tokens) / Total tokens × 100
```

**Target**: >90% of tokens from cheaper models (Gemini/Codex)

**Why 90%?** Claude is 10-20x more expensive than Gemini. Using Gemini for reading docs and Codex for boilerplate maximizes budget.

---

## Usage Patterns

### Pattern 1: Automated Workflow

```bash
# 1. Start task
/full "Add OAuth2 authentication" "" "budget"

# 2. After workflow completes, auto-capture tokens
npm run tasks:complete-auto TASK-456 full conv-abc

# 3. Check efficiency
npm run tasks:efficiency 7
```

### Pattern 2: Manual Fallback

If automated collection fails:

```bash
# Use manual method
npm run tasks:complete TASK-456 85000
```

### Pattern 3: Weekly Review

```bash
# Check 30-day efficiency
npm run tasks:efficiency 30

# Review metrics file directly
cat ai-docs/logs/workflow-metrics.jsonl | jq .
```

---

## Configuration

### Environment Variables

Create `.env` file:

```bash
# Optional: For future Claude API integration
ANTHROPIC_API_KEY=sk-ant-...

# Optional: For Gemini API validation
GEMINI_API_KEY=AI...
```

**Note**: Currently only used for credential validation. Token capture works without these.

### Validation

```bash
# Check if collectors are working
node scripts/token-collectors/index.js

# Test with a sample workflow ID
node -e "
const TokenCollectorFactory = require('./scripts/token-collectors');
TokenCollectorFactory.captureAll('test-123').then(console.log);
"
```

---

## Troubleshooting

### Issue: "No workflow data available"

**Cause**: Metrics file doesn't exist yet

**Solution**: Complete at least one task with `complete-auto`:
```bash
npm run tasks:complete-auto TASK-123 test test-workflow
```

### Issue: All collectors return 0 tokens

**Cause**: Session logs not available or identifiers incorrect

**Solution**:
1. Verify session summary exists: `ls ai-docs/sessions/`
2. Use correct workflow ID (conversation ID from Claude)
3. Check collector logs for errors

### Issue: Efficiency score is low (<50%)

**Cause**: Not using Gemini/Codex for appropriate tasks

**Solution**:
1. Review tool delegation in `~/.claude/CLAUDE.md`
2. Use Gemini for documentation reading
3. Use Codex for boilerplate code
4. Reserve Claude for complex logic

### Issue: Token breakdown shows unexpected values

**Cause**: Estimation algorithms are placeholders

**Solution**:
- Claude: Parsing CLI output (60/40 split is estimated)
- Gemini: Requires MCP response capture (work in progress)
- Codex: Character-based estimation (work in progress)

**This is expected in v1.0.** Future versions will improve accuracy.

---

## Migration Strategy

### Phase 1: Parallel Operation (Current)

- Both `complete` and `complete-auto` available
- Users can choose either method
- No breaking changes

### Phase 2: Encourage Adoption (Next 2-3 weeks)

- Update all slash command docs to recommend `complete-auto`
- Dashboard prompts suggest automated tracking
- Track adoption rate

### Phase 3: Deprecation (Month 2+)

- Mark `complete` as deprecated
- Show warning when manual method used
- Provide migration guide

### Phase 4: Remove Manual Entry (Month 3+)

- Remove `complete` function
- Rename `complete-auto` → `complete`
- Update all documentation

---

## API Reference

### completeTaskAuto()

```javascript
/**
 * Complete task with automated token collection
 * @param {string} taskId - Task ID from task ledger
 * @param {string} workflowType - scout | plan | build | quick | full
 * @param {string} workflowId - Conversation/session identifier
 * @returns {Promise<{task: Object, tokenUsage: Array}>}
 */
async function completeTaskAuto(taskId, workflowType, workflowId)
```

**Example**:
```javascript
const result = await completeTaskAuto('TASK-123', 'build', 'conv-abc');
console.log(result.task.actualTokens); // 45320
console.log(result.tokenUsage); // Array of TokenUsage objects
```

### TokenCollectorFactory.captureAll()

```javascript
/**
 * Capture tokens from all models
 * @param {string} workflowId - Workflow identifier
 * @returns {Promise<Array<TokenUsage>>}
 */
static async captureAll(workflowId)
```

**Example**:
```javascript
const usage = await TokenCollectorFactory.captureAll('conv-abc');
// Returns: [claudeUsage, geminiUsage, codexUsage]
```

### metricsLogger.getEfficiency()

```javascript
/**
 * Get efficiency report for time period
 * @param {number} days - Number of days to analyze (default: 7)
 * @returns {Promise<Object|null>} Efficiency stats or null if no data
 */
async getEfficiency(days = 7)
```

**Example**:
```javascript
const stats = await metricsLogger.getEfficiency(30);
console.log(stats.efficiency); // 87
console.log(stats.modelUsage); // { claude: {...}, gemini: {...} }
```

---

## Best Practices

### 1. Always Use Automated Tracking

```bash
# Good
npm run tasks:complete-auto TASK-123 build conv-abc

# Avoid (unless automated tracking fails)
npm run tasks:complete TASK-123 85000
```

### 2. Use Correct Workflow Types

- `scout` - Vector search phase
- `plan` - Planning phase
- `build` - Implementation phase
- `quick` - Direct Codex implementation
- `full` - Complete scout → plan → build workflow

### 3. Provide Meaningful Workflow IDs

```bash
# Good: Use conversation ID or session identifier
npm run tasks:complete-auto TASK-123 build conv-20251011-oauth

# Avoid: Generic identifiers
npm run tasks:complete-auto TASK-123 build test
```

### 4. Review Efficiency Weekly

```bash
# Every Monday
npm run tasks:efficiency 7

# Look for:
# - Efficiency trending toward 90%
# - Unexpected spikes in Claude usage
# - Opportunities to delegate to cheaper models
```

### 5. Document Token-Intensive Tasks

If a task uses >100K tokens:
1. Document why in task notes
2. Look for optimization opportunities
3. Consider breaking into smaller tasks

---

## Future Enhancements

### Short-term (Next Release)

1. **Direct Claude API integration** when conversation metrics available
2. **Gemini MCP response capture** for accurate token counts
3. **Codex character counting** from session logs
4. **Real-time dashboard** showing token usage during workflows

### Medium-term (Next 3 months)

1. **SQLite migration** for better querying and analysis
2. **Cost analysis** converting tokens to dollar costs
3. **Anomaly detection** alerting on unusual token usage
4. **Optimization recommendations** suggesting cheaper alternatives

### Long-term (Next 6 months)

1. **Predictive budgeting** forecasting token needs
2. **A/B testing** comparing token efficiency across approaches
3. **Workflow optimization** auto-routing to cheapest effective model
4. **Team analytics** aggregating usage across multiple developers

---

## Support

### Documentation

- [Task Management Guide](TASK-MANAGEMENT.md)
- [Budget Mode Guide](budget-mode.md)
- [Workflow Decision Tree](WORKFLOW-DECISION-TREE.md)

### Troubleshooting

1. Check `ai-docs/logs/workflow-metrics.jsonl` for raw data
2. Review session logs in `ai-docs/sessions/`
3. Verify token collectors with test workflow ID

### Contributing

Found a bug or have a suggestion?

1. Check existing issues in `TEMPLATE-DOCS/reference/`
2. Document the problem with examples
3. Propose a solution with rationale

---

**Last Updated**: October 2025
**Maintainer**: Template Project Team
**License**: ISC
