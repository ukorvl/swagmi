---
name: swagmi-basic-usage
description: Guide general @ukorvl/swagmi library usage in consumer apps. Use when installing or integrating @ukorvl/swagmi, sketching basic hook usage, checking required peer dependencies, or replacing manual wagmi contract write flows with swagmi during the pre-release stage.
---

# swagmi Basic Usage

Use this skill for general `@ukorvl/swagmi` integration work.

Treat this skill as conservative pre-release guidance:

- Prefer the currently installed package exports, types, and source over memory.
- Avoid inventing APIs or promising helpers that are not clearly available yet.
- Keep examples minimal unless the consuming project asks for more depth.

## Workflow

1. Confirm the consumer project has compatible `react`, `wagmi`, `viem`, and `@tanstack/react-query` dependencies available.
2. Identify which `@ukorvl/swagmi` export the user actually needs before proposing integration code.
3. Prefer small, direct examples that fit the consumer project's existing stack.
4. If behavior is unclear, inspect the installed package types or source before answering confidently.

## Scope

- Focus on library usage in consumer applications.
- Prefer basic installation and integration guidance over advanced architecture advice.
- Call out uncertainty explicitly when the pre-release API surface is still moving.
