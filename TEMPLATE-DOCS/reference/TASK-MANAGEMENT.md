# Task Management & Productivity System

**Maximize productivity under $20 budget plan constraints**

---

## 🎯 Three Core Features

### 1. Pending Task Visibility with Checkpoints
Track incomplete tasks so you never forget what's pending when working on long features.

### 2. Token Budget Intelligence
Get recommendations for tasks that fit your remaining daily token budget.

### 3. Context Window Warnings
Alerts when approaching the 200K context limit so you can start a new session.

---

## 🚀 Quick Start

### Session Start Summary (NEW!)
```bash
npm run tasks:session-start
```

**Automatically runs at session start via prompt hook!**

Shows:
- 💰 Token budget (daily usage, warnings at 75%/90%)
- 📋 Pending tasks from START-HERE.md
- 📋 Paused tasks from task ledger with checkpoints
- 💡 Task recommendations that fit remaining budget
- 🚀 Suggested workflows (/quick, /scout_build, /full)

### View Full Dashboard
```bash
npm run tasks
```

Shows:
- 💰 Token budget (daily usage and remaining)
- 🪟 Context window (current session usage)
- 📋 Task summary (in progress, paused, blocked, pending)
- 💡 Recommendations (paused tasks, fitting tasks, warnings)

### Add a Task
```bash
npm run tasks:add "Task title" "Description" <size> <priority>
```

**Sizes:**
- `small` - 5K tokens (~5-15 min)
- `medium` - 30K tokens (~30-60 min)
- `large` - 80K tokens (~1-2 hours)
- `xlarge` - 150K tokens (~2-4 hours)

**Priorities:** `low`, `medium`, `high`, `critical`

**Example:**
```bash
npm run tasks:add "Implement OAuth2" "Add OAuth2 authentication flow" large high
```

### Pause a Task (With Checkpoint)
```bash
npm run tasks:pause TASK-xxx "Checkpoint note"
```

**Example:**
```bash
npm run tasks:pause TASK-123 "Completed scout phase, found 15 files. Ready to plan."
```

### Resume a Paused Task
```bash
npm run tasks:resume TASK-xxx
```

Shows the last checkpoint note so you know where you left off.

### Complete a Task
```bash
npm run tasks:complete TASK-xxx <tokens-used>
```

**Example:**
```bash
npm run tasks:complete TASK-123 85000
```

Updates token budget automatically.

### List Tasks
```bash
npm run tasks:list           # Active tasks only
npm run tasks:list all       # All tasks
npm run tasks:list completed # Completed only
```

---

## 📊 Productivity Dashboard Explained

### Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 PRODUCTIVITY DASHBOARD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 TOKEN BUDGET (Daily)
   Used: 150,000 / 500,000 (30.0%)
   [█████████░░░░░░░░░░░░░░░░░░░░]
   Remaining: 350,000 tokens

🪟 CONTEXT WINDOW (Current Session)
   Used: 85,000 / 200,000 (42.5%)
   [████████████░░░░░░░░░░░░░░░░░░]

📋 TASK SUMMARY
   🟢 In Progress: 1
   ⏸️  Paused: 2
   🔴 Blocked: 0
   ⚪ Pending: 3
   ✅ Completed Today: 2

💡 RECOMMENDATIONS

⏸️  You have paused tasks:
   • TASK-123: Implement OAuth2 authentication
     Last checkpoint: Completed scout phase, found 15 files. Ready to plan.
   • TASK-456: Add payment integration
     Last checkpoint: Waiting for Stripe API keys from client

✨ Tasks that fit in remaining budget (350,000 tokens):
   • TASK-789: Fix login button styling
     Size: small (~5,000 tokens, 5-15 min)
   • TASK-101: Add rate limiting
     Size: medium (~30,000 tokens, 30-60 min)
   • TASK-202: Refactor user service
     Size: large (~80,000 tokens, 1-2 hours)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Warning States

**⚠️ WARNING** (Context window at 75%+):
```
⚠️  WARNING: Context window at 78.5%
   Consider starting a new session after current task
```

**🚨 CRITICAL** (Context window at 90%+):
```
🚨 CRITICAL: Context window at 92.5%
   Action: Start a new session to avoid errors
   Run: exit (then restart claude-code)
```

---

## 🎯 Typical Workflows

### Scenario 1: Long Feature with Multiple Sessions

**Session 1: Scout & Plan**
```bash
# Start your day
npm run tasks

# Add the feature task
npm run tasks:add "Implement OAuth2" "Add OAuth2 authentication" large high

# Work on it: /full "Implement OAuth2" "" "budget"
# ... scouts and plans (~45K tokens used)

# Pause with checkpoint before building
npm run tasks:pause TASK-123 "Plan approved. Ready to build: ai-docs/plans/xxx/plan.md"

# Check status
npm run tasks
# Shows: Context at 60%, Budget at 45K/500K, Paused task reminder

# End session
exit
```

**Session 2: Build & Test** (Next day or after break)
```bash
# Start new session
npm run tasks

# See paused task reminder:
#   ⏸️  TASK-123: Implement OAuth2
#   Last checkpoint: Plan approved. Ready to build...

# Resume the task
npm run tasks:resume TASK-123

# Build: /build "ai-docs/plans/xxx/plan.md"
# ... builds and tests (~80K tokens)

# Complete task
npm run tasks:complete TASK-123 80000

# Check recommendations
npm run tasks
# Shows: 420K remaining, suggests medium/small tasks
```

### Scenario 2: Multiple Small Tasks in One Session

