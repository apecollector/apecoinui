"use client";

import { formatUnits } from "ethers/lib/utils";

import usePoolData from "@/hooks/usePoolData";
import { TimeFrame } from "@/types/timeframe";
import { Amount, PoolType } from "@/types/data";
import usePrice from "@/hooks/usePrice";
import useTimeframe from "@/hooks/useTimeframe";
import TimeframeSelector from "./timeframeSelector";

import useAmount from "@/hooks/useAmount";
import AmountSelector from "./amountSelector";

export default function Data() {
  const { timeframe: selectedTimeframe } = useTimeframe();
  const { amount: selectedAmount } = useAmount();

  const poolData = usePoolData();
  const { apecoinPrice } = usePrice();

  const apecoinPriceHumanNumber = apecoinPrice && +formatUnits(apecoinPrice, 8);
  const rewardHeader =
    selectedAmount === Amount.PerApe
      ? "ApeCoin Reward Per ApeCoin Staked"
      : "ApeCoin Reward With 1 Max Staked NFT";

  const rewardMultiplier = (pool: number): number => {
    if (selectedAmount === Amount.PerApe) return 1;
    if (pool == 1) return 10094;
    if (pool == 2) return 2042;
    if (pool == 3) return 856;
    return NaN;
  };

  let timeFrameHourMultiplier: number;
  switch (selectedTimeframe) {
    case TimeFrame.Hourly:
      timeFrameHourMultiplier = 1;
      break;
    case TimeFrame.Daily:
      timeFrameHourMultiplier = 24;
      break;
    case TimeFrame.Weekly:
      timeFrameHourMultiplier = 24 * 7;
      break;
    case TimeFrame.Monthly:
      timeFrameHourMultiplier = 24 * 30;
      break;
  }

  return (
    <div className="mt-4">
      <div className="ld:items-center flex flex-col justify-between gap-x-4 md:flex-row">
        <TimeframeSelector /> <AmountSelector />
      </div>
      <div className="overflow-auto border dark:border-zinc-700">
        <table className="w-full">
          <thead className="border-b border-zinc-200 dark:border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
                Staking Pool
              </th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
                Total Staked
              </th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
                {selectedTimeframe} Reward Pool
              </th>
              <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
                {selectedTimeframe} {rewardHeader}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {(Object.keys(poolData.poolData) as unknown as PoolType[]).map(
              (pool) => (
                <tr key={pool} className="flex">
                  <td className="flex w-1/4 flex-wrap items-center gap-x-4 p-4">
                    <span>
                      {poolData.poolData[pool].name}
                      {pool == PoolType.APE && <>&nbsp;</>}
                    </span>{" "}
                    {poolData.poolData[pool].apr ? (
                      <span className="rounded bg-green-100 px-2.5 py-0.5 text-sm font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
                        {poolData.poolData[pool].apr?.toFixed(0)}%&nbsp;APR
                      </span>
                    ) : (
                      <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </td>
                  <td className="flex w-1/4 flex-wrap items-center p-4">
                    {poolData.poolData[pool].stakedAmount ? (
                      <>
                        {Intl.NumberFormat(undefined, {
                          maximumFractionDigits: 0,
                        }).format(poolData.poolData[pool].stakedAmount!)}
                      </>
                    ) : (
                      <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 md:w-36"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </td>
                  <td className="flex w-1/4 flex-wrap items-center p-4">
                    {poolData.poolData[pool].rewardPoolPerHour &&
                    poolData.poolData[pool].rewardPoolPerDay ? (
                      <>
                        {Intl.NumberFormat(undefined, {
                          maximumFractionDigits: 0,
                        }).format(
                          selectedTimeframe === TimeFrame.Hourly
                            ? poolData.poolData[pool].rewardPoolPerHour!
                            : poolData.poolData[pool].rewardPoolPerDay!
                        )}
                      </>
                    ) : (
                      <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 md:w-36"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </td>
                  <td className="flex w-1/4 flex-wrap items-center p-4">
                    {poolData.poolData[pool].rewardPerHour &&
                    poolData.poolData[pool].rewardPerDay &&
                    apecoinPriceHumanNumber ? (
                      <>
                        {isNaN(rewardMultiplier(pool)) ? (
                          <>Pool has no maximum</>
                        ) : (
                          <>
                            {Intl.NumberFormat(undefined, {
                              maximumFractionDigits: 4,
                            }).format(
                              timeFrameHourMultiplier *
                                poolData.poolData[pool].rewardPerHour! *
                                rewardMultiplier(pool)
                            )}{" "}
                            (
                            {Intl.NumberFormat(undefined, {
                              maximumFractionDigits: 4,
                              style: "currency",
                              currency: "USD",
                            }).format(
                              timeFrameHourMultiplier *
                                poolData.poolData[pool].rewardPerHour! *
                                rewardMultiplier(pool) *
                                apecoinPriceHumanNumber
                            )}
                            )
                          </>
                        )}
                      </>
                    ) : (
                      <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 md:w-36"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
