# CLAUDE.md

This is a template that will be copied to another project folder to provide agentic development workflow guidance to Claude Code (claude.ai/code).

## Repository Overview

This is an **Agentic Development Workflow** repository implementing the "R&D framework" (Reduce and Delegate). The core philosophy centers on using multiple parallel AI agents with custom slash commands to orchestrate complex development tasks.

## Architecture

### Scout-Plan-Build Workflow

The repository implements a three-phase workflow orchestrated through custom slash commands:

1. **Scout Phase** ([scout.md](scout.md)): Vector search to identify relevant files
   - Uses semantic search on indexed documentation and specs
   - Searches across `app-docs/specs/active/`, `app-docs/guides/`, and other indexed directories
   - Returns structured file lists with line ranges
   - Format: `<path> (offset: N, limit: M)`
   - Fast and token-efficient (~5K tokens)

2. **Plan Phase** ([plan.md](plan.md)): Task planning with complexity assessment
   - Takes user prompt, documentation URLs, and relevant files collection
   - Produces a detailed implementation plan
   - Includes complexity check and approval gate

3. **Build Phase** ([build.md](build.md)): Executes the plan from the previous step

### Workflow Execution

The primary workflow is invoked via slash command with this structure:
```
/full "[user_prompt]" "[document-urls]" "[mode]"
```

This executes sequentially:
1. `/scout "[user_prompt]"` → returns `relevant_files_collection_path`
2. `/plan "[user_prompt]" "[docs]" "[files]"` → returns `path_to_plan` (with approval gate)
3. `/build "[path_to_plan]"` → returns `build_report`

### Budget Shortcuts

For faster, token-optimized workflows:
- `/quick "[task]"` - Direct Codex implementation (~5K tokens) for small tasks
- `/scout_build "[task]"` - Scout + Build without plan approval (~30K tokens) for medium tasks
- `/full "[task]" "[docs]" "budget"` - Budget mode for large tasks (~90K tokens)

### Operational Intelligence

- Build commands auto-generate session summaries in `ai-docs/sessions/SESSION-*.md` and rerun `npm run vectorize` so future workflows can query past decisions.
- `npm run tasks` exposes the task ledger at `ai-docs/tasks/tasks.json`, tracking checkpoints, token budgets, and ready-to-run work across sessions.
- The dashboard issues token-budget recommendations and warns at 75%/90% context usage, helping decide when to pause or restart a session.
- Command templates conclude with next-step guidance (tests, deploy, retries) to maintain momentum between agents.

### Vector Search Implementation

The scout phase uses semantic search:
- Indexed vector store built from `app-docs/` documentation
- Command: `npm run search "[query]"`
- Only searches `app-docs/specs/active/` (not archive) for focused results
- Lifecycle management: Archive old specs to improve search quality
- Git safety: `git diff --stat` check after scout, `git reset --hard` if changes detected

## Repository Structure

Per [README.md](README.md), the intended organization is:
1. `ai docs/` - AI-related documentation
2. `app docs/` - Application documentation
3. `app/` - Application code
4. `specs/` - Specifications
5. Root - Contains only working folders and config files (package.json, .mcp config, claude.md)

**Note**: Currently the repository is in early stages with only documentation files present.

## Context Engineering with R&D Framework

**Reduce and Delegate**:
- **Reduce**: Use fast, token-efficient models for initial search/discovery
- **Delegate**: Distribute work across multiple specialized agents running in parallel
- Agents are chained and composed through custom slash commands
- Real-time migration of 8 custom agents to Claude Agent SDK is in progress

## Key Principles

- **Vector Search First**: Scout phase uses semantic search on indexed docs for fast, focused discovery
- **Argument Quoting**: Slash command arguments must be in double quotes; nested quotes become single quotes
- **No Prompt Alteration**: Pass USER_PROMPT variables unchanged through the workflow chain (append ` [BUDGET MODE]` only when running budget workflows)
- **Sequential Workflow Steps**: Each workflow phase must complete before the next begins
- **Git Safety**: Always check for unintended changes after agent operations

