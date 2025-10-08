description: Prepare a focused bundle of source files for deep context loading
argument-hint: [bundle-name] [file-globs]
allowed-tools: Read, Glob, Grep
model: claude-sonnet-4-5

# Load Bundle

## Purpose
Collect a curated set of files matching the provided globs and package them for downstream analysis or editing sessions.

## Workflow
1. Require both `BUNDLE_NAME` and `FILE_GLOBS`; request clarification if either is missing.
2. Resolve each glob and verify the files exist; skip binary assets.
3. Save concatenated excerpts (with clear file headers) to `ai-docs/bundles/<bundle-name>.md`.
4. Record offsets and line ranges to maintain traceability.

## Report
- Provide the bundle path and file count.
- Note any files that were skipped or truncated.
