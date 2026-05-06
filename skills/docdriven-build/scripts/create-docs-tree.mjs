#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const root = valueAfter("--root") || process.cwd();
const force = args.includes("--force");
const docsRoot = valueAfter("--docs-root") || "Docs";
const docs = path.join(root, docsRoot);
const project = detectProject(root);

const files = new Map([
  ["README.md", rootReadme(project)],
  ["human/overview.md", humanOverview(project)],
  ["human/setup.md", humanSetup(project)],
  ["human/commands.md", humanCommands(project)],
  ["human/architecture.md", humanArchitecture()],
  ["agent/manifest.json", manifest(project)],
  ["agent/init-scan.md", initScan(project)],
  ["agent/context-map.md", contextMap(project)],
  ["agent/update-protocol.md", updateProtocol()],
  ["agent/validation.md", validation(project)],
  ["agent/writing-style.md", writingStyle()],
  ["agent/naming.md", naming()],
  ["agent/gaps.md", gaps()],
  ["agent/routes/architecture.json", routeShard(project, "architecture")],
  ["agent/routes/features.json", routeShard(project, "features")],
  ["agent/routes/interfaces.json", routeShard(project, "interfaces")],
  ["agent/routes/operations.json", routeShard(project, "operations")],
  ["knowledge/README.md", knowledgeReadme()],
  ["knowledge/architecture/README.md", architectureReadme()],
  ["knowledge/features/README.md", featuresReadme()],
  ["knowledge/interfaces/README.md", interfacesReadme()],
  ["knowledge/operations/README.md", operationsReadme()],
  ["tmp/README.md", tmpReadme()]
]);

for (const [relative, content] of files) {
  const file = path.join(docs, relative);
  if (fs.existsSync(file) && !force) continue;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

console.log(`Created DocDriven tree at ${docs}`);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function detectProject(rootDir) {
  const pkgPath = path.join(rootDir, "package.json");
  const pyprojectPath = path.join(rootDir, "pyproject.toml");
  const project = {
    name: path.basename(rootDir),
    stack: "Unknown",
    packageManager: "not detected",
    scripts: {},
    frameworks: [],
    workspaces: [],
    sourceDirs: detectExisting(rootDir, ["src", "app", "pages", "packages", "apps", "lib", "tests"]),
    configFiles: detectExisting(rootDir, [
      ".env.example",
      ".env.local",
      "Dockerfile",
      "docker-compose.yml",
      "compose.yml",
      "next.config.js",
      "vite.config.js",
      "tsconfig.json",
      "ruff.toml",
      "pytest.ini",
      ".github/workflows"
    ]),
    commands: {
      test: "not detected",
      build: "not detected",
      lint: "not detected",
      typecheck: "not detected",
      dev: "not detected"
    }
  };

  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const pm = detectJsPackageManager(rootDir);
    const scripts = pkg.scripts || {};
    const dependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies
    };
    project.name = pkg.name || project.name;
    project.stack = "JavaScript/Node.js";
    project.packageManager = pm;
    project.scripts = scripts;
    project.frameworks = detectJsFrameworks(dependencies);
    project.workspaces = normalizeWorkspaces(pkg.workspaces);
    project.commands.test = scripts.test ? `${pm} test` : "not detected";
    project.commands.build = scripts.build ? `${pm} run build` : "not detected";
    project.commands.lint = scripts.lint ? `${pm} run lint` : "not detected";
    project.commands.typecheck = scripts.typecheck ? `${pm} run typecheck` : "not detected";
    project.commands.dev = scripts.dev ? `${pm} run dev` : "not detected";
  } else if (fs.existsSync(pyprojectPath)) {
    const pyproject = fs.readFileSync(pyprojectPath, "utf8");
    project.stack = "Python";
    project.packageManager = "python";
    project.frameworks = detectPythonFrameworks(pyproject);
    project.commands.test = pyproject.includes("pytest") ? "pytest" : "pytest if configured; otherwise inspect manually";
    project.commands.build = pyproject.includes("[build-system]") ? "python -m build" : "python -m build if configured; otherwise inspect manually";
    project.commands.lint = pyproject.includes("ruff") ? "ruff check ." : "ruff check . if configured; otherwise inspect manually";
  }

  return project;
}

