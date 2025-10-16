---
description: Design provider-facing workflows and administrative functions
argument-hint: [product_title] [context_docs]
allowed-tools: ["mcp__gemini-cli__ask-gemini", "Read", "Edit", "Glob", "Grep", "MultiEdit", "Bash"]
model: claude-sonnet-4-5
---

# /baw_provider_functions

## Purpose
Describe the functional interface and operational capabilities required by providers or administrators to manage the product effectively.

## Variables
PRODUCT_TITLE: $1
CONTEXT_DOCS: $2
FEATURE_WORKSPACE_ROOT: ai-docs/capabilities/
PROVIDER_INTAKE_DIRECTORY: <feature-workspace>/intake/personas/provider/
WORKFLOW_LOG_DIRECTORY: <feature-workspace>/workflow/

## Instructions
- Review personas, product charter, and feature catalog stored in the capability workspace to understand provider needs.
- Ensure `PROVIDER_INTAKE_DIRECTORY` exists within the capability workspace (create it when absent).
- Use Gemini MCP to map provider journeys, permissions, and data requirements.
- Identify required tooling (dashboards, bulk actions, reporting) and integration points with developer workflows.
- Save the provider playbook to `PROVIDER_INTAKE_DIRECTORY/<ISO-timestamp>-provider-functions.md` (append if updating).
- Flag missing specifications or operational policies.

## Workflow
1. Aggregate provider-related context from docs and prior research.
2. Outline core provider journeys and tasks.
3. Detail functional requirements, edge cases, and auditing/analytics needs.
4. Highlight dependencies on backend services, data pipelines, or support processes.
5. Recommend follow-up commands for task preparation or support enablement.

## Report
- Provide structured sections covering workflows, permissions, data models, and operational KPIs.
- Include a backlog of implementation tasks or support policies that must be created.
- Reference the saved workspace path and suggest documentation locations (e.g., `app-docs/guides/provider/`).

## Automation Trace
- Emit status JSON with `phase: "provider-functions"` to `WORKFLOW_LOG_DIRECTORY/<ISO-timestamp>-provider-functions.json`.
- Use `status` values `completed`, `needs_docs`, or `blocked`.
- Set `nextCommand` to `/baw_dev_execution_prep`, `/baw_workflow_radar`, or `/baw_support_ticket`.
- Attach the saved provider doc path under `outputPath` and remind the user to run `npm run baw:workflow:sync` after docs are updated.

## Next Steps
- `/baw_dev_execution_prep "<provider-feature>"`
- `/baw_support_ticket "<support-area>"`
