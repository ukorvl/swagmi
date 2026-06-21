<div align="center">
  <h2 align="center">TypeScript Library Template</h2>
  <p>
    This template is a modern foundation for building TypeScript ESM-first libraries with a setup that reflects how serious packages are built today. It includes strong defaults for type safety, package validation, CI, release hygiene, and AI-assisted development, helping you avoid common setup mistakes and ship with more confidence. Whether you are building for Node.js, browser, or both, it gives you a clean, future-facing base without overengineering the project from day one.
  </p>
  <br />
  <p align="center">
    <a href="https://shields.io/docs/static-badges">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/version-0.0.0--template-1e2029?style=flat&logo=npm&logoColor=ffffff">
        <img src="https://img.shields.io/badge/version-0.0.0--template-ffcc00?style=flat&logo=npm&logoColor=000000" alt="Version">
      </picture>
    </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/downloads-mock-1e2029?style=flat&logo=npm&logoColor=ffffff">
      <img src="https://img.shields.io/badge/downloads-mock-ffcc00?style=flat&logo=npm&logoColor=000000" alt="Downloads">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/build-mock--passing-1e2029?style=flat&logo=githubactions&logoColor=ffffff">
      <img src="https://img.shields.io/badge/build-mock--passing-ffcc00?style=flat&logo=githubactions&logoColor=000000" alt="Build Status">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-MIT-1e2029?style=flat">
      <img src="https://img.shields.io/badge/license-MIT-ffcc00?style=flat" alt="License">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/bundle-size%20mock-1e2029?style=flat">
      <img src="https://img.shields.io/badge/bundle-size%20mock-ffcc00?style=flat" alt="Minified size">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/code%20style-eslint-1e2029?style=flat">
      <img src="https://img.shields.io/badge/code%20style-eslint-ffcc00?style=flat" alt="Code Style">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/module-ESM--first-1e2029?style=flat">
      <img src="https://img.shields.io/badge/module-ESM--first-ffcc00?style=flat" alt="ESM-first">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/contributions-welcome-1e2029?style=flat">
      <img src="https://img.shields.io/badge/contributions-welcome-ffcc00?style=flat" alt="Contributions">
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcset="https://img.shields.io/badge/coverage-100%25%20mock-1e2029?style=flat&logo=coveralls&logoColor=ffffff"
      >
      <img
        src="https://img.shields.io/badge/coverage-100%25%20mock-ffcc00?style=flat&logo=coveralls&logoColor=000000"
        alt="Coverage"
      >
    </picture>
  </a>

  <a href="https://shields.io/docs/static-badges">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/jsr-template-1e2029?style=flat&logo=javascript&logoColor=ffffff">
      <img src="https://img.shields.io/badge/jsr-template-ffcc00?style=flat&logo=javascript&logoColor=000000" alt="Jsr version">
    </picture>
  </a>
</p>
</div>

> [!NOTE]
> Fill these shields with real data before your first release, or remove them if you prefer to add them later. They are just placeholders to show how you can create beautiful static badges with icons and dark mode support.

<div align="center">
  <img
    alt="Illustration of a TypeScript library template as a stack of hotcakes"
    src="https://raw.githubusercontent.com/ukorvl/design/master/typescript-library-template/typescript-hotcake.png"
    loading="lazy"
    width="200"
    height="200"
  />
  <p>
    Churn out your own TypeScript libraries with this template - like hotcakes!
  </p>
  <br />
</div>

> [!NOTE]
> **This repository is a template:** Replace placeholder data (name, URLs, emails, owners, and publish settings) before your first public release.

<h2 align="center">What you get with this template</h2>

