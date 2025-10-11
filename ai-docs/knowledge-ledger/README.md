# Knowledge Ledger

## Purpose

The Knowledge Ledger preserves historical context, tracks why decisions were made, and prevents regression to previously rejected approaches.

## Problem Solved

Without a knowledge ledger:
- **No Version History**: Can't see why we chose approach A over approach B
- **Regressions**: Agents might repeat mistakes from previous iterations
- **No Canonical Truth**: Multiple sources of truth (session summaries, specs, code comments)

## Article Schema

Each ledger article uses YAML frontmatter with the following required fields:

```yaml
---
id: KL-001                    # Unique identifier (KL-XXX format)
title: "Decision Title"       # Short, descriptive title
status: adopted               # proposed | adopted | superseded
date: 2025-10-11             # ISO date (YYYY-MM-DD)
replaces: null               # ID of article this supersedes (or null)
links: [KL-002, KL-003]      # Related article IDs
tags: [architecture, perf]   # Categories for search
---
```

### Status Values

- **`proposed`**: Under consideration, not yet official
- **`adopted`**: Official decision, actively used
- **`superseded`**: Replaced by a newer decision (link to replacement via `replaces` field)

## Article Structure

Every ledger article must have these sections:

### 1. Summary
One paragraph explaining the decision or principle.

### 2. Rationale
Why this approach was chosen. Include:
- Alternatives considered
- Trade-offs evaluated
- Key factors in decision

### 3. Implementation
Where to find this decision in code/docs:
- File paths
- Command patterns
- Configuration locations

### 4. Validation
How we know this works:
- Test results
- Metrics
- User feedback

### 5. Future (optional)
Conditions that might trigger reconsideration.

## Usage

### Creating a New Article

1. Copy `template.md` to a new file with descriptive name
2. Assign next available ID (check existing articles)
3. Fill in frontmatter and all required sections
4. Set status to `proposed`
5. Run validation: `npm run knowledge:validate`

### Adopting a Proposal

1. Update status from `proposed` to `adopted`
2. Add adoption date
3. Run `npm run vectorize` to make searchable

### Superseding an Old Decision

1. Create new article with improved approach
2. Set old article's status to `superseded`
3. Set new article's `replaces` field to old article ID
4. Link both articles in `links` array

## Search and Retrieval

Ledger articles are indexed by the vector search system:

```bash
npm run search "workflow patterns"
```

Articles are tagged with `docType=ledger` and boosted in search rankings.

Only `adopted` and `superseded` articles are indexed (not `proposed`).

## Validation

Run validation before committing:

```bash
npm run knowledge:validate
```

Checks:
- Every article has unique ID
- Status is valid (proposed/adopted/superseded)
- `replaces` references exist
- Required sections present (Summary, Rationale, Implementation, Validation)
- Frontmatter is valid YAML
- ID format is correct (KL-XXX)

## Integration with Workflow

The `/plan` command automatically checks the knowledge ledger before proposing solutions:

```bash
npm run search "[relevant topic]"
# Check for adopted articles that inform this decision
```

This prevents re-proposing rejected approaches and builds on established patterns.

## Example Workflow

### Scenario: Proposing a New Approach

1. Research existing ledger articles
2. Create new article with `status: proposed`
3. Discuss with team
4. If approved, update to `status: adopted`
5. Run `npm run vectorize`

### Scenario: Changing an Established Pattern

1. Create new article with improved approach
2. Reference old article in `replaces` field
3. Update old article to `status: superseded`
4. Document why the change was needed in Rationale section
5. Run `npm run vectorize`

## Benefits

- **Prevents Regressions**: Agents can check if an approach was already rejected
- **Preserves Context**: Why decisions were made is explicit, not implicit
- **Enables Learning**: New team members see decision history
- **Improves Search**: Vector search finds relevant architectural decisions
- **Validates Consistency**: Validation ensures ledger stays healthy

## Maintenance

- Review `proposed` articles monthly
- Archive `superseded` articles after 6 months (move to `archive/`)
- Update links when articles are superseded
- Keep tags consistent across related articles

---

**See Also**:
- `template.md` - Article template
- `scripts/validate-knowledge.js` - Validation script
- `TEMPLATE-DOCS/reference/CROSS-SESSION-GUIDE.md` - Cross-session workflows
