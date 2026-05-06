---
name: docdriven
description: Use when working in a Documentation Driven Development project or when creating, changing, or maintaining docs-driven architecture, implementation, or project documentation. Enforces read-before-change, update-after-change, one canonical explanation per concept, and separate human, agent, knowledge, and tmp documentation surfaces.
---

# DocDriven

DocDriven is Documentation Driven Development for agents and humans.

## Required Workflow

1. Check whether the project has a repo-local DocDriven skill.
2. If it exists, read it before continuing.
3. Read `Docs/agent/manifest.json` when present.
4. Load only the smallest relevant route shard.
5. Read the route's `readFirst` docs.
6. Inspect the route's `codeAreas`.
7. Change code and docs together.
8. Update route shards when ownership, validation, or structure changes.
9. Record unknowns in `Docs/agent/gaps.md`.
10. Run validation from the route or `Docs/agent/validation.md`.

## Core Rules

- Code and checks prove truth.
- `Docs/knowledge/` explains current truth.
- `Docs/human/` summarizes for people.
- `Docs/agent/` routes agents.
- `Docs/tmp/` is temporary and not truth.
- Do not duplicate canonical content.
- Link instead of copying.

## Meaningful Changes

Update docs for behavior, public interface, config, environment, deployment,
dependency, package-script, schema, migration, architecture, ownership, and
validation changes.

## Stale Or Missing Docs

- If docs contradict code, inspect code and update docs.
- If truth cannot be verified, record uncertainty in `Docs/agent/gaps.md`.
- If no route matches, update the route graph or record the gap.
- Missing documentation is part of the task.

## Completion Evidence

When finishing DocDriven work, report:

- Docs read
- Routes used
- Code changed
- Docs updated
- Validation run
- Gaps recorded

## References

- Read `../_shared/docdriven-structure.md` for the default documentation model.
- Read `../_shared/agent-operating-contract.md` for route-table requirements.
- Read `../_shared/writing-style.md` before writing or editing docs.
