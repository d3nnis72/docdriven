#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = path.resolve(import.meta.dirname, "..");

testGeneratedArchitectureContract();
testGeneratedProjectSkillContinuityRules();
testAuditFlagsWeakArchitectureDocs();
testAuditFlagsUndocumentedReusePatterns();

console.log("DocDriven regression checks passed.");

function testGeneratedArchitectureContract() {
  const root = makeTempProject("generated-architecture");
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({
    name: "generated-architecture",
    scripts: { test: "node -e \"process.exit(0)\"" },
    dependencies: {}
  }, null, 2));
  fs.mkdirSync(path.join(root, "src"), { recursive: true });
  fs.writeFileSync(path.join(root, "src", "index.js"), "export const ok = true;\n");

  execFileSync("node", [path.join(repoRoot, "skills/docdriven-build/scripts/create-docs-tree.mjs"), "--root", root], {
    cwd: repoRoot,
    stdio: "pipe"
  });

  const architecture = read(root, "Docs/knowledge/architecture/README.md");
  assert.match(architecture, /Adaptive Architecture Contract/);
  assert.match(architecture, /Project Continuity Rules/);
  assert.match(architecture, /Structural Ownership/);
  assert.match(architecture, /Configuration First/);
  assert.match(architecture, /Reuse And Composition/);
  assert.match(architecture, /Do not copy type, schema, or interface definitions into docs/);
  assert.match(architecture, /Prefer existing project primitives over new one-off implementations/);

  const humanArchitecture = read(root, "Docs/human/architecture.md");
  assert.match(humanArchitecture, /Architecture is documented as an adaptive contract/);

  const updateProtocol = read(root, "Docs/agent/update-protocol.md");
  assert.match(updateProtocol, /Do not hardcode generic agent preferences/);
  assert.match(updateProtocol, /Prefer long-term project consistency over local convenience/);

  const route = JSON.parse(read(root, "Docs/agent/routes/architecture.json"));
  const taskTypes = route.routes.flatMap((entry) => entry.taskTypes);
  assert.ok(taskTypes.includes("code organization"));
  assert.ok(taskTypes.includes("structural ownership"));
  assert.ok(taskTypes.includes("configuration pattern"));
  assert.ok(taskTypes.includes("contract location"));
  assert.ok(taskTypes.includes("coding pattern"));
  assert.ok(taskTypes.includes("component reuse"));
  assert.ok(taskTypes.includes("shared primitive"));
  assert.ok(taskTypes.includes("composition pattern"));
}

function testAuditFlagsWeakArchitectureDocs() {
  const root = makeTempProject("weak-architecture");
  fs.mkdirSync(path.join(root, "Docs/knowledge/architecture"), { recursive: true });
  fs.mkdirSync(path.join(root, "Docs/human"), { recursive: true });
  fs.writeFileSync(path.join(root, "Docs/knowledge/architecture/README.md"), "# Architecture\n\nUse this folder for system shape.\n");
  fs.writeFileSync(path.join(root, "Docs/human/architecture.md"), "# Architecture\n\nArchitecture summary.\n");

  const result = spawnSync("node", [
    path.join(repoRoot, "skills/docdriven-audit/scripts/audit-docdriven.mjs"),
    "--root",
    root,
    "--format",
    "json"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  const output = JSON.parse(result.stdout);
  assert.ok(
    output.findings.some((finding) => finding.code === "weak-architecture-contract"),
    "expected audit to report weak-architecture-contract"
  );
}

function testGeneratedProjectSkillContinuityRules() {
  const root = makeTempProject("project-skill-continuity");
  fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({
    name: "project-skill-continuity",
    scripts: { test: "node -e \"process.exit(0)\"" },
    dependencies: {}
  }, null, 2));
  fs.mkdirSync(path.join(root, "src"), { recursive: true });
  fs.writeFileSync(path.join(root, "src", "index.js"), "export const ok = true;\n");

  execFileSync("node", [path.join(repoRoot, "skills/docdriven-init/scripts/create-project-skill.mjs"), "--root", root], {
    cwd: repoRoot,
    stdio: "pipe"
  });

  const skill = read(root, ".agents/skills/project-docdriven/SKILL.md");
  assert.match(skill, /Project Continuity/);
  assert.match(skill, /Do not invent default folders/);
  assert.match(skill, /contract locations/);
  assert.match(skill, /reusable components, helpers, hooks, adapters, and project primitives/);
  assert.match(skill, /Docs must not copy type, schema, or interface definitions/);
}

function testAuditFlagsUndocumentedReusePatterns() {
  const root = makeTempProject("undocumented-reuse");
  fs.mkdirSync(path.join(root, "Docs/knowledge/architecture"), { recursive: true });
  fs.mkdirSync(path.join(root, "src/components"), { recursive: true });
  fs.writeFileSync(path.join(root, "src/components/Button.js"), "export const Button = () => null;\n");
  fs.writeFileSync(path.join(root, "Docs/knowledge/architecture/README.md"), [
    "# Architecture",
    "",
    "## Adaptive Architecture Contract",
    "",
    "Document current structure.",
    "",
    "## Project Continuity Rules",
    "",
    "Follow project conventions.",
    "",
    "## Structural Ownership",
    "",
    "Document ownership.",
    "",
    "## Configuration First",
    "",
    "Document configuration."
  ].join("\n"));

  const result = spawnSync("node", [
    path.join(repoRoot, "skills/docdriven-audit/scripts/audit-docdriven.mjs"),
    "--root",
    root,
    "--format",
    "json"
  ], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  const output = JSON.parse(result.stdout);
  assert.ok(
    output.findings.some((finding) => finding.code === "undocumented-reuse-pattern"),
    "expected audit to report undocumented-reuse-pattern"
  );
}

function makeTempProject(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
}

function read(root, relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}
