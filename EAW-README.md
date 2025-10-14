# Evolving Agentic Workspace (EAW)

This workspace helps you and your AI assistant build software together. It starts simple and adds structure only when you need it, keeping your workflow clean, traceable, and efficient.

There is only one command to remember: `/agent`.

---

## The Core Loop: A Conversation

1.  **Start a Task:** Begin every new piece of work with `/agent start "<your task description>"`.
    -   The agent will ask a few questions to understand the scope (e.g., "Is this a new feature, a bug fix, or research?").
    -   Based on your answers, it creates a simple task directory: `workspace/tasks/TASK-001-user-login`.

2.  **Work on the Task:** Inside the task, use sub-commands. The agent will always suggest the next logical step.
    -   `/agent plan` → Create a technical plan.
    -   `/agent code` → Write or modify code based on the plan.
    -   `/agent test` → Write and run tests.
    -   `/agent review` → Analyze the code for quality and suggest improvements.

3.  **Get Help:** If you're ever unsure, just ask.
    -   `/agent help` → Shows available commands in your current context.
    -   `/agent status` → Provides a summary of the current task.

4.  **Finish a Task:** Once work is complete, close it out.
    -   `/agent finish` → The agent will ask for a one-sentence summary of the outcome. This summary is logged in a central `CHANGELOG.md` for project-wide visibility. The task is then archived.

---

## How It Works: The Evolving Structure

The EAW avoids rigid, upfront scaffolding. The structure grows with your needs.

### 1. The Workspace

All work lives in a single top-level `workspace/` directory.

-   `workspace/tasks/` → Contains all active work. Each task gets its own folder (e.g., `TASK-003-fix-auth-bug`).
-   `workspace/archive/` → Completed or abandoned tasks are moved here for a clean work queue.
-   `workspace/knowledge/` → Key decisions, architectural principles, and important discoveries are automatically promoted here from successful tasks. This is your project's long-term memory.
-   `CHANGELOG.md` → A single, human-readable log of all completed tasks.

### 2. The Task Lifecycle

A task's internal structure depends on its complexity.

**A. Simple Task (e.g., a bug fix):**
A simple task might only contain a few files.

```
workspace/tasks/TASK-003-fix-auth-bug/
├── task.md         # The initial goal and final outcome
└── session.log     # A transcript of the work
```

**B. Complex Task (e.g., a new feature):**
For larger tasks, the agent will suggest creating sub-directories as needed. You never have to create these manually.

-   **Agent:** "This plan is getting complex. Should I break it out into a `plan/` directory?"
-   **You:** "Yes"

A complex task might evolve to look like this:

```
workspace/tasks/TASK-001-user-login/
├── task.md             # The evolving spec and acceptance criteria
├── session.log         # Transcript of all commands and decisions
├── plan/               # Automatically created for complex plans
│   ├── 01_database_schema.md
│   └── 02_api_endpoints.md
├── discovery/          # Automatically created for research artifacts
│   └── jwt_library_comparison.md
└── .context            # A hidden file with task metadata for the agent
```

### 3. The Knowledge Base

You don't manage a knowledge ledger manually. When you finish a task, the agent asks:

> "Were there any key decisions or learnings from this task that the team should remember for the future?"

If you say "yes" and provide a summary, the agent creates a new, permanent file in `workspace/knowledge/`. For example: `workspace/knowledge/K-001-use-argon2-for-password-hashing.md`. This makes knowledge capture a natural part of the workflow, not a separate chore.

---

## Getting Started

1.  Copy the `workspace/` and `.agent/` directories into your project.
2.  Add `workspace/` to your `.gitignore`.
3.  Start your first task: `/agent start "Set up initial project structure"`.

The system is designed to be self-explanatory. The agent will guide you at every step.
