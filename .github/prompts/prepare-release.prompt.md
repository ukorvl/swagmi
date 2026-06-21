# Prepare Release

Prepare a release candidate for the `lib/` package with packaging and CI integrity checks.

## Checklist

1. Confirm versioning state:
   - `lib/package.json` and `lib/jsr.json` versions match.
2. Build and validate package:
   - `pnpm run verify:package`
   - `pnpm -C lib exec size-limit --json`
3. Validate repo gates:
   - `pnpm run lint`
   - `pnpm run typecheck`
   - `pnpm run test`
4. Create and inspect tarball:
   - `pnpm -C lib pack`
5. Confirm release security posture:
   - Dependency review and CodeQL workflows present
   - Build provenance/attestation workflow present

## Output

- Release readiness summary (`ready` or `blocked`)
- Recommended semver bump (`patch`/`minor`/`major`)
- Blocking issues with file references
- Exact next commands to unblock release
- Release notes draft (short)
