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
- prisma

Workspaces:
- none detected

Source dirs:
- src

Config files:
- .env.example
- Dockerfile
- docker-compose.yml
- .github/workflows

Adaptive human docs:
- environment
- configuration
- services
- deployment
- troubleshooting
- maintenance

Operational signals:
- environment: .env.example
- configuration: Dockerfile, docker-compose.yml, .github/workflows
- services: docker-compose.yml, dependency:@supabase/supabase-js, dependency:stripe
- deployment: Dockerfile, .github/workflows, script:deploy
- troubleshooting: script:doctor, complex setup signals
- maintenance: script:migrate, script:seed

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
- data

## Validation

- test: npm test
- build: npm run build
- lint: npm run lint
- typecheck: npm run typecheck
- dev: npm run dev
- deploy: npm run deploy
- debug: not detected
- migrate: npm run migrate
- seed: npm run seed
- docs: npm run docs
- audit: npm run audit
- doctor: npm run doctor

## Update Protocol

- Behavior changes update the affected knowledge docs.
- User-facing changes update human docs when orientation, setup, or commands change.
- Environment, configuration, services, deployment, troubleshooting, and maintenance changes update affected human docs and Docs/knowledge/operations/README.md.
- Routing gaps update Docs/agent/context-map.md or Docs/agent/gaps.md.
- Route, ownership, code area, and validation changes update Docs/agent/manifest.json and route shards.
- Validation command changes update Docs/agent/validation.md and Docs/human/commands.md.
