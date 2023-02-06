import MainnetStakingABI from "@/abis/staking_mainnet";
import GoerliStakingABI from "@/abis/staking_mainnet";

import { Network } from "@/types/constants";

export const getStakingAbi = (chainId: Network) => {
  if (chainId === Network.Ethereum) {
    return MainnetStakingABI;
  } else if (chainId === Network.Goerli) {
    return GoerliStakingABI;
  } else {
    throw new Error("Unsupported network");
  }
};
