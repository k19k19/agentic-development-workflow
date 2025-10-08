# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an **Agentic Development Workflow** repository implementing the "R&D framework" (Reduce and Delegate). The core philosophy centers on using multiple parallel AI agents with custom slash commands to orchestrate complex development tasks.

## Architecture

### Scout-Plan-Build Workflow

The repository implements a three-phase workflow orchestrated through custom slash commands:

1. **Scout Phase** ([scout.md](scout.md)): Multi-agent parallel search to identify relevant files
   - Spawns multiple agents (Gemini, GPT, Claude) in parallel using different models
   - Agents search the codebase and return structured file lists with line ranges
   - Format: `<path> (offset: N, limit: M)`
   - Uses token-efficient fast models for initial discovery

2. **Plan Phase** ([scout_plan_build.md](scout_plan_build.md)): Task planning based on scouted files
   - Takes user prompt, documentation URLs, and relevant files collection
   - Produces a detailed implementation plan

3. **Build Phase**: Executes the plan from the previous step

### Workflow Execution

The primary workflow is invoked via slash command with this structure:
```
/scout_plan_build "[user_prompt]" "[document-urls]"
```

This executes sequentially:
1. `/scout "[user_prompt]" "4"` → returns `relevant_files_collection_path`
2. `/plan_w_docs "[user_prompt]" "[docs]" "[files]"` → returns `path_to_plan`
3. `/build "[path_to_plan]"` → returns `build_report`

### Multi-Agent Orchestration

The scout phase demonstrates the parallel agent pattern:
- Uses the `Task` tool to spawn multiple agents simultaneously
- Each agent calls external agentic coding tools (gemini, claude, codex) via Bash
   - Scale parameter determines number of parallel agents (e.g., "4" = 4 agents)
   - Agents have 3-minute timeout; failures are skipped
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

- **Parallel Agent Execution**: When scouting or searching, spawn multiple agents simultaneously using different models/tools
- **Argument Quoting**: Slash command arguments must be in double quotes; nested quotes become single quotes
- **No Prompt Alteration**: Pass USER_PROMPT variables unchanged through the workflow chain
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
- [QUICK-START.md](QUICK-START.md) - 5-minute setup guide
- [TEMPLATE-SUMMARY.md](TEMPLATE-SUMMARY.md) - What's included
