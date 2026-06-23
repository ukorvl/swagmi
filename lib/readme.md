<div align="center">
  <picture>
    <source
      media="(prefers-color-scheme: dark)"
      srcset="https://raw.githubusercontent.com/ukorvl/design/master/swagmi/swagmi-dark.png"
      type="image/png"
    />
    <img
      alt="swagmi logo"
      src="https://raw.githubusercontent.com/ukorvl/design/master/swagmi/swagmi.png"
      width="300"
      loading="lazy"
    />
  </picture>
  <p>
    Have you ever copied your custom React hooks built on top of <a href="https://wagmi.sh">wagmi</a> from one web3 project to another? Have you ever struggled with allowance handling or preventing your dApp from showing the wrong state after a transaction is signed? That shared pain deserves a shared abstraction.
  </p>
  <br />
  <p>
    The goal of this project is simple: to provide a useful abstraction layer on top of <a href="https://wagmi.sh">wagmi</a> that makes advanced dApp workflows easier and faster to build with React hooks.
    It provides a set of hooks that can be used to handle common edge cases in web3 development, protecting developers from the imperative complexity behind the shiny surface of declarative abstraction.
  </p>
  <br />
  <p align="center">
    <a href="https://www.npmjs.com/package/@ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/npm/v/%40ukorvl%2Fswagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/npm/v/%40ukorvl%2Fswagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="Version"
        >
      </picture>
    </a>

    <a href="https://www.npmjs.com/package/@ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/npm/dm/%40ukorvl%2Fswagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/npm/dm/%40ukorvl%2Fswagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="Downloads"
        >
      </picture>
    </a>

    <a href="https://github.com/ukorvl/swagmi/actions/workflows/build.yaml">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/github/actions/workflow/status/ukorvl/swagmi/build.yaml?branch=main&colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/github/actions/workflow/status/ukorvl/swagmi/build.yaml?branch=main&colorA=a855f7&colorB=a855f7&style=flat"
          alt="Build Status"
        >
      </picture>
    </a>

    <a href="https://pkg.pr.new/~/ukorvl/swagmi">
      <img
        src="https://pkg.pr.new/badge/ukorvl/swagmi"
        alt="pkg.pr.new"
      >
    </a>

    <a href="https://github.com/ukorvl/swagmi/blob/main/LICENSE">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/npm/l/%40ukorvl%2Fswagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/npm/l/%40ukorvl%2Fswagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="License"
        >
      </picture>
    </a>

    <a href="https://bundlephobia.com/package/@ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/bundlephobia/minzip/%40ukorvl%2Fswagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/bundlephobia/minzip/%40ukorvl%2Fswagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="Minified size"
        >
      </picture>
    </a>

    <a href="https://github.com/ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/badge/code%20style-eslint-22d3ee?style=flat"
        >
        <img
          src="https://img.shields.io/badge/code%20style-eslint-a855f7?style=flat"
          alt="Code Style"
        >
      </picture>
    </a>

    <a href="https://github.com/ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/badge/module-ESM--only-22d3ee?style=flat"
        >
        <img
          src="https://img.shields.io/badge/module-ESM--only-a855f7?style=flat"
          alt="ESM Only"
        >
      </picture>
    </a>

    <a href="https://github.com/ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/badge/contributions-welcome-22d3ee?style=flat"
        >
        <img
          src="https://img.shields.io/badge/contributions-welcome-a855f7?style=flat"
          alt="Contributions"
        >
      </picture>
    </a>

    <a href="https://coveralls.io/github/ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/coveralls/github/ukorvl/swagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/coveralls/github/ukorvl/swagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="Coverage"
        >
      </picture>
    </a>

    <a href="https://jsr.io/@ukorvl/swagmi">
      <picture>
        <source
          media="(prefers-color-scheme: dark)"
          srcset="https://img.shields.io/jsr/v/%40ukorvl%2Fswagmi?colorA=22d3ee&colorB=22d3ee&style=flat"
        >
        <img
          src="https://img.shields.io/jsr/v/%40ukorvl%2Fswagmi?colorA=a855f7&colorB=a855f7&style=flat"
          alt="Jsr version"
        >
      </picture>
    </a>

  </p>
</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About](#about)
- [Installation](#installation)
- [Basic usage](#basic-usage)
- [Advanced examples](#advanced-examples)
- [Skills](#skills)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## About

## Installation

## Basic usage

## Advanced examples

## Skills

## Contributing

## Security

## License

[MIT](./LICENSE)
