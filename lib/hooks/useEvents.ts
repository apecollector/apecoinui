import { useContractEvent, useProvider } from "wagmi";
import { ethers, Contract } from "ethers";

import StakingABI from "@/abis/staking_mainnet";
import useStore from "@/stores/store";
import { useEffect, useRef } from "react";
import { StakingContractAddress } from "../types/constants";

const useEvents = () => {
  const alreadyAdded = useRef(false);
  const events = useStore((state) => state.events);
  const addEvent = useStore((state) => state.addEvent);

  const provider = useProvider();

  async function connectToMetamask() {
    const contract = new Contract(
      StakingContractAddress.Ethereum,
      StakingABI,
      provider
    );

    const blockNumber = await provider.getBlockNumber();

    const claimEventFilter = contract.filters.ClaimRewardsNft();
    const claimPastEvents = await contract.queryFilter(
      claimEventFilter,
      blockNumber - 100
    );

    for (let i = 0; i < claimPastEvents.length; i++) {
      const pastEvent = claimPastEvents[i];
      addEvent({
        type: "Claim",
        user: pastEvent.args?.user!,
        amount: pastEvent.args?.amount!,
        poolId: pastEvent.args?.poolId.toNumber()!,
        hash: pastEvent.transactionHash,
      });
    }
  }

  useEffect(() => {
    if (alreadyAdded.current) return;
    connectToMetamask();
    alreadyAdded.current = true;
  }, [alreadyAdded]);

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "Deposit",
    listener(...args) {
      addEvent({
        type: "Deposit",
        user: args[0],
        amount: args[1],
        poolId: 0,
        hash: args[3].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "DepositNft",
    listener(...args) {
      addEvent({
        type: "Deposit",
        user: args[0],
        poolId: args[1].toNumber(),
        amount: args[2],
        hash: args[4].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "DepositPairNft",
    listener(...args) {
      addEvent({
        type: "Deposit",
        user: args[0],
        amount: args[1],
        poolId: 3,
        hash: args[5].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "Withdraw",
    listener(...args) {
      addEvent({
        type: "Withdraw",
        user: args[0],
        amount: args[1],
        poolId: 0,
        hash: args[3].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "WithdrawNft",
    listener(...args) {
      addEvent({
        type: "Withdraw",
        user: args[0],
        poolId: args[1].toNumber(),
        amount: args[2],
        hash: args[5].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "WithdrawPairNft",
    listener(...args) {
      addEvent({
        type: "Withdraw",
        user: args[0],
        amount: args[1],
        poolId: 3,
        hash: args[5].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "ClaimRewards",
    listener(...args) {
      addEvent({
        type: "Claim",
        user: args[0],
        amount: args[1],
        poolId: 0,
        hash: args[3].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "ClaimRewardsNft",
    listener(...args) {
      addEvent({
        type: "Claim",
        user: args[0],
        poolId: args[1].toNumber(),
        amount: args[2],
        hash: args[4].transactionHash,
      });
    },
    chainId: 1,
  });

  useContractEvent({
    address: StakingContractAddress.Ethereum,
    abi: StakingABI,
    eventName: "ClaimRewardsPairNft",
    listener(...args) {
      addEvent({
        type: "Claim",
        user: args[0],
        amount: args[1],
        poolId: 3,
        hash: args[5].transactionHash,
      });
    },
    chainId: 1,
  });

  return events;
};

export default useEvents;
