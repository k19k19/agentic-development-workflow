# Project Operating Guide – [Project Name]

This template assumes the commands inside `.claude/` drive all serious work. Documentation was intentionally removed—commands and scripts must guide the user end-to-end.

---

## Non-Negotiables

- **Stay inside slash commands.** If the user provides a plain request, run `/baw_agent "<request>"` to suggest the right command (offer the npm fallback only when they are outside the Claude CLI), then ask whether to execute it.
- **Keep automation in sync.** Build-style commands must:
  1. Write a session summary to `ai-docs/capabilities/<capability>/sessions/`.
  2. Emit workflow status JSON under `ai-docs/capabilities/<capability>/workflow/` describing phase, status, and resume command.
  3. Remind the user to run `npm run baw:workflow:sync` before checking the dashboard.
- **Verification clarity.** When a command pauses (plan approval, manual checks, etc.), always print:
  - `🛑 Still inside /baw_<command>. Reply 'resume' to continue or 'stop' to exit.`
  - Mention what will happen on resume (e.g., `resume` ➞ `/baw_dev_build`).
- **No legacy doc references.** Always steer users toward the live command set and current `app-docs` structure instead of historical templates.
- **Keep the token ledger accurate.** Every session log must include a `Token usage:` block and trigger the importer (`npm run baw:token:auto -- --path ai-docs/workflow/features/<feature>`) before handing off. Use `npm run baw:token:log` only when no session file is available.

---

## Folder Cheat Sheet

- `app-docs/specs/{active,archive,reference}` – Capability knowledge maintained by the user.
- `ai-docs/capabilities/<capability>/` – Automation outputs organized per capability (intake, plans, builds, reports, sessions, workflow logs).
  - `intake/` – `requirements.md`, `product/`, `personas/`, `support/`, and `tasks/` (outputs from product, persona, support, and `/baw_dev_execution_prep` commands).
  - `plans/` – `checklist.json` plus `dependency/`, `breakouts/`, and `deployment/` subfolders for roadmap outputs.
  - `reports/` – Command-specific evidence (`discovery/`, `tests/`, `uat/`, `deployments/`, `review/`, `failures/`, `ops/`).
- `scripts/` – Node helpers invoked by commands (`manage-knowledge.js`, `workflow-status.js`, `unified-dashboard.js`).

---

## Command Expectations

All custom commands are published with the `baw_` prefix (e.g., `/baw_dev_quick_build`) so they remain grouped in Claude Code. Treat any legacy `/dev_*` alias as equivalent.

- `/baw_dev_feature_start` – Initializes feature folder + session log. After running, suggest `/baw_dev_discovery`.
- `/baw_dev_discovery` – Collects context. On completion, auto-trigger `/baw_dev_verify_discovery`. If confidence <70%, offer targeted re-discovery. Save verification output to `reports/discovery/` and finish with recommended next command.
- `/baw_dev_execution_prep` – Takes an approved plan slice and writes an execution checklist (owners, validation, missing assets) into `intake/tasks/`. Always reference the original `plans/checklist.json` entry so the backlog stays single-sourced.
- `/baw_dev_plan` – Produces implementation plan. After writing the plan:
  1. Print the save path.
  2. State the verification prompt (`🛑 ...`).
  3. Suggest `/baw_dev_build_report "<plan path>"` once approved.
- `/baw_dev_build` & `/baw_dev_build_report` – Implement plan, run git diff, write the session log inside the capability workspace, emit workflow status JSON, and prompt `/baw_dev_test`.
- `/baw_dev_discovery_build` – Calls `/baw_dev_discovery`, then builds immediately. Still write workflow status + session log and prompt `/baw_dev_test`.
- `/baw_dev_quick_build` – Lightweight build without plan. Must update the capability workspace session log, write workflow status, and prompt `/baw_dev_test`.
- `/baw_dev_full_pipeline` – Orchestrates `/baw_dev_discovery`, `/baw_dev_plan`, waits for approval, then `/baw_dev_build_report`. Surface verification message explicitly before waiting.
- `/baw_dev_test` – Runs suite and tells user whether to deploy (`/baw_dev_deploy_staging`) or fix & rerun.

Every command ends with a **Next Steps** section containing literal commands to copy/paste.

---

## Knowledge Management

- `npm run baw:knowledge:manage -- archive|restore <spec>` moves specs between `app-docs/specs/active` and `archive`.
- `npm run baw:workflow:sync` refreshes the aggregated feature index consumed by the dashboard and `/work` script.
- `npm run baw:knowledge:audit` checks the KL ledger for missing What/Why/How coverage or tags before you close out an initiative.

---

## Progressive Feature Scaffolding

- `npm run baw:capability:scaffold -- --title "Feature"` defaults to the minimal workspace profile. Use `--profile full` only when you truly need the legacy directory tree.
- When a task expands (e.g., you now need discovery evidence or breakout plans), ask the user to run `npm run baw:capability:structure -- --capability <slug> --ensure reports/discovery` rather than respinning the capability.

---

## Handling Plain Prompts

When the user types a regular question instead of a slash command:

1. Run `/baw_agent "<request>"` to recommend the best slash command (fallback: `npm run baw:agent -- "<request>"` if you are outside the Claude CLI), then respond with that command.
2. Ask if you should execute it now.
3. Only proceed once the user confirms; otherwise stay ready.

This guarantees the recommended workflow executes, even when the user forgets.

---

## After Each Build/Test Cycle

1. Confirm git diff summary and files touched.
2. Point to `ai-docs/capabilities/<capability>/sessions/<session>.md` so the user can skim what changed.
3. Append a token usage block (e.g., `Claude: 12,345 tokens`, `Gemini: 2,000 tokens`, `Total tokens: 14,345`) to the session note and run `npm run baw:token:auto -- --path ai-docs/workflow/features/<feature>` so the ledger updates before the next agent starts.
4. Prompt `/baw_dev_test` ➞ `/baw_dev_deploy_staging` chain.
5. If tests fail, guide the user to fix and rerun `/baw_dev_test`.

---

## Token Budget Workflow

- `npm run baw:session:start` reads `ai-docs/workflow/token-usage.jsonl` to show the remaining Claude/Gemini budget. Without new entries, the warning thresholds (75%/90%) never fire.
- Prefer the automatic importer: after each session log is written under `ai-docs/workflow/features/<feature>/sessions/`, run:

  ```bash
  npm run baw:token:auto -- --path ai-docs/workflow/features/<feature>
  ```

  It scans `.md`/`.txt` files for token usage blocks, appends totals to the ledger, and skips files it has already ingested.
- If no session file exists yet, log usage manually:

  ```bash
  npm run baw:token:log -- --claude <tokens> [--gemini <tokens>] [--note "context"]
  ```

- Never close a workflow without confirming the ledger reflects the latest session—future kickoff commands depend on it for accurate warnings.

Stick to these rules and the workflow stays self-healing without extra documentation.
