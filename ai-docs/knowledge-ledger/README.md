# Knowledge Ledger

This directory holds the governance records that anchor every implementation decision. Treat it as the project's constitution: ideas start as proposals, but only adopted entries in `ledger.md` become the single source of truth for why and how something exists.

## How the ledger works

1. **Draft a proposal** by copying `template.md` into a new file named `KL-XYZ-descriptive-title.md`. Capture the problem, options, chosen approach, and implementation details.
2. **Review and adopt** the proposal. Once the work ships, update the entry's front matter `status` to `adopted`, record the adoption date, and document any follow-on tasks.
3. **Record the decision** in `ledger.md`. Add a concise summary under the appropriate section so future iterations inherit the context, constraints, and rationale.
4. **Supersede carefully.** When replacing a decision, create a new entry that lists the old `KL-` identifier in `replaces`, describe what changed, and move the superseded summary into the ledger's history section.

Keeping this loop tight ensures later versions build on prior knowledge instead of quietly discarding it.

## Workflow integration

Running `npm run baw:workflow:sync` now ingests `ledger.md` and surfaces adopted decisions alongside the feature dashboard. The
aggregated status index records every adopted `KL-` entry so the unified dashboard can highlight the most recent "laws of the
project" next to active work in flight.

## Files

- `ledger.md` – Canonical index of every adopted decision, including rationale and implementation notes.
- `template.md` – Starter content for new `KL-` entries.
- `KL-*.md` – Individual decisions, proposals, and amendments.
