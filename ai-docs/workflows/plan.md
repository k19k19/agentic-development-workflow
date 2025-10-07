# Plan Workflow

**Token Budget**: 30K (Claude with focused context)
**Model**: claude-sonnet-4-5
**Purpose**: Architectural planning and task breakdown based on scouted files

---

## Input Requirements

1. `USER_PROMPT`: Original task description (unchanged from scout)
2. `DOCUMENTATION_URLS`: Comma-separated URLs to relevant documentation
3. `RELEVANT_FILES_PATH`: Path to file containing scouted files with line ranges

---

## Pre-Planning Checks (MANDATORY)

**Before ANY planning, execute these steps:**

1. **Read Project Documentation** (Gemini MCP)
   ```
   Ask gemini-mcp-tool to summarize:
   - app-docs/specs/ (if relevant to USER_PROMPT)
   - app-docs/guides/ (implementation patterns)
   - app-docs/mappings/ (existing feature-to-source relationships)
   ```

2. **Check Existing Patterns**
   ```
   - Search app-docs/mappings/ for similar features
   - Review app-docs/architecture/ for system constraints
   - Check app-docs/debugging/ for known issues with this area
   ```

3. **Confirm Approach with User**
   ```
   Present 2-3 sentence summary:
   - What files will be modified
   - What architectural patterns will be used
   - Any risks or dependencies identified

   Wait for user approval before proceeding
   ```

---

## Planning Process

### Step 1: Context Loading (8K tokens)

- Read files from `RELEVANT_FILES_PATH` with specified line ranges
- Load only the offset/limit ranges provided by scout
- Use Read tool with offset/limit parameters

### Step 2: Documentation Analysis (5K tokens)

- Use Gemini MCP to fetch and summarize `DOCUMENTATION_URLS`
- Extract relevant API patterns, best practices
- Identify constraints and requirements

### Step 3: Architecture Design (10K tokens)

Using Claude for architectural decisions:

1. **Identify Components**
   - New files needed
   - Files to modify (from scout results)
   - Dependencies and integrations

2. **Design Patterns**
   - Which existing patterns to follow (from app-docs/mappings/)
   - Any new patterns required
   - Service boundaries and data flow

3. **Risk Assessment**
   - Breaking changes
   - Migration requirements
   - Testing complexity
   - Performance implications

### Step 4: Task Breakdown (5K tokens)

Create structured implementation tasks:

```markdown
## Implementation Plan

### Phase 1: [Name]
- [ ] Task 1 (File: path/to/file.js:123)
  - Token estimate: 2K
  - Tool: Codex (boilerplate)
  - Dependencies: None

- [ ] Task 2 (File: path/to/file.js:456)
  - Token estimate: 5K
  - Tool: Claude (complex logic)
  - Dependencies: Task 1

### Phase 2: [Name]
...

## Token Budget Breakdown
- Scout: 10K (completed)
- Plan: 30K (current)
- Build: 50K (estimated)
- Validate: 5K
- Report: 5K
**Total**: 100K

## Risk Mitigation
- Risk 1: [Description] → Mitigation: [Strategy]
- Risk 2: ...

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

### Step 5: Tool Delegation Strategy (2K tokens)

For each task, assign the optimal tool:

| Task Type | Tool | Rationale |
|-----------|------|-----------|
| Boilerplate code | Codex MCP | Fast, syntax-focused |
| Config files | Codex MCP | Simple, no context needed |
| Complex logic | Claude | Multi-file integration |
| Documentation | Gemini MCP | Summarization |
| UI components | Codex MCP | UI/UX specialty |
| Testing | Playwright MCP + Codex | E2E + unit tests |

---

## Output Format

Write plan to: `ai-docs/plans/YYYY-MM-DD-HH-MM-[task-slug].md`

```markdown
# Implementation Plan: [Task Name]

**Created**: YYYY-MM-DD HH:MM
**Estimated Tokens**: [Total]
**Estimated Duration**: [Hours]

## Summary
[2-3 sentences describing the plan]

## Pre-Implementation Checklist
- [ ] User approved approach
- [ ] Documentation reviewed
- [ ] Existing patterns identified
- [ ] Risks assessed

## Implementation Phases
[Detailed phases from Step 4]

## Tool Delegation
[Table from Step 5]

## Success Criteria
[From Step 4]

## Rollback Plan
[How to undo changes if needed]
```

---

## Error Handling

- If `RELEVANT_FILES_PATH` is empty → Error: "Scout phase failed, no files found"
- If documentation URLs are unreachable → Use Firecrawl MCP as fallback
- If user doesn't approve approach → Revise and re-present
- If token budget exceeded → Notify user, offer to continue or simplify

---

## Post-Planning Actions

1. Save plan to `ai-docs/plans/`
2. Return path to plan file
3. Log token usage to `ai-docs/logs/token-usage.jsonl`
4. Create build checklist in plan file

---

## Integration with Build Phase

The build phase will:
1. Read this plan file
2. Execute tasks in order
3. Check off completed tasks
4. Update plan with actual token usage
5. Report deviations from plan
