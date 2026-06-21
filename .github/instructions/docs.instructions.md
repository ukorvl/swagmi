---
applyTo: "docs/**"
---

# Docs Workspace (`docs/`) Instructions

This workspace defines the documentation experience for library users.
Treat it as product-facing surface area: setup instructions, API guidance, and upgrade paths must stay accurate.

## Technical Rules

- Use package imports exactly as consumers do (`typescript-library-template`), not internal source paths.
- Keep docs examples executable or type-checkable whenever possible.
- If a docs framework/site is introduced, wire stable `dev` and `build` scripts in `docs/package.json`.
- Keep commands and paths copy-paste safe for first-time users of this template.

## Content Expectations

- Provide and maintain: getting started, API usage, configuration, troubleshooting.
- When public exports change in `lib/src/index.ts`, update docs in the same change.
- Document supported Node and package-manager versions consistently with root `package.json`.

## Required Validation For `docs/` Changes

```bash
pnpm -C docs run typecheck
pnpm -C docs run test
pnpm run lint:md-links
```

## Documentation Integrity

- If docs mention exports/build outputs, verify against `lib/package.json` and `lib/vite.config.ts`.
- If docs mention CI/release checks, verify against `.github/workflows` and `.github/actions`.
- Keep README/docs wording aligned with actual scripts to avoid onboarding drift.
