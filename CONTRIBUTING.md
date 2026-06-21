# Contributing

## Getting started

1. Fork and clone the repository.
2. Install dependencies and set up local git hooks:

```sh
pnpm install
```

## Development commands

```sh
pnpm run dev
pnpm run build
pnpm run lint
pnpm run lint:md-links
pnpm run typecheck
pnpm run test
pnpm run verify:package
```

Workspace commands:

```sh
pnpm -C docs run dev
pnpm -C docs run build
pnpm -C example run dev
pnpm -C example run build
```

## Pull request expectations

- Keep changes scoped and well-described.
- Update docs/examples when public API or command behavior changes.
- Ensure all required verification commands pass before opening a PR.
- Use conventional commit messages.

## License

By contributing, you agree your contributions are licensed under [MIT](./lib/LICENSE).
