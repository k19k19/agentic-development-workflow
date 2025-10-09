# Project Guides Directory

This directory is for **YOUR project-specific guides and patterns**.

## Purpose

Document recurring patterns, conventions, and best practices specific to YOUR project:
- Coding conventions you follow
- Architecture patterns you use
- Common workflows in YOUR codebase
- Project-specific troubleshooting tips

## This is NOT for Template Workflows

Template workflow guides (budget-mode, WORKFLOW, etc.) are in the template repository at:
`TEMPLATE-DOCS/workflow-guides/`

Reference them when needed, but don't copy them here.

## What to Add Here

### Example Files You Might Create

**coding-conventions.md**
```markdown
# Our Coding Conventions

## Naming
- Components: PascalCase
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## File Organization
- One component per file
- Tests adjacent to source files
```

**api-patterns.md**
```markdown
# Our API Patterns

## Error Handling
All endpoints return:
- 200: Success with data
- 400: Client error with message
- 500: Server error

## Authentication
Bearer token in Authorization header
```

**deployment-workflow.md**
```markdown
# Our Deployment Workflow

1. Create feature branch
2. Make changes
3. Run tests locally
4. Create PR
5. Wait for CI
6. Merge to main
7. Auto-deploy to staging
```

## When to Add Files

- ✅ Found yourself explaining the same pattern twice? Document it.
- ✅ New team member asks "how do we do X?" Add a guide.
- ✅ You have project-specific conventions? Write them down.
- ❌ Don't duplicate information that's already in code comments.
- ❌ Don't copy template workflow guides here.

## Related

- **Template workflows**: `TEMPLATE-DOCS/workflow-guides/` (in template repo)
- **Architecture**: `app-docs/architecture/` (system design)
- **Debugging**: `app-docs/debugging/` (known issues)
- **Operations**: `app-docs/operations/` (runbooks)

---

**Last Updated**: October 2025
**Status**: Empty by default - you add your project's guides
