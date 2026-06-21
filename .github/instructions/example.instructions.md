---
applyTo: "example/**"
---

# Example Workspace (`example/`) Instructions

This workspace is the canonical consumer integration example.
Use it to prove that a clean external project can install and use the package without hidden repo-only setup.

## Technical Rules

- Keep dependency on `typescript-library-template` as `workspace:*`.
- Import from the package name, never from `../lib/src/*`.
- Do not add TS/Vite alias hacks that bypass package resolution.
- Demonstrate at least one runtime import and one type usage when possible.
- Keep setup understandable for first-time template adopters.

## Example Quality Expectations

- Reflect current public exports from `lib/src/index.ts`.
- Prefer small, realistic usage snippets over synthetic demos.
- When API changes, update example code in the same change.

## Required Validation For `example/` Changes

```bash
pnpm -C example run typecheck
pnpm -C example run test
```

## Interop Expectations

- Example should fail fast on stale/broken exports rather than masking issues with local path workarounds.
