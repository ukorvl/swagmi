// @vitest-environment jsdom

import type { Address } from "viem";
import type { Config } from "wagmi";

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as wagmi from "wagmi";

import { useWalletSession } from "./useWalletSession";

type WagmiModule = typeof wagmi;

vi.mock("wagmi", async () => {
  const actual = await vi.importActual<WagmiModule>("wagmi");

  return {
    ...actual,
    useConnection: vi.fn(),
  };
});

const mockedUseConnection = vi.mocked(wagmi.useConnection);

const address = "0x0000000000000000000000000000000000000001" as Address;

afterEach(() => {
  vi.clearAllMocks();
});

const asConnectionResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useConnection>;

describe("useWalletSession", () => {
  it("returns disconnected when the wallet is disconnected", () => {
    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        status: "disconnected",
      })
    );

    const { result } = renderHook(() => useWalletSession());

    expect(result.current).toEqual({
      status: "disconnected",
    });
  });

  it("returns connecting while the wallet is connecting", () => {
    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        status: "connecting",
      })
    );

    const { result } = renderHook(() => useWalletSession());

    expect(result.current).toEqual({
      status: "connecting",
    });
  });

  it("returns reconnecting while the wallet is reconnecting", () => {
    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        chainId: 1,
        status: "reconnecting",
      })
    );

    const { result } = renderHook(() => useWalletSession());

    expect(result.current).toEqual({
      status: "reconnecting",
    });
  });

  it("returns connected when the expected chain matches", () => {
    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        chainId: 1,
        status: "connected",
      })
    );

    const { result } = renderHook(() => useWalletSession({ expectedChainId: 1 }));

    expect(result.current).toEqual({
      address,
      chainId: 1,
      status: "connected",
    });
  });

  it("returns wrong-chain when the current chain does not match the expected chain", () => {
    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        chainId: 1,
        status: "connected",
      })
    );

    const { result } = renderHook(() => useWalletSession({ expectedChainId: 10 }));

    expect(result.current).toEqual({
      address,
      chainId: 1,
      expectedChainId: 10,
      status: "wrong-chain",
    });
  });

  it("forwards wagmi connection parameters without leaking expectedChainId", () => {
    const config = {} as Config;

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        status: "disconnected",
      })
    );

    renderHook(() => useWalletSession({ config, expectedChainId: 1 }));

    expect(mockedUseConnection).toHaveBeenCalledWith({ config });
  });
});
