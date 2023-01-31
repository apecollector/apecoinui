import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import { BigNumber, ethers } from "ethers";
import { PoolType, StakingContractAddresses } from "@/types/constants";
import { PairNftWithAmount, SingleNft } from "@/types/contract";
import { poolStakesData } from "./useAllStakes";
import { getStakingAbi } from "@/utils/abi";

interface UseWithdrawSelfApecoinProps {
  amount: BigNumber;
}

export const useWithdrawSelfApecoin = (props: UseWithdrawSelfApecoinProps) => {
  const { amount } = props;
  const { chain } = useNetwork();
  const chainId = chain?.id ?? 1;
  const abi = getStakingAbi(chainId);
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi,
    functionName: "withdrawSelfApeCoin",
    chainId: chain?.id || 1,
    args: [amount],
    enabled: amount.gt(0),
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { withdrawSelfApecoin: write };
};

interface UseWithdrawSelfNftProps {
  poolId: PoolType.BAYC | PoolType.MAYC;
  nfts: SingleNft[];
}

export const useWithdrawSelfNft = (props: UseWithdrawSelfNftProps) => {
  const { poolId, nfts = [] } = props;
  const { chain } = useNetwork();
  const chainId = chain?.id ?? 1;
  const abi = getStakingAbi(chainId);
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chainId],
    abi,
    functionName:
      poolId === PoolType.BAYC ? "withdrawSelfBAYC" : "withdrawSelfMAYC",
    chainId: chainId,
    args: [nfts],
    enabled: Boolean(nfts.find((n) => n.amount.gt(0))),
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { withdrawSelfNft: write };
};

interface UseWithdrawBakcProps {
  bayc: PairNftWithAmount[];
  mayc: PairNftWithAmount[];
}

export const useWithdrawBakc = (props: UseWithdrawBakcProps) => {
  const { bayc = [], mayc = [] } = props;
  const { chain } = useNetwork();
  const chainId = chain?.id ?? 1;
  const abi = getStakingAbi(chainId);

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chainId],
    abi,
    functionName: "withdrawBAKC",
    chainId: chain?.id || 1,
    args: [bayc, mayc],
    enabled: bayc.length > 0 || mayc.length > 0,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { withdrawBakc: write };
};

export const getFnWithdrawArgsApecoin =
  (allStakes: readonly poolStakesData[]) =>
  (asString: boolean = true) => {
    const token = allStakes[0];
    if (token?.deposited.gt(0)) {
      return asString ? token.deposited.toString() : token.deposited;
    } else {
      return "";
    }
  };

export const getFnWithdrawArgsNft =
  (allStakes: readonly poolStakesData[] = []) =>
  (poolId: PoolType.BAYC | PoolType.MAYC, asString = true) => {
    return (allStakes ?? [])
      .filter(
        (stake) => stake.poolId.toNumber() === poolId && stake.deposited?.gt(0)
      )
      .map((token) =>
        asString
          ? [token.tokenId.toNumber(), token.deposited.toString()]
          : ({
              tokenId: token.tokenId.toNumber(),
              amount: token.deposited,
            } as SingleNft)
      );
  };

export const getFnWithdrawArgsBakc =
  (allStakes: readonly poolStakesData[] = []) =>
  (mainTypePoolId: number, asString: boolean) => {
    return (allStakes ?? [])
      .filter(
        (stake) =>
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId &&
          stake.deposited?.gt(0)
      )
      .map((token) =>
        asString
          ? [
              token.pair.mainTokenId.toNumber(),
              token.tokenId.toNumber(),
              token.deposited.toString(),
            ]
          : ({
              mainTokenId: token.pair.mainTokenId.toNumber(),
              bakcTokenId: token.tokenId.toNumber(),
              amount: token.deposited,
              isUncommit: true,
            } as PairNftWithAmount)
      );
  };
