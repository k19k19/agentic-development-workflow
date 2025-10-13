---
description: Gather repository context relevant to the requested feature
argument-hint: [user_prompt]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# Scout

## Purpose
Collect the most relevant code, documentation, and prior automation outputs needed to understand the feature described in `USER_PROMPT`.

## Variables
USER_PROMPT: $1

## Instructions
- **Delegate Analysis**: Use Gemini MCP (`mcp__gemini-cli__ask-gemini`) to analyze the `USER_PROMPT` and generate a list of optimal `rg` search keywords and relevant file globs.
- **Execute Search**: Use the keywords and globs from Gemini to search the codebase with `rg`. Only fall back to `find` or `grep` if `rg` is unavailable.
- Review `ai-docs/workflow/` for prior status entries related to the same feature.
- Capture enough context for the planning phase: existing implementations, shared utilities, constraints, and open questions.
## Workflow
1. Parse `USER_PROMPT` to identify primary feature areas and constraints.
2. Inspect documentation (`app-docs/`, `ai-docs/knowledge-ledger/`, relevant specs) for background details.
3. Search the codebase with `rg` to surface candidate files and read the important sections (only fall back to other tools if `rg` is not installed).
4. Summarize discoveries, highlighting reusable code, gaps, and risks that the plan must address.
5. Record any documentation that should be updated before continuing.

## Report
- Provide bullet summaries of the most relevant files and excerpts discovered.
- List any documentation or specs the user should review or update.
- Call out risks, unknowns, or follow-up questions uncovered during scouting.
- If this run is clarifying an approved plan slice, explicitly point to the existing `plans/PLAN-*.md` file to update instead of suggesting a new feature or plan.
- Note: Token usage will be automatically captured if using `complete-auto` command.

## Automation Trace
- Emit a workflow status JSON entry following `app-docs/guides/workflow-status-format.md`.
  - Derive `featureId` from the request title in kebab-case.
  - Save to `ai-docs/workflow/<feature-id>/<ISO-timestamp>-scout.json`.
  - Use `phase: "scout"` and set `status` to `completed`, `needs_docs`, or `blocked` as appropriate.
  - Set `nextCommand` to the exact follow-up slash command the user should run.
  - Include any documentation paths that must be updated before resuming.
- Remind the user to run `npm run baw:workflow:sync` so the dashboard reflects the new scout results.

## Next Steps
After completing scout, you typically want to:

**→ Create an implementation plan:**
```bash
/plan "[your-task]" "[doc-urls]" "[scout-notes-path]"
```

Where `[scout-notes-path]` is the file path shown in the scout output.

If the plan already exists, remind the user to append the new context to the same plan document and checklist entry.

**Short circuit:**
```bash
/scout_build "[your-task]"
```

When you hand off to the next command, summarize the available context and highlight any missing documentation the user should supply.
