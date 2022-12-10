"use client";

import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useContractRead, useContractReads, useNetwork } from "wagmi";

import StakingABI from "../../lib/abis/staking";
import PriceABI from "../../lib/abis/price";
import BalanceABI from "../../lib/abis/balance";
import useStakingStore from "../store";

const BAYC_MAX_STAKE = 10094;
const MAYC_MAX_STAKE = 2042;
const BAKC_MAX_STAKE = 856;

const stakingContractAddresses = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
};

const baycContractAddresses = {
  1: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  5: "0x9c4536F82bdDe595cF1F810309feE8a288aef89E",
};

const maycContractAddresses = {
  1: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
  5: "0x67d4266A52870879727EfFb903CE0030Fe86D6AC",
};

const bakcContractAddresses = {
  1: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623",
  5: "0xC84dE322c8403f8d8E2bAA3cB384A1e281664cF6",
};

export default function Data() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const baycContract = {
    address: baycContractAddresses[chain?.id],
    abi: BalanceABI,
  };

  const maycContract = {
    address: maycContractAddresses[chain?.id],
    abi: BalanceABI,
  };

  const bakcContract = {
    address: bakcContractAddresses[chain?.id],
    abi: BalanceABI,
  };

  const poolsContractRead = useContractRead({
    address: stakingContractAddresses[chain?.id || 1],
    abi: StakingABI,
    functionName: "getPoolsUI",
    watch: true,
    chainId: chain?.id || 1,
  });

  const priceContractRead = useContractRead({
    address: "0xD10aBbC76679a20055E167BB80A24ac851b37056",
    abi: PriceABI,
    functionName: "latestRoundData",
    watch: true,
    chainId: 1,
  });

  const { data, isSuccess } = useContractReads({
    enabled: isConnected,
    watch: true,
    contracts: [
      {
        ...baycContract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...maycContract,
        functionName: "balanceOf",
        args: [address],
      },
      {
        ...bakcContract,
        functionName: "balanceOf",
        args: [address],
      },
    ],
  });

  const apeCoinBalance = useStakingStore((state) => state.apeCoinBalance);

  const [initialLoad, setInitialLoad] = useState(false);

  const [baycPoolStakable, setBaycPoolStakable] = useState(0);
  const [maycPoolStakable, setMaycPoolStakable] = useState(0);
  const [bakcPoolStakable, setBakcPoolStakable] = useState(0);

  const [apecoinPrice, setApecoinPrice] = useState(null);

  const [apecoinPoolToStake, setApecoinPoolToStake] = useState(0);

  const [baycPoolHourlyReward, setBaycPoolHourlyReward] = useState(ethers.constants.Zero);
  const [maycPoolHourlyReward, setMaycPoolHourlyReward] = useState(ethers.constants.Zero);
  const [bakcPoolHourlyReward, setBakcPoolHourlyReward] = useState(ethers.constants.Zero);
  const [apecoinPoolHourlyReward, setApecoinPoolHourlyReward] = useState(ethers.constants.Zero);
  const [baycPoolTotalStaked, setBaycPoolTotalStaked] = useState(ethers.constants.Zero);
  const [maycPoolTotalStaked, setMaycPoolTotalStaked] = useState(ethers.constants.Zero);
  const [bakcPoolTotalStaked, setBakcPoolTotalStaked] = useState(ethers.constants.Zero);
  const [apecoinPoolTotalStaked, setApecoinPoolTotalStaked] = useState(ethers.constants.Zero);

  const baycStakableCoins = parseInt(baycPoolStakable) * BAYC_MAX_STAKE;
  const maycStakableCoins = parseInt(maycPoolStakable) * MAYC_MAX_STAKE;
  const bakcStakableCoins = parseInt(bakcPoolStakable) * BAKC_MAX_STAKE;

  const totalPrimaryTokens = parseInt(baycPoolStakable) + parseInt(maycPoolStakable);
  const totalStakable =
    apecoinPoolToStake + baycStakableCoins + maycStakableCoins + bakcStakableCoins;

  useEffect(() => {
    setApecoinPoolToStake(isNaN(apeCoinBalance) ? 0 : apeCoinBalance);
  }, [apeCoinBalance]);

  useEffect(() => {
    if (totalPrimaryTokens < bakcPoolStakable) {
      setBakcPoolStakable(totalPrimaryTokens);
    }
  }, [totalPrimaryTokens, bakcPoolStakable]);

  useEffect(() => {
    if (isSuccess) {
      setBaycPoolStakable(data[0] || 0);
      setMaycPoolStakable(data[1] || 0);
      setBakcPoolStakable(data[2] || 0);
    }
  }, [address, isSuccess, data]);

  useEffect(() => {
    if (poolsContractRead.isSuccess) {
      setInitialLoad(true);

      setApecoinPoolHourlyReward(poolsContractRead.data[0].currentTimeRange.rewardsPerHour);
      setApecoinPoolTotalStaked(poolsContractRead.data[0].stakedAmount);

      setBaycPoolHourlyReward(poolsContractRead.data[1].currentTimeRange.rewardsPerHour);
      setBaycPoolTotalStaked(poolsContractRead.data[1].stakedAmount);

      setMaycPoolHourlyReward(poolsContractRead.data[2].currentTimeRange.rewardsPerHour);
      setMaycPoolTotalStaked(poolsContractRead.data[2].stakedAmount);

      setBakcPoolHourlyReward(poolsContractRead.data[3].currentTimeRange.rewardsPerHour);
      setBakcPoolTotalStaked(poolsContractRead.data[3].stakedAmount);
    }
  }, [poolsContractRead.isSuccess, poolsContractRead.isRefetching, poolsContractRead.data]);

  useEffect(() => {
    if (priceContractRead.isSuccess) {
      setApecoinPrice(priceContractRead.data.answer);
    }
  }, [priceContractRead.isSuccess, priceContractRead.isRefetching, priceContractRead.data]);

  const stats = {
    apecoin: {
      totalStaked: Math.round(formatUnits(apecoinPoolTotalStaked)),
      hourlyRewards: Math.round(formatUnits(apecoinPoolHourlyReward)),
      dailyRewards: Math.round(formatUnits(apecoinPoolHourlyReward)) * 24,
      dailyRewardsPerApeCoin:
        (+formatUnits(apecoinPoolHourlyReward) / +formatUnits(apecoinPoolTotalStaked)) * 24,
    },
    bayc: {
      totalStaked: Math.round(formatUnits(baycPoolTotalStaked)),
      hourlyRewards: Math.round(formatUnits(baycPoolHourlyReward)),
      dailyRewards: Math.round(formatUnits(baycPoolHourlyReward)) * 24,
      dailyRewardsPerApeCoin:
        (+formatUnits(baycPoolHourlyReward) / +formatUnits(baycPoolTotalStaked)) * 24,
    },
    mayc: {
      totalStaked: Math.round(formatUnits(maycPoolTotalStaked)),
      hourlyRewards: Math.round(formatUnits(maycPoolHourlyReward)),
      dailyRewards: Math.round(formatUnits(maycPoolHourlyReward)) * 24,
      dailyRewardsPerApeCoin:
        (+formatUnits(maycPoolHourlyReward) / +formatUnits(maycPoolTotalStaked)) * 24,
    },
    bakc: {
      totalStaked: Math.round(formatUnits(bakcPoolTotalStaked)),
      hourlyRewards: Math.round(formatUnits(bakcPoolHourlyReward)),
      dailyRewards: Math.round(formatUnits(bakcPoolHourlyReward)) * 24,
      dailyRewardsPerApeCoin:
        (+formatUnits(bakcPoolHourlyReward) / +formatUnits(bakcPoolTotalStaked)) * 24,
    },
  };

  return (
    <div className="mt-10">
      <h1 className="mt-10 text-4xl font-bold mb-4 flex items-center">Live Staking Data</h1>

      <div>
        <table className="table-fixed divide-y-[1px] border">
          <thead>
            <tr className="grid grid-cols-4 gap-4 p-4">
              <td className="flex items-center font-semibold">Staking Pool</td>
              <td className="flex items-center font-semibold">ApeCoin Staked</td>
              <td className="flex items-center font-semibold">Daily ApeCoin Reward&nbsp;Pool</td>
              <td className="flex items-center font-semibold">
                Daily ApeCoin reward Per ApeCoin Staked
              </td>
            </tr>
          </thead>
          <tbody className="divide-y-[1px]">
            <tr className="grid grid-cols-4 gap-4 p-4">
              <td className="flex items-center">ApeCoin</td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.apecoin.totalStaked)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.apecoin.dailyRewards)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.apecoin.dailyRewardsPerApeCoin)}{" "}
                    ($
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                      style: "currency",
                      currency: "USD",
                    }).format(stats.apecoin.dailyRewardsPerApeCoin * +formatUnits(apecoinPrice, 8))}
                    )
                  </>
                )}
              </td>
            </tr>
            <tr className="grid grid-cols-4 gap-4 p-4">
              <td>BAYC</td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bayc.totalStaked)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bayc.dailyRewards)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bayc.dailyRewardsPerApeCoin)}{" "}
                    ($
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                      style: "currency",
                      currency: "USD",
                    }).format(stats.bayc.dailyRewardsPerApeCoin * +formatUnits(apecoinPrice, 8))}
                    )
                  </>
                )}
              </td>
            </tr>
            <tr className="grid grid-cols-4 gap-4 p-4">
              <td>MAYC</td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.mayc.totalStaked)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.mayc.dailyRewards)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.mayc.dailyRewardsPerApeCoin)}{" "}
                    ($
                    {(stats.mayc.dailyRewardsPerApeCoin * +formatUnits(apecoinPrice, 8)).toFixed(3)}
                    )
                  </>
                )}
              </td>
            </tr>
            <tr className="grid grid-cols-4 gap-4 p-4">
              <td>BAKC</td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bakc.totalStaked)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bakc.dailyRewards)}
                  </>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <>
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                    }).format(stats.bakc.dailyRewardsPerApeCoin)}{" "}
                    ($
                    {new Intl.NumberFormat({
                      maximumFractionDigits: 4,
                      style: "currency",
                      currency: "USD",
                    }).format(stats.bakc.dailyRewardsPerApeCoin * +formatUnits(apecoinPrice, 8))}
                    )
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <h1 className="mt-10 text-4xl font-bold mb-4">Staking Calculator</h1>
        <div className="divide-y-[1px] border">
          <div className="grid grid-cols-4 p-4 gap-4">
            <div className="flex items-center font-semibold col-span-2">Stake Count</div>
            <div className="flex items-center font-semibold">Stake Limit</div>
            <div className="flex items-center font-semibold">Daily ApeCoin Reward</div>
          </div>

          <div className="grid grid-cols-4 p-4 gap-4">
            <div className="flex items-center col-span-2">
              <input
                id="bayc-count"
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={apecoinPoolToStake}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < 1000000000) {
                    setApecoinPoolToStake(value);
                  }
                }}
              />
              ApeCoin
            </div>
            <div>N/A</div>
            <div>
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(apecoinPoolToStake * stats.apecoin.dailyRewardsPerApeCoin)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    apecoinPoolToStake *
                      stats.apecoin.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 p-4  gap-4">
            <div className="flex items-center col-span-2">
              <input
                id="bayc-count"
                className="mr-2 px-2 border w-16 dark:bg-slate-800 dark:border-slate-500"
                value={baycPoolStakable}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < 10000) {
                    setBaycPoolStakable(value);
                  }
                }}
              />
              BAYC Tokens
            </div>
            <div className="flex items-center">
              {new Intl.NumberFormat({
                maximumFractionDigits: 4,
              }).format(baycPoolStakable * BAYC_MAX_STAKE) || 0}
            </div>{" "}
            <div className="flex items-center">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(
                    baycPoolStakable * BAYC_MAX_STAKE * stats.bayc.dailyRewardsPerApeCoin
                  )}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    baycPoolStakable *
                      BAYC_MAX_STAKE *
                      stats.bayc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4  gap-4">
            <div className="flex items-center col-span-2">
              <input
                id="mayc-count"
                className="mr-2 px-2 border w-16 dark:bg-slate-800 dark:border-slate-500"
                value={maycPoolStakable}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < 10000) {
                    setMaycPoolStakable(value);
                  }
                }}
              />
              MAYC Tokens
            </div>
            <div className="flex items-center">
              {new Intl.NumberFormat({
                maximumFractionDigits: 4,
              }).format(maycPoolStakable * MAYC_MAX_STAKE) || 0}
            </div>
            <div className="flex items-center">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(
                    maycPoolStakable * MAYC_MAX_STAKE * stats.mayc.dailyRewardsPerApeCoin
                  )}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    maycPoolStakable *
                      MAYC_MAX_STAKE *
                      stats.mayc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4  gap-4">
            <div className="flex items-center col-span-2">
              <input
                id="bakc-count"
                className="mr-2 px-2 border w-16 dark:bg-slate-800 dark:border-slate-500"
                value={bakcPoolStakable}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < 9602 && value <= totalPrimaryTokens) {
                    setBakcPoolStakable(value);
                  }
                }}
              />
              BAKC Tokens
            </div>
            <div className="flex items-center">
              {new Intl.NumberFormat({
                maximumFractionDigits: 4,
              }).format(bakcPoolStakable * BAKC_MAX_STAKE) || 0}
            </div>
            <div className="flex items-center">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(
                    bakcPoolStakable * BAKC_MAX_STAKE * stats.bakc.dailyRewardsPerApeCoin
                  )}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    bakcPoolStakable *
                      BAKC_MAX_STAKE *
                      stats.bakc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4  gap-4">
            <div className="flex items-center col-span-2">Totals</div>
            <div className="flex items-center">
              {new Intl.NumberFormat({
                maximumFractionDigits: 4,
              }).format(totalStakable) || 0}
            </div>
            <div className="flex items-center">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(
                    baycPoolStakable * BAYC_MAX_STAKE * stats.bayc.dailyRewardsPerApeCoin +
                      maycPoolStakable * MAYC_MAX_STAKE * stats.mayc.dailyRewardsPerApeCoin +
                      bakcPoolStakable * BAKC_MAX_STAKE * stats.bakc.dailyRewardsPerApeCoin +
                      apecoinPoolToStake * stats.apecoin.dailyRewardsPerApeCoin
                  )}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    (baycPoolStakable * BAYC_MAX_STAKE * stats.bayc.dailyRewardsPerApeCoin +
                      maycPoolStakable * MAYC_MAX_STAKE * stats.mayc.dailyRewardsPerApeCoin +
                      bakcPoolStakable * BAKC_MAX_STAKE * stats.bakc.dailyRewardsPerApeCoin +
                      apecoinPoolToStake * stats.apecoin.dailyRewardsPerApeCoin) *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
        </div>

        {/* <div className="mt-10">
          <h2 className="text-xl mb-2">ApeCoin Pool Staking Rewards:</h2>
          <div className="grid grid-cols-3 p-4 border">
            <div className="col-span-2">ApeCoin Count</div>
            <div>Daily ApeCoin Reward</div>
          </div>

          <div className="grid grid-cols-3 p-4 border">
           
          </div>
        </div> */}
      </div>
    </div>
  );
}
