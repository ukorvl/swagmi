# Review Package Integrity

Review this repository as a publishable TypeScript library package.

## Focus Areas

1. Export correctness in `lib/package.json` (`main`, `module`, `types`, `exports`).
2. Packaging quality (`attw`, `publint --strict`, tarball contents).
3. Size budget sanity (`size-limit` config and inputs).
4. CI and security gates (dependency review, CodeQL, attestations).
5. Docs/example alignment with actual shipped behavior.

## Steps

1. Run:
   - `pnpm run verify:package`
   - `pnpm -C lib exec size-limit --json`
   - `pnpm run lint && pnpm run typecheck && pnpm run test`
2. Inspect:
   - `lib/package.json`
   - `lib/vite.config.ts`
   - `lib/.size-limit.ts`
   - `lib/src/index.ts`
   - `example/src/**`
   - `docs/**`
   - `.github/workflows/*.yaml`
3. Report:
   - Findings sorted by severity (`P0`..`P3`)
   - Exact file references and concrete fix suggestions
   - Residual risks and missing tests/checks
