---
name: docdriven-build
description: Use after docdriven-init to create the initial DocDriven documentation tree for a repository. Builds human, agent, knowledge, and tmp docs using the generated project-docdriven skill as the project contract.
---

# DocDriven Build

Use this skill to create and adapt the initial `Docs/` structure.

## Required Workflow

1. Read the repo-local `project-docdriven` skill if present.
2. Read `Docs/agent/init-scan.md` if present.
3. Inspect existing docs and code structure.
4. Create missing DocDriven folders, manifest, route shards, and canonical files.
5. Fill files with concise, current, non-placeholder content.
6. Document the adaptive architecture contract: current structure, boundaries,
   structural ownership, configuration flow, and durable coding patterns.
7. Use `Docs/agent/manifest.json` as the machine route index.
8. Use `Docs/agent/context-map.md` as the readable route view.
9. Keep human docs short.
10. Keep knowledge docs canonical.
11. Keep tmp docs explicitly non-authoritative.

Generated placeholders are scaffolding only. Build is not complete until
placeholder text in human or knowledge docs is replaced or recorded as a gap.

## Dynamic Build

The generated tree is only a base scaffold. Adapt it to the repository before
calling the build complete.

- Keep the smallest useful docs surface.
- Remove or leave uncreated docs for concepts the project does not have.
- Create project-specific docs when humans or agents have distinct tasks.
- Split knowledge docs or route shards when it reduces context or clarifies ownership.
- Record uncertain docs, missing owners, and unresolved setup facts in `Docs/agent/gaps.md`.
- Do not turn the scaffold into a mandatory architecture.
- Make future agents follow project-specific style and structure instead of hardcoding generic preferences.

## Generator

Prefer `scripts/create-docs-tree.mjs` for the base scaffold, then edit content
and structure manually to match the project.

## References

- Read `../_shared/docs-tree-template.md`.
- Read `../_shared/writing-style.md`.
- Read `../_shared/agent-operating-contract.md`.
