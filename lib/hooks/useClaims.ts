import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import { BigNumber } from "ethers";
import { PoolType, StakingContractAddresses } from "@/types/constants";
import { PairNft, PairNftClaim } from "@/types/contract";
import { poolStakesData } from "./useAllStakes";
import { getStakingAbi } from "@/utils/abi";

export const useClaimSelfApecoin = () => {
  const { chain } = useNetwork();

  const chainId = chain?.id ?? 1;
  const abi = getStakingAbi(chainId);

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi,
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

  const chainId = chain?.id ?? 1;
  const abi = getStakingAbi(chainId);

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi,
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
  bayc: PairNftClaim[];
  mayc: PairNftClaim[];
}

export const useClaimSelfBakc = (props: UseClaimBakcNftProps) => {
  const { bayc = [], mayc = [] } = props;

  const { chain } = useNetwork();
  const chainId = chain?.id || 1;
  const abi = getStakingAbi(chainId);
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chainId],
    abi,
    functionName: "claimSelfBAKC",
    chainId: chainId,
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
  (poolId: PoolType.BAYC | PoolType.MAYC, asString: boolean) => {
    return (allStakes ?? [])
      .filter(
        (stake) => stake.poolId.toNumber() === poolId && stake.unclaimed?.gt(0)
      )
      .map((token) => (asString ? token.tokenId.toNumber() : token.tokenId));
  };

export const getFnClaimArgsBakc =
  (allStakes: readonly poolStakesData[] = []) =>
  (mainTypePoolId: PoolType.BAYC | PoolType.MAYC, asString: boolean) => {
    return (allStakes ?? [])
      .filter(
        (stake) =>
          stake.poolId.toNumber() === PoolType.BAKC &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId &&
          stake.unclaimed?.gt(0)
      )
      .map((token) =>
        asString
          ? [token.pair.mainTokenId.toNumber(), token.tokenId.toNumber()]
          : ({
              mainTokenId: token.pair.mainTokenId,
              bakcTokenId: token.tokenId,
            } as PairNftClaim)
      );
  };
