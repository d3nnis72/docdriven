#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const root = valueAfter("--root") || process.cwd();
const format = valueAfter("--format") || "text";
const docsRoot = valueAfter("--docs-root") || "Docs";
const docs = path.join(root, docsRoot);

const requiredFiles = [
  "README.md",
  "human/overview.md",
  "human/setup.md",
  "human/commands.md",
  "human/architecture.md",
  "agent/context-map.md",
  "agent/update-protocol.md",
  "agent/validation.md",
  "agent/writing-style.md",
  "agent/naming.md",
  "agent/gaps.md",
  "knowledge/README.md",
  "knowledge/architecture/README.md",
  "knowledge/features/README.md",
  "knowledge/interfaces/README.md",
  "knowledge/operations/README.md",
  "tmp/README.md"
];

const requiredColumns = [
  "Task type",
  "Read first",
  "Canonical docs",
  "Code areas",
  "Update docs",
  "Validation",
  "Owner"
];

const sizeTargets = [
  { pattern: /(^|\/)README\.md$/, maxWords: 250, type: "router" },
  { pattern: /\/human\//, maxWords: 700, type: "human" },
  { pattern: /\/agent\//, maxWords: 500, type: "agent" },
  { pattern: /\/knowledge\//, maxWords: 1000, type: "knowledge" }
];

const findings = [];

checkRequiredFiles();
const routeGraph = checkManifest();
checkContextMap();
checkSizes();
checkTmp();
checkOwnedCodeMarkers();
if (routeGraph) {
  checkRouteGraph(routeGraph);
  checkContextMapRouteIds(routeGraph);
  checkOrphanKnowledgeDocs(routeGraph);
}
checkPlaceholders();

if (format === "json") {
  console.log(JSON.stringify({ findings }, null, 2));
} else {
  printText(findings);
}

process.exit(findings.some((finding) => finding.severity === "error") ? 1 : 0);

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
}

function checkRequiredFiles() {
  for (const relative of requiredFiles) {
    const file = path.join(docs, relative);
    if (!fs.existsSync(file)) {
      findings.push({
        severity: "error",
        code: "missing-required-file",
        file: path.relative(root, file),
        message: "Required DocDriven file is missing."
      });
    }
  }
}

function checkManifest() {
  const file = path.join(docs, "agent", "manifest.json");
  if (!fs.existsSync(file)) {
    findings.push({
      severity: "warning",
      code: "missing-manifest",
      file: path.relative(root, file),
      message: "Route graph manifest is missing. Add Docs/agent/manifest.json for scalable routing."
    });
    return null;
  }

  let manifest;
  try {
    manifest = readJson(file);
  } catch (error) {
    findings.push({
      severity: "error",
      code: "invalid-manifest-json",
      file: path.relative(root, file),
      message: `Manifest JSON is invalid: ${error.message}`
    });
    return null;
  }

  if (!Array.isArray(manifest.routeIndexes) || manifest.routeIndexes.length === 0) {
    findings.push({
      severity: "error",
      code: "missing-route-indexes",
      file: path.relative(root, file),
      message: "Manifest must define a non-empty routeIndexes array."
    });
    return null;
  }

  const shards = [];
  for (const relative of manifest.routeIndexes) {
    const shardFile = docsPath(relative);
    if (!fs.existsSync(shardFile)) {
      findings.push({
        severity: "error",
        code: "missing-route-shard",
        file: path.relative(root, shardFile),
        message: `Manifest references a missing route shard: ${relative}.`
      });
      continue;
    }
    try {
      shards.push({ file: shardFile, relative, data: readJson(shardFile) });
    } catch (error) {
      findings.push({
        severity: "error",
        code: "invalid-route-shard-json",
        file: path.relative(root, shardFile),
        message: `Route shard JSON is invalid: ${error.message}`
      });
    }
  }

  return { manifest, shards };
}

function checkContextMap() {
  const file = path.join(docs, "agent", "context-map.md");
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  const header = content
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith("| Route ID |") || line.trim().startsWith("| Task type |"));
  if (!header) {
    findings.push({
      severity: "error",
      code: "missing-route-table",
      file: path.relative(root, file),
      message: "Context map must contain a route table header."
    });
    return;
  }
  for (const column of requiredColumns) {
    if (!header.includes(column)) {
      findings.push({
        severity: "error",
        code: "missing-route-column",
        file: path.relative(root, file),
        message: `Context map is missing required column: ${column}.`
      });
    }
  }
  if (header.includes("Route ID")) return;
  findings.push({
    severity: "warning",
    code: "missing-route-id-column",
    file: path.relative(root, file),
    message: "Context map should include a Route ID column that matches route shards."
  });
}

function checkRouteGraph(routeGraph) {
  const ids = new Map();
  for (const shard of routeGraph.shards) {
    const lineCount = fs.readFileSync(shard.file, "utf8").split(/\r?\n/).length;
    if (lineCount > 500) {
      findings.push({
        severity: "warning",
        code: "oversized-route-shard",
        file: path.relative(root, shard.file),
        message: `Route shard has ${lineCount} lines; split shards above 500 lines.`
      });
    }

    if (!Array.isArray(shard.data.routes)) {
      findings.push({
        severity: "error",
        code: "missing-routes-array",
        file: path.relative(root, shard.file),
        message: "Route shard must define a routes array."
      });
      continue;
    }

    for (const route of shard.data.routes) {
      checkRouteSchema(route, shard.file);
      if (!route || !route.id) continue;
      if (ids.has(route.id)) {
        findings.push({
          severity: "error",
          code: "duplicate-route-id",
          file: path.relative(root, shard.file),
          message: `Route ID is duplicated: ${route.id}. First seen in ${ids.get(route.id)}.`
        });
      } else {
        ids.set(route.id, path.relative(root, shard.file));
      }
      checkRouteDocs(route, shard.file);
      checkRouteCodeAreas(route, shard.file);
      checkRouteValidation(route, shard.file);
    }
  }
}

function checkRouteSchema(route, file) {
  const required = ["id", "readFirst", "canonicalDocs", "codeAreas", "updateDocs", "validation", "owner"];
  if (!route || typeof route !== "object") {
    findings.push({
      severity: "error",
      code: "invalid-route",
      file: path.relative(root, file),
      message: "Route entries must be objects."
    });
    return;
  }
  for (const key of required) {
    if (!(key in route)) {
      findings.push({
        severity: "error",
        code: "missing-route-field",
        file: path.relative(root, file),
        message: `Route ${route.id || "(missing id)"} is missing required field: ${key}.`
      });
    }
  }
  if (typeof route.priority !== "number") {
    findings.push({
      severity: "error",
      code: "invalid-route-priority",
      file: path.relative(root, file),
      message: `Route ${route.id || "(missing id)"} must define numeric priority.`
    });
  }
}

function checkRouteDocs(route, file) {
  for (const key of ["readFirst", "canonicalDocs", "updateDocs"]) {
    for (const relative of arrayValue(route[key])) {
      if (isLooseValue(relative)) continue;
      const absolute = docsPath(stripTicks(relative));
      if (!fs.existsSync(absolute)) {
        findings.push({
          severity: "error",
          code: "missing-route-doc",
          file: path.relative(root, file),
          message: `Route ${route.id} references missing ${key} doc: ${relative}.`
        });
      }
    }
  }
}

function checkRouteCodeAreas(route, file) {
  for (const area of arrayValue(route.codeAreas)) {
    const value = stripTicks(area);
    if (isLooseValue(value)) continue;
    if (matchRepoPaths(value).length === 0) {
      findings.push({
        severity: "warning",
        code: "unmatched-code-area",
        file: path.relative(root, file),
        message: `Route ${route.id} code area matches no files: ${value}.`
      });
    }
  }
}

function checkRouteValidation(route, file) {
  const values = arrayValue(route.validation);
  const nonTemporary = !(arrayValue(route.taskTypes).join(" ").toLowerCase().includes("temporary"));
  if (values.length === 0 && nonTemporary) {
    findings.push({
      severity: "warning",
      code: "missing-validation",
      file: path.relative(root, file),
      message: `Route ${route.id} has no validation evidence.`
    });
  }
  for (const value of values) {
    const normalized = String(value).toLowerCase();
    if (nonTemporary && (!normalized || normalized === "none" || normalized.includes("not detected"))) {
      findings.push({
        severity: "warning",
        code: "weak-validation",
        file: path.relative(root, file),
        message: `Route ${route.id} has weak validation: ${value}.`
      });
    }
  }
}

function checkSizes() {
  for (const file of markdownFiles(docs)) {
    const relative = path.relative(root, file);
    const normalized = relative.split(path.sep).join("/");
    const content = fs.readFileSync(file, "utf8");
    const words = countWords(content);
    const target = sizeTargets.find((entry) => entry.pattern.test(`/${normalized}`));
    if (target && words > target.maxWords) {
      findings.push({
        severity: "warning",
        code: "oversized-doc",
        file: relative,
        message: `${target.type} doc has ${words} words; target is ${target.maxWords}.`
      });
    }
  }
}

function checkTmp() {
  const tmpDir = path.join(docs, "tmp");
  if (!fs.existsSync(tmpDir)) return;
  for (const file of markdownFiles(tmpDir)) {
    const relativeToTmp = path.relative(tmpDir, file);
    if (relativeToTmp !== "README.md") {
      findings.push({
        severity: "info",
        code: "tmp-content",
        file: path.relative(root, file),
        message: "Tmp content exists. Confirm it is not durable project truth."
      });
    }
  }
}

function checkOwnedCodeMarkers() {
  for (const file of markdownFiles(docs)) {
    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/owned-code:\s*(.+)$/i);
      if (!match) continue;
      const ownedPath = match[1].trim().replace(/^`|`$/g, "");
      const absolute = path.join(root, ownedPath);
      if (!fs.existsSync(absolute)) {
        findings.push({
          severity: "warning",
          code: "missing-owned-code",
          file: path.relative(root, file),
          message: `owned-code path does not exist: ${ownedPath}.`
        });
      }
    }
  }
}

