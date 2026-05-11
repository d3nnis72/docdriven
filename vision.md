# DocDriven Vision

DocDriven is a Documentation Driven Development system for agents and humans.
Its purpose is not to create more documentation. Its purpose is to make a
project easier to understand, change, verify, and maintain by using
documentation as the shared context layer.

DocDriven treats documentation as project infrastructure. Before an agent
changes code, it should know which documentation describes the relevant part of
the system. After an agent changes code, it should update the affected
documentation in the same task.

DocDriven is for long-lived projects. It should preserve project continuity:
agents follow the project's documented architecture, style, configuration flow,
and validation reality instead of introducing generic preferences on each task.

## Core Idea

DocDriven separates executable truth from explanatory truth.

- Code, tests, configs, schemas, migrations, and build outputs are executable
  evidence.
- `knowledge/` contains the canonical explanation of current project truth.
- `human/` contains short human-facing orientation and operating docs.
- `agent/` contains the protocol agents use to find and update context.
- `tmp/` contains temporary plans, visions, notes, and working material.

The key rule is:

> Code and checks prove truth. Knowledge explains truth. Human docs summarize
> it. Agent docs route to it. Tmp docs are not truth until promoted.

## Why This Exists

Most project documentation tries to serve too many readers at once. Humans need
short orientation, setup, commands, and architecture summaries. Agents need
precise context routing, update rules, validation commands, and small scoped
files that can be loaded without flooding the context window.

DocDriven separates these needs without duplicating project truth.

For humans, documentation should answer:

- What is this project?
- How do I set it up?
- How do I run, test, build, and deploy it?
- What is the architecture in simple terms?
- What should I know before operating or changing it?

For agents, documentation should answer:

- What kind of task is this?
- Which docs must be read first?
- Which files contain the canonical truth?
- Which constraints must be preserved?
- Which docs must be updated after the change?
- Which command proves the change?

## Default Documentation Structure

The default structure is intentionally small.

```text
Docs/
├── README.md
├── human/
│   ├── overview.md
│   ├── setup.md
│   ├── commands.md
│   └── architecture.md
├── agent/
│   ├── context-map.md
│   ├── update-protocol.md
│   ├── validation.md
│   ├── writing-style.md
│   ├── naming.md
│   └── gaps.md
├── knowledge/
│   ├── README.md
│   ├── architecture/
│   ├── features/
│   ├── interfaces/
│   └── operations/
└── tmp/
    ├── README.md
    ├── visions/
    ├── plans/
    └── notes/
```

Optional folders can be added only when the project needs them:

```text
Docs/knowledge/data/
Docs/knowledge/domains/
Docs/decisions/
```

`decisions/` is not part of the default structure because historical decisions
can become stale. Current documentation should describe current truth. If a
project needs architectural decision records, they must be clearly marked as
historical and linked only when useful.

The structure is adaptive. The scaffold is a starting map, not the territory.
Add, split, rename, or consolidate folders, docs, or route shards only when
repository evidence shows a stable responsibility, repeated pattern, boundary,
configuration rule, shared contract, or validation need.

## Folder Responsibilities

### `Docs/human/`

Human docs are short, readable, and practical. They are for orientation and
operation, not exhaustive implementation detail.

Canonical files:

- `overview.md`: what the project is and why it exists.
- `setup.md`: environment, configuration, dependencies, accounts, services.
- `commands.md`: run, test, build, lint, deploy, and debug commands.
- `architecture.md`: short system shape and links to detailed knowledge docs.

Adaptive human docs may be generated when project evidence requires them:
`environment.md`, `configuration.md`, `services.md`, `deployment.md`,
`troubleshooting.md`, and `maintenance.md`.

Human docs may summarize knowledge docs, but must not duplicate detailed truth.
They contain day-one operational facts and link to `knowledge/operations/` for
deeper current truth.

### `Docs/agent/`

Agent docs define how an LLM or coding agent should work in the repository.
They are procedural, compact, and routing-focused.

Canonical files:

- `context-map.md`: maps task types to docs that must be read and updated.
- `update-protocol.md`: defines when documentation must change.
- `validation.md`: lists commands and checks agents should run.
- `writing-style.md`: defines concise, low-token documentation style.
- `naming.md`: defines file, folder, and concept naming rules.
- `gaps.md`: records missing routes, unknown ownership, and docs debt.

Agent docs should not contain project truth when that truth belongs in
`knowledge/`. They should point to the canonical location.

