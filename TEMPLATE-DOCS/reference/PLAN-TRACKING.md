# Plan Tracking System

**Created**: 2025-10-11
**Status**: Active
**Version**: 1.0

---

## Overview

The Plan Tracking System solves the problem of **"multiple plan files with unclear status"** by providing a centralized registry that tracks all implementation plans, their current status, and linkage to tasks.

### Problem Solved

Before this system:
- ❌ Multiple timestamped plan directories (`20251010-212657-...`, `20251011-token-accounting`, etc.)
- ❌ No clear indication of which plans are pending, in-progress, completed, or abandoned
- ❌ No linkage between plans and tasks
- ❌ Manual tracking required to know "what's next"

After this system:
- ✅ Single source of truth: `ai-docs/plans/plan-registry.json`
- ✅ Clear status indicators for all plans
- ✅ Automatic plan discovery from directory structure
- ✅ Dashboard commands showing what's next
- ✅ Integration with build workflow

---

## Quick Start

### View What's Next

```bash
npm run plans
```

Shows recommended next steps based on plan priorities.

### List All Plans

```bash
npm run plans:list
```

Shows all plans grouped by status (in-progress, pending, completed, etc.).

### Initialize Registry

```bash
npm run plans:init
```

Scans `ai-docs/plans/` directory and creates registry for all discovered plans.

---

## Plan Statuses

| Status | Icon | Meaning |
|--------|------|---------|
| `pending` | ⚪ | Plan created but not started |
| `in_progress` | 🚧 | Currently being implemented |
| `completed` | ✅ | Implementation finished |
| `abandoned` | 🗑️ | Plan canceled or no longer relevant |
| `superseded` | 📦 | Replaced by a newer plan |

---

## Workflow Integration

### When Creating a Plan

After running `/plan`, the plan file is saved to `ai-docs/plans/YYYYMMDD-HHMMSS-feature-name/plan.md`.

**Initialize registry to discover new plan:**
```bash
npm run plans:init
```

### When Starting Implementation

The `/build` command automatically marks the plan as `in_progress`:

```bash
/build "ai-docs/plans/20251011-token-accounting/plan.md"
# Automatically runs: npm run plans:update 20251011-token-accounting in_progress
```

### When Completing Implementation

After finishing the build, mark the plan as completed:

```bash
npm run plans:complete 20251011-token-accounting
```

---

## Commands Reference

### `npm run plans` (default)

Alias for `npm run plans:next`. Shows recommended next steps.

**Output:**
```
🎯 WHAT'S NEXT?

🚧 IN PROGRESS
  20251011-token-accounting
  Automated Token Accounting
  Task: TASK-123
  Action: Continue working or complete

⚪ RECOMMENDED NEXT STEPS
  1. 20251010-225157-task-reminder-system
     Priority: high | Tokens: 60,000
     Action: /build "ai-docs/plans/20251010-225157-task-reminder-system/plan.md"
```

### `npm run plans:init`

Scans `ai-docs/plans/` and registers all plan files.

**When to use:**
- After creating a new plan with `/plan`
- When joining a project for the first time
- After pulling changes that add new plan directories

**Example:**
```bash
npm run plans:init

# Output:
# 🔍 Scanning for plan files...
#   ✅ Added: 20251011-new-feature
# ✅ Registry initialized
#    Found: 5 plans
#    Added: 1 new plans
```

### `npm run plans:sync`

Updates existing plan metadata from markdown files without changing status or notes.

**When to use:**
- After editing plan.md files (updating token estimates, titles, complexity)
- When token estimates show as "unknown" or outdated
- After fixing plan formatting issues

**What it updates:**
- ✅ Title (from markdown heading)
- ✅ Estimated tokens (from markdown metadata)
- ✅ Complexity level (from markdown metadata)

**What it preserves:**
- ✅ Status (pending/in_progress/completed/etc.)
- ✅ Task ID linkage
- ✅ Priority level
- ✅ Notes

**Example:**
```bash
npm run plans:sync

# Output:
# 🔄 Syncing plan metadata from files...
#   🔄 Updated: 20251010-225157-task-reminder-system
#   🔄 Updated: 20251011-token-accounting
# ✅ Sync complete
#    Total plans: 6
#    Updated: 2
```

### `npm run plans:list [status]`

Lists all plans, optionally filtered by status.

