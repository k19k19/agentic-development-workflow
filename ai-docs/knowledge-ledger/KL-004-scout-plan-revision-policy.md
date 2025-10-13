# KL-004 — Scout-to-Plan Revision Policy

- **Status:** Adopted
- **Adopted on:** 2024-05-07
- **Linked Artifacts:**
  - `CLAUDE.md`
  - `app-docs/guides/large-feature-workflow.md`
  - `ai-docs/workflow/features/README.md`
  - `ai-docs/workflow/features/_template/plans/README.md`

## Problem

Early runs of `/baw:scout` routinely discovered new requirements after an initial plan slice had already been created. Agents reacted by scaffolding duplicate features or creating parallel plan files, fragmenting the backlog and breaking traceability between scouting, planning, and implementation.

## Decision

All `/baw:scout` refinements must update the existing feature workspace:

1. Append clarifications and research directly to the in-flight `plans/<timestamp>-*/plan.md` file.
2. Update the corresponding row in `plans/checklist.json` with the new context or acceptance criteria.
3. Track open questions inside `sessions/session-backlog.json` so the next session continues refining the same slice.
4. Only generate a replacement plan document if the slice is intentionally superseded; record that supersession inside the checklist.

## Rationale

Keeping the scout→plan loop scoped to a single plan slice preserves context, prevents token waste on duplicate scaffolding, and keeps dashboards aligned with real progress. The policy also simplifies multi-session hand-offs because every revision funnels through the same artifacts.

## Implementation

- Added a "Scout-to-Plan Feedback Loop" section to `CLAUDE.md` so agents treat `/baw:scout` revisions as updates, not new features.
- Documented the revision workflow in the Large Feature Delivery Playbook and feature directory README so humans and automation share the same expectations.
- Updated the feature template's `plans/README.md` with explicit instructions for recording revisions in-place.