### `Docs/knowledge/`

Knowledge docs contain the canonical explanation of current project truth. Code
and executable checks remain the authority for verification. Knowledge docs are
the main context source for agents and the detailed reference layer for humans.

Default categories:

- `architecture/`: adaptive architecture contract, system shape, boundaries,
  dependency direction, runtime flow, structural ownership, configuration flow,
  reuse/composition rules, and durable coding patterns.
- `features/`: user-visible or business-visible capabilities and behavior.
- `interfaces/`: APIs, CLI commands, events, integrations, public contracts.
- `operations/`: configuration, testing strategy, deployment, troubleshooting.

Optional categories:

- `data/`: schemas, persistence models, migrations, state, pipelines.
- `domains/`: domain concepts when the system is domain-heavy.

The default should not overfit. Start with architecture, features, interfaces,
and operations. Add more only when the project needs them.

Architecture docs must not copy type, schema, or interface definitions. They
explain where authoritative code contracts live, which modules own them, how
consumers access them, and when changes require docs or route updates.

Architecture docs should also explain reusable project primitives: components,
hooks, helpers, adapters, config helpers, test helpers, and composition
patterns. Agents should look for these before creating one-off implementations.
Feature-local code stays local until repeated use or stable responsibility
justifies promotion.

### `Docs/tmp/`

Tmp docs are temporary working material. They are not project truth.

Use `tmp/` for:

- visions
- plans
- notes
- exploration
- unresolved thoughts

When tmp material becomes implemented or stable, promote the truth into
`human/`, `agent/`, or `knowledge/`. Do not leave durable project facts only in
`tmp/`.

## Documentation Rules

DocDriven follows strict documentation ownership.

- Each concept has one canonical home.
- Other files link to the canonical home instead of repeating it.
- Short summaries are allowed when they help navigation.
- Stale text should be replaced, not corrected by appending more text.
- Parent files route readers to child files.
- Leaf files contain the detailed truth.
- Missing documentation is part of the work, not a separate cleanup task.
- Long-term project consistency beats local convenience.
- Agents must not hardcode favorite folders, architecture styles, config flows,
  or coding-style preferences.
- Reuse should be real and documented, not hypothetical or parallel.

## Agent Operating Contract

Agents should follow a concrete route, not interpret prose freely.

`Docs/agent/context-map.md` should use a strict table format so routes are easy
to scan, validate, and update.

Required columns:

| Column | Purpose |
|---|---|
| Task type | The kind of work being requested. |
| Read first | The smallest required docs entry point. |
| Canonical docs | The docs that own current explanation. |
| Code areas | The likely source paths or ownership areas. |
| Update docs | The docs that must be checked after changes. |
| Validation | The command or evidence required before completion. |
| Owner | Optional team, module, or project area owner. |

Example:

```markdown
| Task type | Read first | Canonical docs | Code areas | Update docs | Validation | Owner |
|---|---|---|---|---|---|---|
| Feature behavior | `knowledge/features/README.md` | `knowledge/features/<feature>/` | `src/features/<feature>/` | feature docs, human overview if user-facing | `npm test` | product |
| API change | `knowledge/interfaces/README.md` | `knowledge/interfaces/` | `src/api/` | interface docs, affected feature docs | `npm test` | platform |
| Setup/config | `human/setup.md` | `knowledge/operations/configuration.md` | config files, env examples | setup, commands, validation | documented setup check | operations |
```

Every route should define both read targets and update targets. If a task does
not match an existing route, the agent should update `context-map.md` or record
the gap in `Docs/agent/gaps.md`.

Architecture routes should cover structure-changing work: code organization,
structural ownership, configuration patterns, contract locations, dependency
direction, component reuse, shared primitives, composition patterns, and durable
coding patterns. If those conventions are unclear, the agent should inspect
nearby code and record a gap instead of silently creating a parallel style.

## LLM Context Management

DocDriven optimizes for context quality, not context volume.

Agents should not read every document by default. They should:

1. Classify the task.
2. Read `Docs/agent/context-map.md`.
3. Follow the smallest relevant route.
4. Read the canonical knowledge docs for the task.
5. Inspect code after loading the relevant documentation.
6. Update docs after meaningful changes.
7. Run validation from `Docs/agent/validation.md`.

Good agent context is:

- scoped
- explicit
- current
- easy to search
- low on prose filler
- clear about constraints
- clear about update ownership

