"use client";

import { formatUnits } from "ethers/lib/utils.js";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount, useContractRead, useContractReads, useNetwork } from "wagmi";

import StakingABI from "../../lib/abis/staking";
import BalanceABI from "../../lib/abis/balance";
import useStakingStore from "../store";
import usePrice from "../../lib/hooks/usePrice";
import Events from "../events";
import Countdown from "../countdown";

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

  const apecoinPrice = usePrice();

  const [apePoolStakable, setApePoolStakable] = useState(0);
  const [baycPoolStakable, setBaycPoolStakable] = useState(0);
  const [maycPoolStakable, setMaycPoolStakable] = useState(0);
  const [bakcPoolStakable, setBakcPoolStakable] = useState(0);

  const [apePoolToStake, setApePoolToStake] = useState(0);
  const [baycPoolToStake, setBaycPoolToStake] = useState(0);
  const [maycPoolToStake, setMaycPoolToStake] = useState(0);
  const [bakcPoolToStake, setBakcPoolToStake] = useState(0);

  const [baycPoolHourlyReward, setBaycPoolHourlyReward] = useState(ethers.constants.Zero);
  const [maycPoolHourlyReward, setMaycPoolHourlyReward] = useState(ethers.constants.Zero);
  const [bakcPoolHourlyReward, setBakcPoolHourlyReward] = useState(ethers.constants.Zero);
  const [apecoinPoolHourlyReward, setApecoinPoolHourlyReward] = useState(ethers.constants.Zero);

  const [baycPoolTotalStaked, setBaycPoolTotalStaked] = useState(ethers.constants.Zero);
  const [maycPoolTotalStaked, setMaycPoolTotalStaked] = useState(ethers.constants.Zero);
  const [bakcPoolTotalStaked, setBakcPoolTotalStaked] = useState(ethers.constants.Zero);
  const [apecoinPoolTotalStaked, setApecoinPoolTotalStaked] = useState(ethers.constants.Zero);

  const totalPrimaryTokens = parseInt(baycPoolStakable) + parseInt(maycPoolStakable);
  const totalStakable =
    parseInt(apePoolToStake) +
    parseInt(baycPoolToStake) +
    parseInt(maycPoolToStake) +
    parseInt(bakcPoolToStake);

  useEffect(() => {
    setApePoolToStake(apePoolStakable);
  }, [apePoolStakable]);

  useEffect(() => {
    setBaycPoolToStake(baycPoolStakable * BAYC_MAX_STAKE);
  }, [baycPoolStakable]);

  useEffect(() => {
    setMaycPoolToStake(maycPoolStakable * MAYC_MAX_STAKE);
  }, [maycPoolStakable]);

  useEffect(() => {
    setBakcPoolToStake(bakcPoolStakable * BAKC_MAX_STAKE);
  }, [bakcPoolStakable]);

  useEffect(() => {
    setApePoolStakable(isNaN(apeCoinBalance) ? 0 : apeCoinBalance);
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

  const toStakeTotal =
    baycPoolToStake * stats.bayc.dailyRewardsPerApeCoin +
    maycPoolToStake * stats.mayc.dailyRewardsPerApeCoin +
    bakcPoolToStake * stats.bakc.dailyRewardsPerApeCoin +
    apePoolToStake * stats.apecoin.dailyRewardsPerApeCoin;

  const apeMaxStakable = apePoolStakable;
  const baycMaxStakable = baycPoolStakable * BAYC_MAX_STAKE;
  const maycMaxStakable = maycPoolStakable * MAYC_MAX_STAKE;
  const bakcMaxStakable = bakcPoolStakable * BAKC_MAX_STAKE;

  return (
    <div className="mt-10">
      <div>
        <h1 className="mt-10 text-4xl font-bold mb-4 flex items-center">Staking Rewards Countdown</h1>
        <Countdown targetDate={1670864400000} />
      </div>

      <div>
        <h1 className="mt-10 text-4xl font-bold mb-4 flex items-center">Live Staking Data</h1>
        <table className="table-fixed divide-y-[1px] border dark:divide-slate-500  dark:border-slate-500 ">
          <thead>
            <tr className="grid grid-cols-4 gap-4 gap-x-8 p-4">
              <td className="flex items-center font-semibold">Staking Pool</td>
              <td className="flex items-center font-semibold">ApeCoin Staked</td>
              <td className="flex items-center font-semibold">Daily ApeCoin Reward Pool</td>
              <td className="flex items-center font-semibold">
                Daily ApeCoin reward Per ApeCoin Staked
              </td>
            </tr>
          </thead>
          <tbody className="divide-y-[1px] dark:divide-slate-500">
            <tr className="grid grid-cols-4 gap-4 gap-x-8 p-4">
              <td className="flex flex-wrap items-center gap-x-4 ">
                APE&nbsp;{" "}
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    {(stats.apecoin.dailyRewardsPerApeCoin * 365 * 100).toFixed(0)}%&nbsp;APR
                  </span>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
            <tr className="grid grid-cols-4 gap-4 gap-x-8 p-4">
              <td className="flex flex-wrap items-center gap-x-4 ">
                BAYC{" "}
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    {(stats.bayc.dailyRewardsPerApeCoin * 365 * 100).toFixed(0)}%&nbsp;APR
                  </span>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
            <tr className="grid grid-cols-4 gap-4 gap-x-8 p-4">
              <td className="flex flex-wrap items-center gap-x-4 ">
                MAYC{" "}
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    {(stats.mayc.dailyRewardsPerApeCoin * 365 * 100).toFixed(0)}%&nbsp;APR
                  </span>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
            <tr className="grid grid-cols-4 gap-4 gap-x-8 p-4">
              <td className="flex flex-wrap items-center gap-x-4 ">
                BAKC{" "}
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-20"></div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  </>
                ) : (
                  <span className="bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">
                    {(stats.bakc.dailyRewardsPerApeCoin * 365 * 100).toFixed(0)}%&nbsp;APR
                  </span>
                )}
              </td>
              <td className="flex items-center">
                {!initialLoad ? (
                  <>
                    <div role="status" className="max-w-sm animate-pulse">
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
                      <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
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
      </div>

      <div className="mt-10">
        <h1 className="mt-10 text-4xl font-bold mb-4">Staking Calculator</h1>
        <div className="divide-y-[1px] dark:divide-slate-500 border dark:border-slate-500">
          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
            <div className="flex items-center font-semibold col-span-2">Token Count</div>
            <div className="flex items-center font-semibold">Stake Amount</div>
            <div className="flex items-center font-semibold">Daily ApeCoin Reward</div>
          </div>

          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
            <div className="flex items-center col-span-2 flex-wrap">
              <input
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={apePoolStakable}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < 1000000000) {
                    setApePoolStakable(value);
                  }
                }}
              />
              ApeCoin
            </div>
            <div className="flex items-center flex-wrap">
              <input
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={apePoolToStake}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < apeMaxStakable) {
                    setApePoolToStake(value);
                  }
                }}
              />
              {apePoolToStake != apePoolStakable && (
                <button
                  onClick={() => {
                    setApePoolToStake(apePoolStakable);
                  }}
                >
                  MAX
                </button>
              )}
              {apePoolToStake == apePoolStakable && apePoolStakable != 0 && (
                <button
                  onClick={() => {
                    setApePoolToStake(0);
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
            <div className="flex items-center flex-wrap">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(apePoolToStake * stats.apecoin.dailyRewardsPerApeCoin)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    apePoolToStake *
                      stats.apecoin.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
            <div className="flex items-center col-span-2 flex-wrap">
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
              BAYC NFTs
            </div>
            <div className="flex items-center flex-wrap">
              <input
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={baycPoolToStake}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < baycMaxStakable) {
                    setBaycPoolToStake(value);
                  }
                }}
              />
              {baycPoolToStake != baycMaxStakable && (
                <button
                  onClick={() => {
                    setBaycPoolToStake(baycMaxStakable);
                  }}
                >
                  MAX
                </button>
              )}
              {baycPoolToStake == baycMaxStakable && baycPoolStakable != 0 && (
                <button
                  onClick={() => {
                    setBaycPoolToStake(0);
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
            <div className="flex items-center flex-wrap">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(baycPoolToStake * stats.bayc.dailyRewardsPerApeCoin)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    baycPoolToStake *
                      stats.bayc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
            <div className="flex items-center col-span-2 flex-wrap">
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
              MAYC NFTs
            </div>
            <div className="flex items-center flex-wrap">
              <input
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={maycPoolToStake}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < maycMaxStakable) {
                    setMaycPoolToStake(value);
                  }
                }}
              />
              {maycPoolToStake != maycMaxStakable && (
                <button
                  onClick={() => {
                    setMaycPoolToStake(maycMaxStakable);
                  }}
                >
                  MAX
                </button>
              )}
              {maycPoolToStake == maycMaxStakable && maycPoolStakable != 0 && (
                <button
                  onClick={() => {
                    setMaycPoolToStake(0);
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
            <div className="flex items-center flex-wrap">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(maycPoolToStake * stats.mayc.dailyRewardsPerApeCoin)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    maycPoolToStake *
                      stats.mayc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
            <div className="flex items-center col-span-2 flex-wrap">
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
              BAKC NFTs
            </div>
            <div className="flex items-center flex-wrap">
              <input
                className="mr-2 px-2 border w-28 dark:bg-slate-800 dark:border-slate-500"
                value={bakcPoolToStake}
                onChange={(e) => {
                  const value = +e.target.value;
                  if (Number.isInteger(value) && value < bakcMaxStakable) {
                    setBakcPoolToStake(value);
                  }
                }}
              />
              {bakcPoolToStake != bakcMaxStakable && (
                <button
                  onClick={() => {
                    setBakcPoolToStake(bakcMaxStakable);
                  }}
                >
                  MAX
                </button>
              )}
              {bakcPoolToStake == bakcMaxStakable && bakcPoolStakable != 0 && (
                <button
                  onClick={() => {
                    setBakcPoolToStake(0);
                  }}
                >
                  CLEAR
                </button>
              )}
            </div>
            <div className="flex items-center flex-wrap">
              {!initialLoad ? (
                <>
                  <div role="status" className="max-w-sm animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(bakcPoolToStake * stats.bakc.dailyRewardsPerApeCoin)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(
                    bakcPoolToStake *
                      stats.bakc.dailyRewardsPerApeCoin *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-4 p-4 gap-4 gap-x-8">
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
                    <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-16 sm:w-32"></div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </>
              ) : (
                <>
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                  }).format(toStakeTotal)}{" "}
                  ($
                  {new Intl.NumberFormat({
                    maximumFractionDigits: 4,
                    style: "currency",
                    currency: "USD",
                  }).format(toStakeTotal * +formatUnits(apecoinPrice, 8))}
                  )
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h1 className="mt-10 text-4xl font-bold mb-4">Staking Activity</h1>
        <Events />
      </div>
    </div>
  );
}
