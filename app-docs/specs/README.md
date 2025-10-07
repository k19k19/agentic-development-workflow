# Feature Specifications

This directory contains detailed feature specifications for your application.

## Purpose

Feature specs provide a clear definition of WHAT needs to be built before HOW it's implemented.

## Format

Each spec should include:

1. **Feature Name**: Clear, concise name
2. **Purpose**: What problem does this solve?
3. **Requirements**: Functional and non-functional requirements
4. **API Endpoints**: Expected endpoints (if applicable)
5. **Database Tables**: Required schema (if applicable)
6. **UI Components**: User interface elements (if applicable)
7. **Testing**: How to validate the feature works

## Example Spec

```markdown
# User Authentication

## Purpose
Allow users to securely register, log in, and access protected resources.

## Requirements

### Functional
- [ ] User can register with email and password
- [ ] User can log in with credentials
- [ ] System generates JWT tokens
- [ ] Protected routes check token validity
- [ ] User can log out (token invalidation)

### Non-Functional
- [ ] Passwords hashed with bcrypt (cost factor 10)
- [ ] JWT tokens expire after 24 hours
- [ ] Rate limiting: 5 login attempts per 15 minutes
- [ ] HTTPS required in production

## API Endpoints

POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

## Database Tables

users:
- id (UUID, primary key)
- email (VARCHAR, unique, indexed)
- password_hash (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## Testing

- Unit tests for auth service
- Integration tests for API endpoints
- E2E tests for login flow
```

## Usage in Workflow

The **plan phase** reads specs from this directory to understand requirements before creating implementation plans.

```bash
# Plan phase automatically searches for relevant specs
/plan "Add user authentication" "" "[files]"
# Gemini MCP reads: app-docs/specs/authentication.md
```

## Naming Convention

- `[feature-name].md` - Main feature spec
- `[feature-name]-api.md` - Detailed API specification
- `[feature-name]-ui.md` - UI/UX specification

## Maintenance

- **Create specs BEFORE implementation** (preferred)
- OR create specs during plan phase (Gemini MCP can generate draft)
- Update specs when requirements change
- Reference spec in git commits: `feat: implement auth (spec: app-docs/specs/authentication.md)`
