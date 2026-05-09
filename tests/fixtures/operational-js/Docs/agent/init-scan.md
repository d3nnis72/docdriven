# Init Scan

This scan records detected project dynamics. Verify uncertain items before
treating them as durable project truth.

## Project

- Name: operational-js
- Stack: JavaScript/Node.js
- Package manager: npm

## Frameworks

- prisma

## Workspaces

- none detected

## Source Dirs

- src

## Config Files

- .env.example
- Dockerfile
- docker-compose.yml
- .github/workflows

## Scripts

- dev: `node src/index.js`
- test: `node -e "process.exit(0)"`
- build: `node -e "process.exit(0)"`
- lint: `node -e "process.exit(0)"`
- typecheck: `node -e "process.exit(0)"`
- deploy: `node -e "process.exit(0)"`
- migrate: `prisma migrate deploy`
- seed: `node prisma/seed.js`
- docs: `node ../../skills/docdriven-audit/scripts/audit-docdriven.mjs --root .`
- audit: `node ../../skills/docdriven-audit/scripts/audit-docdriven.mjs --root .`
- doctor: `node src/index.js --doctor`

## Uncertain Items

- Replace generated human and knowledge placeholders.
- Confirm route owners.
- Confirm validation commands marked as not detected.
