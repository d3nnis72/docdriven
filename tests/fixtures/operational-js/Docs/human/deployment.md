# Deployment

Deploy targets, release commands, and rollback pointers.

| Target | Source | Command |
|---|---|---|
| Docker | Dockerfile | `npm run deploy` |
| GitHub Actions | .github/workflows | `npm run deploy` |
| scripted deploy | package.json | `npm run deploy` |

Run validation before deployment. Rollback and environment-specific behavior belong in `../knowledge/operations/README.md`.
