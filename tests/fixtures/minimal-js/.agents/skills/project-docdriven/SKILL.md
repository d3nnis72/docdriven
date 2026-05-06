---
name: project-docdriven
description: Use when working in this repository. Reads the project DocDriven context map before code changes and keeps Docs aligned with implementation.
---

# Project DocDriven

## Project Shape

- Stack: JavaScript/Node.js
- Package manager: npm
- Docs root: Docs/

## Project Dynamics

Frameworks:
- none detected

Workspaces:
- none detected

Source dirs:
- src

Config files:
- none detected

## Required Workflow

1. Read Docs/agent/manifest.json if present.
2. Load the smallest matching route shard.
3. Read route `readFirst` docs.
4. Inspect route `codeAreas`.
5. Update `updateDocs` and route shards after meaningful changes.
6. Run route validation.
7. Record gaps in Docs/agent/gaps.md.

## Knowledge Categories

- architecture
- features
- interfaces
- operations

## Validation

- test: npm test
- build: npm run build
- lint: not detected
- typecheck: not detected
- dev: not detected

## Update Protocol

- Behavior changes update the affected knowledge docs.
- User-facing changes update human docs when orientation, setup, or commands change.
- Routing gaps update Docs/agent/context-map.md or Docs/agent/gaps.md.
- Route, ownership, code area, and validation changes update Docs/agent/manifest.json and route shards.
- Validation command changes update Docs/agent/validation.md and Docs/human/commands.md.
