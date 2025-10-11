# Budget Agentic Workflow MCP Integration Review

## Source Observations

- Optional MCPs include Chrome DevTools for testing, Shadcn for UI components, and Firecrawl for web scraping, while Gemini and Codex are the only required servers.【/tmp/budget-agentic-workflow/README.md†L485-L502】"

- The developer memory instructs agents to fetch external documentation with Firecrawl, summarize it with Gemini, and lean on Codex for boilerplate after that research step.【/tmp/budget-agentic-workflow/USER-MEMORY-CLAUDE.md†L403-L413】

- Project memory advertises MCP configuration templates for Gemini, Codex, Chrome DevTools, Shadcn, and Firecrawl but does not bundle running servers or automation around them.【/tmp/budget-agentic-workflow/CLAUDE.md†L150-L168】

Across the repo, no slash command or workflow script hard-codes a Firecrawl or Shadcn request. Instead, those tools are optional endpoints that humans can hook up through the provided configuration templates and follow-on instructions.

## Improvements to the Earlier Summary

1. **Call out the optional nature of Firecrawl and Shadcn.** They are not wired into the workflow by default; the README lists them as add-ons and only Gemini and Codex are mandatory.
2. **Highlight the manual delegation pattern.** The user memory spells out a recommended sequence—Firecrawl to gather docs, Gemini to digest them, Codex for scaffolding—which clarifies how these MCPs fit into the human-in-the-loop process.
3. **Note the absence of direct routing logic.** Nothing in the template automatically forwards "research" tasks to Firecrawl or "UI" tasks to Shadcn; teams must follow the documented playbooks or extend the slash commands if they want automation.
4. **Mention configuration effort.** The MCP configuration templates advertised in the project memory are guidance artifacts, not running integrations. Readers should be aware they must supply server endpoints and credentials themselves.

These points make the documentation more precise about what the template provides today versus what requires additional setup or workflow discipline.
