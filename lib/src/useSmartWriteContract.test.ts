// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import {
  ContractFunctionRevertedError,
  encodeErrorResult,
  type Hash,
  type ReplacementReturnType,
  type TransactionReceipt,
  UserRejectedRequestError,
} from "viem";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as wagmi from "wagmi";

import { useSmartWriteContract } from "./useSmartWriteContract";

vi.mock("wagmi", async () => {
  const actual = await vi.importActual<typeof import("wagmi")>("wagmi");

  return {
    ...actual,
    useSimulateContract: vi.fn(),
    useWaitForTransactionReceipt: vi.fn(),
    useWriteContract: vi.fn(),
  };
});

const mockedUseSimulateContract = vi.mocked(wagmi.useSimulateContract);
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

const depositRequest = {
  abi,
  address: "0x0000000000000000000000000000000000000001",
  args: [1n],
  functionName: "deposit",
} as const;

const hash = "0x1234" as Hash;

const createReceipt = (overrides: Partial<TransactionReceipt> = {}): TransactionReceipt =>
  ({
    blockHash: "0xblock",
    blockNumber: 1n,
    contractAddress: null,
    cumulativeGasUsed: 1n,
    effectiveGasPrice: 1n,
    from: "0x0000000000000000000000000000000000000001",
    gasUsed: 1n,
    logs: [],
    logsBloom: "0x0",
    status: "success",
    to: "0x0000000000000000000000000000000000000002",
    transactionHash: hash,
    transactionIndex: 0,
    type: "legacy",
    ...overrides,
  }) as TransactionReceipt;

const createReplacement = (
  overrides: Partial<ReplacementReturnType> = {}
): ReplacementReturnType =>
  ({
    reason: "replaced",
    replacedTransaction: {
      hash,
    },
    transaction: {
      hash: "0x5678",
    },
    transactionReceipt: createReceipt({
      transactionHash: "0x5678" as Hash,
    }),
    ...overrides,
  }) as ReplacementReturnType;

afterEach(() => {
  vi.clearAllMocks();
});

const asSimulateResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useSimulateContract>;

const asWaitResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useWaitForTransactionReceipt>;

const asWriteResult = (value: unknown) =>
  value as ReturnType<typeof wagmi.useWriteContract>;

describe("useSmartWriteContract", () => {
  it("runs the happy-path write lifecycle", async () => {
    const onReceipt = vi.fn();
    const refetch = vi.fn().mockResolvedValue({
      data: {
        request: depositRequest,
      },
      error: null,
    });
    const mutateAsync = vi.fn().mockResolvedValue(hash);
    let waitState: unknown = {
      data: undefined,
      error: null,
      isPending: false,
    };

    mockedUseSimulateContract.mockImplementation(() =>
      asSimulateResult({
        data: {
          request: depositRequest,
        },
        refetch,
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
      useSmartWriteContract({
        abi,
        address: depositRequest.address,
        args: depositRequest.args,
        functionName: "deposit",
        onReceipt,
      })
    );

    await act(async () => {
      await result.current.writeAsync();
    });

    expect(refetch).toHaveBeenCalledTimes(1);
    expect(mutateAsync).toHaveBeenCalledWith(depositRequest);
    expect(result.current.hash).toBe(hash);
    expect(result.current.status).toBe("submitted");

    waitState = {
      data: undefined,
      error: null,
      isPending: true,
    };
    rerender();

    expect(result.current.status).toBe("confirming");

    waitState = {
      data: createReceipt(),
      error: null,
      isPending: false,
    };
    rerender();

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.receipt?.transactionHash).toBe(hash);
    expect(result.current.status).toBe("success");
    expect(onReceipt).toHaveBeenCalledTimes(1);
  });

  it("surfaces user-rejected signatures as a dedicated status", async () => {
    const refetch = vi.fn().mockResolvedValue({
      data: {
        request: depositRequest,
      },
      error: null,
    });
    const mutateAsync = vi
      .fn()
      .mockRejectedValue(new UserRejectedRequestError(new Error("Rejected")));

    mockedUseSimulateContract.mockImplementation(() =>
      asSimulateResult({
        data: {
          request: depositRequest,
        },
        refetch,
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
      useSmartWriteContract({
        abi,
        address: depositRequest.address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    await act(async () => {
      await expect(result.current.writeAsync()).rejects.toBeInstanceOf(
        UserRejectedRequestError
      );
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.status).toBe("user-rejected");
  });

  it("decodes reverted simulation errors and reports them once", async () => {
    const onDecodedError = vi.fn();
    const errorAbi = [
      {
        inputs: [
          { name: "available", type: "uint256" },
          { name: "required", type: "uint256" },
        ],
        name: "BalanceTooLow",
        type: "error",
      },
    ] as const;
    const revertedError = new ContractFunctionRevertedError({
      abi: errorAbi,
      data: encodeErrorResult({
        abi: errorAbi,
        args: [1n, 2n],
        errorName: "BalanceTooLow",
      }),
      functionName: "deposit",
    });
    const refetch = vi.fn().mockResolvedValue({
      data: undefined,
      error: revertedError,
    });

    mockedUseSimulateContract.mockImplementation(() =>
      asSimulateResult({
        data: undefined,
        refetch,
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync: vi.fn(),
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
      useSmartWriteContract({
        abi,
        address: depositRequest.address,
        args: depositRequest.args,
        functionName: "deposit",
        onDecodedError,
      })
    );

    await act(async () => {
      await expect(result.current.writeAsync()).rejects.toBe(revertedError);
    });

    expect(result.current.decodedError?.errorName).toBe("BalanceTooLow");
    expect(result.current.decodedError?.args).toEqual([1n, 2n]);
    expect(result.current.status).toBe("error");
    expect(onDecodedError).toHaveBeenCalledTimes(1);
  });

  it("marks cancelled replacements distinctly", async () => {
    const refetch = vi.fn().mockResolvedValue({
      data: {
        request: depositRequest,
      },
      error: null,
    });
    const mutateAsync = vi.fn().mockResolvedValue(hash);
    let lastReplacementHandler:
      | ((replacement: ReplacementReturnType) => void)
      | undefined;

    mockedUseSimulateContract.mockImplementation(() =>
      asSimulateResult({
        data: {
          request: depositRequest,
        },
        refetch,
      })
    );
    mockedUseWriteContract.mockImplementation(() =>
      asWriteResult({
        mutateAsync,
        reset: vi.fn(),
      })
    );
    mockedUseWaitForTransactionReceipt.mockImplementation(parameters => {
      lastReplacementHandler = parameters?.onReplaced;

      return asWaitResult({
        data: undefined,
        error: null,
        isPending: true,
      });
    });

    const { result } = renderHook(() =>
      useSmartWriteContract({
        abi,
        address: depositRequest.address,
        args: depositRequest.args,
        functionName: "deposit",
      })
    );

    await act(async () => {
      await result.current.writeAsync();
    });

    act(() => {
      lastReplacementHandler?.(
        createReplacement({
          reason: "cancelled",
        })
      );
    });

    expect(result.current.hash).toBe("0x5678");
    expect(result.current.isError).toBe(true);
    expect(result.current.status).toBe("cancelled");
  });
});
