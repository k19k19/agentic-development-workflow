# Budget Agentic Workflow

Zero-doc onboarding: every command explains itself, prints required follow-ups, and reminds you to stay inside the workflow. Run the dashboard, follow the prompt, and keep shipping.

---

## Daily Loop
1. Execute the recommended slash command for the feature you’re working on (`/scout`, `/plan`, `/build`, `/report_failure`).
   - Each command emits a status JSON record so automation can track progress.
2. Update documentation or specs under `app-docs/` as needed.
3. Run `npm run workflow:sync` to aggregate the latest command outputs.
4. Review the dashboard via `npm run work` for feature states, summaries, and resume commands.
5. When a command pauses for verification, it will say:
   - `🛑 Waiting inside /<command>. Reply 'resume' to continue or 'stop' to exit.`
6. After a build completes, run `/test`, then follow any prompts (deploy, retry, etc.).

You can always type plain language; Claude will answer with the recommended command and offer to run it for you.

---

## Slash Commands at a Glance
- `/quick "fix typo"` → One-file change, ~5K tokens.
- `/scout_build "add JWT auth"` → Medium task, scout + build in one pass.
- `/full "implement billing" "https://link" budget` → Large feature with approval pause.
- `/start "FEATURE-ID"` → Set up spec + session log, then run `/scout`.
- `/test` → Execute automated tests; prints follow-up commands (`/deploy_staging`, etc.).

Every command outputs:
- Current status (including verification stops).
- Files touched / artifacts written.
- The next command you should run.

---

## Automation Scripts (npm)
- `npm run manage-knowledge -- <cmd>` → Move specs between `active/`, `archive/`, and `reference/`.
- `npm run tasks:session-start` → Summarize cross-session context, token usage, and right-sized next tasks.
- `npm run workflow:sync` → Aggregate the latest scout/plan/build/report status files for the dashboard.
- `npm run work` → Launch the feature workflow dashboard fed by `status-index.json`.
- `npm run lint` / `npm run lint:fix` / `npm run format` — enforce ESLint + Prettier conventions.

Scripts never copy documentation into consumer projects—only runtime assets (`.claude/`, `scripts/`) plus empty scaffolding (`app-docs/` and `ai-docs/`).

---

## Repository Layout
- `app-docs/` – Specs, guides, architecture notes (yours only; template docs removed).
- `ai-docs/` – Auto-generated plans, builds, sessions, and workflow status history.
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
- The installer prints the next command to keep the automation loop aligned.

Stay inside the slash-command loop, and the system keeps itself up to date.
