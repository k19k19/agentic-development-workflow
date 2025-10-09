# Debugging Directory

This directory contains **troubleshooting guides and known issues** for your project.

## Purpose

- Document common bugs and their solutions
- Create debugging workflows
- Track recurring issues
- Help AI agents diagnose problems faster

## What Goes Here

### Troubleshooting Guides
- Common error messages and fixes
- Debugging workflows
- Performance issues
- Environment-specific problems

### Known Issues
- Unresolved bugs
- Workarounds
- Future fixes planned

## File Naming Convention

```
troubleshooting-guide.md      # Main debugging reference
known-issues.md               # Active bug list
[component]-debugging.md      # Component-specific guides
```

**Examples**:
- `troubleshooting-guide.md`
- `known-issues.md`
- `database-debugging.md`
- `auth-debugging.md`

## Example Structure

### troubleshooting-guide.md
```markdown
# Troubleshooting Guide

## Common Issues

### Issue: Database connection timeout

**Symptoms**:
- Connection errors in logs
- API returns 500 errors
- Happens intermittently

**Diagnosis**:
```bash
# Check database connection
psql -h localhost -U user -d database
```

**Solution**:
1. Increase connection pool size
2. Check network configuration
3. Verify database credentials

**References**: [Database docs](https://...)
```

### known-issues.md
```markdown
# Known Issues

## Active Bugs

### BUG-123: Login timeout on Safari

**Status**: Investigating
**Priority**: High
**Workaround**: Use Chrome/Firefox
**Tracking**: [GitHub Issue #123]

**Details**:
- Safari 15+ only
- Timeout after 30 seconds
- Cookies not being set correctly

**Next Steps**:
- [ ] Test with different cookie settings
- [ ] Check Safari console logs
- [ ] Review session middleware
```

## When to Update

- ✅ New bug discovered
- ✅ Bug fixed (move to "Resolved" section)
- ✅ New workaround found
- ✅ Pattern of similar issues emerges
- ❌ One-time errors (use logs instead)

## AI Usage

When AI encounters errors, it should:
1. Check `known-issues.md` first
2. Check component-specific debugging guides
3. Follow troubleshooting workflows
4. Update docs with new solutions found

## Related

- **Failures**: `ai-docs/failures/` (AI-generated failure reports)
- **Guides**: `app-docs/guides/implementation-guidelines.md`
- **Architecture**: `app-docs/architecture/` (System design)

---

**Last Updated**: October 2025
