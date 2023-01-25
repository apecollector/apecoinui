import { useContractRead, useNetwork, useEnsAddress } from "wagmi";
import StakingABI from "@/abis/staking";
import { StakingContractAddresses } from "@/types/constants";
import { BigNumber } from "ethers";

export interface poolStakesData {
  poolId: BigNumber;
  tokenId: BigNumber;
  deposited: BigNumber;
  unclaimed: BigNumber;
  rewards24hr: BigNumber;
  pair: { mainTokenId: BigNumber; mainTypePoolId: BigNumber };
}

function useAllStakes(addressOrEns: string) {
  const { chain } = useNetwork();
  const { data } = useEnsAddress({
    name: addressOrEns,
  });

  const poolsContractRead = useContractRead({
    enabled: addressOrEns !== undefined && addressOrEns !== "",
    address: StakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "getAllStakes",
    watch: true,
    chainId: chain?.id || 1,
    args: [data as `0x${string}`],
  });

  const apeCoinStakes: poolStakesData[] | undefined =
    poolsContractRead.data?.filter((stake) => {
      if (stake.poolId.toNumber() === 0) {
        return true;
      }
    });

  const baycStakes: poolStakesData[] | undefined =
    poolsContractRead.data?.filter((stake) => {
      if (stake.poolId.toNumber() === 1) {
        return true;
      }
    });

  const maycStakes: poolStakesData[] | undefined =
    poolsContractRead.data?.filter((stake) => {
      if (stake.poolId.toNumber() === 2) {
        return true;
      }
    });

  const bakcStakes: poolStakesData[] | undefined =
    poolsContractRead.data?.filter((stake) => {
      if (stake.poolId.toNumber() === 3) {
        return true;
      }
    });

  return {
    poolsContractRead,
    apeCoinStakes,
    baycStakes,
    maycStakes,
    bakcStakes,
  };
}

export default useAllStakes;
