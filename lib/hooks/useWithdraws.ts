import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { StakingContractAddresses } from "@/types/constants";
import { PairNftWithAmount, SingleNft } from "@/types/contract";

interface UseWithdrawSelfApecoinProps {
  amount: BigNumber;
}

export const useWithdrawSelfApecoin = (props: UseWithdrawSelfApecoinProps) => {
  const { amount } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
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
  poolId: 1 | 2;
  nfts: SingleNft[];
}

export const useWithdrawSelfNft = (props: UseWithdrawSelfNftProps) => {
  const { poolId, nfts } = props;
  const { chain } = useNetwork();

  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: poolId === 1 ? "withdrawSelfBAYC" : "withdrawSelfMAYC",
    chainId: chain?.id || 1,
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
  const { bayc, mayc } = props;
  const { chain } = useNetwork();
  const { config } = usePrepareContractWrite({
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
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
