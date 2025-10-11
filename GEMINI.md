# Budget Agentic Workflow Project Overview

This project implements a "Budget Agentic Workflow" designed to streamline software development through AI assistance, focusing on budget-first execution and comprehensive self-documentation. It provides a structured environment for managing features, tasks, and knowledge, ensuring that development processes are transparent, traceable, and efficient.

## Key Features:
*   **Agentic Development:** Utilizes AI agents (like Gemini, and previously Claude) to assist with various development phases (scouting, planning, building, testing).
*   **Workflow Tracking:** Tracks the status and progress of features through different development phases, aggregating information into a central index.
*   **Knowledge Ledger:** Maintains a "constitution-style" knowledge ledger to document key decisions, their rationale, and implementation details, preventing loss of context and ensuring consistency.
*   **Task Management:** Defines and manages actionable tasks, often linked to specific AI commands, with estimated token usage for budget awareness.
*   **Unified Dashboard:** Provides a concise overview of in-flight features, their status, and next steps.
*   **Code Quality:** Enforces coding standards using ESLint and Prettier.

## Technologies Used:
*   **Node.js:** The primary runtime environment for the project's scripts and utilities.
*   **npm:** Package manager for project dependencies.
*   **ESLint:** For static code analysis and enforcing coding style.
*   **Prettier:** For consistent code formatting.
*   **@xenova/transformers:** Likely used for AI/ML model inference, possibly for natural language processing or code generation tasks.
*   **gemini-mcp-tool:** Indicates integration with Gemini-specific tools or APIs, leveraging Gemini's capabilities within the workflow.

## Project Structure:
*   `.claude/`: Contains slash commands and hooks for AI agent interaction.
*   `ai-docs/`: Stores auto-generated plans, build artifacts, session logs, and workflow status history. This includes the `workflow/status-index.json` (central workflow status) and `workflow/tasks.json` (defined tasks).
*   `app-docs/`: Houses application-specific documentation, including specs, guides, and architecture notes.
*   `scripts/`: Contains Node.js utilities that power the workflow, such as `workflow-status.js` (for syncing status) and `unified-dashboard.js` (for displaying the dashboard).

## Building and Running:

### Initial Setup:
To set up the project, run the initialization script:
```bash
bash scripts/init-agentic-workflow.sh
```
This script copies necessary files, scaffolds directories, merges `package.json` and `.gitignore`, and installs dependencies.

### Core npm Scripts:
*   `npm run manage-knowledge -- <cmd>`: Manage entries in the knowledge ledger.
*   `npm run work`: Launch the unified feature workflow dashboard.
*   `npm run tasks:session-start`: Summarize cross-session context and next tasks.
*   `npm run workflow:sync`: Aggregate the latest command outputs and update the workflow status index (`ai-docs/workflow/status-index.json`).
*   `npm run lint`: Run ESLint to check for code style violations.
*   `npm run lint:fix`: Automatically fix ESLint issues.
*   `npm run format`: Format code using Prettier.

### Daily Workflow Loop:
1.  Execute a relevant slash command (e.g., `/scout`, `/plan`, `/build`, `/report_failure`).
2.  Update documentation or specs in `app-docs/` as needed.
3.  Run `npm run workflow:sync` to update the aggregated status.
4.  Review the dashboard with `npm run work`.
5.  After a build, run `/test` and follow prompts.

## Development Conventions:

### Code Style and Formatting:
*   **ESLint:** Used for linting with recommended JavaScript configurations. It ignores `node_modules/`, `ai-docs/`, and `eslint.config.mjs`.
*   **Prettier:** Configured for consistent code formatting:
    *   `semi: true`
    *   `trailingComma: "all"`
    *   `singleQuote: true`
    *   `printWidth: 80`
    *   `tabWidth: 2`

### Knowledge Management:
*   Decisions and their rationales are documented in the knowledge ledger (`ai-docs/knowledge-ledger/`). New decisions should follow the `KL-XXX` format and be integrated into `ai-docs/knowledge-ledger/ledger.md`.

This `GEMINI.md` serves as a comprehensive guide to understanding and interacting with the Budget Agentic Workflow project.
