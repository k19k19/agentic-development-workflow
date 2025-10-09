# Operations Directory

This directory contains **operational documentation** for maintaining and running your project.

## Purpose

- Document data fixes and migrations
- Track production operations
- Create runbooks for common tasks
- Maintain deployment procedures

## What Goes Here

### Data Fixes
- SQL queries for data corrections
- Migration scripts
- Bulk updates
- Data integrity fixes

### Runbooks
- Deployment procedures
- Backup/restore processes
- Monitoring and alerts
- Incident response

### Maintenance
- Routine tasks
- Database maintenance
- Log rotation
- Cache clearing

## File Naming Convention

```
data-fix-[date]-[description].sql     # Data correction queries
migration-[number]-[description].sql  # Schema migrations
runbook-[task].md                     # Operational procedures
```

**Examples**:
- `data-fix-2025-10-01-user-emails.sql`
- `migration-001-add-user-roles.sql`
- `runbook-deployment.md`
- `runbook-database-backup.md`

## Example Structure

### data-fix-queries.sql
```sql
-- Data Fix: Correct duplicate user emails (2025-10-01)
-- Ticket: BUG-456
-- Tested on: staging (2025-09-30)

BEGIN;

-- Find duplicates
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Keep oldest user, delete duplicates
DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id)
  FROM users
  GROUP BY email
);

-- Verify
SELECT email, COUNT(*)
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
-- Should return 0 rows

COMMIT;
```

### runbook-deployment.md
```markdown
# Deployment Runbook

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Staging deployment verified
- [ ] Database migrations prepared
- [ ] Rollback plan documented

## Deployment Steps

### 1. Backup Database
```bash
./scripts/backup-database.sh production
```

### 2. Run Migrations
```bash
npm run migrate:production
```

### 3. Deploy Code
```bash
git push production main
```

### 4. Verify Deployment
```bash
./scripts/health-check.sh production
```

## Rollback Procedure

If deployment fails:

1. Revert code: `git revert HEAD && git push production main`
2. Restore database: `./scripts/restore-database.sh [backup-file]`
3. Verify: `./scripts/health-check.sh production`
```

## Safety Guidelines

### Before Running Data Fixes

1. **Always test on staging first**
2. **Use transactions** (BEGIN/COMMIT/ROLLBACK)
3. **Backup before modifying data**
4. **Document the fix** (why, when, who)
5. **Verify results** before committing

### Production Operations

- ⚠️ Never run untested queries on production
- ⚠️ Always have a rollback plan
- ⚠️ Monitor during and after deployment
- ⚠️ Document all production changes

## Related

- **Architecture**: `app-docs/architecture/` (System design)
- **Debugging**: `app-docs/debugging/` (Troubleshooting)
- **Scripts**: `scripts/validation/` (Pre-deploy checks)

---

**Last Updated**: October 2025
