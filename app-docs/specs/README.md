# Specification Index

This folder keeps product and technical specifications traceable throughout their lifecycle. Each spec moves through the **active → reference → archive** pipeline; the goal is to ensure that anyone can find the current source of truth and understand what changed over time.

## Folder layout

- `active/` — Drafts, explorations, and in-progress design decisions. These documents may contain open questions or TODOs and should identify a current owner.
- `reference/` — Canonical behaviour. Files in this folder must open with a short metadata header:

  ```
  ---
  status: reference
  version: 2024-10-12
  owner: name or team
  supersedes: path/to/previous-spec.md
  ---
  ```

  Adjust `supersedes` (or set to `null`) as appropriate; this metadata helps automation and readers.

- `archive/` — Superseded specs. Start each file with a closure note that links to the replacement reference doc and outlines why the previous approach was sunset.

## Maintaining the index

Keep the table below in sync with every spec move. Add a link in the **Spec Path** column using workspace-relative paths, and include the merge request or issue that introduced the change for quick traceability.

| Feature / Domain | Status | Owner | Spec Path | Last Updated | Replaces / Notes |
| ---------------- | ------ | ----- | --------- | ------------ | ---------------- |
| _example_ | reference | _tbd_ | `[reference/example.md](reference/example.md)` | 2024-10-12 | Replaces `[archive/example-v1.md](archive/example-v1.md)` |

When archiving a spec:

1. Move the file into `archive/`.
2. Add a short “Change log” paragraph to the archived document.
3. Update this table to point to the new reference doc.

When promoting an active spec to reference:

1. Update the metadata header (`status`, `version`, `supersedes`).
2. Create or update automated checks to reflect the agreed behaviour, where practical.
3. Review related documentation (READMEs, runbooks, knowledge ledger entries) so the wider ecosystem remains aligned.

## Automation hooks

- Add a TODO to wire this index into CI (e.g. linting that ensures the metadata header exists).
- Consider adding a small script under `scripts/maintenance/` to verify that every `reference/` spec has a companion knowledge-ledger entry.

Thank you for keeping specifications current—clear documentation saves hours of rediscovery during future phases.
