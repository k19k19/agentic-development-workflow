# GEMINI.md

This file provides a comprehensive overview of the "Budget Agentic Workflow" project, designed to be used as a primary context for Gemini.

## Project Overview

This project is a template for a budget-conscious AI-powered development workflow. It enables solo developers to tackle large-scale projects by intelligently delegating tasks to different AI models (Claude, Gemini, Codex) to optimize for cost and efficiency. The workflow is orchestrated through a system of "slash commands" interpreted by the AI.

The core philosophy is "Reduce and Delegate":
*   **Reduce:** Use token-efficient models (Gemini, Codex) for simpler tasks like documentation, boilerplate code, and syntax fixes.
*   **Delegate:** Use a powerful model (Claude) for complex tasks like architecture, complex logic, and orchestration.

This hybrid approach aims to provide a 40-60% token savings compared to using a single powerful model for all tasks.

## Building and Running

This is a Node.js project. The key commands are defined in `package.json`:

*   **Installation:**
    ```bash
    npm install
    ```
*   **Testing:**
    ```bash
    npm test
    ```
*   **Linting:**
    ```bash
    npm run lint
    ```
*   **Formatting:**
    ```bash
    npm run format
    ```
*   **Vectorizing Documents:** (For semantic search)
    ```bash
    npm run vectorize
    ```
*   **Searching Documents:**
    ```bash
    npm run search "<query>"
    ```
*   **Task Management:**
    ```bash
    npm run tasks -- <command>
    ```
    (e.g., `npm run tasks -- list`, `npm run tasks -- add "New Feature" "Description" medium high`)

## Development Conventions

*   **Coding Style:** The project uses ESLint and Prettier for code formatting and style enforcement.
*   **Testing:** The project has a test suite that can be run with `npm test`.
*   **AI Agent Interaction:** The primary interaction with the AI is through "slash commands" which are defined in the `.claude/commands` directory. These commands are not executable scripts but rather markdown instruction files that the AI interprets.

## Key Files

*   **`README.md`:** The main entry point for understanding the project, its philosophy, and how to use it.
*   **`package.json`:** Defines the project's dependencies, scripts, and metadata.
*   **`GEMINI.md`:** (This file) The primary context for the Gemini AI agent.
*   **`.claude/`:** Contains the configuration and commands for the Claude AI agent.
*   **`scripts/`:** Contains various Node.js scripts for managing the workflow, such as vectorizing documents, managing tasks, and running tests.
*   **`ai-docs/`:**  A directory for the AI to store its generated documents, plans, and reports.
*   **`app-docs/`:**  A directory for application-specific documentation, including architecture, guides, and specifications.
*   **`TEMPLATE-DOCS/`:** Contains the documentation for the agentic workflow template itself.

## Workflow

The development workflow is divided into several phases, orchestrated by slash commands:

1.  **`start`:** Initializes a clean environment for a new feature.
2.  **`scout`:** Uses vector search to find relevant files for a given task.
3.  **`plan`:** The AI creates an implementation plan, which requires user approval.
4.  **`build`:** The AI executes the plan, delegating tasks to different models as needed.
5.  **`test`:** Runs the test suite to verify the changes.
6.  **`finalize`:** Generates documentation and updates trackers.
7.  **`release`:** Deploys the changes to production.

There are also "budget shortcuts" like `/quick` and `/scout_build` for smaller, less complex tasks.

## Tool Delegation

The project uses a "Tool Delegation Matrix" to decide which AI model to use for a given task:

| Task Type                 | Tool        |
| ------------------------- | ----------- |
| Read/summarize docs       | Gemini MCP  |
| Generate boilerplate      | Codex MCP   |
| Fix syntax bugs           | Codex MCP   |
| Build UI components       | Codex MCP   |
| Complex debugging         | Claude      |
| Architectural decisions   | Claude      |
| Security/performance review | Claude      |
| E2E testing               | Chrome DevTools MCP |

## Memory Management

The system has a sophisticated memory management system to maintain context across sessions:

*   **Session Notes:** Automatic session summaries are generated and stored in `ai-docs/sessions/`.
*   **Vector Store:** Semantic search is used to find relevant information across all documentation. The `npm run vectorize` command is used to update the vector store.
*   **Task Management:** A task management system is used to track pending work, pause and resume tasks, and manage the token budget.
*   **Lifecycle-based Spec Management:** Specs are moved from `active` to `archive` to keep the vector search focused on current work.
