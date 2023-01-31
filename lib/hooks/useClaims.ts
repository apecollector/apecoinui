import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { PoolType, StakingContractAddresses } from "@/types/constants";
import { PairNft } from "@/types/contract";
import { poolStakesData } from "./useAllStakes";

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
  poolId: PoolType.BAYC | PoolType.MAYC;
  tokenIds: BigNumber[];
}

export const useClaimSelfNft = (props: UseClaimSelfNftProps) => {
  const { poolId, tokenIds = [] } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: poolId === PoolType.BAYC ? "claimSelfBAYC" : "claimSelfMAYC",
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
  const { bayc = [], mayc = [] } = props;

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

export const getFnClaimArgsApecoin =
  (allStakes: readonly poolStakesData[] = []) =>
  (asString: boolean) => {
    const token = allStakes?.[0];
    if (token?.unclaimed.gt(0)) {
      return asString ? token.unclaimed.toString() : token.unclaimed;
    } else {
      return "";
    }
  };

export const getFnClaimArgsNft =
  (allStakes: readonly poolStakesData[] = []) =>
  (poolId: number, asString: boolean) => {
    return (allStakes ?? [])
      .filter(
        (stake) => stake.poolId.toNumber() === poolId && stake.unclaimed?.gt(0)
      )
      .map((token) => (asString ? token.tokenId.toNumber() : token.tokenId));
  };

export const getFnClaimArgsBakc =
  (allStakes: readonly poolStakesData[] = []) =>
  (mainTypePoolId: number, asString: boolean) => {
    return (allStakes ?? [])
      .filter(
        (stake) =>
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId &&
          stake.unclaimed?.gt(0)
      )
      .map((token) =>
        asString
          ? [token.pair.mainTokenId.toNumber(), token.tokenId.toNumber()]
          : ({
              mainTokenId: token.pair.mainTokenId,
              bakcTokenId: token.tokenId,
            } as PairNft)
      );
  };
