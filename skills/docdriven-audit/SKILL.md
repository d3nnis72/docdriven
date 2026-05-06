---
name: docdriven-audit
description: Use to audit a DocDriven project for stale docs, missing routes, duplicate truth, invalid context maps, oversized files, tmp content that should be promoted, and weak validation evidence.
---

# DocDriven Audit

Use this skill to check documentation drift and maintainability.

## Required Workflow

1. Read the repo-local `project-docdriven` skill if present.
2. Read `Docs/agent/manifest.json`.
3. Load route shards listed by the manifest.
4. Run deterministic checks with `scripts/audit-docdriven.mjs` when possible.
5. Inspect reported gaps manually.
6. Report findings by severity.
7. Update docs only when asked.

Audit checks the route graph, referenced docs, referenced code areas, validation
evidence, placeholder text, oversized shards, orphan knowledge docs, tmp
content, and context-map drift.

## References

- Read `../_shared/audit-checklist.md`.
- Read `../_shared/agent-operating-contract.md`.
