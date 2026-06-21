import { useEffect, useRef, useState } from "react";
import {
  type Abi,
  BaseError,
  type ContractFunctionArgs,
  type ContractFunctionName,
  ContractFunctionRevertedError,
  type Hash,
  type ReplacementReturnType,
  type TransactionReceipt,
  UserRejectedRequestError,
} from "viem";
import {
  type Config,
  type ResolvedRegister,
  useSimulateContract,
  type UseSimulateContractParameters,
  type UseSimulateContractReturnType,
  useWaitForTransactionReceipt,
  type UseWaitForTransactionReceiptParameters,
  type UseWaitForTransactionReceiptReturnType,
  useWriteContract,
  type UseWriteContractParameters,
  type UseWriteContractReturnType,
} from "wagmi";

type SmartWriteContractPhase = "awaiting-signature" | "idle" | "submitted" | "validating";

/**
 * Canonical lifecycle state for a contract write.
 */
export type SmartWriteContractStatus =
  | "awaiting-signature"
  | "cancelled"
  | "confirming"
  | "error"
  | "idle"
  | "replaced"
  | "reverted"
  | "submitted"
  | "success"
  | "user-rejected"
  | "validating";

/**
 * Decoded revert metadata extracted from a viem `BaseError`.
 */
export type SmartWriteContractDecodedError = {
  args?: readonly unknown[] | undefined;
  contractError: ContractFunctionRevertedError;
  errorName?: string | undefined;
  raw?: `0x${string}` | undefined;
  reason?: string | undefined;
  shortMessage: string;
  signature?: `0x${string}` | undefined;
};

export type UseSmartWriteContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable"> =
    ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName> =
    ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
> = Omit<
  UseSimulateContractParameters<abi, functionName, args, config, chainId>,
  "query"
> & {
  confirmations?: number | undefined;
  enabled?: boolean | undefined;
  onDecodedError?:
    | ((decodedError: SmartWriteContractDecodedError, error: BaseError) => void)
    | undefined;
  onReceipt?: ((receipt: TransactionReceipt) => void) | undefined;
  onReplaced?: ((replacement: ReplacementReturnType) => void) | undefined;
  simulateQuery?:
    | UseSimulateContractParameters<abi, functionName, args, config, chainId>["query"]
    | undefined;
  waitForReceipt?:
    | Omit<
        UseWaitForTransactionReceiptParameters<config, config["chains"][number]["id"]>,
        "chainId" | "confirmations" | "hash" | "onReplaced" | "query"
      >
    | undefined;
  waitForReceiptQuery?:
    | UseWaitForTransactionReceiptParameters<
        config,
        config["chains"][number]["id"]
      >["query"]
    | undefined;
  writeMutation?: UseWriteContractParameters<config>["mutation"] | undefined;
};

export type UseSmartWriteContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable"> =
    ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName> =
    ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
> = {
  decodedError: SmartWriteContractDecodedError | null;
  error: Error | null;
  hash: Hash | undefined;
  isError: boolean;
  isIdle: boolean;
  isPending: boolean;
  isReadyToWrite: boolean;
  isSuccess: boolean;
  mutation: UseWriteContractReturnType<config>;
  originalHash: Hash | undefined;
  receipt: TransactionReceipt | undefined;
  replacement: ReplacementReturnType | null;
  reset: () => void;
  simulation: UseSimulateContractReturnType<abi, functionName, args, config, chainId>;
  status: SmartWriteContractStatus;
  transaction: UseWaitForTransactionReceiptReturnType<
    config,
    config["chains"][number]["id"]
  >;
  write: () => void;
  writeAsync: () => Promise<Hash>;
};

const getConfigParameter = <TConfig extends Config>(
  nextConfig: TConfig | undefined
): { config?: TConfig } => {
  if (!nextConfig) return {};
  return { config: nextConfig };
};

const getDecodedError = (error: BaseError): SmartWriteContractDecodedError | null => {
  const revertedError = error.walk(
    nestedError => nestedError instanceof ContractFunctionRevertedError
  );

  if (!(revertedError instanceof ContractFunctionRevertedError)) return null;

  return {
    args: revertedError.data?.args,
    contractError: revertedError,
    errorName: revertedError.data?.errorName,
    raw: revertedError.raw,
    reason: revertedError.reason,
    shortMessage: revertedError.shortMessage,
    signature: revertedError.signature,
  };
};

const getUserRejectedError = (error: BaseError): UserRejectedRequestError | null => {
  const rejectedError = error.walk(
    nestedError => nestedError instanceof UserRejectedRequestError
  );

  if (!(rejectedError instanceof UserRejectedRequestError)) return null;

  return rejectedError;
};

const toError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error("Unknown smart contract write error.");
};

/**
 * Simulates, submits, and tracks a wagmi contract write as a single lifecycle.
 * @param parameters - Contract simulation and transaction lifecycle options.
 * @returns A unified write lifecycle with submit helpers, receipt state, and decoded errors.
 */
