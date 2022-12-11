"use client";

import { useNetwork } from "wagmi";
import { formatUnits } from "ethers/lib/utils.js";

import useEvents from "../lib/hooks/useEvents";

const poolIDs = {
  0: "ApeCoin",
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

export default function Events() {
  const { chain } = useNetwork();
  const events = useEvents();
  return (
    <>
      <div>
        <ol className="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
          {events.length === 0 && (
            <li className="block items-center py-3 sm:flex">
              <div>
                <div className="text-gray-600 dark:text-gray-400">
                  Waiting for new contract events...
                </div>
              </div>
            </li>
          )}
          {events.map((evt, i) => (
            <li key={i} className="block items-center py-3 sm:flex">
              <a
                className="text-gray-600 dark:text-gray-400"
                target={"_blank"}
                href={`https://${chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"}/tx/${
                  evt.event.transactionHash
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">{evt.user}</span> staked{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(+formatUnits(evt.amount))}{" "}
                  ApeCoin
                </span>{" "}
                into the{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {poolIDs[evt.poolId]} pool
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
