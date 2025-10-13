# Mappings Directory

This directory contains **code navigation mappings** to help developers and AI agents find implementation details quickly.

## Purpose

- Map features to source files
- Prevent AI from reading entire directories
- Speed up context discovery
- Track code organization

## Primary File

**`feature-to-source.md`** - Maps user-facing features to implementation files

This file is:
- ✅ **Auto-updated** by `/report` phase after builds
- ✅ **Committed to git** (human knowledge)
- ✅ **Read by AI** during planning phase

## How It Works

### During Planning (`/baw:dev_plan`)
AI reads `feature-to-source.md` to find existing patterns:
```markdown
Task: "Add new API endpoint for users"
AI reads: feature-to-source.md
Finds: Existing API pattern in app/api/health.js
Follows: Same pattern for new endpoint
```

### During Building (`/baw:dev_build`)
AI uses mappings to locate related code:
```markdown
Task: "Modify authentication"
AI reads: feature-to-source.md
Finds: auth implementation in app/auth/*.js
Reads: Only those specific files (not all of app/)
```

### During Reporting (`/report`)
AI updates the mapping with new code:
```markdown
After build: Added feature "User Preferences"
AI updates: feature-to-source.md
Adds: New entry for User Preferences feature
```

## Benefits

### For Developers
- Quick reference: "Where is authentication implemented?"
- Onboarding: New team members understand structure
- Refactoring: Track dependencies before changes

### For AI Agents
- **Token savings**: Read 3 files instead of entire `app/` directory
- **Accuracy**: Find exact implementation patterns
- **Speed**: Faster context discovery

## Example Entry

```markdown
## User Authentication

**Description**: JWT-based authentication system

### API Endpoints
- `POST /auth/login` → `app/api/auth-api.js:15-45`
- `POST /auth/logout` → `app/api/auth-api.js:47-60`

### Services
- **Main**: `app/services/auth-service.js`
- **Token**: `app/utils/jwt.js`

### Middleware
- `app/middleware/auth-middleware.js:1-50`

### Tests
- Unit: `app/services/auth-service.test.js`
- Integration: `app/api/auth-api.test.js`
```

## Maintenance Tips

1. **Let AI update it** - Use `/report` phase after builds
2. **Manual updates** - When restructuring code outside workflow
3. **Keep it current** - Outdated mappings confuse AI
4. **Use line ranges** - `file.js:10-50` instead of just `file.js`
5. **Group by feature** - Not by file type

## Related

- **Specs**: `app-docs/specs/` (Feature requirements)
- **Architecture**: `app-docs/architecture/` (System design)
- **Guides**: `app-docs/guides/common-patterns.md` (Code patterns)

---

**Last Updated**: October 2025
