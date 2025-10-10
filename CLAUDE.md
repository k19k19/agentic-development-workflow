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
- [app-docs/guides/COMMAND-MAPPING.md](app-docs/guides/COMMAND-MAPPING.md) - Command reference
- [app-docs/guides/WORKFLOW-DECISION-TREE.md](app-docs/guides/WORKFLOW-DECISION-TREE.md) - Command flow with next steps
- [app-docs/guides/TASK-MANAGEMENT.md](app-docs/guides/TASK-MANAGEMENT.md) - Task tracking & productivity
- [app-docs/guides/budget-mode.md](app-docs/guides/budget-mode.md) - Budget optimization guide
- [app-docs/guides/CROSS-SESSION-GUIDE.md](app-docs/guides/CROSS-SESSION-GUIDE.md) - Cross-session workflow patterns