function checkPlaceholders() {
  const patterns = [
    /TODO:/i,
    /This is the short human architecture summary\./,
    /inspect manually/i,
    /unknown/i,
    /not detected/i
  ];
  for (const file of markdownFiles(docs)) {
    const content = fs.readFileSync(file, "utf8");
    const matched = patterns.find((pattern) => pattern.test(content));
    if (!matched) continue;
    findings.push({
      severity: "warning",
      code: "placeholder-text",
      file: path.relative(root, file),
      message: `Doc contains generated placeholder or unresolved text matching ${matched}.`
    });
  }
}

function checkContextMapRouteIds(routeGraph) {
  const file = path.join(docs, "agent", "context-map.md");
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  if (!content.includes("| Route ID |")) return;

  const routeIds = new Set(routeGraph.shards.flatMap((shard) => (shard.data.routes || []).map((route) => route.id).filter(Boolean)));
  const mapIds = new Set(
    content
      .split(/\r?\n/)
      .filter((line) => line.trim().startsWith("|") && !line.includes("---") && !line.includes("Route ID"))
      .map((line) => line.split("|")[1]?.trim())
      .filter(Boolean)
  );

  for (const id of routeIds) {
    if (!mapIds.has(id)) {
      findings.push({
        severity: "warning",
        code: "context-map-missing-route",
        file: path.relative(root, file),
        message: `Context map is missing route ID from manifest: ${id}.`
      });
    }
  }
  for (const id of mapIds) {
    if (!routeIds.has(id)) {
      findings.push({
        severity: "warning",
        code: "context-map-extra-route",
        file: path.relative(root, file),
        message: `Context map has route ID not found in manifest: ${id}.`
      });
    }
  }
}

