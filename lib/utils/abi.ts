import MainnetStakingABI from "@/abis/staking_mainnet";
import GoerliStakingABI from "@/abis/staking_mainnet";

import { Network } from "@/types/constants";

export const getStakingAbi = (chainId: Network) =>
  chainId === Network.Ethereum ? MainnetStakingABI : GoerliStakingABI;
