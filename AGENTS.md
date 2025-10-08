# Repository Guidelines

## Reduce & Delegate Workflow
Operate in the R&D mindset: trim the ask, then hand it to the right agents. Default to `/scout_plan_build "<user prompt>" "<doc urls>"`; break it into `/scout`, `/plan_w_docs`, and `/build` only for targeted follow-ups. Log every run under `ai-docs/reports/` so the next agent can replay decisions.

## Project Structure & Module Organization
Keep only configs in the root (`package.json`, `.mcp/`, `CLAUDE.md`). `.claude/commands/` hosts orchestrator prompts. `ai-docs/` starts empty until workflows populate it. `app-docs/` is the structured knowledge base for the project, and includes `guides`, `specs`, `mappings`, `architecture`, and `debugging` directories. Ship runtime code in `app/`, and keep automation scripts in `scripts/`.

## Documentation Templates
Seed new docs with predictable structure so agents can parse them fast:

```markdown
# Feature Spec (app-docs/specs/[round-type]-[feature].md)
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
- Docs: `app-docs/specs/[round-type]-[feature].md`
```

## Retrieval Protocol

To ensure high token efficiency, the AI must be trained to follow a multi-phase protocol that relies on **targeted retrieval** from the structured knowledge base.

### **Phase A: Pre-Task Retrieval (The Scout) 🔎**

Before the AI engages in *any* expensive code generation, it must execute targeted searches using low-cost tools (grep, indexing agent) to gather only the necessary context.

1. **Read Current Spec**: Retrieve the specific spec for the current task (e.g., `2nd-frontend-billing.md`).
2. **Check Mappings (Anti-Duplication)**: Search **app-docs/mappings/feature-to-source.md** for related features. This instantly tells the AI if a component or function already exists and where to find it.
3. **Check Patterns**: Retrieve relevant sections from **app-docs/guides/common-patterns.md** to ensure the new code adheres to project standards and avoids duplicating utilities.
4. **Identify Minimal Files**: Use an internal tool to identify **only** the specific files and line ranges required for the modification.

### **Phase B: Context-Aware Implementation (The Claude Role) 🏗️**

The main AI (e.g., Claude) is engaged only after the minimal context is retrieved.

* The prompt sent to the AI includes the **full AI User Memory** and the **minimal, highly-relevant file snippets** retrieved in Phase A.
* **Mandatory Rule:** The AI must be programmed to **build upon the existing functions** identified in the Mappings file rather than creating new, slightly different versions.

### **Phase C: Post-Task Update (The Historian) ✍️**

Every successful feature completion or major fix must automatically update the knowledge base.

1. **Update Mappings**: Update app-docs/mappings/feature-to-source.md with the new file paths and features implemented.
2. **Log New Patterns**: If the implementation introduced a new, reusable utility or pattern, add a brief entry to app-docs/guides/common-patterns.md.
3. **Final Report**: Save the detailed build report to ai-docs/reports/ for historical logging and metric tracking.

## Commit & Pull Request Guidelines
Write concise, active-voice commits ("Implement scout plan workflow") and group related agent outputs together. Reference the supporting plan in `specs/` plus any documentation you touched in `app-docs/`. Pull requests should list the triggering prompt, validation evidence, and follow-up tasks queued for other agents.

## Agent Workflow Tips
Refresh `CLAUDE.md` whenever structure, commands, or tooling shifts. Organize concurrent initiatives with timestamped subfolders inside `ai-docs/workflows/`, and archive stale artifacts instead of deleting them so parallel devices preserve traceability without bloating active context.
