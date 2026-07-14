# Skills

This directory contains reusable agent skills for projects that consume `@ukorvl/swagmi`.

## What These Are

Skills are promptable agent guidance packages. They are not npm packages and they are not part of the published `@ukorvl/swagmi` runtime bundle.

Each skill usually lives in its own folder and can include:

- `SKILL.md` with the main instructions
- optional `agents/` helpers
- optional metadata or supporting files

## When To Use Them

Install a skill in your own app when you want your coding agent to follow `swagmi`-specific integration guidance instead of improvising from scratch.

If you want to try a skill from a non-default branch before it lands in `main`, replace `main` in the install URL with the branch name.

Typical use cases:

- installing `@ukorvl/swagmi` into a consumer app
- wiring up hooks safely in an existing codebase
- replacing hand-rolled wagmi transaction flows with the abstractions from this repo
- keeping generated code and examples aligned with the library's intended usage

## How To Install A Skill

Install the library in your app first:

```sh
pnpm add @ukorvl/swagmi wagmi viem @tanstack/react-query
```

Then install the specific skill you want in your consumer project's root:

```sh
npx skills add https://github.com/ukorvl/swagmi/tree/main/skills/<skill-name>
```

Example:

```sh
npx skills add https://github.com/ukorvl/swagmi/tree/main/skills/swagmi-usage
```

If you need a skill from a branch that has not landed in `main` yet, replace `main` with that branch name in the URL.

## How To Use An Installed Skill

Once installed, mention the skill by name in your agent prompt when you want it applied.

Example prompts:

```text
Use the swagmi-usage skill to integrate @ukorvl/swagmi into this app.
```

```text
Use the swagmi-usage skill while replacing our manual wagmi write flow.
```

As this repo grows, you can install one skill, several skills, or all skills that match the workflows you want your agent to follow.
