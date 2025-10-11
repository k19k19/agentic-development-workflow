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
```bash
# From your project directory
bash /path/to/template/scripts/init-agentic-workflow.sh
```
What happens:
- Copies `.claude/` + `scripts/` (merges if already present).
- Creates empty `app-docs/` and `ai-docs/` scaffolding.
- Merges `package.json`, `.gitignore`, installs dependencies.
- Seeds the workflow status index used by the dashboard.
- Prints the **exact next command** to keep automation aligned.

Stay inside the slash-command loop, and the system keeps itself up to date.
