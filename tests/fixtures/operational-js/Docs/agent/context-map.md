# Context Map

Use this table to choose the smallest useful context route.

| Route ID | Task type | Read first | Canonical docs | Code areas | Update docs | Validation | Owner |
|---|---|---|---|---|---|---|---|
| architecture-general | Architecture change, code organization, structural ownership, configuration pattern, contract location, coding pattern | `knowledge/architecture/README.md` | `knowledge/architecture/README.md` | src/** | architecture docs, human architecture if user-facing | test | unknown |
| feature-general | Feature behavior | `knowledge/features/README.md` | `knowledge/features/README.md` | src/** | affected feature docs, human overview if needed | test | unknown |
| interface-general | Interface change | `knowledge/interfaces/README.md` | `knowledge/interfaces/README.md` | src/** | interface docs and affected feature docs | test | unknown |
| operations-setup | setup, local setup, onboarding | `human/setup.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/commands.md | test | unknown |
| operations-environment | environment variable change, env change, secret setup | `human/environment.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/environment.md | test | unknown |
| operations-configuration | config file change, runtime setting, feature flag | `human/configuration.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/configuration.md | test | unknown |
| operations-services | service dependency change, external service, local service | `human/services.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/services.md | test | unknown |
| operations-deployment | deployment change, release change, rollback | `human/deployment.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/deployment.md | test | unknown |
| operations-troubleshooting | troubleshooting, setup failure, runtime failure | `human/troubleshooting.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/troubleshooting.md | test | unknown |
| operations-maintenance | maintenance task change, migration, seed, scheduled job | `human/maintenance.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | knowledge/operations/README.md, human/setup.md, human/maintenance.md | test | unknown |
| operations-validation | validation command change, test command change, build command change | `agent/validation.md`, `human/commands.md` | `knowledge/operations/README.md` | .env.example, Dockerfile, docker-compose.yml, .github/workflows | agent/validation.md, human/commands.md, knowledge/operations/README.md | test | unknown |
