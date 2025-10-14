# Budget Agentic Workflow

Zero-doc onboarding: every command explains itself, prints required follow-ups, and reminds you to stay inside the workflow. Run the dashboard, follow the prompt, and keep shipping. Unsure which command to start with? `npm run baw:agent -- "describe your task"` suggests the right `/baw:` entry point.

---

## Daily Loop
1. Start with discovery: `/baw:product_charter`, `/baw:product_features`, or `/baw:product_helper` to capture the latest understanding of the product and personas.
   - Every discovery command emits a workflow status JSON record so automation can track decision history.
2. Move into build preparation: `/baw:dev_dependency_plan`, `/baw:dev_breakout_plan`, and `/baw:dev_execution_prep` sequence implementation-ready work.
   - `/baw:dev_discovery` handles research + code discovery; `/baw:dev_execution_prep` converts an approved plan slice into an executable checklist (owners, validation, missing docs). Keep both commands writing into the same `ai-docs/workflow/features/<feature-id>/` workspace so revisions remain traceable.
3. Execute implementation commands (`/baw:dev_build`, `/baw:dev_test`, `/baw:dev_deploy_plan`, `/baw:dev_deploy_staging`, etc.) as prompted.
4. Update documentation or specs under `app-docs/` as needed, then run `npm run baw:workflow:sync` to aggregate the latest command outputs.
   - New or migrating features should use `npm run baw:feature:scaffold` to copy the template workspace before the first command runs.
5. Review the dashboard via `npm run baw:work` or generate a persona-oriented summary with `/baw:workflow_radar`.
6. When a command pauses for verification, it will say:
   - `🛑 Waiting inside /baw:<command>. Reply 'resume' to continue or 'stop' to exit.`
7. After a build completes, run `/baw:dev_test`, capture `/baw:uat` notes, and finish with `/baw:dev_release` when deployment is greenlit.

You can always type plain language; Claude will answer with the recommended command and offer to run it for you.

---

## Slash Commands at a Glance
### Product + Strategy
- `/baw:product_charter "<product>"` → Define personas, value proposition, and success metrics.
- `/baw:product_features "<product>"` → Translate the charter into a feature catalog with dependencies.
- `/baw:product_wishlist "<product>"` → Capture stretch goals without derailing the core roadmap.
- `/baw:product_helper "<topic>"` → Research answers for discovery gaps (market, compliance, tech).

### Developer Delivery
- `/baw:dev_dependency_plan "<initiative>"` → Build a dependency-ordered delivery roadmap.
- `/baw:dev_breakout_plan "<phase>"` → Shape sprint-sized breakout increments.
- `/baw:dev_execution_prep "<task>"` → Gather specs, acceptance criteria, and owners for each task.
- `/baw:dev_test_matrix "<release>"` → Plan verification strategy across environments.
- `/baw:dev_deploy_plan "<release>"` → Produce the deployment runbook.
- `/baw:dev_quick_build "fix typo"` → One-file change, ~5K tokens.
- `/baw:dev_discovery_build "add JWT auth"` → Medium task, discovery + build in one pass.
- `/baw:dev_full_pipeline "implement billing" "https://link" budget` → Large feature with approval pause.
- `/baw:dev_feature_start "FEATURE-ID"` → Set up spec + session log, then run `/baw:dev_discovery`.
- `/baw:dev_test` → Execute automated tests; prints follow-up commands (`/baw:dev_deploy_staging`, etc.).

### Operations + Support
- `/baw:workflow_radar "<initiative>"` → Visualize outstanding work, missing docs, and blockers by persona.
- `/baw:provider_functions "<product>"` → Map provider/admin interfaces and operational needs.
- `/baw:support_ticket "<queue>"` → Convert support feedback into actionable follow-ups.
- `/baw:hotfix "<bug-id>"` / `/baw:triage_bug "<bug-id>"` → Escalate incidents and capture remediation steps in the support intake folder.

Every command outputs:
- Current status (including verification stops).
- Files touched / artifacts written.
- The next command you should run.

---

## Automation Scripts (npm)
- `npm run baw:agent -- "<request>"` → Map plain-language requests to the closest `/baw:` command before you leave the workflow loop.
- `npm run baw:knowledge:manage -- <cmd>` → Move specs between `active/`, `archive/`, and `reference/`.
- `npm run baw:session:start` → Summarize cross-session context, token usage, and right-sized next tasks.
- `npm run baw:workflow:sync` → Aggregate the latest discovery/baw:dev_plan/baw:dev_build/report status files for the dashboard.
- `npm run baw:work` → Launch the feature workflow dashboard fed by `status-index.json`.
- `npm run baw:feature:scaffold -- --title "Feature"` → Create a new workspace (defaults to the minimal profile; add `--profile full` for the legacy tree).
- `npm run baw:feature:structure -- --feature <slug> --list` → Inspect optional directories; add them progressively with `--ensure reports/discovery`.
- `npm run baw:knowledge:audit` → Check the KL ledger for missing fields or tags before closing out an initiative.
- `npm run lint` / `npm run lint:fix` / `npm run format` — enforce ESLint + Prettier conventions.

Scripts never copy documentation into consumer projects—only runtime assets (`.claude/`, `scripts/`) plus empty scaffolding (`app-docs/` and `ai-docs/`).

---

## Repository Layout
- `app-docs/` – Specs, guides, architecture notes (yours only; template docs removed).
- `ai-docs/` – Feature workspaces (`workflow/features/<feature>/`) plus knowledge ledger + legacy scratch space.
  - `workflow/features/<feature>/intake/` keeps discovery artifacts (product charter, feature catalog, wishlist, persona playbooks, support tickets, task dossiers).
  - `workflow/features/<feature>/plans/` contains plan slices and dependency/deployment/breakout roadmaps.
  - `workflow/features/<feature>/reports/` holds command-specific outputs (discovery verification, test runs, UAT evidence, deployment logs, radar summaries, etc.).
  - `workflow/features/<feature>/workflow/` mirrors command history for the dashboard.
- `scripts/` – Node utilities that commands rely on.
- `.claude/` – Slash commands + hooks.

---

## Adopting the Template
1. Clone or download this template alongside your existing project (keep your project’s root README in place).
   ```bash
   git clone https://github.com/k19k19/budget-agentic-workflow.git /tmp/budget-agentic-workflow
   ```
2. From within your existing project directory, run the installer script shipped with the template:
   ```bash
   cd /path/to/your/project
   bash /tmp/budget-agentic-workflow/scripts/init-agentic-workflow.sh
   ```
    - The script merges automation assets and configuration without touching your project’s README or other non-template docs.
    - If you have custom `.gitignore`, `package.json`, or config files, the script merges in the required entries instead of overwriting them.

After the script runs:
- `.claude/` and `scripts/` are copied in (existing files are respected).
- `app-docs/` and `ai-docs/` directories are scaffolded if missing.
- Required scripts and dependencies are added to `package.json` and `.gitignore`.
- The workflow status index is seeded so dashboard commands work immediately.
- The installer prints the next command to keep the automation loop aligned. When you spin up a feature, start with the minimal profile (`npm run baw:feature:scaffold -- --title "XYZ"`), then pull in extra directories only when needed via `npm run baw:feature:structure`.

Stay inside the slash-command loop, and the system keeps itself up to date.