## Scaling Large Repositories

Large repositories need indexes and ownership boundaries. DocDriven should scale
by adding routing precision, not by making files longer.

Scaling primitives:

- generated or maintained indexes for large folders
- per-feature or per-domain route entries in `context-map.md`
- ownership maps from docs to code areas
- file size caps and split rules
- short summaries with canonical links
- searchable names for concepts, features, and interfaces
- explicit validation evidence for high-risk areas
- `gaps.md` entries for missing routes or unknown ownership

For large repos, each major area should have a local router:

```text
Docs/knowledge/features/<feature>/README.md
Docs/knowledge/architecture/README.md
Docs/knowledge/interfaces/README.md
```

These files should say what belongs below them, what does not belong there, and
which files must be updated when that area changes.

## Writing Style

DocDriven documentation should be efficient for LLMs and readable for humans.

Rules:

- Use simple language.
- Use short declarative sentences.
- Prefer bullets and tables over long prose.
- Avoid marketing language.
- Avoid generic explanations.
- Avoid repeating the same fact in multiple files.
- Mark uncertainty explicitly.
- Link to canonical docs instead of copying content.
- Split or compress files that become too broad.

Recommended size limits:

- Router files: 100-250 words.
- Human orientation files: 300-700 words.
- Agent protocol files: 200-500 words.
- Knowledge leaf files: 300-1000 words.
- Tmp plans or visions: as long as needed while temporary.

## Skill Package

DocDriven should be distributed as an installable skill package, for example:

```bash
npx skills add D3nnis72/docdriven-skills
```

The package should contain four public skills.

### `docdriven`

Defines the Documentation Driven Development paradigm.

Responsibilities:

- explain the core model
- enforce read-before-change behavior
- enforce update-after-change behavior
- define the human, agent, knowledge, and tmp surfaces
- define the executable-truth and explanatory-truth split
- define concise documentation style

### `docdriven-init`

Creates the repo-local DocDriven skill.

Responsibilities:

- inspect the project shape
- detect stack, framework, commands, and conventions
- choose the docs root
- create the repo-local skill
- define required read order
- define project-specific routing expectations
- define framework-specific knowledge categories when needed

The generated repo-local skill is agent behavior, not project truth.

Example:

```text
.agents/skills/project-docdriven/SKILL.md
```

### `docdriven-build`

Creates the initial documentation structure.

Responsibilities:

- create `Docs/human/`
- create `Docs/agent/`
- create `Docs/knowledge/`
- create `Docs/tmp/`
- write initial context maps and update protocols
- document current project architecture, features, interfaces, and operations
- keep documentation concise and linked

`docdriven-build` should use the generated repo-local skill as its project
contract.

### `docdriven-audit`

Checks documentation quality and drift.

Responsibilities:

- find missing docs
- find stale docs
- find duplicated truth
- find oversized files
- find orphan docs
- find weak context routes
- find tmp content that should be promoted or deleted
- verify docs still match code structure and commands

Audit can report findings or update docs when explicitly asked.

Drift detection should be repeatable. It should not rely only on subjective
review.

Audit should compare:

- context routes to actual code areas
- documented commands to package scripts, build files, or task runners
- documented interfaces to schemas, route files, CLI definitions, or generated
  contracts
- documented config to env examples, config loaders, and deployment files
- feature docs to source ownership maps
- tmp plans to implemented code and promoted knowledge docs

Useful audit markers:

- `last-verified`: date or commit when a doc was checked
- `evidence`: command, file path, schema, or test used for verification
- `owned-code`: source paths explained by the doc
- `canonical-doc`: the doc that owns a concept

These markers should be lightweight. They exist to help agents trust and update
docs in large repositories without reading everything.

## Repository-Local Skill

Each project should get a generated local skill. This skill tells agents how
DocDriven applies to that specific repository.

It should include:

- docs root
- project type
- stack and framework
- test/build/lint commands
- required read order
- project-specific knowledge categories
- naming conventions
- validation expectations
- update protocol
- links to `Docs/agent/context-map.md`

It should not copy the full project documentation. It should point agents to the
right docs.

## Success Criteria

DocDriven is working when:

- a new human can understand the project quickly
- an agent can find the right context without reading everything
- code changes update docs in the same task
- docs stay small, linked, and current
- each fact has one canonical home
- temporary plans do not become hidden truth
- validation commands are discoverable
- framework-specific structure is supported without changing the core model
