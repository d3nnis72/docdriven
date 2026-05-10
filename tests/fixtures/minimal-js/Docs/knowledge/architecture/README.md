# Architecture

Architecture docs describe how this project is actually structured. They are an adaptive contract for long-term project continuity, not a generic folder template.

## Adaptive Architecture Contract

Document current system shape, boundaries, dependency direction, runtime flow, and cross-cutting patterns. Add, split, rename, or consolidate docs and code areas only when repository evidence shows stable responsibility, repeated patterns, dependency boundaries, configuration rules, shared contracts, or validation needs.

Do not invent a standard structure because an agent prefers it.

## Project Continuity Rules

- Follow project docs, nearby code, formatter, linter, and validation commands before applying generic agent taste.
- Prefer long-term project consistency over local convenience.
- New durable conventions require docs and route updates.
- If the convention is unclear, record a gap instead of silently starting a new pattern.

## Structural Ownership

Document where authoritative code contracts and structural concepts live: configuration modules, API contracts, schemas, domain models, provider adapters, shared utilities, generated code, and package boundaries.

Do not copy type, schema, or interface definitions into docs. Explain where authoritative code lives, which module owns it, how consumers access it, and when changes require docs or route updates.

## Configuration First

Runtime configuration should be discoverable through documented project paths. Avoid hardcoded URLs, provider IDs, secrets, feature flags, limits, and other runtime settings in feature code when the project has or needs a config flow.

Document where configuration is loaded, validated, typed if applicable, and overridden by environment or deployment settings. Detailed operational setup belongs in `../operations/README.md` or a routed operations doc.

## Current Structure

Replace this section with verified project structure after inspecting the repository.

## Boundaries And Dependency Direction

Record allowed dependency direction and import boundaries when verified.

## Coding Patterns

Record durable coding patterns that future agents should follow. Keep this focused on project-specific conventions, not generic style advice.

## Open Questions

Record uncertain architecture ownership in `../../agent/gaps.md` instead of guessing.
