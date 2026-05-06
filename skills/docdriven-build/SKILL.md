---
name: docdriven-build
description: Use after docdriven-init to create the initial DocDriven documentation tree for a repository. Builds human, agent, knowledge, and tmp docs using the generated project-docdriven skill as the project contract.
---

# DocDriven Build

Use this skill to create the initial `Docs/` structure.

## Required Workflow

1. Read the repo-local `project-docdriven` skill if present.
2. Read `Docs/agent/init-scan.md` if present.
3. Inspect existing docs and code structure.
4. Create missing DocDriven folders, manifest, route shards, and canonical files.
5. Fill files with concise, current, non-placeholder content.
6. Use `Docs/agent/manifest.json` as the machine route index.
7. Use `Docs/agent/context-map.md` as the readable route view.
8. Keep human docs short.
9. Keep knowledge docs canonical.
10. Keep tmp docs explicitly non-authoritative.

Generated placeholders are scaffolding only. Build is not complete until
placeholder text in human or knowledge docs is replaced or recorded as a gap.

## Generator

Prefer `scripts/create-docs-tree.mjs` for the base tree, then edit content manually.

## References

- Read `../_shared/docs-tree-template.md`.
- Read `../_shared/writing-style.md`.
- Read `../_shared/agent-operating-contract.md`.
