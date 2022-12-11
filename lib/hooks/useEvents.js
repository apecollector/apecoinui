import { useState } from "react";
import { useContractEvent, useNetwork } from "wagmi";

import StakingABI from "../abis/staking";

const stakingContractAddresses = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
};

export default function useEvents() {
  const { chain } = useNetwork();

  const [depositEvents, setDepositEvents] = useState([]);
  useContractEvent({
    enabled: true,
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    eventName: "Deposit",
    listener(...args) {
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({
          user: args[0],
          amount: args[1],
          poolId: 0,
          event: args[args.length - 1],
        });
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
    listener(...args) {
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({
          user: args[0],
          poolId: args[1],
          amount: args[2],
          event: args[args.length - 1],
        });
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
    listener(...args) {
      setDepositEvents((prevEvents) => {
        const newEvents = [...prevEvents];

        if (newEvents.length >= 10) {
          newEvents.pop();
        }
        newEvents.unshift({
          user: args[0],
          amount: args[1],
          poolId: 3,
          event: args[args.length - 1],
        });
        return newEvents;
      });
    },
    chainId: 1,
  });

  return depositEvents;
}
