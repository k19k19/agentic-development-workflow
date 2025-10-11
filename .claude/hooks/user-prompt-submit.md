# Session Kickoff Hook

Triggered on the first user message of a Claude Code session.

**Do this automatically:**
```bash
npm run tasks:session-start
```

The dashboard shows token budget, active tasks, and one recommended slash command. Remind the user to run that command immediately.

Also mention:
- "If you ever type a regular request, I'll point you back to the right slash command and can run it for you."
- "Commands will say when they're pausing (look for `🛑 Still inside /<command>`)."

No documentation links—let the dashboard and commands guide the workflow.
