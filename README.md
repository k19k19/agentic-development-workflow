# Budget Agentic Workflow

Zero-doc onboarding: every command explains itself, prints required follow-ups, and reminds you to stay inside the workflow. Run the dashboard, follow the prompt, and keep shipping. Unsure which command to start with? `/baw_agent "describe your task"` proposes the right `/baw_` entry point (fallback: `npm run baw:agent -- "describe your task"`).

> **Command namespace**
> All custom commands are now published with the `baw_` prefix (for example `/baw_dev_quick_build`) so they group together inside Claude Code. If you see an older prompt or doc using `/dev_quick_build`, swap in the `baw_` prefix—the behavior is identical.

---

## Daily Loop
1. Start with discovery: `/baw_product_charter`, `/baw_product_features`, or `/baw_product_helper` to capture the latest understanding of the product and personas.
   - Every discovery command emits a workflow status JSON record so automation can track decision history.
2. Move into build preparation: `/baw_dev_dependency_plan`, `/baw_dev_breakout_plan`, and `/baw_dev_execution_prep` sequence implementation-ready work.
   - `/baw_dev_discovery` handles research + code discovery; `/baw_dev_execution_prep` converts an approved plan slice into an executable checklist (owners, validation, missing docs). Keep both commands writing into the same `ai-docs/workflow/features/<feature-id>/` workspace so revisions remain traceable.
3. Execute implementation commands (`/baw_dev_build`, `/baw_dev_test`, `/baw_dev_deploy_plan`, `/baw_dev_deploy_staging`, etc.) as prompted.
4. Update documentation or specs under `app-docs/` as needed, then run `npm run baw:workflow:sync` to aggregate the latest command outputs.
   - New or migrating features should use `npm run baw:feature:scaffold` to copy the template workspace before the first command runs.
5. Review the dashboard via `npm run baw:work` or generate a persona-oriented summary with `/baw_workflow_radar`.
6. When a command pauses for verification, it will say:
   - `🛑 Waiting inside /baw_<command>. Reply 'resume' to continue or 'stop' to exit.`
7. After a build completes, run `/baw_dev_test`, capture `/baw_uat` notes, and finish with `/baw_dev_release` when deployment is greenlit.

You can always type plain language; Claude will answer with the recommended command and offer to run it for you.

---

## Slash Commands at a Glance
### Navigator
- `/baw_agent "<request>"` → Translate plain-language prompts into the right `/baw_` command without leaving the CLI.

### Product + Strategy
- `/baw_product_charter "<product>"` → Define personas, value proposition, and success metrics.
- `/baw_product_features "<product>"` → Translate the charter into a feature catalog with dependencies.
- `/baw_product_wishlist "<product>"` → Capture stretch goals without derailing the core roadmap.
- `/baw_product_helper "<topic>"` → Research answers for discovery gaps (market, compliance, tech).

### Developer Delivery
- `/baw_dev_dependency_plan "<initiative>"` → Build a dependency-ordered delivery roadmap.
- `/baw_dev_breakout_plan "<phase>"` → Shape sprint-sized breakout increments.
- `/baw_dev_execution_prep "<task>"` → Gather specs, acceptance criteria, and owners for each task.
- `/baw_dev_test_matrix "<release>"` → Plan verification strategy across environments.
- `/baw_dev_deploy_plan "<release>"` → Produce the deployment runbook.
- `/baw_dev_quick_build "fix typo"` → One-file change, ~5K tokens.
- `/baw_dev_discovery_build "add JWT auth"` → Medium task, discovery + build in one pass.
- `/baw_dev_full_pipeline "implement billing" "https://link" budget` → Large feature with approval pause.
- `/baw_dev_feature_start "FEATURE-ID"` → Set up spec + session log, then run `/baw_dev_discovery`.
- `/baw_dev_test` → Execute automated tests; prints follow-up commands (`/baw_dev_deploy_staging`, etc.).

### Operations + Support
- `/baw_workflow_radar "<initiative>"` → Visualize outstanding work, missing docs, and blockers by persona.
- `/baw_provider_functions "<product>"` → Map provider/admin interfaces and operational needs.
- `/baw_support_ticket "<queue>"` → Convert support feedback into actionable follow-ups.
- `/baw_hotfix "<bug-id>"` / `/baw_triage_bug "<bug-id>"` → Escalate incidents and capture remediation steps in the support intake folder.

Every command outputs:
- Current status (including verification stops).
- Files touched / artifacts written.
- The next command you should run.

---

## Automation Scripts (npm)
- `npm run baw:agent -- "<request>"` → Fallback for `/baw_agent` when you need to call the router outside the Claude CLI.
- `npm run baw:knowledge:manage -- <cmd>` → Move specs between `active/`, `archive/`, and `reference/`.
- `npm run baw:session:start` → Summarize cross-session context, token usage, and right-sized next tasks.
- `npm run baw:workflow:sync` → Aggregate the latest discovery/baw_dev_plan/baw_dev_build/report status files for the dashboard.
- `npm run baw:work` → Launch the feature workflow dashboard fed by `status-index.json`.
- `npm run baw:feature:scaffold -- --title "Feature"` → Create a new workspace (defaults to the minimal profile; add `--profile full` for the legacy tree).
- `npm run baw:feature:structure -- --feature <slug> --list` → Inspect optional directories; add them progressively with `--ensure reports/discovery`.
- `npm run baw:knowledge:audit` → Check the KL ledger for missing fields or tags before closing out an initiative.
- `npm run baw:smoke -- [options]` → Provision a throwaway project and exercise the installer, router, dashboard sync, and Jest smoke run.
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

### Reusable end-to-end smoke test

Need a fast sanity check after updating the template? Run the bundled smoke test:

```bash
npm run baw:smoke -- --keep
```

- Creates a temporary Node.js project (or use `--workspace /path/to/dir` to reuse your own sandbox).
- Runs `scripts/init-agentic-workflow.sh` against it so you can confirm install steps still succeed.
- Exercises the router (`npm run baw:agent`), workflow sync, dashboard, and the Jest stub that ships with the template.
- Captures logs under `<workspace>/logs/` for quick inspection. Omit `--keep` to clean up automatically when finished.
- If package installs are blocked (for example, in an offline environment), the script still runs the router and reports which steps were skipped.

Use this after modifying installer scripts or upgrading dependencies to ensure the template still boots end to end without consuming extra tokens.
