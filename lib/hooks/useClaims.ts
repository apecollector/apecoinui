import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { StakingContractAddresses } from "@/types/constants";
import { PairNft } from "@/types/contract";

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
  tokenIds: BigNumber[];
}

export const useClaimSelfNft = (props: UseClaimSelfNftProps) => {
  const { poolId, tokenIds } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: poolId === 1 ? "claimSelfBAYC" : "claimSelfMAYC",
    chainId: chain?.id || 1,
    args: [tokenIds],
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { claimSelfNft: write };
};

interface UseClaimBakcNftProps {
  bayc: PairNft[];
  mayc: PairNft[];
}

export const useClaimSelfBakc = (props: UseClaimBakcNftProps) => {
  const { bayc, mayc } = props;

  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "claimSelfBAKC",
    chainId: chain?.id || 1,
    args: [bayc, mayc],
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { claimSelfBakc: write };
};
