# @ukorvl/swagmi

`@ukorvl/swagmi` is an ESM-only collection of advanced React hooks built on top of [wagmi](https://wagmi.sh/) for production dapp flows.

Repository: [ukorvl/swagmi](https://github.com/ukorvl/swagmi)

## Current Hooks

- `useSmartWriteContract` combines simulation, wallet signature, transaction submission, confirmation tracking, replacement handling, and decoded revert errors into one write lifecycle.

## Install

```sh
pnpm add @ukorvl/swagmi wagmi viem @tanstack/react-query react
```

`@ukorvl/swagmi` expects wagmi, viem, React, and TanStack Query to already be part of your app.

## ESM Only

`@ukorvl/swagmi` ships ESM only. Use it in modern bundlers and runtimes that support ESM package entrypoints.

## Example

```tsx
import { useSmartWriteContract } from "@ukorvl/swagmi";

const useDeposit = () =>
  useSmartWriteContract({
    abi: vaultAbi,
    address: vaultAddress,
    functionName: "deposit",
    args: [amount],
    confirmations: 2,
    onReceipt: receipt => {
      console.log("confirmed", receipt.transactionHash);
    },
    onDecodedError: decodedError => {
      console.error(decodedError.reason ?? decodedError.shortMessage);
    },
  });
```

The hook exposes a single lifecycle with statuses such as `validating`, `awaiting-signature`, `submitted`, `confirming`, `success`, `reverted`, `replaced`, `cancelled`, and `user-rejected`.

## Development

```sh
pnpm install
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run verify:package
```

## License

[MIT](./LICENSE)
