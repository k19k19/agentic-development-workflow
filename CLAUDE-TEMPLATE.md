# Project Operating Guide – [Project Name]

This template assumes the commands inside `.claude/` drive all serious work. Documentation was intentionally removed—commands and scripts must guide the user end-to-end.

---

## Non-Negotiables
- **Stay inside slash commands.** If the user provides a plain request, reply with the recommended command (usually `/baw:quick`, `/baw:scout_build`, or `/baw:full`) and offer to run it.
- **Keep automation in sync.** Build-style commands must:
  1. Write a session summary to `ai-docs/workflow/features/<feature>/sessions/`.
  2. Emit workflow status JSON under `ai-docs/workflow/features/<feature>/workflow/` describing phase, status, and resume command.
  3. Remind the user to run `npm run baw:workflow:sync` before checking the dashboard.
- **Verification clarity.** When a command pauses (plan approval, manual checks, etc.), always print:
  - `🛑 Still inside /baw:<command>. Reply 'resume' to continue or 'stop' to exit.`
  - Mention what will happen on resume (e.g., `resume` ➞ `/baw:build`).
- **No legacy doc references.** Always steer users toward the live command set and current `app-docs` structure instead of historical templates.

---

## Folder Cheat Sheet
- `app-docs/specs/{active,archive,reference}` – Feature knowledge maintained by the user.
- `ai-docs/workflow/features/<feature>/` – Automation outputs organized per feature (intake, plans, builds, reports, sessions, workflow logs).
  - `intake/` – `requirements.md`, `product/`, `personas/`, `support/`, and `tasks/` (outputs from product, persona, support, and `/baw:task_prep` commands).
  - `plans/` – `checklist.json` plus `dependency/`, `breakouts/`, and `deployment/` subfolders for roadmap outputs.
  - `reports/` – Command-specific evidence (`scout/`, `tests/`, `uat/`, `deployments/`, `review/`, `failures/`, `ops/`).
- `scripts/` – Node helpers invoked by commands (`manage-knowledge.js`, `workflow-status.js`, `unified-dashboard.js`).

---

## Command Expectations
- `/baw:start` – Initializes feature folder + session log. After running, suggest `/baw:scout`.
- `/baw:scout` – Collects context. On completion, auto-trigger `/baw:verify_scout`. If confidence <70%, offer targeted re-scout. Save verification output to `reports/scout/` and finish with recommended next command.
- `/baw:task_prep` – Takes an approved plan slice and writes an execution checklist (owners, validation, missing assets) into `intake/tasks/`. Always reference the original `plans/checklist.json` entry so the backlog stays single-sourced.
- `/baw:plan` – Produces implementation plan. After writing the plan:
  1. Print the save path.
  2. State the verification prompt (`🛑 ...`).
  3. Suggest `/baw:build_w_report "<plan path>"` once approved.
- `/baw:build` & `/baw:build_w_report` – Implement plan, run git diff, write the session log inside the feature workspace, emit workflow status JSON, and prompt `/baw:test`.
- `/baw:scout_build` – Calls `/baw:scout`, then builds immediately. Still write workflow status + session log and prompt `/baw:test`.
- `/baw:quick` – Lightweight build without plan. Must update the feature workspace session log, write workflow status, and prompt `/baw:test`.
- `/baw:full` – Orchestrates `/baw:scout`, `/baw:plan`, waits for approval, then `/baw:build_w_report`. Surface verification message explicitly before waiting.
- `/baw:test` – Runs suite and tells user whether to deploy (`/baw:deploy_staging`) or fix & rerun.

Every command ends with a **Next Steps** section containing literal commands to copy/paste.

---

## Knowledge Management
- `npm run baw:knowledge:manage -- archive|restore <spec>` moves specs between `app-docs/specs/active` and `archive`.
- `npm run baw:workflow:sync` refreshes the aggregated feature index consumed by the dashboard and `/work` script.

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
2. Point to `ai-docs/workflow/features/<feature>/sessions/<session>.md` so the user can skim what changed.
3. Prompt `/baw:test` ➞ `/baw:deploy_staging` chain.
4. If tests fail, guide the user to fix and rerun `/baw:test`.

Stick to these rules and the workflow stays self-healing without extra documentation.
