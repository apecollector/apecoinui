"use client";

import { useNetwork } from "wagmi";
import { formatUnits } from "ethers/lib/utils.js";

import useEvents from "@/hooks/useEvents";
import { EventData } from "@/types/event";

interface Map {
  [key: number]: string;
}

const poolIDs: Map = {
  0: "ApeCoin",
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

const DisplayStakeEvent: React.FC<{ event: EventData }> = ({ event }) => {
  const { chain } = useNetwork();
  return (
    <a
      className="text-zinc-600 dark:text-zinc-400"
      target="_blank"
      rel="noreferrer"
      href={`https://${
        chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
      }/tx/${event.hash}`}
    >
      <span className="font-medium text-zinc-900 dark:text-white">
        {event.user}
      </span>{" "}
      staked{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(+formatUnits(event.amount))}{" "}
        ApeCoin
      </span>{" "}
      into the{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {poolIDs[event.poolId]} pool
      </span>
    </a>
  );
};

const DisplayWithdrawEvent: React.FC<{ event: EventData }> = ({ event }) => {
  const { chain } = useNetwork();
  return (
    <a
      className="text-zinc-600 dark:text-zinc-400"
      target="_blank"
      rel="noreferrer"
      href={`https://${
        chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
      }/tx/${event.hash}`}
    >
      <span className="font-medium text-zinc-900 dark:text-white">
        {event.user}
      </span>{" "}
      withdrew{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(+formatUnits(event.amount))}{" "}
        ApeCoin
      </span>{" "}
      from the{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {poolIDs[event.poolId]} pool
      </span>
    </a>
  );
};

const DisplayClaimEvent: React.FC<{ event: EventData }> = ({ event }) => {
  const { chain } = useNetwork();
  return (
    <a
      className="text-zinc-600 dark:text-zinc-400"
      target="_blank"
      rel="noreferrer"
      href={`https://${
        chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
      }/tx/${event.hash}`}
    >
      <span className="font-medium text-zinc-900 dark:text-white">
        {event.user}
      </span>{" "}
      claimed{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(+formatUnits(event.amount))}{" "}
        ApeCoin
      </span>{" "}
      from the{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {poolIDs[event.poolId]} pool
      </span>
    </a>
  );
};

const DisplayEvent: React.FC<{ event: EventData }> = ({ event }) => {
  const { chain } = useNetwork();
  if (event.type === "Deposit") {
    return <DisplayStakeEvent event={event} />;
  } else if (event.type === "Withdraw") {
    return <DisplayWithdrawEvent event={event} />;
  } else if (event.type === "Claim") {
    return <DisplayClaimEvent event={event} />;
  }
  return (
    <a
      className="text-zinc-600 dark:text-zinc-400"
      target="_blank"
      rel="noreferrer"
      href={`https://${
        chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
      }/tx/${event.hash}`}
    >
      <span className="font-medium text-zinc-900 dark:text-white">
        {event.user}
      </span>{" "}
      staked{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 4,
        }).format(+formatUnits(event.amount))}{" "}
        ApeCoin
      </span>{" "}
      into the{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {poolIDs[event.poolId]} pool
      </span>
    </a>
  );
};

export default function Events() {
  const events = useEvents();
  return (
    <>
      <div>
        <ol className="divider-zinc-200 mt-3 divide-y dark:divide-zinc-700">
          {!events || events?.length === 0 ? (
            <li className="block items-center py-3 sm:flex">
              <div>
                <div className="text-zinc-600 dark:text-zinc-400">
                  Waiting for staking contract events...
                </div>
              </div>
            </li>
          ) : (
            <>
              {events.map((evt, i) => (
                <li key={i} className="block items-center py-3 sm:flex">
                  <DisplayEvent event={evt} />
                </li>
              ))}
            </>
          )}
        </ol>
      </div>
    </>
  );
}
