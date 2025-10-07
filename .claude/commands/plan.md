description: Create implementation plan based on scouted files and documentation
argument-hint: [user_prompt] [documentation_urls] [files_collection_path]
model: claude-sonnet-4-5

# Plan Phase: Architectural Planning

**Token Budget**: 30K
**Purpose**: Create detailed implementation plan with task breakdown and tool delegation

---

## Arguments

1. `USER_PROMPT`: Original task description (unchanged from scout)
2. `DOCUMENTATION_URLS`: Comma-separated URLs to relevant docs (can be empty "")
3. `FILES_COLLECTION_PATH`: Path to scout output (files-collection.txt)

---

## MANDATORY Pre-Planning Checks

**STOP! Execute these checks before ANY planning:**

### Check 1: Read Project Specifications (Gemini MCP)

```
Use Task tool with Gemini MCP:
  description: "Summarize project specs"
  prompt: |
    Read and summarize these files:
    1. app-docs/specs/ (find specs related to {USER_PROMPT})
    2. app-docs/guides/implementation-guidelines.md
    3. app-docs/mappings/feature-to-source.md

    Answer:
    - Does this feature already exist?
    - What patterns should be followed?
    - Are there known constraints?
    - What similar features exist?

    Return concise summary (max 500 words).
```

### Check 2: Search for Existing Patterns

```bash
# Use Grep to find similar implementations
grep -r "similar_pattern_keyword" app/
grep -r "related_feature" app-docs/mappings/

# Check debugging docs for known issues
grep -r "{feature_name}" app-docs/debugging/
```

### Check 3: Confirm Approach with User

**Present this summary and WAIT for approval:**

```markdown
📋 **Implementation Approach Confirmation**

## Task
{USER_PROMPT}

## Files to Modify
- file1.js (lines 10-50) - Add authentication middleware
- file2.js (lines 100-120) - Update API endpoint

## New Files to Create
- file3.js - New service class
- file3.test.js - Unit tests

## Architectural Pattern
Following pattern from: app-docs/guides/service-pattern.md
- Service-oriented architecture
- Dependency injection
- Event-driven updates

## Estimated Token Usage
- Scout: 10K (completed)
- Plan: 30K (current phase)
- Build: 45K (estimated)
- Report: 5K
**Total**: 90K tokens

## Risks Identified
1. **Breaking change**: Modifying auth middleware affects all routes
   - Mitigation: Add feature flag, gradual rollout
2. **Database migration**: New schema changes required
   - Mitigation: Backward-compatible migration

## Dependencies
- Requires: user-service to be updated first
- Blocks: admin-panel feature

## Similar Features in Codebase
- app/services/auth.js (existing auth pattern)
- app/services/payment.js (similar service structure)

---

**Proceed with this plan? (yes/no)**
```

**STOP HERE AND WAIT FOR USER RESPONSE**

If user says no: Ask for feedback and revise approach
If user says yes: Continue to planning

---

## Planning Process

### Step 1: Load Context (8K tokens)

1. **Read Files Collection**
   ```
   Read FILES_COLLECTION_PATH
   Parse each line: <path> (offset: N, limit: M)
   Use Read tool with offset/limit for each file
   ```

2. **Fetch Documentation (Gemini MCP)**
   ```
   If DOCUMENTATION_URLS provided:
     Use Firecrawl MCP to fetch each URL
     Use Gemini MCP to summarize key points
     Extract: API patterns, best practices, constraints
   ```

3. **Load Project Patterns**
   ```
   Read relevant files from app-docs/guides/
   Identify which patterns apply to this task
   ```

### Step 2: Architecture Design (12K tokens)

**Using Claude for architectural decisions:**

1. **Component Identification**
   ```markdown
   ## Components Analysis

   ### New Files Needed
   - app/services/feature-service.js
     - Purpose: Business logic for {feature}
     - Pattern: Service class with EventEmitter
     - Dependencies: database-service, logger

   - app/api/feature-api.js
     - Purpose: REST API endpoints
     - Pattern: Express router
     - Dependencies: feature-service, auth-middleware

   ### Files to Modify
   - app/routes/index.js (line 45)
     - Change: Add new route registration
     - Risk: None (additive change)

   - app/services/auth-service.js (lines 100-120)
     - Change: Add new permission check
     - Risk: May affect existing auth flows
   ```

