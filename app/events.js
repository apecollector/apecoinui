"use client";

import { useState } from "react";
import { useContractEvent, useNetwork } from "wagmi";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";

import StakingABI from "../lib/abis/staking";

const stakingContractAddresses = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
};

const poolIDs = {
  0: "ApeCoin",
  1: "BAYC",
  2: "MAYC",
  3: "BAKC",
};

export default function Events() {
  const { chain } = useNetwork();

  const [depositEvents, setDepositEvents] = useState([
    // { user: "0x3d1Bc92B1635a76193E67e86FA0B10CD8b8b1aB9", amount: parseUnits("4230"), poolId: 1 },
    // { user: "0x3d1Bc92B1635a76193E67e86FA0B10CD8b8b1aB9", amount: parseUnits("4230"), poolId: 3 },
    // { user: "0x3d1Bc92B1635a76193E67e86FA0B10CD8b8b1aB9", amount: parseUnits("4230"), poolId: 0 },
    // { user: "0x3d1Bc92B1635a76193E67e86FA0B10CD8b8b1aB9", amount: parseUnits("4230"), poolId: 2 },
  ]);
  useContractEvent({
    enabled: true,
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    eventName: "Deposit",
    listener(user, amount) {
      console.log("Deposit", user, amount.toString());
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({ user, amount, poolId: 0 });
        return newEvents;
      });
    },
    chainId: 1,
  });

  useContractEvent({
    enabled: true,
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    eventName: "DepositNft",
    listener(user, poolId, amount) {
      console.log("DepositNft", user, amount.toString(), poolId);
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({ user, amount, poolId });
        return newEvents;
      });
    },
    chainId: 1,
  });

  useContractEvent({
    enabled: true,
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    eventName: "DepositPairNft",
    listener(user, amount) {
      console.log("DepositPairNft", user, amount.toString());
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({ user, amount, poolId: 3 });
        return newEvents;
      });
    },
    chainId: 1,
  });

  return (
    <>
      <div>
        <h3>Live staking activity:</h3>
        {/* {JSON.stringify(depositEvents)} */}

        <ol className="mt-3 divide-y divider-gray-200 dark:divide-gray-700">
          {depositEvents.length === 0 && (
            <li className="block items-center py-3 sm:flex">
              <div>
                <div className="text-base font-normal text-gray-600 dark:text-gray-400">
                  Waiting for new contract events...
                </div>
              </div>
            </li>
          )}
          {depositEvents.map((evt, i) => (
            <li key={i} className="block items-center py-3 sm:flex">
              <div>
                <div className="text-base font-normal text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{evt.user}</span>{" "}
                  staked{" "}
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
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
