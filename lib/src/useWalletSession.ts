import type { Address } from "viem";

import {
  type Config,
  type ResolvedRegister,
  useConnection,
  type UseConnectionParameters,
} from "wagmi";

export type WalletSessionState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; address: Address; chainId: number }
  | {
      status: "wrong-chain";
      address: Address;
      chainId: number;
      expectedChainId: number;
    }
  | { status: "reconnecting" };

export type UseWalletSessionParameters<
  config extends Config = ResolvedRegister["config"],
> = UseConnectionParameters<config> & {
  expectedChainId?: config["chains"][number]["id"] | undefined;
};

/**
 * Normalizes wagmi wallet connection details into a single discriminated union.
 * @param parameters - Optional wagmi config and an expected chain id for wrong-chain detection.
 * @returns Wallet session state that is safe to switch on in UI code.
 */
export function useWalletSession<config extends Config = ResolvedRegister["config"]>(
  parameters: UseWalletSessionParameters<config> = {}
): WalletSessionState {
  const { expectedChainId, ...connectionParameters } = parameters;
  const connection = useConnection(connectionParameters);

  switch (connection.status) {
    case "connected": {
      if (expectedChainId !== undefined && connection.chainId !== expectedChainId) {
        return {
          address: connection.address,
          chainId: connection.chainId,
          expectedChainId,
          status: "wrong-chain",
        };
      }

      return {
        address: connection.address,
        chainId: connection.chainId,
        status: "connected",
      };
    }
    case "connecting": {
      return {
        status: "connecting",
      };
    }
    case "disconnected": {
      return {
        status: "disconnected",
      };
    }
    case "reconnecting": {
      return {
        status: "reconnecting",
      };
    }
  }
}
