// @vitest-environment jsdom

import type { Hash, TransactionReceipt } from "viem";

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as wagmi from "wagmi";

import { useTransactionFlow } from "./useTransactionFlow";

type WagmiModule = typeof wagmi;

const zero = 0;
const oneBigInt = 1n;

vi.mock("wagmi", async () => {
  const actual = await vi.importActual<WagmiModule>("wagmi");

  return {
    ...actual,
    useConnection: vi.fn(),
    usePublicClient: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
    useWriteContract: vi.fn(),
  };
});

const mockedUseConnection = vi.mocked(wagmi.useConnection);
const mockedUsePublicClient = vi.mocked(wagmi.usePublicClient);
const mockedUseWaitForTransactionReceipt = vi.mocked(wagmi.useWaitForTransactionReceipt);
const mockedUseWriteContract = vi.mocked(wagmi.useWriteContract);

const abi = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const address = "0x0000000000000000000000000000000000000001" as const;
const depositRequest = {
  abi,
  address,
  args: [oneBigInt],
  functionName: "deposit",
} as const;
const hash = "0x1234" as Hash;

const createReceipt = (
  overrides: Partial<TransactionReceipt> = {}
): TransactionReceipt => ({
  blockHash: "0xblock",
  blockNumber: oneBigInt,
  contractAddress: null,
  cumulativeGasUsed: oneBigInt,
  effectiveGasPrice: oneBigInt,
  from: address,
  gasUsed: oneBigInt,
  logs: [],
  logsBloom: "0x0",
  status: "success",
  to: "0x0000000000000000000000000000000000000002",
  transactionHash: hash,
  transactionIndex: zero,
  type: "legacy",
  ...overrides,
});

const createDeferred = <T>() => {
  let reject!: (error: unknown) => void;
  let resolve!: (value: T) => void;

  // eslint-disable-next-line promise/param-names
  const promise = new Promise<T>((resolve_, reject_) => {
    reject = reject_;
    resolve = resolve_;
  });

  return { promise, reject, resolve };
};

afterEach(() => {
  vi.clearAllMocks();
});

const asConnectionResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useConnection>;

const asPublicClient = (value: unknown) =>
  value as ReturnType<typeof wagmi.usePublicClient>;

const asWaitResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useWaitForTransactionReceipt>;

const asWriteResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useWriteContract>;

