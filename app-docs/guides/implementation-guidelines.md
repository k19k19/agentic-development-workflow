# AI Implementation Guidelines

This document contains the global rules for the AI agents working on this project. These rules are designed to ensure consistency, efficiency, and quality.

## Core Principles

- **R&D Framework (Reduce and Delegate):** Use token-efficient models for discovery and boilerplate, and delegate to specialized tools (Gemini, Codex, Chrome DevTools). Reserve Claude for complex logic and architecture.
- **Structured Knowledge:** All project knowledge should be stored in the `app-docs/` directory in a structured and hierarchical manner.
- **Retrieval-Based Context:** The AI should rely on targeted retrieval from the knowledge base rather than the limited context window.

## Mandatory Protocols

- **Pre-Implementation Protocol:** Before any code changes, the AI must read the relevant project documentation, check for existing patterns, and confirm its approach with the user.
- **Post-Task Update:** After every successful implementation, the AI must update the relevant documentation, including code mappings and new patterns.

## Token-Saving Rules

- **Delegate Documentation Reading:** Use cheaper tools (like Gemini MCP) to summarize or read documentation and specs.
- **Avoid Directory Reading:** The AI should never read an entire directory. It must rely on the scouting phase and the `feature-to-source.md` mapping file to find the minimal required context.