- **Structured Output**: Agents should return file paths with specific line ranges for efficient context loading

## Custom Slash Commands

The repository uses custom slash commands stored in `.claude/` that chain together to create complex workflows. These commands compose and orchestrate multiple AI agents working in parallel.

### Slash Command Architecture

**IMPORTANT**: Slash commands are **NOT executable scripts**. They are **markdown instruction files** interpreted by Claude Code's `SlashCommand` tool.

**Execution Model**:
```
User types: /scout "find auth code"
    ↓
Claude reads: .claude/commands/scout.md
    ↓
Claude expands variables: $1 → "find auth code"
    ↓
Claude executes instructions using tools (Bash, Read, Grep, Task)
    ↓
Claude reports results
```

**Key Characteristics**:
- **Instruction-based runtime**: Commands are prompts, not code
- **Variable substitution**: Arguments passed via `$1`, `$2`, `${VAR_NAME}`
- **Tool orchestration**: Commands invoke Claude's tools (Bash, Read, Edit, Task)
- **Sequential execution**: Each step completes before the next begins
- **Context-aware**: Full access to project files and git state

**Variable Syntax**:
- Positional: `$1`, `$2`, `$3`
- Named: `${TASK}`, `${DOC_URLS}`, `${MODE}`
- Quoting: Arguments must be quoted: `/scout "my task"`

**Workflow Chaining**:
Commands can invoke other commands sequentially:
```markdown
## /full command workflow
1. Execute: /scout "[USER_PROMPT]" → capture RELEVANT_FILES
2. Execute: /plan "[USER_PROMPT]" "[DOC_URLS]" "[RELEVANT_FILES]" → capture PLAN_PATH
3. WAIT for user approval (CRITICAL)
4. Execute: /build "[PLAN_PATH]" → capture BUILD_REPORT
```

**Complete documentation**: See [TEMPLATE-DOCS/reference/slash-command-architecture.md](TEMPLATE-DOCS/reference/slash-command-architecture.md) for:
- Detailed execution flow
- Writing custom commands
- Tool usage patterns
- Debugging commands
- Common patterns and best practices

## Development Status

**Status**: ✅ Template Complete and Production Ready

**What's Done:**
- ✅ Complete directory structure (ai-docs, app-docs, app, scripts)
- ✅ All workflow documents (scout, plan, build, report) with token budgets
- ✅ Slash command implementations using Agent SDK Task tool
- ✅ MCP configuration templates (Gemini, Codex, Chrome DevTools, Shadcn, Firecrawl)
- ✅ Project scale detection helper
- ✅ Validation and health-check scripts
- ✅ Migration guide (old SDK → new Agent SDK)
- ✅ Comprehensive documentation (README, Quick Start, Template Guide)

**Ready to Use:**
- Copy this template to any project
- Customize CLAUDE.md for your project
- Run workflows based on project scale

**See Also:**
- [README.md](README.md) - Complete documentation
- [GETTING-STARTED.md](GETTING-STARTED.md) - 5-minute setup guide
- [TEMPLATE-DOCS/reference/COMMAND-MAPPING.md](TEMPLATE-DOCS/reference/COMMAND-MAPPING.md) - Command reference
- [TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md](TEMPLATE-DOCS/reference/WORKFLOW-DECISION-TREE.md) - Command flow with next steps
- [TEMPLATE-DOCS/reference/TASK-MANAGEMENT.md](TEMPLATE-DOCS/reference/TASK-MANAGEMENT.md) - Task tracking & productivity
- [TEMPLATE-DOCS/reference/budget-mode.md](TEMPLATE-DOCS/reference/budget-mode.md) - Budget optimization guide
- [TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md](TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md) - Cross-session workflow patterns
