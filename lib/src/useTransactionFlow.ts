import { useEffect, useRef, useState } from "react";
import {
  type Abi,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hash,
  type TransactionReceipt,
} from "viem";
import {
  type Config,
  type ResolvedRegister,
  useConnection,
  usePublicClient,
  type UseSimulateContractParameters,
  useWaitForTransactionReceipt,
  type UseWaitForTransactionReceiptParameters,
  useWriteContract,
  type UseWriteContractParameters,
} from "wagmi";

const defaultConfirmations = 1;

type FirstParameter<TFunction extends (...arguments_: never[]) => unknown> =
  Parameters<TFunction> extends [infer TParameter, ...unknown[]] ? TParameter : never;

type TransactionFlowPhase = "awaiting-signature" | "broadcasting" | "idle" | "simulating";

export type TxFlowStatus =
  | "idle"
  | "simulating"
  | "awaiting-signature"
  | "broadcasting"
  | "pending"
  | "success"
  | "reverted"
  | "error";

export type UseTransactionFlowParameters<
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
  onReceipt?: ((receipt: TransactionReceipt) => void) | undefined;
  simulate?: boolean | undefined;
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

export type UseTransactionFlowReturnType = {
  error: Error | null;
  hash: Hash | undefined;
  receipt: TransactionReceipt | undefined;
  reset: () => void;
  send: () => Promise<Hash>;
  status: TxFlowStatus;
};

const toError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  return new Error("Unknown transaction flow error.");
};

/**
 * Simulates, signs, broadcasts, and tracks a contract transaction as one flow.
 * @param parameters - Contract write parameters with optional simulation and receipt settings.
 * @returns A unified transaction lifecycle for product-facing UI state.
 */
export function useTransactionFlow<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  const args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
>(
  parameters: UseTransactionFlowParameters<abi, functionName, args, config, chainId>
): UseTransactionFlowReturnType {
  const {
    confirmations = defaultConfirmations,
    onReceipt,
    simulate = true,
    waitForReceipt,
    waitForReceiptQuery,
    writeMutation,
    ...transactionParameters
  } = parameters;

  const [error, setError] = useState<Error | null>(null);
  const [hash, setHash] = useState<Hash | undefined>();
  const [phase, setPhase] = useState<TransactionFlowPhase>("idle");

  const handledWaitErrorReference = useRef<Error | null>(null);
  const receiptCallbackHashReference = useRef<Hash | undefined>(undefined);

  const configParameter =
    transactionParameters["config"] === undefined
      ? {}
      : { config: transactionParameters["config"] };
  const chainIdParameter =
    transactionParameters["chainId"] === undefined
      ? {}
      : { chainId: transactionParameters["chainId"] };

  const { address } = useConnection(configParameter);
  const publicClient = usePublicClient({
    ...configParameter,
    ...chainIdParameter,
  });
  const mutation = useWriteContract({
    ...configParameter,
    mutation: writeMutation,
  });

  const transaction = useWaitForTransactionReceipt({
    ...chainIdParameter,
    ...configParameter,
    ...waitForReceipt,
    confirmations,
    hash,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onReplaced: (replacement: { transaction: { hash: any } }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setHash(replacement.transaction.hash);
    },
    query: {
      ...waitForReceiptQuery,
      enabled: Boolean(hash) && (waitForReceiptQuery?.enabled ?? true),
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
    setError(toError(transaction.error));
  }, [transaction.error]);

  const status = (() => {
    if (receipt) return receipt.status === "reverted" ? "reverted" : "success";
    if (error) return "error";
    if (transaction.isPending && hash) return "pending";
    return phase;
  })();

  const reset = () => {
    handledWaitErrorReference.current = null;
    mutation.reset();
    receiptCallbackHashReference.current = undefined;
    setError(null);
    setHash(undefined);
    setPhase("idle");
  };

  const send = async () => {
    handledWaitErrorReference.current = null;
    mutation.reset();
    receiptCallbackHashReference.current = undefined;
    setError(null);
    setHash(undefined);
    setPhase(simulate ? "simulating" : "awaiting-signature");

    try {
      const {
        chainId: transactionChainId,
        config: _config,
        connector,
        ...contractParameters
      } = transactionParameters;

      // eslint-disable-next-line sonarjs/function-return-type
      const request = (() => {
        if (!simulate) {
          return {
            ...contractParameters,
            ...(transactionChainId === undefined ? {} : { chainId: transactionChainId }),
            ...(connector === undefined ? {} : { connector }),
          } as FirstParameter<typeof mutation.mutateAsync>;
        }

        if (!publicClient) {
          throw new Error("Transaction simulation requires an available public client.");
        }

        return (
          publicClient
            .simulateContract({
              ...contractParameters,
              ...(contractParameters["account"] === undefined && address
                ? { account: address }
                : {}),
            } as never)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
            .then((result: { request: any }) => result.request)
        );
      })();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const writeRequest = await request;

      if (!writeRequest) {
        throw new Error(
          "Transaction simulation completed without returning a write request."
        );
      }

      setPhase("awaiting-signature");
      const nextHash = await mutation.mutateAsync(
        writeRequest as FirstParameter<typeof mutation.mutateAsync>
      );
      setHash(nextHash);
      setPhase("broadcasting");
      return nextHash;
    } catch (error_) {
      setError(toError(error_));
      setPhase("idle");
      throw error_;
    }
  };

  return {
    error,
    hash,
    receipt,
    reset,
    send,
    status,
  };
}
