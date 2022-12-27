"use client";
import { useEffect } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useClient, useConnect } from "wagmi";
import useAutoConnecting from "@/hooks/useAutoConnecting";
import useApeCoinBalance from "@/hooks/useApeCoinBalance";
import { formatUnits } from "ethers/lib/utils.js";

const ConnectButton: React.FC<{ classNames?: string }> = ({ classNames }) => {
  const client = useClient();
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { apeCoinBalance } = useApeCoinBalance();
  const { autoConnecting, setAutoConnecting } = useAutoConnecting();

  useEffect(() => {
    setAutoConnecting(true);
    if (isConnected) return;

    const autoConnect = async () => {
      const lastUsedConnector = client.storage?.getItem("wallet");

      const sorted = lastUsedConnector
        ? [...connectors].sort((x) => (x.id === lastUsedConnector ? -1 : 1))
        : connectors;

      for (const connector of sorted) {
        if (!connector.ready || !connector.isAuthorized) continue;
        const isAuthorized = await connector.isAuthorized();
        if (!isAuthorized) continue;

        await connectAsync({ connector });
        break;
      }
      setAutoConnecting(false);
    };

    autoConnect();
  }, []);

  if (autoConnecting) return <></>;

  return (
    <>
      {apeCoinBalance !== undefined && (
        <>
          {Intl.NumberFormat("en-us", {
            maximumFractionDigits: 2,
          }).format(+formatUnits(apeCoinBalance))}{" "}
          APE
        </>
      )}
      <ConnectKitButton.Custom>
        {({ isConnected, isConnecting, show, address, ensName }) => {
          if (isConnecting) {
            return;
          }
          return (
            <>
              <button
                onClick={show}
                className={`box-content flex h-6 items-center border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300 sm:h-8 md:hidden ${
                  classNames && classNames
                }`}
              >
                {isConnected && address
                  ? ensName
                    ? ensName.length > 10
                      ? ensName.slice(0, 10) + "..."
                      : ensName
                    : address.slice(2, 8)
                  : "Connect Wallet"}
              </button>
              <button
                onClick={show}
                className={`box-content hidden h-8 items-center border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300 md:flex ${
                  classNames && classNames
                }`}
              >
                {isConnected && address
                  ? ensName
                    ? ensName.length > 18
                      ? ensName.slice(0, 18) + "..."
                      : ensName
                    : address.slice(0, 6) +
                      "..." +
                      address.slice(address.length - 6, address.length)
                  : "Connect Wallet"}
              </button>
            </>
          );
        }}
      </ConnectKitButton.Custom>
    </>
  );
};

export default ConnectButton;
