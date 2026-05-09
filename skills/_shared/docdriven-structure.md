# DocDriven Structure

DocDriven separates executable truth from explanatory truth.

- Code, tests, configs, schemas, migrations, and build outputs are executable evidence.
- `Docs/knowledge/` contains the canonical explanation of current project truth.
- `Docs/human/` contains short human-facing orientation and day-one operating docs.
- `Docs/agent/` contains the protocol agents use to find and update context.
- `Docs/tmp/` contains temporary plans, visions, notes, and working material.

Default scaffold:

```text
Docs/
├── README.md
├── human/
├── agent/
│   ├── manifest.json
│   ├── init-scan.md
│   ├── context-map.md
│   ├── gaps.md
│   └── routes/
├── knowledge/
└── tmp/
```

Rule: code and checks prove truth; knowledge explains truth; human docs summarize it; agent docs route to it; tmp docs are not truth until promoted.

The scaffold is not a closed structure. Agents should choose the final docs
tree from project evidence, reader needs, ownership boundaries, and validation
reality.

`Docs/human/` usually starts with `overview.md`, `setup.md`, `commands.md`, and
`architecture.md`. Projects with operational evidence may have adaptive human
docs such as `environment.md`, `configuration.md`, `services.md`,
`deployment.md`, `troubleshooting.md`, and `maintenance.md`. These names are
examples, not the full set of valid human docs.

Human docs contain actionable setup and operation facts. Deeper configuration,
service, deployment, and maintenance truth belongs in `Docs/knowledge/operations/`,
with human docs linking there instead of copying implementation detail.

Add docs only when they have a clear job:

- a human doc answers a distinct human question
- a knowledge doc owns durable current truth
- a route shard lowers agent context load or clarifies ownership
- a tmp doc captures temporary work that is not yet truth

If the evidence is weak, record a gap instead of inventing a file.
