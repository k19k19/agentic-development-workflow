# Architecture Directory

This directory contains **system design and architectural documentation** for your project.

## Purpose

- Document overall system architecture
- Track architectural decisions and rationale
- Provide high-level context for AI agents
- Create onboarding material for team members

## What Goes Here

### System Design
- High-level architecture diagrams
- Component interactions
- Data flow documentation
- Technology stack overview

### Architectural Decisions
- Why certain technologies were chosen
- Trade-offs and alternatives considered
- Performance considerations
- Security architecture

## File Naming Convention

```
system-design.md              # Overall architecture
component-[name].md           # Specific component details
adr-[number]-[decision].md    # Architecture Decision Records
```

**Examples**:
- `system-design.md`
- `component-database.md`
- `adr-001-choose-postgresql.md`

## Example Structure

### system-design.md
```markdown
# System Architecture

## Overview
[High-level description of the system]

## Components
- Frontend: [Technology, responsibility]
- Backend: [Technology, responsibility]
- Database: [Technology, schema approach]
- Cache: [Technology, caching strategy]

## Data Flow
[How data moves through the system]

## Deployment
[Infrastructure, hosting, CI/CD]
```

### Architecture Decision Record (ADR)
```markdown
# ADR-001: Use PostgreSQL for Primary Database

## Status
Accepted

## Context
We need a reliable database for user data and transactions.

## Decision
Use PostgreSQL as primary database.

## Consequences
**Positive**:
- ACID compliance
- Strong JSON support
- Mature ecosystem

**Negative**:
- More complex than SQLite
- Requires separate hosting
```

## When to Update

- ✅ Adding new major components
- ✅ Changing technology stack
- ✅ Major refactoring or redesign
- ✅ Security architecture changes
- ❌ Minor code changes (use git commits)
- ❌ Bug fixes (use debugging docs)

## Related

- **Specs**: `app-docs/specs/` (Feature requirements)
- **Mappings**: `app-docs/mappings/feature-to-source.md` (Code locations)
- **Guides**: `app-docs/guides/` (Implementation patterns)

---

**Last Updated**: October 2025