2. **Design Patterns**
   ```markdown
   ## Patterns to Follow

   ### From app-docs/mappings/feature-to-source.md:
   - Service pattern: Class-based with dependency injection
   - Error handling: Try/catch with centralized logger
   - Testing: Unit tests for services, integration for APIs

   ### New Patterns (if any):
   - Event-driven notifications for async operations
   - Justification: Real-time updates needed
   - Documentation: Will add to app-docs/guides/
   ```

3. **Data Flow**
   ```markdown
   ## Data Flow

   Client Request
     ↓
   API Endpoint (feature-api.js)
     ↓
   Auth Middleware (validation)
     ↓
   Feature Service (business logic)
     ↓
   Database Service (persistence)
     ↓
   Event Emitter (notify subscribers)
     ↓
   WebSocket (real-time update)
   ```

4. **Risk Assessment**
   ```markdown
   ## Risks & Mitigations

   ### High Risk
   - **Auth middleware changes**
     - Impact: All protected routes
     - Mitigation: Feature flag + A/B testing
     - Testing: Full integration test suite

   ### Medium Risk
   - **Database schema changes**
     - Impact: Data migration required
     - Mitigation: Backward-compatible migration
     - Rollback: Keep old schema for 2 versions

   ### Low Risk
   - **New API endpoints**
     - Impact: Additive only
     - Mitigation: Rate limiting
   ```

### Step 3: Task Breakdown (8K tokens)

**Create structured implementation tasks:**

```markdown
## Implementation Plan

### Phase 1: Database & Models (Est: 10K tokens)

#### Task 1.1: Database Migration
- **File**: migrations/YYYY-MM-DD-add-feature-table.js
- **Tool**: Codex MCP (boilerplate SQL)
- **Token estimate**: 2K
- **Dependencies**: None
- **Acceptance criteria**:
  - [ ] Migration runs without errors
  - [ ] Rollback tested
  - [ ] Schema matches spec

#### Task 1.2: Data Model
- **File**: app/models/feature-model.js
- **Tool**: Codex MCP (class structure)
- **Token estimate**: 3K
- **Dependencies**: Task 1.1 complete
- **Acceptance criteria**:
  - [ ] All fields defined
  - [ ] Validation methods
  - [ ] Type safety

### Phase 2: Business Logic (Est: 20K tokens)

#### Task 2.1: Service Class
- **File**: app/services/feature-service.js
- **Tool**: Claude (complex logic)
- **Token estimate**: 8K
- **Dependencies**: Phase 1 complete
- **Acceptance criteria**:
  - [ ] All methods implemented
  - [ ] Error handling
  - [ ] Event emission
  - [ ] Logging

#### Task 2.2: Service Tests
- **File**: app/services/feature-service.test.js
- **Tool**: Codex MCP + Playwright
- **Token estimate**: 5K
- **Dependencies**: Task 2.1 complete
- **Acceptance criteria**:
  - [ ] >80% coverage
  - [ ] All edge cases
  - [ ] Mock dependencies

### Phase 3: API Layer (Est: 15K tokens)

#### Task 3.1: API Routes
- **File**: app/api/feature-api.js
- **Tool**: Codex MCP (boilerplate routes)
- **Token estimate**: 4K
- **Dependencies**: Phase 2 complete
- **Acceptance criteria**:
  - [ ] CRUD endpoints
  - [ ] Input validation
  - [ ] Auth integration

#### Task 3.2: API Tests
- **File**: app/api/feature-api.test.js
- **Tool**: Playwright MCP (integration tests)
- **Token estimate**: 6K
- **Dependencies**: Task 3.1 complete
- **Acceptance criteria**:
  - [ ] All endpoints tested
  - [ ] Auth flows tested
  - [ ] Error cases covered

### Phase 4: Integration (Est: 5K tokens)

#### Task 4.1: Route Registration
- **File**: app/routes/index.js
- **Tool**: Codex MCP (simple addition)
- **Token estimate**: 1K
- **Dependencies**: Phase 3 complete

#### Task 4.2: Documentation Update
- **Files**:
  - app-docs/mappings/feature-to-source.md
  - README.md
- **Tool**: Gemini MCP (documentation)
- **Token estimate**: 2K
- **Dependencies**: All implementation complete

## Token Budget Breakdown
| Phase | Planned | Buffer | Total |
|-------|---------|--------|-------|
| Scout | 10K | - | 10K |
| Plan | 30K | - | 30K |
| Build Phase 1 | 10K | 2K | 12K |
| Build Phase 2 | 20K | 3K | 23K |
| Build Phase 3 | 15K | 2K | 17K |
| Build Phase 4 | 5K | 1K | 6K |
| Report | 5K | - | 5K |
| **Total** | **95K** | **8K** | **103K** |
```

