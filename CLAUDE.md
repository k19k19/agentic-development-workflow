# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Purpose

This is a **budget-first agentic development workflow template** designed to maximize efficiency through:
- Token-aware command orchestration via slash commands
- Automated workflow status tracking and session management
- Knowledge persistence through structured documentation
- Tool delegation strategy (Gemini MCP for docs, Codex MCP for implementation, Claude for architecture)

The workflow is built around self-documenting slash commands that enforce automation hooks, emit machine-readable status JSON, and maintain cross-session continuity without relying on external documentation.

---

## Core Architecture

### Slash Command System
All engineering work flows through commands in `.claude/commands/*.md`:

**Entry Points:**
- `/quick [task]` – Direct implementation via Codex MCP (~5K tokens, <10 files)
- `/scout_build [task]` – Medium tasks: scout + build without plan approval
- `/full [task] [docs] [mode]` – Large features with scout → plan → approval → build cycle

All implementation phases rely on Codex MCP (`mcp__codex__codex`) for code edits. Claude orchestrates the workflow, reviews Codex output, and handles approvals/communication.

**Workflow Phases:**
- `/start [feature-id]` – Initialize feature folder + session log
- `/scout [prompt]` – Gather context via grep/glob, emit scout results
- `/plan [prompt] [docs] [context]` – Write implementation plan, wait for approval
- `/build [plan]` or `/build_w_report [plan]` – Execute plan, update mappings
- `/test` – Run test suite, suggest next action
- `/deploy_staging` → `/uat` → `/finalize` → `/release` – Deployment pipeline

**Support Commands:**
- `/verify_scout` – Quality gate for scout output (auto-triggered)
- `/pause_feature`, `/restart_feature`, `/report_failure` – Error handling
- `/hotfix [bug-id]`, `/triage_bug` – Production fixes
- `/next` – Select next feature from roadmap

### Scout-to-Plan Feedback Loop

- When a `/scout` result is too thin to execute an approved plan slice, **re-run `/scout` against the same feature directory** instead of creating a new feature. Reference the active `plans/PLAN-*.md` file and append new findings in-place.
- Promote all clarified requirements into the existing `plans/checklist.json` entry by updating its notes, acceptance criteria, or dependencies. Never spawn a second plan slice just to hold the extra data.
- Use the session backlog to flag "Plan needs revision" so subsequent prompts continue refining the same artifact until it is executable.
- Only call `/plan` again if the scope materially changes and the old plan entry is superseded—record the supersession inside `plans/checklist.json`.

### Workflow Status System
Every command writes structured JSON to `ai-docs/workflow/<feature-id>/<timestamp>-<phase>.json` containing:
```javascript
{
  featureId: "kebab-case-id",
  featureTitle: "Human Title",
  phase: "scout|plan|build|test|deploy",
  status: "pending|in_progress|needs_validation|blocked|completed",
  command: "the slash command that ran",
  nextCommand: "recommended follow-up command",
  summary: "one-sentence status",
  outputPath: "path to main artifact",
  documentation: ["paths to docs"],
  timestamp: "ISO-8601"
}
```

**Key scripts:**
- `npm run baw:workflow:sync` – Aggregates status JSON → `ai-docs/workflow/status-index.json`
- `npm run baw:work` – Renders unified dashboard from status index
- `npm run baw:session:start` – Shows token budget + recommended tasks

### Directory Structure
```
.claude/commands/          Slash command definitions
scripts/                   Node utilities (workflow-status.js, unified-dashboard.js, etc.)
app-docs/                  User-maintained documentation
  specs/active/            Active feature specifications
  specs/archive/           Completed/archived specs
  specs/reference/         Example templates
  guides/                  Implementation patterns
  mappings/                feature-to-source.md (file locations)
  architecture/            System design docs
  operations/              Runbooks, data fixes
  debugging/               Known issues, troubleshooting
ai-docs/                   AI-generated artifacts
  plans/                   Implementation plans from /plan
  builds/                  Build reports from /build_w_report
  sessions/                Session summaries (cross-session memory)
  workflow/                Status JSON files + index
  knowledge-ledger/        Architectural decision records
```

---

## Development Commands

### Testing & Quality
```bash
npm run lint              # ESLint check (flat config)
npm run lint:fix          # Auto-fix linting issues
npm run format            # Prettier formatting
npm test                  # Run test suite (if present)
```

### Knowledge Management
```bash
npm run baw:knowledge:manage -- list                    # Show specs in active/archive/reference
npm run baw:knowledge:manage -- archive <spec.md>       # Move spec to archive/
npm run baw:knowledge:manage -- restore <spec.md>       # Restore from archive/
```

### Session Management
```bash
npm run baw:session:start    # Show token budget, workflow status, recommended tasks
npm run baw:workflow:sync          # Update status-index.json from individual JSON files
npm run baw:work                   # Display unified dashboard
```

---

## Command Patterns

### When User Provides Plain Request
1. Map request to appropriate slash command based on scope:
   - Single file/simple change → `/quick "[task]"`
   - Medium task (10-50 files) → `/scout_build "[task]"`
   - Large feature (>50 files) → `/full "[task]" "" "budget"`
2. Ask if you should execute the command
3. Only proceed after user confirmation
4. When a command enters an implementation phase, immediately delegate edits to Codex MCP and keep Claude focused on oversight and reporting.

### Command Execution Flow
1. **Before command:** Read existing feature spec from `app-docs/specs/active/` if it exists
2. **During command:** Follow the command's markdown instructions precisely
3. **After command:**
   - Write workflow status JSON to `ai-docs/workflow/<feature-id>/<timestamp>-<phase>.json`
   - Update session log in `ai-docs/sessions/SESSION-<date>-<slug>.md`
   - Remind user to run `npm run baw:workflow:sync`
   - Print verification message for approval gates:
     ```
     🛑 Still inside /<command>. Reply 'resume' to continue or 'stop' to exit.
     [Explain what happens on resume]
     ```
   - Show **Next Steps** section with literal commands to run