- _AI-friendly by default_ - the repository already includes _deterministic_ instructions for coding agents, making it easier to use AI tools.
- _Start fast_ without wiring the basics from scratch - the template already gives you a modern TypeScript library foundation, so you can focus on building your package instead of assembling tooling for days.
- _Strong code quality from day one_ - strict linting, formatting, and type-checking help catch problems early and keep the codebase consistent. All linters configs are carefully curated to balance strictness with developer experience.
- A modern library setup that feels _production-minded_ - build, test, package validation, and workspace structure are already in place.
- Confidence in your _package output_ - included checks help validate typings, exports, and package quality before you publish.
- Better _dependency hygiene_ - the repo includes tooling that helps detect unused files and checks for production dependency issues.
- _Future-facing TypeScript support_ - the setup is designed to stay aligned with current and upcoming TypeScript versions and best practices.

<h2 align="center">Workspace layout</h2>

- `lib/` publishable package workspace.
- `docs/` minimal Vite docs shell that uses package imports.
- `example/` minimal Vite consumer integration workspace.

<h2 align="center">Quick start</h2>

**Prerequisites**

- Node.js `>=20.19.0 <25`
- pnpm `>=10.32.0`

Use GitHub's **Use this template** button first, then clone your repository and bootstrap it:

```sh
REPO_URL="https://github.com/<owner>/<repo>.git"
git clone "$REPO_URL"
cd "$(basename "${REPO_URL%.git}")"
pnpm install
```

This template intentionally uses generic placeholder metadata and repository links. Update them to your organization values before publishing.

> [!NOTE]
> Before running the publish workflow, configure your package as an **npm Trusted Publisher** for this repository/workflow. This enables **OIDC-based publishing from GitHub Actions** and removes the need for a long-lived `NPM_TOKEN`. [npm’s Trusted Publishers guide](https://docs.npmjs.com/trusted-publishers) for setup steps.
>
> Trusted publishing requires **npm CLI `>=11.5.1`** and **Node.js `>=22.14.0`** in the publishing environment. The publish workflow in this template runs on Node `24`, which satisfies that requirement.
>
> If your package is **scoped** (for example `@your-scope/your-package`) and you are publishing it **publicly for the first time**, npm requires `npm publish --access public`. After the first successful public publish, later versions do not need that flag. See [npm’s scoped package publishing docs](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages).

<h2 align="center">First publish checklist</h2>

- [ ] Update package metadata in `lib/package.json`: `name`, `description`, `author`, `homepage`, `bugs.url`, `repository.url`, and `repository.directory` (if your package is not in `lib/`).
- [ ] Update root metadata in `package.json`: `name`, `description`, and `author`.
- [ ] Replace template scope/name values in `lib/jsr.json` (for example `name` currently uses `@your-scope/...`).
- [ ] Replace template placeholders in `lib/readme.md` (mirrored at root `readme.md`): badges, links, and branding text.
- [ ] Configure npm Trusted Publisher for this repo/workflow (`.github/workflows/publish.yaml`).
- [ ] Run release gates before your first publish:

```sh
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run verify:package
```

<h2 align="center">Tooling Stack</h2>

- **Vite 8** for fast builds and dev workflows across `lib/`, `docs/`, and `example/`.
- **TypeScript (strict mode)** for strong type safety and predictable library APIs.
- **Vitest + V8 coverage** for fast tests with built-in coverage reporting.
- **ESLint 9 + TypeScript ESLint + security-focused plugins** to catch correctness and safety issues early.
- **Prettier + JSON/package sorting plugins** for consistent formatting across code and config.
- **Knip** to detect unused files, dependencies, and exports.
- **AreTheTypesWrong (`attw`) + publint** to validate package exports and publish quality.
- **size-limit** with CI reporting to keep bundle size changes visible in pull requests.
- **Commit quality gates** with `commitlint`, `lint-staged`, and `simple-git-hooks`.
- **Supply-chain aware release pipeline** with npm provenance, SBOM generation, and GitHub artifact attestations.

...and other carefully selected tools for day-to-day DX and release reliability.

<h2 align="center">License</h2>

This project is licensed under the [MIT License](./LICENSE). You can freely use, modify, and distribute this template as per the terms of the license.