### Step 4: Tool Delegation Strategy (2K tokens)

```markdown
## Tool Delegation

| Task | Tool | Rationale | Fallback |
|------|------|-----------|----------|
| Database migration | Codex MCP | SQL boilerplate | Manual SQL |
| Data models | Codex MCP | Type definitions | Claude |
| Service class | Claude | Complex business logic | - |
| Unit tests | Codex MCP | Test patterns | Playwright |
| API routes | Codex MCP | CRUD boilerplate | Claude |
| Integration tests | Playwright MCP | E2E specialty | Codex |
| Route registration | Codex MCP | Simple addition | Manual |
| Documentation | Gemini MCP | Summarization | Claude |

### Parallel Execution Opportunities
- Phase 1 Task 1.1 and 1.2 can run in parallel after migration
- Phase 2 Task 2.2 can start while 2.1 is being reviewed
- Phase 3 tasks can be parallelized if independent endpoints

### Sequential Dependencies
- Phase 2 requires Phase 1 complete
- Phase 3 requires Phase 2 complete
- Task 4.2 requires all implementation tasks complete
```

---

## Output

### Write Plan File

Save to: `ai-docs/plans/YYYY-MM-DD-HH-MM-[task-slug].md`

Include all sections above plus:

```markdown
# Implementation Plan: {Task Name}

**Created**: YYYY-MM-DD HH:MM:SS
**Task**: {USER_PROMPT}
**Estimated Duration**: 6-8 hours
**Estimated Tokens**: 103K
**Status**: Ready for build

## Pre-Implementation Checklist
- [x] User approved approach
- [x] Documentation reviewed
- [x] Existing patterns identified
- [x] Risks assessed and mitigated
- [x] Dependencies mapped
- [x] Token budget allocated

[All sections from Step 2-4 above]

## Success Criteria
- [ ] All tests passing (>80% coverage)
- [ ] API endpoints functional
- [ ] Documentation updated
- [ ] No breaking changes (or feature-flagged)
- [ ] Performance acceptable (<100ms response)

## Rollback Plan
1. Revert database migration: `npm run migrate:rollback`
2. Remove new routes from index.js
3. Delete new files (will be listed in build report)
4. Restart services

## Post-Build Validation
- [ ] Run full test suite
- [ ] Manual API testing
- [ ] Check logs for errors
- [ ] Performance testing
- [ ] Security scan
```

### Return Path

```
Plan created successfully!

Plan file: ai-docs/plans/YYYY-MM-DD-HH-MM-[task-slug].md
Estimated tokens: 103K
Estimated duration: 6-8 hours

Review plan? (Open file above)

Ready to build:
/build "ai-docs/plans/YYYY-MM-DD-HH-MM-[task-slug].md"
```

---

## Error Handling

### User Rejected Approach
```
User feedback: [what user said]

Action required:
1. Revise approach based on feedback
2. Re-run pre-planning checks
3. Present updated approach
4. Wait for approval again
```

### Files Collection Empty
```
ERROR: No files in {FILES_COLLECTION_PATH}

Possible causes:
- Scout phase failed
- File path incorrect
- No relevant files found

Suggested actions:
1. Re-run scout with higher scale
2. Manually specify files
3. Use direct implementation (skip scout)
```

### Documentation URLs Unreachable
```
WARNING: Could not fetch docs from:
- {url1}: Connection timeout
- {url2}: 404 Not Found

Action: Proceeding without external docs
Impact: May miss best practices from external sources
Mitigation: Review plan manually for completeness
```

### Token Budget Exceeded
```
WARNING: Plan phase approaching token limit

Current usage: 28K / 30K budget
Remaining: 2K tokens

Action:
- Saving plan in current state
- Marked as "partial plan"
- User can:
  a) Approve partial plan (continue with what we have)
  b) Extend budget (continue planning)
  c) Simplify scope (reduce features)
```

---

## Integration with Build Phase

The build phase will:
1. Read this plan file
2. Execute tasks in order (respecting dependencies)
3. Use designated tools for each task
4. Check off completed tasks
5. Log actual vs estimated tokens
6. Report deviations from plan
