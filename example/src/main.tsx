import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { createConfig, http, WagmiProvider } from "wagmi";
import { injected } from "wagmi/connectors";

import { App } from "./App";
import { resolveDemoEnvironmentFromImportMetaEnv } from "./demoEnvironment";

const domSelector = "#app";
const app = document.querySelector<HTMLDivElement>(domSelector);

if (!app) {
  throw new Error(`Missing ${domSelector} element in index.html`);
}

const demoEnvironment = resolveDemoEnvironmentFromImportMetaEnv(import.meta.env);
const wagmiConfig = createConfig({
  chains: [demoEnvironment.chain],
  connectors: [
    injected({
      shimDisconnect: true,
    }),
  ],
  transports: {
    [demoEnvironment.chain.id]: http(demoEnvironment.rpcUrl),
  },
});
const queryClient = new QueryClient();

ReactDOM.createRoot(app).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App demo={demoEnvironment} />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
