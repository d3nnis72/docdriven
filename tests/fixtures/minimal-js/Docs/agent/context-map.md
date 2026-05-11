# Context Map

Use this table to choose the smallest useful context route.

| Route ID | Task type | Read first | Canonical docs | Code areas | Update docs | Validation | Owner |
|---|---|---|---|---|---|---|---|
| architecture-general | Architecture change, code organization, structural ownership, configuration pattern, contract location, coding pattern, component reuse, shared primitive, composition pattern | `knowledge/architecture/README.md` | `knowledge/architecture/README.md` | src/** | architecture docs, human architecture if user-facing | test | unknown |
| feature-general | Feature behavior | `knowledge/features/README.md` | `knowledge/features/README.md` | src/** | affected feature docs, human overview if needed | test | unknown |
| interface-general | Interface change | `knowledge/interfaces/README.md` | `knowledge/interfaces/README.md` | src/** | interface docs and affected feature docs | test | unknown |
| operations-general | setup, config, operations, deployment, validation command | `human/setup.md` | `knowledge/operations/README.md` | inspect manually | knowledge/operations/README.md, human/setup.md, human/commands.md, agent/validation.md | test | unknown |
