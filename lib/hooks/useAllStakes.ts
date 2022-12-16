import { useContractRead, useNetwork } from "wagmi";
import StakingABI from "@/abis/staking";
import { Map } from "@/types/map";

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
} as const;

function useAllStakes(address: string) {
  const { chain } = useNetwork();

  const poolsContractRead = useContractRead({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "getAllStakes",
    watch: true,
    chainId: chain?.id || 1,
    args: [address as `0x${string}`],
  });

  return poolsContractRead;
}

export default useAllStakes;
