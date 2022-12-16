"use client";

import { formatUnits } from "ethers/lib/utils";

import usePoolData from "@/hooks/usePoolData";
import usePrice from "@/hooks/usePrice";
import useTimeframe from "@/hooks/useTimeframe";

import { TimeFrame } from "@/types/timeframe";
import { PoolType } from "@/types/data";

import TimeframeSelector from "@/components/timeframeSelector";
import { Dispatch, useEffect, useState } from "react";
import useBalances from "@/hooks/useBalances";
import useApeCoinBalance from "@/hooks/useApeCoinBalance";

export default function Calculator() {
  const poolData = usePoolData();
  const apecoinPrice = usePrice();
  const { timeframe } = useTimeframe();
  const { baycPoolStakable, maycPoolStakable, bakcPoolStakable } =
    useBalances();
  const { apeCoinBalance } = useApeCoinBalance();

  // apecoinPrice comes back as a big number and apecoin token has 8 decimal
  // places, so we need to turn it into a formatted string via ethers then
  // turn that into a number
  const apecoinPriceNumber = apecoinPrice && +formatUnits(apecoinPrice, 8);

  const [apeCoinOwnedCount, setApeCoinOwnedCount] = useState<number>(0);
  const [baycTokenOwnedCount, setBaycTokenOwnedCount] = useState<number>(0);
  const [maycTokenOwnedCount, setMaycTokenOwnedCount] = useState<number>(0);
  const [bakcTokenOwnedCount, setBakcTokenOwnedCount] = useState<number>(0);

  const [apeCoinToStakeCount, setApeCoinToStakeCount] = useState<number>(0);
  const [baycTokenToStakeCount, setBaycTokenToStakeCount] = useState<number>(0);
  const [maycTokenToStakeCount, setMaycTokenToStakeCount] = useState<number>(0);
  const [bakcTokenToStakeCount, setBakcTokenToStakeCount] = useState<number>(0);

  interface PoolDataInterface {
    type: PoolType;
    maxStakeAmount?: number;
    ownedCount: number;
    setOwnedCount: Dispatch<number>;
    toStake: number;
    setToStakeCount: Dispatch<number>;
  }

  const PoolDataArray: PoolDataInterface[] = [
    {
      type: PoolType.APE,
      ownedCount: apeCoinOwnedCount,
      setOwnedCount: setApeCoinOwnedCount,
      toStake: apeCoinToStakeCount,
      setToStakeCount: setApeCoinToStakeCount,
    },
    {
      type: PoolType.BAYC,
      maxStakeAmount: 10094,
      ownedCount: baycTokenOwnedCount,
      setOwnedCount: setBaycTokenOwnedCount,
      toStake: baycTokenToStakeCount,
      setToStakeCount: setBaycTokenToStakeCount,
    },
    {
      type: PoolType.MAYC,
      maxStakeAmount: 2042,
      ownedCount: maycTokenOwnedCount,
      setOwnedCount: setMaycTokenOwnedCount,
      toStake: maycTokenToStakeCount,
      setToStakeCount: setMaycTokenToStakeCount,
    },
    {
      type: PoolType.BAKC,
      maxStakeAmount: 856,
      ownedCount: bakcTokenOwnedCount,
      setOwnedCount: setBakcTokenOwnedCount,
      toStake: bakcTokenToStakeCount,
      setToStakeCount: setBakcTokenToStakeCount,
    },
  ];

  let PoolDataObject: { [key in PoolType]: PoolDataInterface };
  PoolDataObject = PoolDataArray.reduce((map, obj) => {
    map[obj.type] = obj;
    return map;
  }, {} as { [key in PoolType]: PoolDataInterface });

  useEffect(() => {
    setApeCoinToStakeCount(apeCoinOwnedCount);
  }, [apeCoinOwnedCount]);

  useEffect(() => {
    setBaycTokenToStakeCount(
      baycTokenOwnedCount * PoolDataObject[PoolType.BAYC].maxStakeAmount!
    );
  }, [baycTokenOwnedCount]);

  useEffect(() => {
    setMaycTokenToStakeCount(
      maycTokenOwnedCount * PoolDataObject[PoolType.MAYC].maxStakeAmount!
    );
  }, [maycTokenOwnedCount]);

  useEffect(() => {
    setBakcTokenToStakeCount(
      bakcTokenOwnedCount * PoolDataObject[PoolType.BAKC].maxStakeAmount!
    );
  }, [bakcTokenOwnedCount]);

  useEffect(() => {
    if (!apeCoinBalance) return;
    setApeCoinOwnedCount(Math.round(apeCoinBalance));
  }, [apeCoinBalance]);

  useEffect(() => {
    setBaycTokenOwnedCount(baycPoolStakable);
  }, [baycPoolStakable]);

  useEffect(() => {
    setMaycTokenOwnedCount(maycPoolStakable);
  }, [maycPoolStakable]);

  useEffect(() => {
    setBakcTokenOwnedCount(bakcPoolStakable);
  }, [bakcPoolStakable]);

  const totalStakable =
    apeCoinToStakeCount +
    baycTokenToStakeCount +
    maycTokenToStakeCount +
    bakcTokenToStakeCount;

  const hourlyRewardsTotal =
    apeCoinToStakeCount * poolData.poolData[PoolType.APE].rewardPerHour! +
    baycTokenToStakeCount * poolData.poolData[PoolType.BAYC].rewardPerHour! +
    maycTokenToStakeCount * poolData.poolData[PoolType.MAYC].rewardPerHour! +
    bakcTokenToStakeCount * poolData.poolData[PoolType.BAKC].rewardPerHour!;

  const dailyRewardsTotal = hourlyRewardsTotal * 24;
  const weeklyRewardsTotal = dailyRewardsTotal * 7;

  let rewardsTotal;
  let timeFrameHourMultiplier: number;
  switch (timeframe) {
    case TimeFrame.Hourly:
      rewardsTotal = hourlyRewardsTotal;
      timeFrameHourMultiplier = 1;
      break;
    case TimeFrame.Daily:
      rewardsTotal = dailyRewardsTotal;
      timeFrameHourMultiplier = 24;
      break;
    case TimeFrame.Weekly:
      rewardsTotal = weeklyRewardsTotal;
      timeFrameHourMultiplier = 24 * 7;
      break;
  }

  return (
    <div className="mt-4">
      <TimeframeSelector />
      <div className="overflow-auto border dark:border-gray-600">
        <table className="w-full">
          <thead className="border-b-2 border-gray-200 dark:border-gray-600">
            <tr className="flex">
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Owned Token Count
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                ApeCoin To Stake
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                {timeframe} ApeCoin Reward
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {(Object.keys(poolData.poolData) as unknown as PoolType[]).map(
              (pool) => (
                <tr key={pool} className="flex">
                  <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                    <input
                      className={`${
                        pool != PoolType.APE ? "w-16" : "w-28"
                      } border px-2 dark:border-slate-500 dark:bg-slate-800`}
                      value={PoolDataObject[pool].ownedCount}
                      onChange={(e) => {
                        const newValue = +e.target.value;
                        if (!isNaN(newValue)) {
                          PoolDataObject[pool].setOwnedCount(+e.target.value);
                        }
                      }}
                    />
                    <span>
                      {poolData.poolData[pool].name}
                      {pool != PoolType.APE && <>&nbsp;NFTs</>}
                    </span>{" "}
                  </td>
                  <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                    <input
                      className="w-28 border px-2 dark:border-slate-500 dark:bg-slate-800"
                      value={PoolDataObject[pool].toStake}
                      onChange={(e) => {
                        const newValue = +e.target.value;
                        if (!isNaN(newValue)) {
                          PoolDataObject[pool].setToStakeCount(+e.target.value);
                        }
                      }}
                    />
                    {PoolDataObject[pool].ownedCount != 0 &&
                      PoolDataObject[pool].maxStakeAmount &&
                      PoolDataObject[pool].toStake !=
                        PoolDataObject[pool].ownedCount *
                          PoolDataObject[pool].maxStakeAmount! && (
                        <button
                          onClick={() => {
                            PoolDataObject[pool].setToStakeCount(
                              PoolDataObject[pool].ownedCount *
                                PoolDataObject[pool].maxStakeAmount!
                            );
                          }}
                        >
                          MAX
                        </button>
                      )}
                    {PoolDataObject[pool].maxStakeAmount &&
                    PoolDataObject[pool].toStake != 0 &&
                    PoolDataObject[pool].toStake ==
                      PoolDataObject[pool].ownedCount *
                        PoolDataObject[pool].maxStakeAmount! ? (
                      <button
                        onClick={() => {
                          PoolDataObject[pool].setToStakeCount(0);
                        }}
                      >
                        CLEAR
                      </button>
                    ) : (
                      <button className="invisible">HIDDEN</button>
                    )}
                  </td>
                  <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                    {poolData.poolData[pool].rewardPerHour &&
                    poolData.poolData[pool].rewardPerDay &&
                    apecoinPriceNumber ? (
                      <>
                        {Intl.NumberFormat(undefined, {
                          maximumFractionDigits: 4,
                        }).format(
                          poolData.poolData[pool].rewardPerHour! *
                            timeFrameHourMultiplier *
                            PoolDataObject[pool].toStake
                        )}{" "}
                        (
                        {Intl.NumberFormat(undefined, {
                          maximumFractionDigits: 4,
                          style: "currency",
                          currency: "USD",
                        }).format(
                          poolData.poolData[pool].rewardPerHour! *
                            timeFrameHourMultiplier *
                            PoolDataObject[pool].toStake *
                            apecoinPriceNumber!
                        )}
                        )
                      </>
                    ) : (
                      <div role="status" className="max-w-sm animate-pulse">
                        <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700 md:w-36"></div>
                        <span className="sr-only">Loading...</span>
                      </div>
                    )}
                  </td>
                </tr>
              )
            )}
            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Totals{" "}
                {totalStakable !== 0 && (
                  <span className="rounded bg-green-100 px-2.5 py-0.5 text-sm font-semibold text-green-800 dark:bg-green-200 dark:text-green-900">
                    {(
                      (dailyRewardsTotal / totalStakable) *
                      365 *
                      100
                    ).toFixed()}
                    %&nbsp;APR
                  </span>
                )}
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat(undefined, {
                  maximumFractionDigits: 4,
                }).format(totalStakable) || 0}
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {apecoinPriceNumber ? (
                  <>
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 4,
                    }).format(rewardsTotal)}{" "}
                    (
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 4,
                      style: "currency",
                      currency: "USD",
                    }).format(
                      hourlyRewardsTotal *
                        apecoinPriceNumber! *
                        timeFrameHourMultiplier
                    )}
                    )
                  </>
                ) : (
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700 md:w-36"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
