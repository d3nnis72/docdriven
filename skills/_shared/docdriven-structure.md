# DocDriven Structure

DocDriven separates executable truth from explanatory truth.

- Code, tests, configs, schemas, migrations, and build outputs are executable evidence.
- `Docs/knowledge/` contains the canonical explanation of current project truth.
- `Docs/human/` contains short human-facing orientation and operating docs.
- `Docs/agent/` contains the protocol agents use to find and update context.
- `Docs/tmp/` contains temporary plans, visions, notes, and working material.

Default tree:

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
