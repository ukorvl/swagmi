# Agents guide

## Project overview

## Environment setup

### Package manager

- Only `pnpm` is supported in this repository. `npm` and `yarn` are not supported and should be treated as invalid choices for install, build, test, and workspace operations.
- For workspace-specific commands, use the `-F` flag instead of changing directories.
- Never use `cd` to move into package directories just to run commands.

Examples:

- `pnpm -F @ukorvl/swagmi build`
- `pnpm -F @ukorvl/swagmi test`
- `pnpm -F swagmi-docs build`
- `pnpm -F swagmi-example dev`

## Main working principles

## Code validation matrix (before marking code as done)

- Run `eslint` by `pnpm lint` from root and fix all errors and warnings, if any. Don't mark code as done if there are any errors or warnings.
- Run `pnpm typecheck` from root and fix all errors and warnings, if any. Don't mark code as done if there are any errors or warnings.
- Don't add eslint disable comments in the code unless it's absolutely necessary. If you do, please add a comment explaining why it was necessary and report it to the user.
- Don't use `any` type in TypeScript code. Use `unknown` instead and narrow it down to a specific type as soon as possible.
- When making changes prefer existing code format. If there are any extra spaces, new lines, or other formatting issues, leave them as is unless they are causing linting errors. If you need to change the formatting, report it to the user and ask for confirmation before making changes.
- Prefer existing scripts from package.json over custom `pnpm exec` commands.

- If you encounter nested `AGENTS.md` files, consider the local `AGENTS.md` file as the main reference for that specific folder. If there is a conflict between the local `AGENTS.md` and the root `AGENTS.md`, follow the local one when working in that folder.

## other references

[Contributing](./CONTRIBUTING.md)
