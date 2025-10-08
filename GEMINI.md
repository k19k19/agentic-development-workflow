# GEMINI.md

## Project Overview

This repository contains a sophisticated framework for orchestrating AI agents (like Gemini, Claude, and Codex) to automate software development tasks. It's a meta-project designed to manage other code projects in a token-efficient and scalable manner. The core of the project is a set of slash commands and scripts that implement a "Reduce and Delegate" (R&D) workflow. This workflow analyzes the scale of a project (small, medium, or large) and then uses the appropriate sequence of AI agents to perform tasks like code generation, documentation, and testing.

The project is structured to support a multi-agent workflow, with different agents specializing in different tasks:

*   **Scout:** Discovers relevant files in the codebase.
*   **Plan:** Creates a plan for implementing a new feature or fixing a bug.
*   **Build:** Executes the plan, generating code and documentation.
*   **Report:** Summarizes the work that was done.



## Building and Running

This project is not a traditional application that you build and run. Instead, it's a collection of scripts and configuration files that you use to manage other projects. The main entry point for the workflow is the `scripts/detect-project-scale.js` script, which analyzes your project and recommends a workflow.

To use this framework, you would typically follow these steps:

1.  **Copy the template to your project:**
    ```bash
    cp -r agentic-development-workflow/. my-existing-project/
    ```
2.  **Customize `CLAUDE.md`:** This file serves as the "memory" for the AI agents, and you should update it with information about your project.
3.  **Run the project scale detection script:**
    ```bash
    node scripts/detect-project-scale.js
    ```
4.  **Follow the recommended workflow:** The script will recommend a slash command to run, such as `/scout_plan_build`, to start the AI-powered development workflow.

## Development Conventions

The `AGENTS.md` file provides detailed guidelines on how to use this framework. Some of the key conventions include:

*   **Directory Structure:** The project has a well-defined directory structure that separates configuration files, AI-generated documents, application code, and scripts.
*   **Documentation:** The framework includes templates for creating feature specifications, architecture documents, and other important documentation.

*   **Commits and Pull Requests:** The `AGENTS.md` file provides guidelines on how to write commit messages and pull requests that are easy for both humans and AI agents to understand.
