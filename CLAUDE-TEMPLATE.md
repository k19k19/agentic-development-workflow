# Project Operating Guide – [Project Name]

This template assumes the commands inside `.claude/` drive all serious work. Documentation was intentionally removed—commands and scripts must guide the user end-to-end.

---

## Non-Negotiables
- **Stay inside slash commands.** If the user provides a plain request, reply with the recommended command (usually `/quick`, `/scout_build`, or `/full`) and offer to run it.
- **Keep automation in sync.** Build-style commands must:
  1. Write a session summary to `ai-docs/sessions/`.
  2. Emit workflow status JSON under `ai-docs/workflow/<feature>/` describing phase, status, and resume command.
  3. Remind the user to run `npm run workflow:sync` before checking the dashboard.
- **Verification clarity.** When a command pauses (plan approval, manual checks, etc.), always print:
  - `🛑 Still inside /<command>. Reply 'resume' to continue or 'stop' to exit.`
  - Mention what will happen on resume (e.g., `resume` ➞ `/build`).
- **No legacy doc references.** Always steer users toward the live command set and current `app-docs` structure instead of historical templates.

---

## Folder Cheat Sheet
- `app-docs/specs/{active,archive,reference}` – Feature knowledge maintained by the user.
- `ai-docs/{plans,builds,sessions}` – Automation outputs. Commands append here automatically.
- `scripts/` – Node helpers invoked by commands (`manage-knowledge.js`, `workflow-status.js`, `unified-dashboard.js`).

---

## Command Expectations
- `/start` – Initializes feature folder + session log. After running, suggest `/scout`.
- `/scout` – Collects context. On completion, auto-trigger `/verify_scout`. If confidence <70%, offer targeted re-scout. Finish with recommended next command.
- `/plan` – Produces implementation plan. After writing the plan:
  1. Print the save path.
  2. State the verification prompt (`🛑 ...`).
  3. Suggest `/build_w_report "<plan path>"` once approved.
- `/build` & `/build_w_report` – Implement plan, run git diff, write session log, emit workflow status JSON, and prompt `/test`.
- `/scout_build` – Calls `/scout`, then builds immediately. Still write workflow status + session log and prompt `/test`.
- `/quick` – Lightweight build without plan. Must update session log, write workflow status, and prompt `/test`.
- `/full` – Orchestrates `/scout`, `/plan`, waits for approval, then `/build_w_report`. Surface verification message explicitly before waiting.
- `/test` – Runs suite and tells user whether to deploy (`/deploy_staging`) or fix & rerun.

Every command ends with a **Next Steps** section containing literal commands to copy/paste.

---

## Knowledge Management
- `npm run manage-knowledge -- archive|restore <spec>` moves specs between `app-docs/specs/active` and `archive`.
- `npm run workflow:sync` refreshes the aggregated feature index consumed by the dashboard and `/work` script.

---

## Handling Plain Prompts
When the user types a regular question instead of a slash command:
1. Respond with the exact slash command that should run next.
2. Ask if you should execute it now.
3. Only proceed once the user confirms; otherwise stay ready.

This guarantees the recommended workflow executes, even when the user forgets.

---

## After Each Build/Test Cycle
1. Confirm git diff summary and files touched.
2. Point to `ai-docs/sessions/<session>.md` so the user can skim what changed.
3. Prompt `/test` ➞ `/deploy_staging` chain.
4. If tests fail, guide the user to fix and rerun `/test`.

Stick to these rules and the workflow stays self-healing without extra documentation.