### Budget Mode Behavior
When mode parameter is `"budget"` or prompt contains `[BUDGET MODE]`:
- Skip external documentation scraping unless URL explicitly provided
- Limit plan to ~350 words
- Use concise section structure: Summary, Key Steps (max 4), Risks, Tests
- Set scout scale to 2 agents (vs 4 in standard mode)

---

## Key Implementation Details

### Feature ID Generation
Convert feature titles to kebab-case:
```javascript
// "Add JWT Auth" → "add-jwt-auth"
title.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim()
```

### Workflow Status Validation
`scripts/workflow-status.js` enforces required fields:
- `featureId`, `featureTitle`, `phase`, `status`, `command` (all strings)
- `documentation` (array of strings)
- Skips invalid entries with warnings

### Knowledge Ledger Integration
`scripts/utils/knowledge-ledger.js` parses `ai-docs/knowledge-ledger/ledger.md` for architectural decisions:
- Adopted decisions (active patterns)
- Superseded decisions (historical context)
- Auto-integrated into status index

### Token Budget Tracking
`scripts/utils/token-usage-analyzer.js` tracks usage by:
- Daily limit: 200K tokens (Claude $20 plan)
- Weekly rolling window
- Per-model breakdown (Gemini/Codex vs Claude)
- Efficiency warnings at 70% (🟠) and 90% (🔴)

---

## Tool Delegation Strategy

**Use Gemini MCP for:**
- Reading/summarizing documentation URLs
- Quick documentation searches
- Format conversions

**Use Codex MCP for:**
- Small single-file implementations (`/quick`)
- CRUD boilerplate
- UI component tweaks
- Syntax fixes

**Use Claude (Sonnet 4.5) for:**
- Multi-agent orchestration (scout/plan/build workflows)
- Architectural decisions
- Complex multi-file refactoring
- Plan verification and approval gates

---

## Verification & Approval Gates

Commands that pause for approval:
1. `/plan` – After plan written, before `/build`
2. `/full` – After plan phase, before build phase
3. `/verify_scout` – After scout, if confidence <70%

**Always:**
- Print clear pause message with `🛑` emoji
- Explain what resume will do
- Wait for explicit "resume" or "stop" from user
- Never skip approval even if task seems simple

---

## Session Memory Pattern

After each build/test cycle:
1. Run `git diff --stat` to show files changed
2. Write or update `ai-docs/sessions/SESSION-[date]-[slug].md` with:
   - Task summary (1-2 sentences)
   - Files modified
   - Key decisions and rationale
   - Validation highlights
   - Follow-up tasks for next agent
3. Emit workflow status JSON
4. Prompt `npm run baw:workflow:sync`
5. Suggest next command (usually `/test`)

---

## ESLint Configuration

Uses flat config (`eslint.config.mjs`):
- Extends `@eslint/js` recommended
- Ignores: `node_modules/`, `ai-docs/**`, config file itself
- Language: CommonJS, ES2021, Node + Browser globals
- Repository uses `eslint . --fix` for auto-fixing

---

## Git Workflow

After implementation:
1. Show `git diff --stat`
2. Point to session log: `ai-docs/sessions/SESSION-*.md`
3. Suggest commit only after tests pass
4. Use commit format:
   ```
   feat: Add feature title (spec: app-docs/specs/...)

   Implementation plan: ai-docs/plans/...
   Build report: ai-docs/builds/...

   - Key change 1
   - Key change 2

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

---

## Common Pitfalls

**DON'T:**
- Skip pre-approval gates "for efficiency"
- Read entire directories (use scout + feature-to-source.md)
- Commit without running tests
- Create new files when editing existing ones suffices
- Batch multiple todo completions (mark done immediately)
- Skip workflow status JSON emission
- Forget to remind user about `npm run baw:workflow:sync`

**DO:**
- Check `app-docs/guides/workflow-status-format.md` before writing status JSON
- Read `app-docs/specs/active/` for existing feature context
- Update `app-docs/mappings/feature-to-source.md` when files change
- Use `npm run baw:session:start` at session start for budget awareness
- Delegate appropriately (Gemini for docs, Codex for boilerplate, Claude for complexity)

---

## Testing Notes

When `/test` command runs:
- Executes test suite (method depends on project)
- Captures output to `ai-docs/builds/[timestamp]/test-output.txt`
- Analyzes results
- Suggests next action:
  - Pass → `/deploy_staging`
  - Fail → Fix issues, rerun `/test`
- Never proceed to deployment if tests fail

---

## Adoption by Other Projects

This template can be installed via:
```bash
bash /path/to/template/scripts/init-agentic-workflow.sh
```

What it does:
- Copies `.claude/` commands + `scripts/` utilities
- Creates empty `app-docs/` and `ai-docs/` scaffolding
- Merges `package.json` scripts + dependencies
- Updates `.gitignore`
- Seeds workflow status index
- Prints exact next command to run

**Does NOT copy:** Template documentation (only runtime assets)

---

## Reference Documentation

For deeper understanding:
- `app-docs/guides/workflow-status-format.md` – Status JSON schema
- `app-docs/guides/` – Implementation patterns (populated by user)
- `README.md` – Quick start guide for end users
- `.claude/commands/*.md` – Full command specifications

This codebase is optimized for token efficiency, cross-session continuity, and self-documenting automation. When in doubt, follow the slash command flow and let the scripts handle bookkeeping.
