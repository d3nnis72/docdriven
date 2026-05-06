# Tests

This repository validates skills through fixture projects and deterministic helper scripts.

Validation targets:

- generated repo-local skill exists
- generated `Docs/` tree matches DocDriven structure
- `context-map.md` has required columns
- `manifest.json` exists and parses
- route shards exist and parse
- route IDs are unique
- route doc paths resolve
- route code areas resolve or are explicitly unknown
- context map route IDs match route shards
- placeholder scaffold text is detected
- audit reports missing files, oversized docs, and invalid route tables
- skills can be listed or installed by `npx skills`

Fixture docs may intentionally contain scaffold warnings. Audit errors should be
treated as failures.
