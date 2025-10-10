# Feature to Source Mapping

This file maps user-facing features to their implementation in the codebase.

**Purpose**: Quick reference for finding where features are implemented.

**Updated by**: Report phase (automatically) and manual edits

---

## Template Entry

```markdown
## [Feature Name]

**Description**: [Brief description of feature]

### API Endpoints
- `GET /api/[resource]` → `app/api/[resource]-api.js:10-50`
- `POST /api/[resource]` → `app/api/[resource]-api.js:52-80`

### Database
- **Table**: `[table_name]`
- **Schema**: `migrations/YYYY-MM-DD-[table].js`
- **Model**: `app/models/[model].js`

### Services
- **Main**: `app/services/[service].js`
- **Dependencies**: `[other-services]`

### Frontend (if applicable)
- **Component**: `frontend/src/components/[Component].tsx`
- **State**: `frontend/src/stores/[store].ts`

### Tests
- **Unit**: `app/services/[service].test.js`
- **Integration**: `app/api/[resource].test.js`
- **E2E**: `tests/e2e/[feature].spec.js`

### Documentation
- **Spec**: `app-docs/specs/[feature].md`
- **API Docs**: `app-docs/architecture/API-ENDPOINTS.md#[feature]`
```

---

## Example: Health Check

**Description**: Simple endpoint to verify server is running

### API Endpoints
- `GET /health` → `app/api/health.js:1-10`

### Services
- None (simple route)

### Tests
- Integration: `app/api/health.test.js`

---

## How to Use

### For Developers
```bash
# Find where "authentication" is implemented
grep -A 10 "Authentication" app-docs/mappings/feature-to-source.md
```

### For AI Agents
```markdown
# Plan phase reads this file to find existing patterns
Use Gemini MCP to summarize:
  app-docs/mappings/feature-to-source.md

Question: "What pattern should I follow for new API endpoints?"
Answer: [Based on existing entries in this file]
```

---

## Maintenance

- **Automatically updated** by `/report` phase after builds
- **Manually update** when restructuring code
- **Keep concise** - Link to files, don't duplicate code
- **Use line ranges** - `file.js:10-50` for specific sections

---

## Quick Index

| Feature | Files | Status |
|---------|-------|--------|
| [Feature 1] | [files] | ✅ Implemented |
| [Feature 2] | [files] | 🚧 In Progress |
| [Feature 3] | [files] | 📋 Planned |

---

**Last Updated**: [Auto-updated by report phase]
**Total Features**: [Count]
## Core Template Fixes

**Added**: 2025-10-10
**Files**:
  - `scripts/detect-project-scale.js`
  - `scripts/run-tests.js`
  - `scripts/update-mappings.js`
  - `scripts/generate-session-summary.js`

---

