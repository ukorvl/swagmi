import type { SizeLimitConfig } from "size-limit";

import packageJson from "./package.json" with { type: "json" };

const esmPath = packageJson.module || packageJson.main;

if (!esmPath) {
  throw new Error("Set `module` or `main` in lib/package.json for size-limit.");
}

const config: SizeLimitConfig = [
  {
    name: "ESM",
    path: esmPath,
    limit: "5 kB",
    brotli: true,
  },
];

export default config;
