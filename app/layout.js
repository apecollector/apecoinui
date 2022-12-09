"use client";

import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import Header from "./header";

import "./globals.css";

const client = createClient(
  getDefaultClient({
    appName: "ApeCoin UI",
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains: [chain.goerli, chain.mainnet],
    autoConnect: false,
  })
);

export default function RootLayout({ children }) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="minimal">
        <html lang="en" className="light font-monospace">
          <body className="h-full p-4 md:p-8 mx-auto flex flex-col min-h-screen container max-w-6xl">
            <header className="flex justify-between items-center mb-8">
              <Header />
            </header>
            <main className="flex-grow">{children}</main>
            <footer className="text-center pt-4">
              <p className="text-gray-700">
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
