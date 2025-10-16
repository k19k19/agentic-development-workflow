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
All engineering work flows through commands in `.claude/commands/*.md`. They are organized around three persona tracks:

All custom commands are published with the `baw_` prefix (e.g., `/baw_dev_quick_build`) so they stay grouped in Claude Code. Treat any legacy `/dev_*` alias as equivalent.

**Navigator:**
- `/baw_agent [--persona <track>] "<request>"` – Recommend the right slash command from natural-language input (fallback CLI: `npm run baw:agent -- "<request>"`).

**Product + Strategy:**
- `/baw_product_charter [product]` – Define personas, value proposition, and metrics.
- `/baw_product_capabilities [product]` – Catalog core capabilities with dependencies and readiness signals.
- `/baw_product_wishlist [product]` – Capture stretch ideas and activation triggers.
- `/baw_product_helper [topic]` – Run targeted research to close discovery gaps.

**Developer Delivery:**
- `/baw_dev_dependency_plan [initiative]` – Sequence milestones based on dependencies.
- `/baw_dev_breakout_plan [phase]` – Shape sprint-sized breakout increments.
- `/baw_dev_execution_prep [task]` – Gather specs, acceptance criteria, and owners for implementation.
- `/baw_dev_test_matrix [release]` – Define verification strategy across environments.
- `/baw_dev_deploy_plan [release]` – Produce deployment/rollback runbooks.
- `/baw_dev_quick_build [task]`, `/baw_dev_discovery_build [task]`, `/baw_dev_full_pipeline [task] [docs] [mode]` – Implementation accelerators using Codex MCP.

**Operations + Support:**
- `/baw_workflow_radar [initiative]` – Visualize blockers and missing documentation by persona.
- `/baw_provider_functions [product]` – Map provider/admin workflows and operational requirements.
- `/baw_support_ticket [queue]` – Convert support feedback into prioritized actions.
- `/baw_dev_verify_discovery`, `/baw_pause_feature`, `/baw_restart_feature`, `/baw_report_failure`, `/baw_hotfix`, `/baw_triage_bug`, `/baw_next` – Guardrails, recovery, and triage utilities.

All implementation phases rely on Codex MCP (`mcp__codex__codex`) for code edits. Claude orchestrates the workflow, reviews Codex output, and handles approvals/communication.

**Workflow Phases:**
- Discovery: `/baw_product_charter`, `/baw_product_capabilities`, `/baw_product_wishlist`, `/baw_product_helper`
- Planning: `/baw_dev_feature_start`, `/baw_dev_discovery`, `/baw_dev_plan`, `/baw_dev_dependency_plan`, `/baw_dev_breakout_plan`, `/baw_dev_execution_prep`
- Implementation: `/baw_dev_build`, `/baw_dev_build_report`, `/baw_dev_quick_build`, `/baw_dev_discovery_build`
- Verification: `/baw_dev_test_matrix`, `/baw_dev_test`, `/baw_uat`, `/baw_report_failure`
- Deployment: `/baw_dev_deploy_plan`, `/baw_dev_deploy_staging`, `/baw_dev_finalize`, `/baw_dev_release`
- Operations: `/baw_workflow_radar`, `/baw_provider_functions`, `/baw_support_ticket`, `/baw_triage_bug`, `/baw_hotfix`

### Discovery-to-Plan Feedback Loop

- When a `/baw_dev_discovery` result is too thin to execute an approved plan slice, **re-run `/baw_dev_discovery` against the same capability workspace** instead of creating a new feature. Reference the active plan under `ai-docs/capabilities/<capability-id>/plans/` and append new findings in-place.
- Promote all clarified requirements into the existing `plans/checklist.json` entry inside the capability workspace by updating its notes, acceptance criteria, or dependencies. Never spawn a second plan slice just to hold the extra data.
- Use the capability workspace session backlog to flag "Plan needs revision" so subsequent prompts continue refining the same artifact until it is executable.
- Only call `/baw_dev_plan` again if the scope materially changes and the old plan entry is superseded—record the supersession inside `plans/checklist.json`.