export function useSmartWriteContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  const args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
  parameters: UseSmartWriteContractParameters<abi, functionName, args, config, chainId>
): UseSmartWriteContractReturnType<abi, functionName, args, config, chainId> {
  const {
    confirmations = 1,
    enabled = true,
    onDecodedError,
    onReceipt,
    onReplaced,
    simulateQuery,
    waitForReceipt,
    waitForReceiptQuery,
    writeMutation,
    ...simulateParameters
  } = parameters;

  const [decodedError, setDecodedError] = useState<SmartWriteContractDecodedError | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);
  const [originalHash, setOriginalHash] = useState<Hash | undefined>();
  const [phase, setPhase] = useState<SmartWriteContractPhase>("idle");
  const [replacement, setReplacement] = useState<ReplacementReturnType | null>(null);

  const handledWaitErrorReference = useRef<Error | null>(null);
  const receiptCallbackHashReference = useRef<Hash | undefined>(undefined);

  const configParameter = getConfigParameter(simulateParameters.config);
  const chainIdParameter =
    simulateParameters.chainId === undefined
      ? {}
      : { chainId: simulateParameters.chainId };

  const simulation = useSimulateContract({
    ...simulateParameters,
    ...configParameter,
    query: {
      ...simulateQuery,
      enabled: enabled && (simulateQuery?.enabled ?? true),
    },
  } as UseSimulateContractParameters<abi, functionName, args, config, chainId>);

  const mutation = useWriteContract({
    ...configParameter,
    mutation: writeMutation,
  });

  const transaction = useWaitForTransactionReceipt({
    ...chainIdParameter,
    ...configParameter,
    ...waitForReceipt,
    confirmations,
    hash: originalHash,
    onReplaced: nextReplacement => {
      setReplacement(nextReplacement);
      onReplaced?.(nextReplacement);
    },
    query: {
      ...waitForReceiptQuery,
      enabled: Boolean(originalHash) && (waitForReceiptQuery?.enabled ?? true),
    },
  });

  const receipt = transaction.data as TransactionReceipt | undefined;

  useEffect(() => {
    if (!receipt) return;
    if (receiptCallbackHashReference.current === receipt.transactionHash) return;

    receiptCallbackHashReference.current = receipt.transactionHash;
    onReceipt?.(receipt);
  }, [onReceipt, receipt]);

  useEffect(() => {
    if (!transaction.error) return;
    if (handledWaitErrorReference.current === transaction.error) return;

    handledWaitErrorReference.current = transaction.error;

    const nextError = toError(transaction.error);
    const nextDecodedError =
      transaction.error instanceof BaseError ? getDecodedError(transaction.error) : null;

    setDecodedError(nextDecodedError);
    setError(nextError);

    if (transaction.error instanceof BaseError && nextDecodedError) {
      onDecodedError?.(nextDecodedError, transaction.error);
    }
  }, [onDecodedError, transaction.error]);

  const hash = replacement?.transaction.hash ?? originalHash;
  const rejectedError = error instanceof BaseError ? getUserRejectedError(error) : null;

  const status = (() => {
    if (replacement?.reason === "cancelled") return "cancelled";
    if (receipt) return receipt.status === "reverted" ? "reverted" : "success";
    if (rejectedError) return "user-rejected";
    if (error) return "error";
    if (replacement && (transaction.isPending || phase === "submitted")) {
      return "replaced";
    }
    if (transaction.isPending && originalHash) return "confirming";
    if (phase === "submitted") return "submitted";
    if (phase === "awaiting-signature") return "awaiting-signature";
    if (phase === "validating") return "validating";
    return "idle";
  })();

  const isPending =
    status === "awaiting-signature" ||
    status === "confirming" ||
    status === "replaced" ||
    status === "submitted" ||
    status === "validating";

  const applyError = (nextErrorCandidate: unknown) => {
    const nextError = toError(nextErrorCandidate);
    const nextDecodedError =
      nextErrorCandidate instanceof BaseError
        ? getDecodedError(nextErrorCandidate)
        : null;

    setDecodedError(nextDecodedError);
    setError(nextError);

    if (nextErrorCandidate instanceof BaseError && nextDecodedError) {
      onDecodedError?.(nextDecodedError, nextErrorCandidate);
    }

    return nextError;
  };

  const reset = () => {
    handledWaitErrorReference.current = null;
    mutation.reset();
    receiptCallbackHashReference.current = undefined;
    setDecodedError(null);
    setError(null);
    setOriginalHash(undefined);
    setPhase("idle");
    setReplacement(null);
  };

  const writeAsync = async () => {
    handledWaitErrorReference.current = null;
    mutation.reset();
    receiptCallbackHashReference.current = undefined;
    setDecodedError(null);
    setError(null);
    setOriginalHash(undefined);
    setPhase("validating");
    setReplacement(null);

    const simulationResult = await simulation.refetch();

    if (simulationResult.error) {
      setPhase("idle");
      throw applyError(simulationResult.error);
    }

    const request = simulationResult.data?.request;

    if (!request) {
      const nextError = new Error(
        "Simulation completed without returning a write request."
      );
      setError(nextError);
      setPhase("idle");
      throw nextError;
    }

    try {
      setPhase("awaiting-signature");
      const nextHash = await mutation.mutateAsync(
        request as Parameters<typeof mutation.mutateAsync>[0]
      );
      setOriginalHash(nextHash);
      setPhase("submitted");
      return nextHash;
    } catch (error_) {
      setPhase("idle");
      throw applyError(error_);
    }
  };

  const write = () => {
    void writeAsync();
  };

  return {
    decodedError,
    error,
    hash,
    isError:
      status === "cancelled" ||
      status === "error" ||
      status === "reverted" ||
      status === "user-rejected",
    isIdle: status === "idle",
    isPending,
    isReadyToWrite: Boolean(simulation.data?.request) && !isPending,
    isSuccess: status === "success",
    mutation,
    originalHash,
    receipt,
    replacement,
    reset,
    simulation,
    status,
    transaction,
    write,
    writeAsync,
  };
}
