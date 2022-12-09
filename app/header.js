"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount, useConnect, useBalance, useClient, useNetwork } from "wagmi";

import MobileMenu from "./mobileMenu";
import useStakingStore from "./store";

import { humanize } from "../lib/utils/number";

import { ConnectButton } from "./connectButton";

const apecoinContractAddresses = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x6729F254aaB029a9B076CdDF97D5CbEe3859340d",
};

export default function Header() {
  const pathname = usePathname();

  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  const balance = useBalance({
    enabled: isConnected,
    address: address,
    token: apecoinContractAddresses[chain?.id],
  });

  const apeCoinBalance = useStakingStore((state) => state.apeCoinBalance);
  const setApeCoinBalance = useStakingStore((state) => state.setApeCoinBalance);

  useEffect(() => {
    setApeCoinBalance(parseFloat(balance.data?.formatted).toFixed(0));
  }, [setApeCoinBalance, balance.data?.formatted]);

  const autoConnecting = useStakingStore((state) => state.autoConnecting);
  const setAutoConnecting = useStakingStore((state) => state.setAutoConnecting);

  const { connectAsync, connectors } = useConnect();
  const client = useClient();

  useEffect(() => {
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

  const pages = [
    { name: "Home", pathname: "/" },
    { name: "Data", pathname: "/data" },
    { name: "Stake", pathname: "/stake" },
    { name: "FAQ", pathname: "/faq" },
  ];

  return (
    <>
      <div className="flex justify-between items-center gap-x-4">
        <Link className="opacity-90 hover:opacity-100 cursor-pointer" href="/">
          <img src="./teeth.png" alt="ApeCoin Logo" width={32} height={32} />
        </Link>
        <div className="hidden sm:flex gap-x-4">
          {pages.map((page) => (
            <Link
              key={page.name}
              className={
                page.pathname === pathname
                  ? " text-black dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
              }
              href={page.pathname}
            >
              {page.name}
            </Link>
          ))}
        </div>
        <div className="sm:hidden">
          <MobileMenu pages={pages} />
        </div>
      </div>
      <div className="flex items-center">
        {isConnected && apeCoinBalance && (
          <div className="mr-2">{humanize(apeCoinBalance)} ApeCoin</div>
        )}
        {!autoConnecting && <ConnectButton />}
      </div>
    </>
  );
}
