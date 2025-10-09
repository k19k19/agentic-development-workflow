# Specifications Directory

This folder houses **human-written feature specs** created before implementation so the automation loop can plan, build, and verify accurately.

## Directory Layout
- `active/` — Specs that describe features currently in flight; only these are indexed for search.
- `archive/` — Shipped specs kept for historical context (not indexed unless restored).
- `reference/` — Evergreen templates or exemplar specs that should remain searchable.
- `README.md` — This guide.

Use `npm run manage-knowledge -- list` to inspect the current inventory.

## Workflow

### 1. Draft in `active/`
```bash
cp app-docs/specs/reference/_EXAMPLE-feature-spec.md app-docs/specs/active/round5-caching.md
vim app-docs/specs/active/round5-caching.md
```

### 2. Plan & Build
Specs in `active/` feed `/scout_plan_build`, `/quick-plan`, and related commands. Generated plans live in `ai-docs/` and are not indexed.

### 3. Archive After Ship
```bash
npm run manage-knowledge -- archive round5-caching.md
```
The helper moves the spec to `archive/` and re-runs `npm run vectorize` so search results stay focused on current work.

## Naming Convention
```
[round]-[feature-name].md        # Feature specs
bug-[id]-[description].md         # Bug fix specs
```

Examples:
- `round1-user-authentication.md`
- `round2-oauth-integration.md`
- `bug-123-login-timeout-fix.md`

## Example Structure
See `reference/_EXAMPLE-feature-spec.md` for the full template.

## Tips
1. **Be specific.** Clear requirements keep plans tight and reduce rework.
2. **Capture constraints.** Explicitly call out what must not change.
3. **Keep a checklist.** Success criteria drive report validation.
4. **Reference sources.** Link to guides, architecture notes, or external docs.

## Related Resources
- `app-docs/guides/` — Implementation and style guides.
- `app-docs/architecture/` — System diagrams and decisions.
- `app-docs/mappings/feature-to-source.md` — Trace specs to code and tests.

---
**Last Updated**: January 2026
