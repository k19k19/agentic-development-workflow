# User Prompt Submit Hook

This hook runs automatically when the user submits their first message in a Claude Code session.

## Purpose

Display pending tasks and token budget recommendations at session start to help users:
1. Remember paused or pending tasks
2. See which tasks fit their remaining token budget
3. Get workflow suggestions based on available tokens
4. Avoid token budget overruns with early warnings

## Trigger

This hook is triggered on the **first user message** of a new Claude Code session.

## Implementation

Run the session-start command to display task recommendations:

```bash
npm run tasks:session-start
```

## What This Shows

- **Token Budget**: Daily usage, remaining tokens, warnings at 75%/90%
- **Pending Tasks**: Tasks from START-HERE.md and task ledger
- **Paused Tasks**: Tasks you paused with checkpoint notes
- **Recommendations**: Tasks that fit in remaining budget
- **Suggested Workflows**: /quick, /scout_build, or /full based on budget

## Example Output

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 SESSION START SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 TOKEN BUDGET (Daily)
   Used: 0 / 167,000 (0%)
   [░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]
   Remaining: 167,000 tokens

📋 PENDING TASKS FROM START-HERE.md
   ⚪ No pending tasks found (all completed ✅)

📋 TASKS FROM TASK LEDGER
   ⏸️  PAUSED: 1
   🚧 IN PROGRESS: 0
   ⚪ PENDING: 2

⏸️  PAUSED TASKS (Resume these first):
   • TASK-123: Implement OAuth2
     📍 Completed plan. Ready to build: ai-docs/plans/xxx/plan.md

💡 RECOMMENDATIONS

✨ Tasks that fit in remaining budget (167,000 tokens):
   • TASK-456: Add rate limiting
     Size: ~30,000 tokens
   • TASK-789: Fix CSS bug
     Size: ~5,000 tokens

🚀 SUGGESTED WORKFLOWS:
   • Large task: /full "[task]" "[docs]" "budget" (~90K tokens)
   • Medium task: /scout_build "[task]" (~30K tokens)
   • Small task: /quick "[task]" (~5K tokens)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Configuration

To disable this hook, rename or delete this file.

To adjust token budget limits, edit `ai-docs/tasks/tasks.json`:

```json
{
  "tokenBudget": {
    "dailyLimit": 167000,
    ...
  }
}
```

## Related Documentation

- [TASK-MANAGEMENT.md](../../TEMPLATE-DOCS/reference/TASK-MANAGEMENT.md) - Task system overview
- [budget-mode.md](../../TEMPLATE-DOCS/reference/budget-mode.md) - Token optimization
- [CROSS-SESSION-GUIDE.md](../../TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Multi-session workflows
