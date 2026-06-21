# TypeScript Library Template — AI Source of Truth

This repository is a pnpm monorepo template for shipping a TypeScript library from `lib/`, with `docs/` and `example/` workspaces.
`AGENTS.md` and `CLAUDE.md` are symlink mirrors of this file.

## Baseline Rules

- Keep TypeScript strict; do not introduce `any` without a concrete reason.
- Keep library exports side-effect free and tree-shakeable.
- Use named exports from `lib/src/index.ts`.
- Do not change scripts/docs inconsistently. If command behavior changes, update docs in the same change.
- Prefer workspace-aware paths and commands (`pnpm -C <workspace> ...`).
- Prefer maintainable shell/workflow code over clever one-liners.

## CI/Workflow Script Quality

- Keep shell steps readable and reviewable; avoid dense inline `node -e`/`perl` one-liners when a clear `jq` or multiline shell block works.
- Prefer deterministic artifact paths and outputs (for example parse `pnpm pack --json`) instead of filesystem glob guessing when possible.
- When parsing command output, include explicit null/empty checks and clear error messages.
- Reuse composite actions for repeated workflow logic to avoid drift between workflows.
- Don't use insecure tag or branch references in actions; prefer local actions or exact commit references for external actions.

## Workspace Map

- `lib/` — publishable package (`package.json` exports, Vite build, Vitest tests).
- `docs/` — user-facing documentation workspace.
- `example/` — consumer integration workspace.

## Path-Specific Instructions

Use scoped instruction files (GitHub `.instructions.md` with `applyTo`):

- `.github/instructions/lib.instructions.md`
- `.github/instructions/docs.instructions.md`
- `.github/instructions/example.instructions.md`

These scoped files are authoritative for code under their paths.

## Reusable Prompt Files

- `.github/prompts/review-package.prompt.md`
- `.github/prompts/add-export.prompt.md`
- `.github/prompts/prepare-release.prompt.md`

## Custom Agent Roles

- `.github/agents/reviewer.agent.md`
- `.github/agents/release.agent.md`

## Outcome Standard

Changes should leave the template in a state where a new team can:

- install dependencies,
- run lint/typecheck/test,
- build and verify the package.

## Required Verification Commands

- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run verify:package`
