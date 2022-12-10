"use client";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";

import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import Header from "./header";

import "./globals.css";

const { provider, chains } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== mainnet.id) return null;
        return { http: "https://eth.apecoinui.com" };
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

export default function RootLayout({ children }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="auto" mode="auto">
        <html lang="en" className="font-monospace">
          <body className="h-full p-4 md:p-8 mx-auto flex flex-col min-h-screen container max-w-6xl dark:bg-gray-900 dark:text-slate-300">
            <header className="flex justify-between items-center mb-8">
              <Header />
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="text-center my-20">
              <p>
                Made by{" "}
                <a className="text-[#1da1f2]" href="https://twitter.com/ApeCollector">
                  @ApeCollector
                </a>
                .
              </p>
              <p>
                View the{" "}
                <a className="text-[#1da1f2]" href="https://github.com/apecollector/apecoinui">
                  source code
                </a>{" "}
                on GitHub.
              </p>
            </footer>
          </body>
        </html>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
