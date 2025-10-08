description: Enumerate every available tool and capability for quick reference
argument-hint: []
model: claude-sonnet-4-5

# All Tools Overview

## Purpose
Summarize the currently registered tools so agents can choose the appropriate delegation path without trial and error.

## Workflow
1. Call the Tooling API to list all registered tools and their capabilities.
2. Group tools by domain (code editing, shell, HTTP, MCP connectors, analytics, testing).
3. Note authentication or configuration prerequisites (API keys, env variables, sandbox constraints).
4. Produce a markdown summary that future agents can scan before delegating work.

## Report
- Provide the grouped tool list with one-line descriptions.
- Highlight any tools that are disabled or require manual setup.