function detectJsPackageManager(rootDir) {
  if (fs.existsSync(path.join(rootDir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(rootDir, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(rootDir, "bun.lockb"))) return "bun";
  return "npm";
}

function detectExisting(rootDir, candidates) {
  return candidates.filter((candidate) => fs.existsSync(path.join(rootDir, candidate)));
}

function detectJsFrameworks(dependencies) {
  const known = ["next", "react", "vite", "express", "fastify", "prisma", "@prisma/client", "vue", "svelte", "astro"];
  return known.filter((name) => dependencies && dependencies[name]).map((name) => name.replace(/^@prisma\/client$/, "prisma"));
}

function detectPythonFrameworks(content) {
  return ["fastapi", "django", "flask", "pytest", "ruff"].filter((name) => content.toLowerCase().includes(name));
}

function normalizeWorkspaces(workspaces) {
  if (Array.isArray(workspaces)) return workspaces;
  if (workspaces && Array.isArray(workspaces.packages)) return workspaces.packages;
  return [];
}

function listOrNone(values) {
  return values.length ? values.map((value) => `- ${value}`).join("\n") : "- none detected";
}

function codeArea(project) {
  const source = project.sourceDirs.find((dir) => dir !== "tests") || project.sourceDirs[0];
  return source ? `${source}/**` : "inspect manually";
}

function validationKey(project) {
  return project.commands.test !== "not detected" ? "test" : "not detected";
}

function rootReadme(project) {
  return `# ${project.name} Docs

DocDriven documentation separates human orientation, agent protocol, canonical knowledge, and temporary working material.

## Start Here

- Human orientation: \`human/overview.md\`
- Agent routing: \`agent/context-map.md\`
- Canonical project explanation: \`knowledge/README.md\`
- Temporary work: \`tmp/README.md\`
`;
}

function humanOverview(project) {
  return `# Overview

${project.name} is a ${project.stack} project.

TODO: Replace this with a short human summary of what the project does and who it serves.
`;
}

function humanSetup(project) {
  return `# Setup

Stack: ${project.stack}

TODO: Document required runtime, environment variables, services, accounts, and setup traps.
`;
}

function humanCommands(project) {
  const rows = Object.entries(project.commands)
    .map(([name, command]) => `| ${titleCase(name)} | \`${command}\` |`)
    .join("\n");

  return `# Commands

| Purpose | Command |
|---|---|
${rows}
`;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function humanArchitecture() {
  return `# Architecture

This is the short human architecture summary.

Detailed architecture truth belongs in \`../knowledge/architecture/\`.
`;
}

function manifest() {
  return `${JSON.stringify({
    schemaVersion: 1,
    docsRoot: "Docs",
    routeIndexes: [
      "agent/routes/architecture.json",
      "agent/routes/features.json",
      "agent/routes/interfaces.json",
      "agent/routes/operations.json"
    ],
    contextMap: "agent/context-map.md",
    gaps: "agent/gaps.md"
  }, null, 2)}\n`;
}

function initScan(project) {
  const scripts = Object.entries(project.scripts)
    .map(([name, command]) => `- ${name}: \`${command}\``)
    .join("\n") || "- none detected";

  return `# Init Scan

This scan records detected project dynamics. Verify uncertain items before
treating them as durable project truth.

## Project

- Name: ${project.name}
- Stack: ${project.stack}
- Package manager: ${project.packageManager}

## Frameworks

${listOrNone(project.frameworks)}

## Workspaces

${listOrNone(project.workspaces)}

## Source Dirs

${listOrNone(project.sourceDirs)}

## Config Files

${listOrNone(project.configFiles)}

## Scripts

${scripts}

## Uncertain Items

- Replace generated human and knowledge placeholders.
- Confirm route owners.
- Confirm validation commands marked as not detected.
`;
}

function contextMap(project) {
  return `# Context Map

Use this table to choose the smallest useful context route.

| Route ID | Task type | Read first | Canonical docs | Code areas | Update docs | Validation | Owner |
|---|---|---|---|---|---|---|---|
| architecture-general | Architecture change | \`knowledge/architecture/README.md\` | \`knowledge/architecture/README.md\` | ${codeArea(project)} | architecture docs, human architecture if user-facing | ${validationKey(project)} | unknown |
| feature-general | Feature behavior | \`knowledge/features/README.md\` | \`knowledge/features/README.md\` | ${codeArea(project)} | affected feature docs, human overview if needed | ${validationKey(project)} | unknown |
| interface-general | Interface change | \`knowledge/interfaces/README.md\` | \`knowledge/interfaces/README.md\` | ${codeArea(project)} | interface docs and affected feature docs | ${validationKey(project)} | unknown |
| operations-general | Setup/config/operations | \`human/setup.md\` | \`knowledge/operations/README.md\` | ${project.configFiles.join(", ") || "inspect manually"} | setup, commands, validation, operations docs | ${validationKey(project)} | unknown |
`;
}

function routeShard(project, area) {
  const routeByArea = {
    architecture: {
      id: "architecture-general",
      priority: 100,
      taskTypes: ["architecture change", "dependency direction", "runtime flow"],
      readFirst: ["knowledge/architecture/README.md"],
      canonicalDocs: ["knowledge/architecture/README.md"],
      codeAreas: [codeArea(project)],
      updateDocs: ["knowledge/architecture/README.md", "human/architecture.md"],
      validation: [validationKey(project)],
      owner: "unknown"
    },
    features: {
      id: "feature-general",
      priority: 100,
      taskTypes: ["feature behavior", "user-visible behavior"],
      readFirst: ["knowledge/features/README.md"],
      canonicalDocs: ["knowledge/features/README.md"],
      codeAreas: [codeArea(project)],
      updateDocs: ["knowledge/features/README.md", "human/overview.md"],
      validation: [validationKey(project)],
      owner: "unknown"
    },
    interfaces: {
      id: "interface-general",
      priority: 100,
      taskTypes: ["interface change", "api change", "cli change", "integration change"],
      readFirst: ["knowledge/interfaces/README.md"],
      canonicalDocs: ["knowledge/interfaces/README.md"],
      codeAreas: [codeArea(project)],
      updateDocs: ["knowledge/interfaces/README.md", "knowledge/features/README.md"],
      validation: [validationKey(project)],
      owner: "unknown"
    },
    operations: {
      id: "operations-general",
      priority: 100,
      taskTypes: ["setup", "config", "operations", "deployment", "validation command"],
      readFirst: ["human/setup.md"],
      canonicalDocs: ["knowledge/operations/README.md"],
      codeAreas: project.configFiles.length ? project.configFiles : ["inspect manually"],
      updateDocs: ["knowledge/operations/README.md", "human/setup.md", "human/commands.md", "agent/validation.md"],
      validation: [validationKey(project)],
      owner: "unknown"
    }
  };

  return `${JSON.stringify({
    schemaVersion: 1,
    area,
    routes: [routeByArea[area]]
  }, null, 2)}\n`;
}

function updateProtocol() {
  return `# Update Protocol

- Behavior changes update affected knowledge docs.
- User-facing setup or command changes update human docs.
- Interface changes update \`knowledge/interfaces/\`.
- Architecture boundary changes update \`knowledge/architecture/\`.
- Missing routes go in \`agent/gaps.md\` until fixed.
- Tmp notes are not truth until promoted.
`;
}

function validation(project) {
  const rows = Object.entries(project.commands)
    .map(([name, command]) => `| ${name} | \`${command}\` |`)
    .join("\n");

  return `# Validation

| Purpose | Command |
|---|---|
${rows}

If a command is not detected, inspect the project before claiming validation passed.
`;
}

function writingStyle() {
  return `# Writing Style

- Use simple language.
- Use short declarative sentences.
- Prefer bullets and tables.
- Link to canonical docs instead of copying content.
- Replace stale text instead of appending corrections.
`;
}

function naming() {
  return `# Naming

- Use lowercase kebab-case file names.
- Use \`README.md\` as a local router for folders.
- Avoid vague names like \`misc.md\`, \`notes.md\`, and \`details.md\` outside \`tmp/\`.
- Name docs after stable concepts, features, interfaces, or operations.
`;
}

function gaps() {
  return `# Gaps

Record missing routes, unknown ownership, stale docs, and docs debt here.

| Gap | Evidence | Next step |
|---|---|---|
`;
}

function knowledgeReadme() {
  return `# Knowledge

Knowledge docs contain the canonical explanation of current project truth.

- Architecture: \`architecture/README.md\`
- Features: \`features/README.md\`
- Interfaces: \`interfaces/README.md\`
- Operations: \`operations/README.md\`
`;
}

function architectureReadme() {
  return `# Architecture

Use this folder for system shape, boundaries, dependency direction, runtime flow, and cross-cutting patterns.
`;
}

function featuresReadme() {
  return `# Features

Use this folder for user-visible or business-visible capabilities and behavior.
`;
}

function interfacesReadme() {
  return `# Interfaces

Use this folder for APIs, CLI commands, events, integrations, and public contracts.
`;
}

function operationsReadme() {
  return `# Operations

Use this folder for configuration, testing strategy, deployment, troubleshooting, and maintenance.
`;
}

function tmpReadme() {
  return `# Tmp

Temporary plans, visions, notes, and exploration live here.

Tmp is not truth. Promote stable or implemented facts into \`human/\`, \`agent/\`, or \`knowledge/\`.
`;
}
