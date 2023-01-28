import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { StakingContractAddresses } from "@/types/constants";
import { PairNftWithAmount, SingleNft } from "@/types/contract";

interface UseDepositsProps {
  amount: BigNumber;
}

export const useDeposits = (props: UseDepositsProps) => {
  const { amount } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
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

interface UseNftDepositsProps {
  poolId: 1 | 2;
  nfts: SingleNft[];
}

export const useNftDeposits = (props: UseNftDepositsProps) => {
  const { poolId, nfts = [] } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
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

interface UseBakcDepositsProps {
  bayc: PairNftWithAmount[];
  mayc: PairNftWithAmount[];
}

export const useBakcDeposits = (props: UseBakcDepositsProps) => {
  const { bayc = [], mayc = [] } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "depositBAKC",
    chainId: chain?.id || 1,
    args: [bayc, mayc],
    enabled: bayc.length > 0 || mayc.length > 0,
  });

  const { data, isLoading, isSuccess, write, ...rest } = useContractWrite({
    ...config,
  });

  return { depositBakc: write };
};