```bash
# Start session
npm run tasks

# See available budget: 500K tokens
# Add quick wins
npm run tasks:add "Fix button CSS" "Update styles" small medium
npm run tasks:add "Add logging" "Implement logger" small low
npm run tasks:add "Update README" "Add setup instructions" small low

# Check dashboard
npm run tasks
# Shows all 3 tasks fit in budget

# Work on tasks using /quick
/quick "Fix button CSS"
npm run tasks:complete TASK-111 5000

/quick "Add logging"
npm run tasks:complete TASK-222 5000

# Context window at 70% - one more task fits
/quick "Update README"
npm run tasks:complete TASK-333 5000

# Check final status
npm run tasks
# Shows: 485K remaining, context at 72%
```

### Scenario 3: Context Window Warning

```bash
# Working on large feature
/full "Implement payment system" "" "budget"

# After scout + plan + build
npm run tasks
# ⚠️  WARNING: Context window at 78%
#    Consider starting a new session after current task

# Complete current task
npm run tasks:complete TASK-456 95000

# Start new session
exit
claude-code

# Resume next task in fresh context
npm run tasks
# Context at 0%, Budget at 95K/500K
```

---

## 🧠 Smart Recommendations

### Paused Tasks Reminder
Never forget about tasks you paused. The dashboard shows:
- Task ID and title
- Last checkpoint note
- Quick resume command

### Token Budget Optimizer
Dashboard automatically filters pending tasks to show only those that fit remaining budget:
- Sorted by size (smallest first for quick wins)
- Shows estimated tokens and time
- Updates in real-time as you complete tasks

### Context Window Monitoring
Three states:
1. **Normal** (0-74%): No warnings
2. **Warning** (75-89%): Suggests new session after current task
3. **Critical** (90%+): Immediate action required

---

## 🔗 Integration with Workflows

### Automatic Updates

Workflow commands should update the task system:

**After `/scout`:**
```bash
# Pause task with checkpoint
npm run tasks:pause TASK-123 "Scout completed. Found: ai-docs/scout-results/xxx/"
```

**After `/plan`:**
```bash
# Pause task with checkpoint
npm run tasks:pause TASK-123 "Plan ready at: ai-docs/plans/xxx/plan.md"
```

**After `/build`:**
```bash
# Complete task with actual tokens
npm run tasks:complete TASK-123 85000

# Update context window
node scripts/manage-tasks.js context $(echo "Current tokens from /tasks command")
```

**After `/test`, `/deploy`, etc:**
- Update context window regularly
- Check dashboard before starting new task
- Pause if approaching context limit

---

## 📁 Task States

| State | Emoji | Meaning |
|-------|-------|---------|
| `pending` | ⚪ | Not started yet |
| `in_progress` | 🟢 | Currently working on it |
| `paused` | ⏸️ | Temporarily stopped (with checkpoint) |
| `blocked` | 🔴 | Waiting on external dependency |
| `completed` | ✅ | Done (moved to completed list) |
| `cancelled` | ❌ | No longer needed |

---

## 💡 Best Practices

### 1. Session Start Reminder (Automatic!)
The session-start summary runs automatically via prompt hook when you start a new Claude Code session. It shows:
- Pending tasks from START-HERE.md
- Paused tasks with checkpoints
- Token budget status with warnings
- Recommended next tasks

**Manual check:**
```bash
npm run tasks:session-start  # Session start summary
npm run tasks                # Full dashboard
```

### 2. Checkpoint Frequently
When pausing tasks, write detailed checkpoints:
```bash
# Good ✅
npm run tasks:pause TASK-123 "Completed plan phase. Next: /build 'ai-docs/plans/20251010-oauth/plan.md'. Found issue: need Stripe webhook secret."

# Bad ❌
npm run tasks:pause TASK-123 "Paused"
```

### 3. Update Context Window Regularly
After major workflow steps:
```bash
node scripts/manage-tasks.js context 85000
```

### 4. Plan Your Day
```bash
# Morning: Check dashboard
npm run tasks

# See: 500K budget available

# Plan work:
# - Large task: 80K tokens
# - Medium task: 30K tokens
# - 3 small tasks: 15K tokens
# = 125K total, leaves 375K buffer
```

### 5. Respect Context Window Warnings
**Warning at 75%:** Finish current task, then new session
**Critical at 90%:** Stop immediately, start new session

---

## 🗂️ Task Data Location

**File:** `ai-docs/tasks/tasks.json`

Contains:
- Active tasks
- Completed tasks (today)
- Token budget (daily)
- Context window (current session)

**Auto-resets:**
- Token budget: Daily at midnight
- Context window: Manual update (use dashboard)

---

## 🔧 Advanced Usage

### Batch Operations
```bash
# Add multiple tasks
for task in "Task 1" "Task 2" "Task 3"; do
  npm run tasks:add "$task" "Description" small medium
done
```

### Custom Token Budgets
Edit `ai-docs/tasks/tasks.json`:
```json
{
  "tokenBudget": {
    "dailyLimit": 1000000,  // $40 plan
    "used": 0,
    "remaining": 1000000,
    "lastReset": "2025-10-10T00:00:00Z"
  }
}
```

### Task Dependencies
Manually edit JSON to add dependencies:
```json
{
  "id": "TASK-123",
  "dependencies": ["TASK-456", "TASK-789"],
  ...
}
```

Dashboard won't recommend tasks with incomplete dependencies.

---

## 📚 Related Documentation

- [WORKFLOW-DECISION-TREE.md](WORKFLOW-DECISION-TREE.md) - Command flow guide
- [CROSS-SESSION-GUIDE.md](../../TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Working across sessions
- [budget-mode.md](budget-mode.md) - Token optimization
- [ai-docs/sessions/README.md](../../ai-docs/sessions/README.md) - Session memory

---

**Last Updated**: October 2025
