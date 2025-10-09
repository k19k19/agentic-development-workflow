# AI Artifacts Directory

This directory contains **ephemeral AI-generated workflow outputs**. These files are NOT committed to git.

## Purpose

- Store workflow execution outputs
- Enable cross-session continuity
- Track token usage and metrics
- Support learning loops

## Directory Structure

```
ai-docs/
├── scout/              Scout phase file discovery results
├── plans/              AI-generated implementation plans
├── builds/             Build execution reports and outputs
├── sessions/           Feature development session logs
├── failures/           Failure reports and learning data
└── logs/               Token metrics and workflow tracking
```

## Gitignore Strategy

**❌ These directories are gitignored**:
- All content in `ai-docs/` subdirectories

**✅ But structure is preserved**:
- `.gitkeep` files maintain directory structure
- README.md provides documentation

## What Goes Where

### `scout/` - File Discovery
```
scout/[timestamp]-[feature]/
└── files.txt           # List of relevant files found
```

**Created by**: `/scout` command
**Used by**: `/plan` command (reads discovered files)

### `plans/` - Implementation Plans
```
plans/[timestamp]-[feature]/
├── plan.md             # Detailed implementation strategy
├── complexity-score.json  # Automated complexity assessment
└── external-docs/      # Scraped documentation
    └── oauth-spec.md
```

**Created by**: `/plan` command
**Used by**: `/build` command (executes the plan)

### `builds/` - Build Outputs
```
builds/[timestamp]-[feature]/
├── build-report.md     # What was implemented
├── test-results.txt    # Test execution output
└── commits.log         # Git commits made
```

**Created by**: `/build` command
**Used by**: Human review, `/report` command

### `sessions/` - Development Sessions
```
sessions/[feature-id]/
├── session-log.md      # Activity timeline
├── paused.md           # Pause checkpoint
└── context-snapshot.md # Files read, decisions made
```

**Created by**: `/start` command
**Used by**: Session continuity, debugging

### `failures/` - Learning Loop
```
failures/[feature-id]/
├── failure-report.md   # Root cause analysis
└── retry-history.md    # Fix attempts
```

**Created by**: `/report_failure` command
**Used by**: AI learning, pattern recognition

### `logs/` - Metrics
```
logs/
└── workflow-metrics.jsonl  # Token usage, timing, efficiency
```

**Created by**: All workflow commands
**Used by**: Budget tracking, optimization

## Cross-Session Workflow

AI artifacts enable work across multiple sessions:

```bash
# Session 1 (Monday)
/scout "Add caching layer"
# Output: ai-docs/scout/2025-10-09-caching/files.txt

# Session 2 (Tuesday)
/plan "Add caching" "" "ai-docs/scout/2025-10-09-caching/files.txt"
# Output: ai-docs/plans/2025-10-09-caching/plan.md

# Session 3 (Wednesday)
/build "ai-docs/plans/2025-10-09-caching/plan.md"
# Output: ai-docs/builds/2025-10-09-caching/build-report.md
```

## Why Not Commit?

**Reasons to gitignore**:
- ✅ Keeps git history clean
- ✅ Reduces repository size
- ✅ Personal workflow artifacts
- ✅ Regenerable from specs and code

**Exception**: Some teams commit approved plans to `ai-docs/plans/approved/`

## Token Tracking

Check your usage:
```bash
# View recent workflow metrics
tail -10 ai-docs/logs/workflow-metrics.jsonl | jq ".efficiency"

# Calculate average token usage
cat ai-docs/logs/workflow-metrics.jsonl | jq -s 'map(.tokens_used) | add/length'

# Find expensive workflows
cat ai-docs/logs/workflow-metrics.jsonl | jq 'select(.tokens_used > 50000)'
```

## Cleanup

Since these are ephemeral, you can safely delete old artifacts:

```bash
# Delete scout results older than 30 days
find ai-docs/scout -type d -mtime +30 -exec rm -rf {} +

# Delete old build reports
find ai-docs/builds -type d -mtime +60 -exec rm -rf {} +

# Keep logs for quarterly review
# Don't delete ai-docs/logs/
```

## Related

- **Human knowledge**: `app-docs/` (committed to git)
- **Template docs**: `TEMPLATE-DOCS/` (not copied to projects)
- **Workflow guide**: `app-docs/guides/WORKFLOW.md`

---

**Last Updated**: October 2025
**Git Status**: ❌ Gitignored (ephemeral)