**Examples:**
```bash
# List all plans
npm run plans:list

# List only pending plans
npm run plans:list pending

# List only in-progress plans
npm run plans:list in_progress
```

### `npm run plans:update <plan-id> <status> [notes]`

Updates plan status with optional notes.

**Examples:**
```bash
# Mark as in-progress
npm run plans:update 20251011-token-accounting in_progress "Starting implementation"

# Mark as abandoned
npm run plans:update 20251010-old-feature abandoned "No longer needed"

# Mark as superseded
npm run plans:update 20251010-v1-auth superseded "Replaced by 20251011-v2-auth"
```

**Status values:**
- `pending` - Not started
- `in_progress` - Currently working
- `completed` - Finished
- `abandoned` - Canceled
- `superseded` - Replaced by another plan

### `npm run plans:complete <plan-id>`

Shortcut to mark a plan as completed.

**Example:**
```bash
npm run plans:complete 20251011-token-accounting

# Output:
# ✅ Plan status updated
#    Plan: 20251011-token-accounting
#    in_progress → completed
```

---

## Plan Registry Structure

**File**: `ai-docs/plans/plan-registry.json`

```json
{
  "version": "1.0",
  "lastUpdated": "2025-10-11T12:00:00Z",
  "plans": [
    {
      "planId": "20251011-token-accounting",
      "title": "Automated Token Accounting",
      "status": "in_progress",
      "taskId": "TASK-123",
      "planPath": "ai-docs/plans/20251011-token-accounting/plan.md",
      "createdAt": "2025-10-11T00:00:00Z",
      "updatedAt": "2025-10-11T11:00:00Z",
      "priority": "high",
      "estimatedTokens": 90000,
      "complexity": "large",
      "notes": "Build started"
    }
  ]
}
```

### Fields Explained

| Field | Type | Description |
|-------|------|-------------|
| `planId` | string | Directory name (timestamp + slug) |
| `title` | string | Plan title (extracted from markdown) |
| `status` | enum | Current status (pending/in_progress/completed/etc.) |
| `taskId` | string/null | Linked task ID from `tasks.json` |
| `planPath` | string | Path to `plan.md` file |
| `createdAt` | ISO date | Plan creation timestamp |
| `updatedAt` | ISO date | Last status update |
| `priority` | enum | Priority (high/medium/low) |
| `estimatedTokens` | number | Token budget from plan |
| `complexity` | enum | Complexity (small/medium/large/unknown) |
| `notes` | string/null | Additional context |

---

## Automatic Plan Discovery

The system extracts metadata from plan markdown files:

**Plan file structure expected:**
```markdown
# Implementation Plan: Feature Name

**Date**: 2025-10-11
**Estimated Tokens**: 90K tokens
**Complexity**: Large

...
```

**Extracted fields:**
- Title: From `# Implementation Plan: {title}` heading
- Date: From `**Date**: YYYY-MM-DD` line
- Tokens: From `**Estimated Tokens**: {number}K?` line
- Complexity: From `**Complexity**: {level}` line

---

## Integration with Task Management

Plans can be linked to tasks for full traceability:

```bash
# Create a task
npm run tasks:add "Implement token accounting" "Build the token accounting system" large high

# Link plan to task
npm run plans:link 20251011-token-accounting TASK-xxx

# Now the plan shows task linkage
npm run plans:list
# Output shows: "Task: TASK-xxx" for that plan
```

---

## Best Practices

### 1. Initialize After Creating Plans

Always run `npm run plans:init` after creating new plans:

```bash
/plan "Add user authentication" "https://auth0.com/docs" ""
# Plan saved to: ai-docs/plans/20251011-123456-user-auth/plan.md

npm run plans:init
# Registers the new plan
```

### 2. Check "What's Next" at Session Start

Start each session by checking pending plans:

```bash
npm run plans
# Shows recommended next steps
```

### 3. Mark Plans as In-Progress Before Building

This prevents confusion about which plan is active:

```bash
npm run plans:update 20251011-feature-x in_progress "Starting now"
/build "ai-docs/plans/20251011-feature-x/plan.md"
```

### 4. Complete Plans After Successful Build

Always mark plans as complete when finished:

```bash
# After build succeeds
npm run plans:complete 20251011-feature-x
```

### 5. Abandon Outdated Plans

If a plan becomes irrelevant, mark it as abandoned:

