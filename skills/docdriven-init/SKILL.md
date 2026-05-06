---
name: docdriven-init
description: Use once in a repository to initialize Documentation Driven Development. Scans the project shape, detects stack and commands, and generates a repo-local project-docdriven skill that tells agents how to use the project-specific Docs tree.
---

# DocDriven Init

Use this skill to make a repository DocDriven-aware.

## Required Workflow

1. Inspect repository files and existing docs.
2. Run a Project Dynamics Scan.
3. Decide the docs root, defaulting to `Docs/`.
4. Generate `.agents/skills/project-docdriven/SKILL.md`.
5. Do not create the full docs tree; that belongs to `docdriven-build`.
6. Report what was detected, what is uncertain, and where the local skill was written.

## Project Dynamics Scan

Detect:

- package usage: package manager, workspaces, scripts, dependencies
- code shape: source dirs, app dirs, package dirs, tests
- runtime dynamics: config, env, CI, deployment, database or schema tools
- validation reality: actual test, build, lint, typecheck, and dev commands
- documentation fit: knowledge categories and route shards the project needs

## Generator

Prefer running `scripts/create-project-skill.mjs` instead of hand-writing the local skill.

## References

- Read `../_shared/repo-local-skill-template.md`.
- Read `../_shared/agent-operating-contract.md`.
