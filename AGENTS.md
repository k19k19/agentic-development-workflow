# Repository Guidelines

## Reduce & Delegate Workflow
Operate in the R&D mindset: trim the ask, then hand it to the right agents. Default to `/scout_plan_build "<user prompt>" "<doc urls>"`; break it into `/scout`, `/plan_w_docs`, and `/build` only for targeted follow-ups. Log every run under `ai-docs/reports/` so the next agent can replay decisions.

## Project Structure & Module Organization
Keep only configs in the root (`package.json`, `.mcp/`, `CLAUDE.md`). `.claude/commands/` hosts orchestrator prompts, `.claude/agents/` and `.claude/utils/` house personas and shared settings. `ai-docs/` starts empty until workflows populate it, while `app-docs/` ships with `.gitkeep` placeholders—create specs, guides, and mappings when you first document a feature. Ship runtime code in `app/`, store generated plans in `specs/`, and keep automation scripts in `scripts/` (`detect-project-scale.js`, validation hooks, health checks).

## Documentation Templates
Seed new docs with predictable structure so agents can parse them fast:

```markdown
# Feature Spec (app-docs/specs/<feature>.md)
## Purpose
## Requirements
## Interfaces (API/UI)
## Testing
```

```markdown
# Mapping Entry (append to app-docs/mappings/feature-to-source.md)
## <Feature>
- Code: `app/...` :10-40
- Tests: `tests/...`
- Docs: `app-docs/specs/<feature>.md`
```

## Build, Test, and Development Commands
Run `node scripts/detect-project-scale.js` before delegating to confirm the right workflow. Slash command `/scout_plan_build` chains `/scout`, `/plan_w_docs`, and `/build_w_report`; call the individual commands only when you need to restart a specific phase. Wire lint, unit, and integration suites into `bash scripts/validation/pre-deploy-check.sh`, and execute `bash scripts/health-check/health-check.sh` after merges.

## Coding Style & Naming Conventions
Mirror the dominant language in `app/`, keep shared assets two-space indented, and prefer kebab-case for filenames in `specs/` and `.claude/commands/`. Document command edits in the matching `.claude/commands/*.md` file and note them in `CLAUDE.md` for downstream agents.

## Testing Guidelines
Co-locate automated tests with their source (`app/services/user.js` ↔ `tests/services/user.test.js`). Extend `scripts/validation/pre-deploy-check.sh` to enforce coverage thresholds and fail on regressions. Capture exploratory findings in `app-docs/guides/`, attaching logs when filing defects so delegated agents can replay scenarios.

## Commit & Pull Request Guidelines
Write concise, active-voice commits ("Implement scout plan workflow") and group related agent outputs together. Reference the supporting plan in `specs/` plus any documentation you touched in `app-docs/`. Pull requests should list the triggering prompt, validation evidence, and follow-up tasks queued for other agents.

## Agent Workflow Tips
Refresh `CLAUDE.md` whenever structure, commands, or tooling shifts. Organize concurrent initiatives with timestamped subfolders inside `ai-docs/workflows/`, and archive stale artifacts instead of deleting them so parallel devices preserve traceability without bloating active context.
