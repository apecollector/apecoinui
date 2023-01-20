import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { stakingContractAddresses } from "@/types/constants";

interface UseDepositsProps {
  amount: BigNumber;
}

export const useDeposits = (props: UseDepositsProps) => {
  const { amount } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "depositSelfApeCoin",
    chainId: chain?.id || 1,
    args: [amount],
    enabled: amount.gt(0),
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { depositApecoin: write };
};
export interface SingleNft {
  tokenId: BigNumber;
  amount: BigNumber;
}

interface UseNftDepositsProps {
  poolId: 1 | 2;
  nfts: SingleNft[];
}

export const useNftDeposits = (props: UseNftDepositsProps) => {
  const { poolId, nfts } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: poolId === 1 ? "depositBAYC" : "depositMAYC",
    chainId: chain?.id || 1,
    args: [nfts],
    enabled: Boolean(nfts.find((n) => n.amount.gt(0))),
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { depositNft: write };
};

interface PairNftDepositWithAmount {
  mainTokenId: BigNumber;
  bakcTokenId: BigNumber;
  amount: BigNumber;
}

interface UseBakcDepositsProps {
  baycPairs: PairNftDepositWithAmount[];
  maycPairs: PairNftDepositWithAmount[];
}

export const useBakcDeposits = (props: UseBakcDepositsProps) => {
  const { baycPairs, maycPairs } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "depositBAKC",
    chainId: chain?.id || 1,
    args: [baycPairs, maycPairs],
    enabled: baycPairs.length > 0 || maycPairs.length > 0,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { depositBakc: write };
};
