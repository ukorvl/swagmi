# Add Public Export

Add a new public export to the library safely and update all related surfaces.

## Inputs

- Export name(s)
- Source file path
- Whether export is type-only or runtime
- Any expected example usage

## Required Changes

1. Add export in `lib/src/index.ts`.
2. Ensure implementation exists and is typed.
3. Add or update tests in `lib/` for behavior and types.
4. Update example/docs usage if the export is user-facing.
5. Verify package output still resolves correctly after build.

## Required Validation

Run:

- `pnpm -C lib run test`
- `pnpm -C lib run typecheck`
- `pnpm run verify:package`
- `pnpm -C example run typecheck`
- `pnpm run lint`

## Output Format

- Summary of code changes
- API diff (what was newly exported)
- Validation command results
- Backward-compatibility notes
- Follow-up actions, if any
