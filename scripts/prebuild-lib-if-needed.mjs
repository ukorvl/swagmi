#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(scriptDir, "..");
const libDir = join(repoRoot, "lib");
const libPackageJsonPath = join(libDir, "package.json");

const libPackageJson = JSON.parse(readFileSync(libPackageJsonPath, "utf8"));
const libPackageBaseName = String(libPackageJson.name ?? "")
  .split("/")
  .pop();

if (!libPackageBaseName) {
  console.error(`Error: Missing package name in '${libPackageJsonPath}'.`);
  process.exit(1);
}

const requiredArtifacts = [
  join(libDir, "dist", "index.d.ts"),
  join(libDir, "dist", `${libPackageBaseName}.mjs`),
];

if (requiredArtifacts.every(filePath => existsSync(filePath))) {
  process.exit(0);
}

console.log("lib build artifacts are missing. Building lib...");

// eslint-disable-next-line sonarjs/no-os-command-from-path
const build = spawnSync("pnpm", ["-C", libDir, "run", "build"], {
  stdio: "inherit",
});

if (build.error) {
  console.error(`Error: Failed to run pnpm build: ${build.error.message}`);
  process.exit(1);
}

process.exit(build.status ?? 1);
