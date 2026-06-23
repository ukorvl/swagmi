import { type Address, type Chain, defineChain, isAddress } from "viem";
import { sepolia } from "viem/chains";

const defaultLocalRpcUrl = "http://127.0.0.1:8545";
const localChainId = 31_337;

const localDemoChain = defineChain({
  id: localChainId,
  name: "Anvil Local",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [defaultLocalRpcUrl],
    },
    public: {
      http: [defaultLocalRpcUrl],
    },
  },
  testnet: true,
});

type DemoNetwork = "local" | "sepolia";

type DemoEnvironmentInput = {
  localContractAddress?: string | undefined;
  localRpcUrl?: string | undefined;
  network?: string | undefined;
  testnetContractAddress?: string | undefined;
  testnetRpcUrl?: string | undefined;
};

type DemoEnvironment = {
  chain: Chain;
  contractAddress: Address | undefined;
  explorerBaseUrl: string | undefined;
  hasContractAddress: boolean;
  mode: DemoNetwork;
  networkLabel: string;
  rpcUrl: string;
  setupSteps: string[];
};

const getDefaultSepoliaRpcUrl = () =>
  sepolia.rpcUrls.default.http[0] ?? "https://ethereum-sepolia-rpc.publicnode.com";

const normalizeDemoNetwork = (value: string | undefined): DemoNetwork =>
  value === "sepolia" ? "sepolia" : "local";

const toOptionalAddress = (value: string | undefined): Address | undefined => {
  if (!value) return undefined;

  return isAddress(value) ? value : undefined;
};

const resolveDemoEnvironment = (input: DemoEnvironmentInput = {}): DemoEnvironment => {
  const mode = normalizeDemoNetwork(input.network);

  if (mode === "sepolia") {
    const rpcUrl = input.testnetRpcUrl?.trim() ?? getDefaultSepoliaRpcUrl();
    const contractAddress = toOptionalAddress(input.testnetContractAddress);

    return {
      chain: sepolia,
      contractAddress,
      explorerBaseUrl: sepolia.blockExplorers?.default.url,
      hasContractAddress: Boolean(contractAddress),
      mode,
      networkLabel: "Sepolia public testnet",
      rpcUrl,
      setupSteps: [
        "Set TESTNET_RPC_URL and PRIVATE_KEY if you want to deploy the demo contract yourself.",
        "Run `pnpm -C example run deploy:sepolia` to deploy and update `example/.env.local`.",
      ],
    };
  }

  const rpcUrl = input.localRpcUrl?.trim() ?? defaultLocalRpcUrl;
  const contractAddress = toOptionalAddress(input.localContractAddress);

  return {
    chain: localDemoChain,
    contractAddress,
    explorerBaseUrl: undefined,
    hasContractAddress: Boolean(contractAddress),
    mode,
    networkLabel: "Local Anvil network",
    rpcUrl,
    setupSteps: [
      "Run `pnpm -C example run chain:local` to start the local node.",
      "Run `pnpm -C example run deploy:local` to deploy the demo contract and update `example/.env.local`.",
    ],
  };
};

const resolveDemoEnvironmentFromImportMetaEnv = (
  env: Record<string, string | boolean | undefined>
): DemoEnvironment =>
  resolveDemoEnvironment({
    localContractAddress:
      typeof env["VITE_SWAGMI_LOCAL_CONTRACT_ADDRESS"] === "string"
        ? env["VITE_SWAGMI_LOCAL_CONTRACT_ADDRESS"]
        : undefined,
    localRpcUrl:
      typeof env["VITE_SWAGMI_LOCAL_RPC_URL"] === "string"
        ? env["VITE_SWAGMI_LOCAL_RPC_URL"]
        : undefined,
    network:
      typeof env["VITE_SWAGMI_DEMO_NETWORK"] === "string"
        ? env["VITE_SWAGMI_DEMO_NETWORK"]
        : undefined,
    testnetContractAddress:
      typeof env["VITE_SWAGMI_TESTNET_CONTRACT_ADDRESS"] === "string"
        ? env["VITE_SWAGMI_TESTNET_CONTRACT_ADDRESS"]
        : undefined,
    testnetRpcUrl:
      typeof env["VITE_SWAGMI_TESTNET_RPC_URL"] === "string"
        ? env["VITE_SWAGMI_TESTNET_RPC_URL"]
        : undefined,
  });

export {
  defaultLocalRpcUrl,
  type DemoEnvironment,
  type DemoEnvironmentInput,
  type DemoNetwork,
  localDemoChain,
  normalizeDemoNetwork,
  resolveDemoEnvironment,
  resolveDemoEnvironmentFromImportMetaEnv,
};
