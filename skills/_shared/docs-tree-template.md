# Docs Tree Template

Create this default tree:

```text
Docs/
├── README.md
├── human/
│   ├── overview.md
│   ├── setup.md
│   ├── commands.md
│   └── architecture.md
├── agent/
│   ├── manifest.json
│   ├── init-scan.md
│   ├── context-map.md
│   ├── update-protocol.md
│   ├── validation.md
│   ├── writing-style.md
│   ├── naming.md
│   ├── gaps.md
│   └── routes/
│       ├── architecture.json
│       ├── features.json
│       ├── interfaces.json
│       └── operations.json
├── knowledge/
│   ├── README.md
│   ├── architecture/
│   │   └── README.md
│   ├── features/
│   │   └── README.md
│   ├── interfaces/
│   │   └── README.md
│   └── operations/
│       └── README.md
└── tmp/
    └── README.md
```

Human docs are short orientation. Agent docs are protocol and routing.
`manifest.json` points to route shards. Route shards are the machine-readable
contract. `context-map.md` is the readable route view. Knowledge docs are the
canonical explanation of current truth. Tmp docs are temporary and not truth.