```bash
npm run plans:update 20251010-old-approach abandoned "Requirements changed"
```

### 6. Use Superseded for Replaced Plans

When a newer plan replaces an older one:

```bash
npm run plans:update 20251010-v1-auth superseded "Replaced by 20251011-v2-auth"
```

---

## Troubleshooting

### Plan Not Showing Up

**Problem**: Created a plan but it doesn't appear in `npm run plans:list`

**Solution**: Run `npm run plans:init` to scan for new plans

### Duplicate Plans

**Problem**: Same plan appears twice with different statuses

**Solution**: Check `ai-docs/plans/plan-registry.json` and remove duplicate entry manually, then re-run `npm run plans:init`

### Can't Find Plan ID

**Problem**: Don't know the exact plan ID to use in commands

**Solution**: Run `npm run plans:list` to see all plan IDs

### Registry Out of Sync

**Problem**: Registry shows plans that no longer exist in filesystem

**Solution**: Run `npm run plans:sync` to update metadata and detect missing files

**Alternative**: Delete `ai-docs/plans/plan-registry.json` and re-run `npm run plans:init`

### Token Estimates Show "unknown"

**Problem**: Token estimates are missing or show as "unknown" in plan list

**Solution**: Run `npm run plans:sync` to re-read token estimates from plan.md files

**Ensure plan.md has proper format:**
```markdown
**Estimated Tokens**: ~60K
```

Supported formats:
- `~60K` or `~60000`
- `60K tokens` or `60000 tokens`
- `60 tokens`

### Plan ID Contains Shell Syntax

**Problem**: Plan directory has literal `$(date...)` in name instead of expanded timestamp

**Solution**:
```bash
# Validate plan IDs
node scripts/validate-plan-id.js validate "your-plan-id"

# Manually rename the directory
mv "ai-docs/plans/bad-$(date)-name" "ai-docs/plans/20251011-123456-good-name"

# Update registry
npm run plans:sync
```

---

## Migration Guide

If you have existing plans created before this system:

### Step 1: Initialize Registry

```bash
npm run plans:init
```

This scans all existing plan directories and adds them to the registry as "pending".

### Step 2: Update Status for In-Progress Plans

If you were working on a plan, mark it:

```bash
npm run plans:update <plan-id> in_progress
```

### Step 3: Complete Finished Plans

If a plan was already implemented, mark it:

```bash
npm run plans:complete <plan-id>
```

### Step 4: Clean Up Old Plans

Mark abandoned or superseded plans:

```bash
npm run plans:update <plan-id> abandoned "No longer needed"
```

---

## Future Enhancements

Planned improvements:

1. **Priority Management**: Automatically set priority based on dependencies
2. **Token Budget Tracking**: Show remaining budget after accounting for pending plans
3. **Plan Dependencies**: Track which plans depend on others
4. **Auto-Archive**: Move completed plans to archive after 30 days
5. **Plan Templates**: Quick-start templates for common plan types
6. **Web Dashboard**: Visual interface for plan tracking
7. **Slack Integration**: Notifications when plans are completed

---

## Implementation Details

### Script Location

`scripts/manage-plans.js`

### npm Scripts

Defined in `package.json`:

```json
{
  "scripts": {
    "plans": "node scripts/manage-plans.js next",
    "plans:list": "node scripts/manage-plans.js list",
    "plans:init": "node scripts/manage-plans.js init",
    "plans:sync": "node scripts/manage-plans.js sync",
    "plans:update": "node scripts/manage-plans.js update",
    "plans:complete": "node scripts/manage-plans.js complete",
    "plans:next": "node scripts/manage-plans.js next"
  }
}
```

### Workflow Integration

`.claude/commands/build.md` automatically:
1. Extracts plan ID from path
2. Marks plan as `in_progress` before building
3. Prompts to mark as `completed` after building

---

## Related Documentation

- [TASK-MANAGEMENT.md](TASK-MANAGEMENT.md) - Task tracking system
- [WORKFLOW-DECISION-TREE.md](WORKFLOW-DECISION-TREE.md) - When to use which workflow
- [CROSS-SESSION-GUIDE.md](CROSS-SESSION-GUIDE.md) - Working across multiple sessions

---

**Status**: ✅ Production Ready
**Created**: 2025-10-11
**Last Updated**: 2025-10-11
