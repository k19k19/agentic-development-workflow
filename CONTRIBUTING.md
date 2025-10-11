# Contributing

Welcome to the project! These notes capture the day-to-day expectations for exploring the codebase and keeping the documentation ecosystem healthy.

## Search workflow

- Use `rg` (ripgrep) for code and docs: it is available in CI images and significantly faster than `grep`.
- Add temporary type filters when searching across mixed assets:\
  `rg --type-add 'docs:*.md' --type docs "<pattern>" app app-docs`
- Cap results when exploring large payloads (protocol specs, sample data) so previews stay responsive:\
  `rg --max-filesize 5M "<pattern>" data app-docs`
- Combine filename globs (`rg -g '*.sql' "<pattern>" scripts/migrations`) or JSON querying (`jq`, `rg '"fieldName"' data/`) when dealing with generated data.

## Documentation lifecycle

- Feature specs live in `app-docs/specs`. Track them through three folders:
  - `active/` – in-flight designs and open questions.
  - `reference/` – agreed, current behaviour (always include `status`, `version`, and `supersedes` metadata at the top of the file).
  - `archive/` – superseded specs with a short closure note.
- Update the index at `app-docs/specs/README.md` whenever a spec moves between states so readers can find the canonical source quickly.
- Reflect architecture or process decisions in the knowledge ledger (see `app-docs/knowledge-ledger`) during the same pull request that implements them.

Thanks for keeping search discipline tight and the documentation traceable—future contributors depend on it.
