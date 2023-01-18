import { usePrepareContractWrite, useNetwork, useContractWrite } from "wagmi";
import StakingABI from "@/abis/staking";
import { BigNumber } from "ethers";
import { stakingContractAddresses } from "@/types/constants";

interface UseDepositsProps {
  addressOrEns?: string;
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

  return { write };
};
