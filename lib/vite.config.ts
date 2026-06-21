import camelCase from "camelcase";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import circularDependency from "vite-plugin-circular-dependency";
import dts from "vite-plugin-dts";

import packageJson from "./package.json" with { type: "json" };
import { prependEntryBannerPlugin } from "./vite/plugins/prepend-entry-banner";

const __dirname = dirname(fileURLToPath(import.meta.url));

const packageName = packageJson.name;
const packageFileBaseName = packageName.split("/").at(-1) ?? packageName;
const packageVersion = packageJson.version;
const packageLicense = packageJson.license;
const packageDependencies = (
  "dependencies" in packageJson ? packageJson.dependencies : {}
) as Record<string, string>;
const packagePeerDependencies = (
  "peerDependencies" in packageJson ? packageJson.peerDependencies : {}
) as Record<string, string>;
const externalPackages = Object.keys({
  ...packageDependencies,
  ...packagePeerDependencies,
});
const umdGlobals = {
  "@tanstack/react-query": "TanStackReactQuery",
  react: "React",
  "react-dom": "ReactDOM",
  viem: "Viem",
  wagmi: "Wagmi",
};

const umdGlobalName = camelCase(packageName.replace(/^@/u, "").split("/"), {
  pascalCase: true,
});

export default defineConfig(() => {
  const plugins = [
    circularDependency({
      circleImportThrowErr: true,
    }),
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
    }),
    prependEntryBannerPlugin({
      packageLicense,
      packageName,
      packageVersion,
    }),
  ];

  return {
    plugins,
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      minify: true,
      sourcemap: true,
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: umdGlobalName,
        formats: ["es", "umd"],
        fileName: format => {
          if (format === "es") return `${packageFileBaseName}.mjs`;
          if (format === "umd") return `${packageFileBaseName}.umd.js`;
          return `${packageFileBaseName}.js`;
        },
      },
      rollupOptions: {
        external: identifier =>
          externalPackages.some(
            externalPackage =>
              identifier === externalPackage ||
              identifier.startsWith(`${externalPackage}/`)
          ),
        output: {
          globals: umdGlobals,
        },
      },
    },
  };
});