**Discovery vs Execution Prep**
- `/baw_dev_discovery` performs discovery—gather code/document context and risks. Its outputs live in `reports/discovery/` and update the matching plan slice.
- `/baw_dev_execution_prep` is the actionizer—turn a planned slice into an executable checklist with owners, validation hooks, and missing assets. Store those dossiers in `intake/tasks/` and keep them synced with the plan checklist entry.

### Workflow Status System
Every command writes structured JSON to `ai-docs/capabilities/<capability-id>/workflow/<timestamp>-<phase>.json` containing:
```javascript
{
  featureId: "kebab-case-id",
  featureTitle: "Human Title",
  phase: "discovery|execution-prep|plan|build|test|deploy",
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
- `npm run baw:workflow:sync` – Aggregates status JSON → `ai-docs/capabilities/status-index.json`
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
  workflow/
    features/
      <capability-id>/
        intake/
          requirements.md
          product/        Charter, feature catalog, wishlist, research
          personas/       Provider/consumer/support playbooks
          support/        Ticket analysis, hotfix triage notes
          tasks/          `/baw_dev_execution_prep` checklists
        plans/
          checklist.json
          dependency/     `/baw_dev_dependency_plan`
          breakouts/      `/baw_dev_breakout_plan`
          deployment/     `/baw_dev_deploy_plan`
        builds/            Build logs, compiled assets, automation output
        reports/
          discovery/      Verification verdicts
          tests/          `/baw_dev_test` outputs
          test-matrices/  `/baw_dev_test_matrix`
          uat/            `/baw_uat` evidence
          deployments/    `/baw_dev_deploy_staging` & `/baw_dev_release` logs
          review/         `/baw_dev_wait_for_review` critiques
          failures/       `/baw_report_failure` analyses
          ops/            `/baw_workflow_radar` dashboards
        sessions/          Session hand-offs and backlog JSON
        workflow/          Per-command status JSON history
        handoff/           Launch checklists and release notes
        artifacts/         Supporting documents (diagrams, exports, etc.)
  knowledge-ledger/        Architectural decision records
  logs/, plans/, builds/   Legacy scratch space (read-only; keep new work in capability workspaces)
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
1. Run `/baw_agent "<request>"` to surface the recommended slash command (use `npm run baw:agent -- "<request>"` only when you are outside the Claude CLI).
   - Single file/simple change → `/baw_dev_quick_build "[task]"`
   - Medium task (10-50 files) → `/baw_dev_discovery_build "[task]"`
   - Large feature (>50 files) → `/baw_dev_full_pipeline "[task]" "" "budget"`
2. Ask if you should execute the command
3. Only proceed after user confirmation
4. When a command enters an implementation phase, immediately delegate edits to Codex MCP and keep Claude focused on oversight and reporting.

### Command Execution Flow
1. **Before command:** Read existing feature spec from `app-docs/specs/active/` if it exists
2. **During command:** Follow the command's markdown instructions precisely
3. **After command:**
   - Write workflow status JSON to `ai-docs/capabilities/<capability-id>/workflow/<timestamp>-<phase>.json`
   - Update session log in `ai-docs/capabilities/<capability-id>/sessions/SESSION-<date>-<slug>.md`
   - Remind user to run `npm run baw:workflow:sync`
   - Print verification message for approval gates:
     ```
     🛑 Still inside /baw_<command>. Reply 'resume' to continue or 'stop' to exit.
     [Explain what happens on resume]
     ```
   - Show **Next Steps** section with literal commands to run

### Budget Mode Behavior
When mode parameter is `"budget"` or prompt contains `[BUDGET MODE]`:
- Skip external documentation scraping unless URL explicitly provided
- Limit plan to ~350 words
- Use concise section structure: Summary, Key Steps (max 4), Risks, Tests
- Set discovery scale to 2 agents (vs 4 in standard mode)

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

### Progressive Feature Scaffolding
- `npm run baw:capability:scaffold -- --title "Feature"` now defaults to the minimal workspace profile; add `--profile full` when you explicitly need the legacy tree.
- When a command requires additional folders (e.g., discovery evidence or breakout plans), have the user run `npm run baw:capability:structure -- --capability <slug> --ensure reports/discovery` (or the relevant section) instead of recreating the capability.

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
- Run `npm run baw:knowledge:audit` when wrapping an initiative to confirm every adopted decision has What/Why/How coverage and tagged metadata.

### Token Budget Tracking
`scripts/utils/token-usage-analyzer.js` reads entries from `ai-docs/capabilities/token-usage.jsonl` and updates:
  - Daily limit: 200K tokens (Claude $20 plan)
  - Weekly rolling window
  - Per-model breakdown (Gemini/Codex vs Claude)
  - Efficiency warnings at 70% (🟠) and 90% (🔴)

Add usage to the ledger in one of two ways:

1. **Automatic import (preferred):** Drop session summaries that include a `Token usage:` block into the capability workspace and run:
   ```
   npm run baw:token:auto -- --path ai-docs/capabilities/<capability-id>
   ```
   The importer scans `.md/.txt` files for lines such as `Claude: 12,345 tokens`, logs the total, and skips files that were already ingested.

2. **Manual entry:**
   ```
   npm run baw:token:log -- --claude <tokens> [--gemini <tokens>] [--note "context"]
   ```

---

## Tool Delegation Strategy

**Use Gemini MCP for:**
- Reading/summarizing documentation URLs
- Quick documentation searches
- Format conversions

**Use Codex MCP for:**
- Small single-file implementations (`/baw_dev_quick_build`)
- CRUD boilerplate
- UI component tweaks
- Syntax fixes

**Use Claude (Sonnet 4.5) for:**
- Multi-agent orchestration (`/baw_dev_discovery` → `/baw_dev_plan` → `/baw_dev_build` workflows)
- Architectural decisions
- Complex multi-file refactoring
- Plan verification and approval gates

---

## Verification & Approval Gates

Commands that pause for approval:
1. `/baw_dev_plan` – After plan written, before `/baw_dev_build`
2. `/baw_dev_full_pipeline` – After plan phase, before build phase
3. `/baw_dev_verify_discovery` – After discovery, if confidence <70%

**Always:**
- Print clear pause message with `🛑` emoji
- Explain what resume will do
- Wait for explicit "resume" or "stop" from user
- Never skip approval even if task seems simple

---

## Session Memory Pattern

After each build/baw_dev_test cycle:
1. Run `git diff --stat` to show files changed
2. Write or update `ai-docs/capabilities/<capability-id>/sessions/SESSION-[date]-[slug].md` with:
   - Task summary (1-2 sentences)
   - Files modified
   - Key decisions and rationale
   - Validation highlights
   - Follow-up tasks for next agent
   - Token usage block (e.g., `Claude: 12,345 tokens`, `Gemini: 2,000 tokens`, `Total tokens: 14,345`)
3. Emit workflow status JSON
4. Prompt `npm run baw:workflow:sync`
5. Run `npm run baw:token:auto -- --path ai-docs/capabilities/<capability-id>` so the session summary's token block is captured
6. Suggest next command (usually `/baw_dev_test`)

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
2. Point to session log: `ai-docs/capabilities/<capability-id>/sessions/SESSION-*.md`
3. Suggest commit only after tests pass
4. Use commit format:
   ```
   feat: Add feature title (spec: app-docs/specs/...)

   Implementation plan: ai-docs/capabilities/<capability-id>/plans/<timestamp>-*/plan.md
   Build report: ai-docs/capabilities/<capability-id>/reports/...

   - Key change 1
   - Key change 2

   🤖 Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

---

## Common Pitfalls

**DON'T:**
- Skip pre-approval gates "for efficiency"
- Read entire directories (use discovery + feature-to-source.md)
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

When `/baw_dev_test` command runs:
- Executes test suite (method depends on project)
- Captures output to `ai-docs/capabilities/<capability-id>/builds/[timestamp]/test-output.txt`
- Analyzes results
- Suggests next action:
  - Pass → `/baw_dev_deploy_staging`
  - Fail → Fix issues, rerun `/baw_dev_test`
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
