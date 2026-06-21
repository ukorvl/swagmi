---
applyTo: "lib/**"
---

# Library Workspace (`lib/`) Instructions

This workspace is the package users install from npm.
Optimize for durable API design, predictable packaging, and low-friction upgrades for teams adopting this template.

## Technical Rules

- Keep the public API intentional and explicit in `lib/src/index.ts`.
- Preserve ESM-first packaging and export map correctness.
- Keep `sideEffects: false` assumptions true (no top-level runtime side effects in public entries).
- Keep `main`, `module`, `types`, and `exports` aligned with Vite output files.
- Avoid template placeholder metadata in publish-facing fields.

## API Quality Expectations

- New exports should include a realistic usage path (tests and/or example updates).
- Runtime exports and type-only exports must remain tree-shake friendly.
- Breaking API changes require clear migration notes in docs/changelog updates.

## Required Validation For `lib/` Changes

Run these before finalizing:

```bash
pnpm -C lib run build
pnpm -C lib run typecheck
pnpm -C lib run test
pnpm run verify:package
```

## Packaging and Release Quality

- Keep `attw` and `publint --strict` passing.
- Ensure `size-limit` config points to real built artifacts.
- When package metadata changes, verify tarball contents with `pnpm -C lib pack`.
- Keep release workflows aligned with package behavior (build, verify, provenance).
