---
name: swagmi-usage
description: Guide general @ukorvl/swagmi library usage in consumer apps. Use when installing or integrating @ukorvl/swagmi, sketching basic hook usage, checking required peer dependencies, or replacing manual wagmi contract write flows with swagmi.
---

# swagmi Basic Usage

Use this skill for general `@ukorvl/swagmi` integration work.

If the package is already installed, you can skip the installation step and go directly to the usage section.
If the package is not installed, follow the installation instructions below:

- Use preferred package manager of the consumer app to install `@ukorvl/swagmi` and its peer dependencies:
  - `wagmi`
  - `viem`
  - `@tanstack/react-query`

## core working rules

- Exported hooks are reguar React hooks, so their usage is the same as any other React hook. Foolow React rules of hooks and best practices when using them.
