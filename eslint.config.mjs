import js from "@eslint/js";
import pluginImport from "eslint-plugin-import";
import jsdoc from "eslint-plugin-jsdoc";
import noSecrets from "eslint-plugin-no-secrets";
import packageJson from "eslint-plugin-package-json";
import perfectionist from "eslint-plugin-perfectionist";
import promisePlugin from "eslint-plugin-promise";
import * as regexpPlugin from "eslint-plugin-regexp";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import vitest from "eslint-plugin-vitest";
import globals from "globals";
import * as jsoncParser from "jsonc-eslint-parser";
import tseslint from "typescript-eslint";

const rootTsFiles = ["*.{ts,mts,cts}"];
const workspaceTsFiles = ["{lib,docs,example}/**/*.{ts,mts,cts,tsx}"];
const scriptsTsFiles = ["scripts/**/*.{ts,mts,cts}", "*/scripts/**/*.{ts,mts,cts}"];
const allTsFiles = [...rootTsFiles, ...workspaceTsFiles, ...scriptsTsFiles];

const rootJsFiles = ["*.{js,mjs,cjs}"];
const workspaceJsFiles = ["{lib,docs,example}/**/*.{js,mjs,cjs,jsx}"];
const scriptsJsFiles = ["scripts/**/*.{js,mjs,cjs}", "*/scripts/**/*.{js,mjs,cjs}"];
const allJsFiles = [...rootJsFiles, ...workspaceJsFiles, ...scriptsJsFiles];

const allCodeFiles = [...allTsFiles, ...allJsFiles];
const allJsonFiles = ["**/*.json"];
const packageJsonFiles = ["**/package.json"];
const sourceCodeFiles = [
  "lib/**/*.{ts,mts,cts,tsx,js,mjs,cjs,jsx}",
  "scripts/**/*.{ts,mts,cts,js,mjs,cjs}",
];
const testFiles = [
  "**/*.test.{ts,tsx,js,jsx,mts,cts,mjs,cjs}",
  "**/*.spec.{ts,tsx,js,jsx,mts,cts,mjs,cjs}",
];

const tsConfigs = tseslint.configs.recommendedTypeChecked.map(config => ({
  ...config,
  files: allTsFiles,
}));
const importResolverProjects = [
  "./tsconfig.json",
  "./lib/tsconfig.json",
  "./docs/tsconfig.json",
  "./example/tsconfig.json",
];

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/build/**",
      "**/.astro/**",
      "*.tgz",
    ],
  },
  {
    files: allJsonFiles,
    languageOptions: {
      parser: jsoncParser,
    },
  },
  {
    ...packageJson.configs.recommended,
    files: packageJsonFiles,
    settings: {
      packageJson: {
        enforceForPrivate: false,
      },
    },
  },
  {
    ...js.configs.recommended,
    files: allJsFiles,
  },
  ...tsConfigs,
  {
    files: allCodeFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: allTsFiles,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-magic-numbers": ["warn", { ignoreArrayIndexes: true }],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "no-debugger": "warn",
      "no-duplicate-imports": "error",
      "no-redeclare": "error",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-var": "warn",
      "object-shorthand": "error",
      "prefer-const": "warn",
      "prefer-template": "error",
    },
  },
  {
    files: [
      "*.config.{ts,js,mjs,cjs}",
      "commitlint.config.ts",
      "eslint.config.mjs",
      "{lib,docs,example}/**/*config.{ts,js,mjs,cjs}",
    ],
    rules: {
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  {
    files: allCodeFiles,
    plugins: {
      import: pluginImport,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          noWarnOnMultipleProjects: true,
          project: importResolverProjects,
        },
      },
    },
    rules: {
      "import/no-cycle": "error",
      "import/no-deprecated": "warn",
      "import/no-unresolved": "error",
      "import/no-unused-modules": "warn",
    },
  },
  {
    files: allCodeFiles,
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": ["error", { order: "asc", type: "natural" }],
      "perfectionist/sort-named-exports": ["error", { order: "asc", type: "natural" }],
      "perfectionist/sort-named-imports": ["error", { order: "asc", type: "natural" }],
    },
  },
  {
    ...unicorn.configs["recommended"],
    files: allCodeFiles,
    rules: {
      ...unicorn.configs["recommended"].rules,
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/import-style": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-sort": "warn",
      "unicorn/no-nested-ternary": "warn",
      "unicorn/no-null": "off",
      "unicorn/prefer-module": "warn",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
    ...sonarjs.configs.recommended,
    files: allCodeFiles,
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/no-nested-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    ...regexpPlugin.configs["flat/recommended"],
    files: allCodeFiles,
  },
  {
    ...promisePlugin.configs["flat/recommended"],
    files: allCodeFiles,
  },
  {
    files: sourceCodeFiles,
    plugins: {
      "no-secrets": noSecrets,
      security,
    },
    rules: {
      "no-secrets/no-secrets": ["warn", { tolerance: 4 }],
      "security/detect-non-literal-regexp": "warn",
      "security/detect-object-injection": "off",
      "security/detect-unsafe-regex": "error",
    },
  },
  {
    ...jsdoc.configs["flat/recommended-typescript"],
    files: ["lib/src/**/*.{ts,tsx}"],
    rules: {
      ...jsdoc.configs["flat/recommended-typescript"].rules,
      "jsdoc/check-types": "off",
      "jsdoc/require-file-overview": "off",
      "jsdoc/require-jsdoc": ["warn", { publicOnly: true }],
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns-type": "off",
      "jsdoc/valid-types": "off",
    },
  },
  {
    files: testFiles,
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "no-console": "warn",
      "vitest/max-nested-describe": ["error", { max: 3 }],
      "vitest/prefer-lowercase-title": ["error", { ignore: ["describe"] }],
      "vitest/prefer-to-be": "error",
      "vitest/prefer-to-contain": "error",
      "vitest/prefer-to-have-length": "error",
    },
  },
];
