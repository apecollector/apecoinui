"use client";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";

import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { provider, chains } = configureChains(
  [mainnet, goerli],
  [
    publicProvider({ priority: 2 }),
    alchemyProvider({
      priority: 1,
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!,
    }),
    jsonRpcProvider({
      priority: 1,
      rpc: (chain) => {
        return {
          http: `https://eth.apecoinui.com${
            chain.id === mainnet.id ? "/v1/mainnet" : "/v1/goerli"
          }`,
        };
      },
    }),
  ]
);

const client = createClient(
  getDefaultClient({
    appName: "ApeCoin UI",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: chains,
    autoConnect: false,
    provider: provider,
  })
);

export default function Provider({ children }: React.PropsWithChildren<{}>) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
}