describe("useTransactionFlow", () => {
  it("runs the full lifecycle from simulation to success", async () => {
    const simulateDeferred = createDeferred<{ request: typeof depositRequest }>();
    const signatureDeferred = createDeferred<Hash>();
    const simulateContract = vi.fn(() => simulateDeferred.promise);
    const mutateAsync = vi.fn(() => signatureDeferred.promise);
    let waitState: unknown = {
      data: undefined,
      error: null,
      isPending: false,
    };

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        status: "connected",
      })
    );
    mockedUsePublicClient.mockImplementation(() =>
      asPublicClient({
        simulateContract,
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: vi.fn(),
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(() => asWaitResult(waitState));

    const { result, rerender } = renderHook(() =>
      useTransactionFlow({
        abi,
        address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    expect(result.current.status).toBe("idle");

    act(() => {
      void result.current.send();
    });

    expect(result.current.status).toBe("simulating");

    await act(async () => {
      simulateDeferred.resolve({ request: depositRequest });
      await Promise.resolve();
    });

    expect(simulateContract).toHaveBeenCalledWith({
      abi,
      address,
      args: depositRequest.args,
      functionName: "deposit",
      account: address,
    });
    expect(result.current.status).toBe("awaiting-signature");

    await act(async () => {
      signatureDeferred.resolve(hash);
      await Promise.resolve();
    });

    expect(mutateAsync).toHaveBeenCalledWith(depositRequest);
    expect(result.current.hash).toBe(hash);
    expect(result.current.status).toBe("broadcasting");

    waitState = {
      data: undefined,
      error: null,
      isPending: true,
    };
    rerender();

    expect(result.current.status).toBe("pending");

    waitState = {
      data: createReceipt(),
      error: null,
      isPending: false,
    };
    rerender();

    expect(result.current.receipt?.transactionHash).toBe(hash);
    expect(result.current.status).toBe("success");
  });

  it("can skip simulation and send the raw write request", async () => {
    const simulateContract = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue(hash);

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        status: "connected",
      })
    );
    mockedUsePublicClient.mockImplementation(() =>
      asPublicClient({
        simulateContract,
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: vi.fn(),
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(() =>
      asWaitResult({
        data: undefined,
        error: null,
        isPending: false,
      })
    );

    const { result } = renderHook(() =>
      useTransactionFlow({
        abi,
        address,
        args: depositRequest.args,
        functionName: "deposit",
        simulate: false,
      })
    );

    await act(async () => {
      await result.current.send();
    });

    expect(simulateContract).not.toHaveBeenCalled();
    expect(mutateAsync).toHaveBeenCalledWith({
      abi,
      address,
      args: depositRequest.args,
      functionName: "deposit",
    });
    expect(result.current.status).toBe("broadcasting");
  });

  it("surfaces receipt polling errors as a single error state", async () => {
    const waitError = new Error("Receipt polling failed");
    const mutateAsync = vi.fn().mockResolvedValue(hash);
    let waitState: unknown = {
      data: undefined,
      error: null,
      isPending: false,
    };

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        status: "connected",
      })
    );
    mockedUsePublicClient.mockImplementation(() =>
      asPublicClient({
        simulateContract: vi.fn().mockResolvedValue({
          request: depositRequest,
        }),
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: vi.fn(),
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(() => asWaitResult(waitState));

    const { result, rerender } = renderHook(() =>
      useTransactionFlow({
        abi,
        address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    await act(async () => {
      await result.current.send();
    });

    waitState = {
      data: undefined,
      error: waitError,
      isPending: false,
    };
    rerender();

    expect(result.current.error).toBe(waitError);
    expect(result.current.status).toBe("error");
  });

  it("marks reverted receipts distinctly", async () => {
    const mutateAsync = vi.fn().mockResolvedValue(hash);
    let waitState: unknown = {
      data: undefined,
      error: null,
      isPending: false,
    };

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        status: "connected",
      })
    );
    mockedUsePublicClient.mockImplementation(() =>
      asPublicClient({
        simulateContract: vi.fn().mockResolvedValue({
          request: depositRequest,
        }),
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: vi.fn(),
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(() => asWaitResult(waitState));

    const { result, rerender } = renderHook(() =>
      useTransactionFlow({
        abi,
        address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    await act(async () => {
      await result.current.send();
    });

    waitState = {
      data: createReceipt({
        status: "reverted",
      }),
      error: null,
      isPending: false,
    };
    rerender();

    expect(result.current.status).toBe("reverted");
  });

  it("resets the lifecycle state", async () => {
    const resetMutation = vi.fn();
    const mutateAsync = vi.fn().mockResolvedValue(hash);

    mockedUseConnection.mockImplementation(() =>
      asConnectionResult({
        address,
        status: "connected",
      })
    );
    mockedUsePublicClient.mockImplementation(() =>
      asPublicClient({
        simulateContract: vi.fn().mockResolvedValue({
          request: depositRequest,
        }),
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: resetMutation,
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(() =>
      asWaitResult({
        data: undefined,
        error: null,
        isPending: false,
      })
    );

    const { result } = renderHook(() =>
      useTransactionFlow({
        abi,
        address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    await act(async () => {
      await result.current.send();
    });

    act(() => {
      result.current.reset();
    });

    const expectedResetCalls = 2;
    expect(resetMutation).toHaveBeenCalledTimes(expectedResetCalls);
    expect(result.current.error).toBeNull();
    expect(result.current.hash).toBeUndefined();
    expect(result.current.receipt).toBeUndefined();
    expect(result.current.status).toBe("idle");
  });
});
