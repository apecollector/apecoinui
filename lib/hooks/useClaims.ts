import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { StakingContractAddresses } from "@/types/constants";
import { PairNftWithAmount, SingleNft } from "@/types/contract";

export const useClaimSelfApecoin = () => {
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "claimSelfApeCoin",
    chainId: chain?.id || 1,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { claimSelfApecoin: write };
};

interface UseClaimSelfNftProps {
  poolId: 1 | 2;
}

export const useClaimSelfNft = (props: UseClaimSelfNftProps) => {
  const { poolId } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: poolId === 1 ? "claimSelfBAYC" : "claimSelfMAYC",
    chainId: chain?.id || 1,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { claimSelfNft: write };
};

export const useClaimBakc = () => {
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "claimBAKC",
    chainId: chain?.id || 1,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { claimBakc: write };
};
