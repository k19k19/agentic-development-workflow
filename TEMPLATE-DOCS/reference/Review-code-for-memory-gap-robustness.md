# Budget Agentic Workflow – Knowledge Ledger Specification

## Context

The budget workflow keeps learning from previous delivery attempts, but each iteration currently copies an entire documentation set, patches it, and re-indexes memory. After a few cycles there is no canonical reference that explains which fixes actually shipped, what was rejected, or how the live implementation diverges from prior drafts. Agents only see the latest directory snapshot, so historical gaps resurface and regressions slip back in.

## Goal

Create a durable "knowledge ledger" that records every accepted change alongside the reason it became the new source of truth. The ledger acts like a constitution: drafts may be proposed many times, but only adopted articles feed the memory index and agent prompts. Future iterations must either amend an existing article or add a superseding entry, keeping the lineage explicit.

## Data Model

Each knowledge article is a Markdown file with frontmatter stored under `docs/knowledge-ledger/`:

```markdown
---
id: kb-2024-09-18-summarize-transactions
status: adopted # proposed | adopted | superseded
replaces: kb-2024-07-01-summarize-transactions
owner: data-platform
context:
  initiative: budget-agentic-workflow
  version: v3
links:
  pr: https://github.com/k19k19/budget-agentic-workflow/pull/42
  incident: INC-2024-143
---

## Summary
Explain the change, the motivating gap, and the acceptance criteria.

## Implementation Notes
Detail how the workflow, scripts, prompts, or infrastructure were updated.

## Validation
Document the tests, manual checks, or metrics that prove the change works.

## Future Work
Describe known follow-ups so they are not lost in the next iteration.
```

Key properties:

- **Stable IDs** – frontmatter `id` is immutable and follows `kb-YYYY-MM-DD-slug` to encode chronology.
- **Lifecycle states** – `status` tracks where the article sits in the legislative flow. Only `adopted` (and optionally `superseded`) articles are indexed for memory.
- **Explicit lineage** – `replaces` or `supersedes` chains connect amendments so agents can follow the complete evolution.
- **Link anchors** – `links` capture PRs, incidents, or design docs so context is never lost.

## Workflow Changes

1. **Authoring** – When a change is proposed, add a `proposed` article describing the intended behavior. During review, evolve the same file instead of copying entire doc trees. Once shipped, flip `status` to `adopted` and append validation evidence.
2. **Amendments** – To modify existing behavior, create a new article referencing the previous `id` in `replaces`. The old article becomes `superseded`. This preserves history without deleting context.
3. **Indexing** – Update `scripts/vectorize-docs.js` to scan `docs/knowledge-ledger/**/*.md`, parse frontmatter, and only feed `status: adopted` and `status: superseded` articles into embeddings. Combine them with current active specs so agents see both the live rules and deprecation notices.
4. **Manifest Sync** – Extend the proposed integrity manifest to include the ledger directory. The manifest should store the `id`, `status`, hash, and `replaces` linkage so we can audit continuity.
5. **Validation Command** – Add `npm run knowledge:validate` that ensures:
   - every article has a unique `id` and valid `status`
   - `replaces` references resolve to existing articles
   - superseded articles are not marked as adopted simultaneously
   - required sections (`Summary`, `Implementation Notes`, `Validation`) are populated
6. **CI Policy** – Block merges when `knowledge:validate` fails or when a PR modifies workflow code without touching at least one ledger article. This enforces the single source of truth discipline.

## Memory Integration

- **Prompt Conditioning** – Update agent prompts to cite the ledger: "Consult the knowledge ledger for adopted articles related to the current spec. Summarize the latest adopted article before proposing new steps." This ensures reasoning is grounded in the canonical law before drafting new plans.
- **Retrieval Priority** – Tag ledger embeddings with `docType=ledger` and boost them in search results. When the agent asks "How do we handle transaction normalization?" it first retrieves the adopted ledger article, not the obsolete proposal.
- **Diff Aware Responses** – When a superseding article exists, retrieval should surface both the new and prior entries so the agent can compare what changed. This guards against re-introducing deprecated behavior.

## Long-Term Stewardship

- **Quarterly Summaries** – Generate a quarterly digest (Markdown or Notion export) that lists new adopted articles and superseded ones. Link it in the README so humans can review knowledge drift.
- **Backfill Plan** – Migrate existing documentation by extracting the final decision from each iteration and backfilling ledger articles retroactively. Mark ambiguous cases as `proposed` until a maintainer confirms the canonical outcome.
- **Ownership** – Assign a "knowledge steward" rotation responsible for approving ledger changes and running `knowledge:validate`. The steward ensures that the workflow never ships code without an adopted article explaining the why/how.

Institutionalizing the ledger keeps every iteration tethered to a vetted, versioned body of knowledge. Agents gain a dependable constitution to reference, preventing regressions and guaranteeing that past lessons remain accessible even as the documentation tree evolves.
