# Repo-Local Skill Template

Generate `.agents/skills/project-docdriven/SKILL.md` by default.

Required sections:

- frontmatter with `name: project-docdriven`
- project shape
- docs root
- project dynamics scan summary
- required read order
- project-specific routes
- validation commands
- update protocol
- links to `Docs/agent/context-map.md`
- links to `Docs/agent/manifest.json`
- links to `Docs/agent/init-scan.md`

The generated skill is agent behavior. It must not copy full project docs.

Required workflow:

1. Read `Docs/agent/manifest.json`.
2. Load the smallest matching route shard.
3. Read route `readFirst` docs.
4. Inspect route `codeAreas`.
5. Update `updateDocs` and route shards after meaningful changes.
6. Run route validation.
7. Record gaps in `Docs/agent/gaps.md`.