function checkOrphanKnowledgeDocs(routeGraph) {
  const referenced = new Set();
  for (const shard of routeGraph.shards) {
    for (const route of shard.data.routes || []) {
      for (const key of ["readFirst", "canonicalDocs", "updateDocs"]) {
        for (const relative of arrayValue(route[key])) {
          if (String(relative).startsWith("knowledge/")) referenced.add(stripTicks(relative));
        }
      }
    }
  }

  for (const file of markdownFiles(path.join(docs, "knowledge"))) {
    const relative = path.relative(docs, file).split(path.sep).join("/");
    if (relative.endsWith("/README.md")) continue;
    if (!referenced.has(relative)) {
      findings.push({
        severity: "warning",
        code: "orphan-knowledge-doc",
        file: path.relative(root, file),
        message: "Knowledge doc is not referenced by any route."
      });
    }
  }
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function docsPath(relative) {
  return path.join(docs, stripTicks(relative));
}

function stripTicks(value) {
  return String(value).trim().replace(/^`|`$/g, "");
}

function arrayValue(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function isLooseValue(value) {
  const normalized = String(value).trim().toLowerCase();
  return ["", "none", "none until promoted", "inspect manually", "documented setup check"].includes(normalized);
}

function matchRepoPaths(pattern) {
  const normalized = pattern.split(path.sep).join("/");
  if (normalized.endsWith("/**")) {
    const prefix = normalized.slice(0, -3);
    return allFiles(root).filter((file) => {
      const relative = path.relative(root, file).split(path.sep).join("/");
      return relative === prefix || relative.startsWith(`${prefix}/`);
    });
  }
  const exact = path.join(root, normalized);
  if (fs.existsSync(exact)) return [exact];
  return [];
}

function allFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allFiles(absolute));
    if (entry.isFile()) out.push(absolute);
  }
  return out;
}

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...markdownFiles(absolute));
    if (entry.isFile() && entry.name.endsWith(".md")) out.push(absolute);
  }
  return out;
}

function countWords(content) {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function printText(items) {
  if (items.length === 0) {
    console.log("DocDriven audit passed: no findings.");
    return;
  }
  for (const finding of items) {
    console.log(`[${finding.severity}] ${finding.code}: ${finding.file}`);
    console.log(`  ${finding.message}`);
  }
}
