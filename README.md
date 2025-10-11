# Budget Agentic Workflow

Zero-doc onboarding: every command explains itself, prints required follow-ups, and reminds you to stay inside the workflow. Run the dashboard, follow the prompt, and keep shipping.

---

## Daily Loop
1. `npm run tasks:session-start`
   - Shows token budget, active tasks, and **one command to run next**.
2. Execute the suggested slash command immediately (`/quick`, `/scout_build`, or `/full`).
   - The command keeps the vector store, knowledge ledger, and session logs in sync.
3. When a command pauses for verification, it will say:
   - `🛑 Waiting inside /<command>. Reply 'resume' to continue or 'stop' to exit.`
4. After a build completes, run `/test`, then follow any prompts (deploy, retry, etc.).

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
- `npm run tasks:*` → Task ledger + token budget dashboard.
- `npm run vectorize` → Rebuild vector store from `app-docs/` + `ai-docs/` outputs.
- `npm run manage-knowledge -- <cmd>` → Move specs between `active/` and `archive/`.
- `npm run search -- "query"` → Semantic search across indexed docs.
- `npm run workflow:sync` → Aggregate latest scout/plan/build/report status files for the dashboard.

Scripts never copy documentation into consumer projects—only runtime assets (`.claude/`, `scripts/`) plus empty scaffolding (`app-docs/`, `ai-docs/`, `vector-store.json`).

---

## Repository Layout
- `app-docs/` – Specs, guides, architecture notes (yours only; template docs removed).
- `ai-docs/` – Auto-generated plans, builds, sessions, task ledger.
- `scripts/` – Node utilities that commands rely on.
- `.claude/` – Slash commands + hooks.
- `vector-store.json` – Embedding store (regenerated after each build command).

---

## Adopting the Template
```bash
# From your project directory
bash /path/to/template/scripts/init-agentic-workflow.sh
```
What happens:
- Copies `.claude/` + `scripts/` (merges if already present).
- Creates empty `app-docs/`, `ai-docs/`, and `vector-store.json` scaffolding.
- Merges `package.json`, `.gitignore`, installs dependencies.
- Runs initial vectorization + project scale detection.
- Prints the **exact next command** to keep automation aligned.

Stay inside the slash-command loop, and the system keeps itself up to date.
