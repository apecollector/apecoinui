import { useContractRead, useNetwork } from "wagmi";
import StakingABI from "@/abis/staking";
import { useEffect, useState } from "react";
import { formatUnits } from "ethers/lib/utils.js";
import { Map } from "@/types/map";
import { PoolData } from "@/types/data";

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0xeF37717B1807a253c6D140Aca0141404D23c26D4",
} as const;

function calculateAPR(perDayPool: number, stakedAmount: number): number {
  return (perDayPool / stakedAmount) * 365 * 100;
}

function usePoolData(): {
  initialLoad: boolean;
  poolData: PoolData;
} {
  const { chain } = useNetwork();

  const poolsContractRead = useContractRead({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "getPoolsUI",
    watch: true,
    chainId: chain?.id || 1,
  });

  const [initialLoad, setInitialLoad] = useState(false);
  const [poolData, setPoolData] = useState<PoolData>({
    0: {
      name: "APE",
    },
    1: {
      name: "BAYC",
    },
    2: {
      name: "MAYC",
    },
    3: {
      name: "BAKC",
    },
  });

  useEffect(() => {
    if (
      !poolsContractRead ||
      !poolsContractRead.data ||
      poolsContractRead.data.length !== 4
    ) {
      return;
    }
    if (poolsContractRead.isSuccess) {
      setInitialLoad(true);

      const apeRewardPoolPerHour = +formatUnits(
        poolsContractRead.data[0].currentTimeRange.rewardsPerHour
      );

      const apeRewardPoolPerDay = apeRewardPoolPerHour * 24;

      const apeRewardPerHour =
        +formatUnits(
          poolsContractRead.data[0].currentTimeRange.rewardsPerHour
        ) / +formatUnits(poolsContractRead.data[0].stakedAmount);

      const apeRewardPerDay = apeRewardPerHour * 24;

      const apeStakedAmount = +formatUnits(
        poolsContractRead.data[0].stakedAmount
      );
      const apePoolAPR = calculateAPR(apeRewardPoolPerDay, apeStakedAmount);

      const baycRewardPoolPerHour = +formatUnits(
        poolsContractRead.data[1].currentTimeRange.rewardsPerHour
      );

      const baycRewardPoolPerDay = baycRewardPoolPerHour * 24;

      const baycRewardPerHour =
        +formatUnits(
          poolsContractRead.data[1].currentTimeRange.rewardsPerHour
        ) / +formatUnits(poolsContractRead.data[1].stakedAmount);

      const baycRewardPerDay = baycRewardPerHour * 24;

      const baycStakedAmount = +formatUnits(
        poolsContractRead.data[1].stakedAmount
      );
      const baycPoolAPR = calculateAPR(baycRewardPoolPerDay, baycStakedAmount);

      const maycRewardPoolPerHour = +formatUnits(
        poolsContractRead.data[2].currentTimeRange.rewardsPerHour
      );

      const maycRewardPoolPerDay = maycRewardPoolPerHour * 24;

      const maycRewardPerHour =
        +formatUnits(
          poolsContractRead.data[2].currentTimeRange.rewardsPerHour
        ) / +formatUnits(poolsContractRead.data[2].stakedAmount);

      const maycRewardPerDay = maycRewardPerHour * 24;

      const maycStakedAmount = +formatUnits(
        poolsContractRead.data[2].stakedAmount
      );
      const maycPoolAPR = calculateAPR(maycRewardPoolPerDay, maycStakedAmount);

      const bakcRewardPoolPerHour = +formatUnits(
        poolsContractRead.data[3].currentTimeRange.rewardsPerHour
      );

      const bakcRewardPoolPerDay = bakcRewardPoolPerHour * 24;

      const bakcRewardPerHour =
        +formatUnits(
          poolsContractRead.data[3].currentTimeRange.rewardsPerHour
        ) / +formatUnits(poolsContractRead.data[3].stakedAmount);

      const bakcRewardPerDay = bakcRewardPerHour * 24;

      const bakcStakedAmount = +formatUnits(
        poolsContractRead.data[3].stakedAmount
      );
      const bakcPoolAPR = calculateAPR(bakcRewardPoolPerDay, bakcStakedAmount);

      setPoolData({
        0: {
          name: "APE",
          apr: apePoolAPR,
          stakedAmount: apeStakedAmount,
          rewardPoolPerHour: apeRewardPoolPerHour,
          rewardPoolPerDay: apeRewardPoolPerDay,
          rewardPerHour: apeRewardPerHour,
          rewardPerDay: apeRewardPerDay,
        },
        1: {
          name: "BAYC",
          apr: baycPoolAPR,
          stakedAmount: baycStakedAmount,
          rewardPoolPerHour: baycRewardPoolPerHour,
          rewardPoolPerDay: baycRewardPoolPerDay,
          rewardPerHour: baycRewardPerHour,
          rewardPerDay: baycRewardPerDay,
        },
        2: {
          name: "MAYC",
          apr: maycPoolAPR,
          stakedAmount: maycStakedAmount,
          rewardPoolPerHour: maycRewardPoolPerHour,
          rewardPoolPerDay: maycRewardPoolPerDay,
          rewardPerHour: maycRewardPerHour,
          rewardPerDay: maycRewardPerDay,
        },
        3: {
          name: "BAKC",
          apr: bakcPoolAPR,
          stakedAmount: bakcStakedAmount,
          rewardPoolPerHour: bakcRewardPoolPerHour,
          rewardPoolPerDay: bakcRewardPoolPerDay,
          rewardPerHour: bakcRewardPerHour,
          rewardPerDay: bakcRewardPerDay,
        },
      });
    }
  }, [
    poolsContractRead.isSuccess,
    poolsContractRead.isRefetching,
    poolsContractRead.data,
  ]);

  return { initialLoad, poolData };
}

export default usePoolData;
