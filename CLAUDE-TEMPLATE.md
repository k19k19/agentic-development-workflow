# Project Operating Guide – [Project Name]

This template assumes the commands inside `.claude/` drive all serious work. Documentation was intentionally removed—commands and scripts must guide the user end-to-end.

---

## Repository Purpose

Use this workspace to run a **budget-first agentic development workflow**. All serious work should go through slash commands so that:

- Token usage stays predictable via orchestrated command flows.
- Workflow status JSON and session notes keep automation state machine-readable.
- Knowledge persists in the capability workspace instead of ad-hoc docs.
- Tool roles remain clear (Gemini MCP for docs, Codex MCP for implementation, Claude for orchestration).

Keep the template opinionated: commands teach the workflow; supplemental docs only exist when automation needs context.

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

## Slash Command System

All engineering work flows through `.claude/commands/*.md`. Keep new commands aligned to the existing persona tracks and publish them with the `baw_` prefix (legacy `/dev_*` aliases mirror them).

**Navigator**

- `/baw_agent [--persona <track>] "<request>"` – Route natural-language requests to the right slash command (CLI fallback: `npm run baw:agent -- "<request>"`).

**Product & Strategy**

- `/baw_product_charter [product]` – Capture personas, value prop, metrics.
- `/baw_product_capabilities [product]` – Map capabilities, dependencies, readiness signals.
- `/baw_product_wishlist [product]` – Track stretch goals and activation triggers.
- `/baw_product_helper [topic]` – Fill discovery gaps with targeted research.

**Developer Delivery**

- `/baw_dev_feature_start [capability]` – Scaffold capability workspace and prompt discovery.
- `/baw_dev_discovery [capability]` – Gather context; auto-trigger `/baw_dev_verify_discovery`; deposit evidence in `reports/discovery/`.
- `/baw_dev_plan [capability]` – Write implementation plan, print save path, pause for approval before building.
- `/baw_dev_execution_prep [task]` – Convert plan slice into `intake/tasks/` checklist tied to `plans/checklist.json`.
- `/baw_dev_dependency_plan`, `/baw_dev_breakout_plan`, `/baw_dev_test_matrix`, `/baw_dev_deploy_plan` – Support roadmap, breakout, test, and deployment preparation.
- `/baw_dev_build`, `/baw_dev_build_report`, `/baw_dev_discovery_build`, `/baw_dev_quick_build`, `/baw_dev_full_pipeline` – Implementation flows that must write session logs, emit workflow status JSON, and suggest `/baw_dev_test`.
- `/baw_dev_test [capability]` – Run suites, save output to `reports/tests/`, and direct users to `/baw_dev_deploy_staging` on pass or re-run on fail.

**Operations & Support**

- `/baw_workflow_radar`, `/baw_provider_functions`, `/baw_support_ticket` – Operational intelligence and support conversion.
- `/baw_pause_feature`, `/baw_restart_feature`, `/baw_report_failure`, `/baw_hotfix`, `/baw_triage_bug`, `/baw_next` – Guardrails, recovery, and triage helpers.

Each command ends with a **Next Steps** section containing literal commands to copy/paste; never skip it.

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

## Workflow Status System

Every command writes structured JSON to `ai-docs/capabilities/<capability>/workflow/<timestamp>-<phase>.json`. Keep the schema stable so downstream scripts can aggregate it.

```json
{
  "featureId": "kebab-case-id",
  "featureTitle": "Human Title",
  "phase": "discovery|execution-prep|plan|build|test|deploy",
  "status": "pending|in_progress|needs_validation|blocked|completed",
  "command": "/baw_dev_build",
  "nextCommand": "/baw_dev_test",
  "summary": "One-sentence status",
  "outputPath": "ai-docs/capabilities/<capability>/plans/<timestamp>-plan.md",
  "documentation": ["paths to supporting docs"],
  "timestamp": "ISO-8601"
}
```

- `npm run baw:workflow:sync` ingests these files into `ai-docs/capabilities/status-index.json`.
- `npm run baw:work` renders the unified dashboard from the index.
- When a command pauses, always print:

  ```
  🛑 Still inside /baw_<command>. Reply 'resume' to continue or 'stop' to exit.
  resume ➞ /baw_dev_build (describe the next action)
  ```

---

## After Each Build/Test Cycle

1. Confirm git diff summary and files touched.
2. Point to `ai-docs/capabilities/<capability>/sessions/<session>.md` so the user can skim what changed.
3. Emit workflow status JSON to `ai-docs/capabilities/<capability>/workflow/` and remind the user to run `npm run baw:workflow:sync`.
4. Append a token usage block (e.g., `Claude: 12,345 tokens`, `Gemini: 2,000 tokens`, `Total tokens: 14,345`) to the session note and run `npm run baw:token:auto -- --path ai-docs/workflow/features/<feature>` so the ledger updates before the next agent starts.
5. Prompt `/baw_dev_test` ➞ `/baw_dev_deploy_staging` chain.
6. If tests fail, guide the user to fix and rerun `/baw_dev_test`.

---

## Key Implementation Guardrails

- **Discovery-to-plan loop.** When discovery is thin, rerun `/baw_dev_discovery` against the same capability, update `plans/checklist.json`, and flag the session backlog instead of spawning new plan slices.
- **Feature ID generation.** Convert titles to kebab-case (strip non-alphanumerics, collapse whitespace/dashes, trim) so automation stays consistent.
- **Workflow validation.** `scripts/workflow-status.js` enforces the JSON schema; invalid entries are skipped from the index.
- **Knowledge ledger.** `scripts/utils/knowledge-ledger.js` syncs `ai-docs/knowledge-ledger/ledger.md`; run `npm run baw:knowledge:audit` before closing an initiative.
- **Budget mode.** Commands invoked with `"budget"` should keep outputs concise (Summary, ≤4 Key Steps, Risks, Tests) and avoid external scraping unless URLs are provided.
- **Tool delegation.** Gemini MCP covers documentation tasks, Codex MCP does code edits, Claude orchestrates approvals and reporting—respect those roles.

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
