"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import useAllStakes from "@/hooks/useAllStakes";
import { formatUnits } from "ethers/lib/utils.js";
import usePrice from "@/hooks/usePrice";

export default function UserStaking() {
  const { address } = useAccount();
  const apecoinPrice = usePrice();
  const [statsAddress, setStatsAddress] = useState<string>();
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const allStakes = useAllStakes(statsAddress!);

  const totalStaked = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.deposited);
  }, 0);

  const totalUnclaimed = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.unclaimed);
  }, 0);

  const apecoinPriceNumber = apecoinPrice && +formatUnits(apecoinPrice, 8);
  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div
          className={`block border border-gray-200 bg-white p-4 
          dark:border-gray-700 dark:bg-gray-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Address or ENS name:
          </h5>
          <input
            spellCheck="false"
            className="w-full border px-1 text-xs dark:border-slate-500 dark:bg-slate-800"
            value={statsAddress}
            placeholder={"ennter address or ens name"}
            onChange={(e) => {
              setStatsAddress(e.target.value);
            }}
          />
          {statsAddress &&
            allStakes.isError &&
            allStakes.error &&
            "Invalid address or ENS name"}
        </div>
        <div
          className={`block border border-gray-200 bg-white p-4 
          dark:border-gray-700 dark:bg-gray-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Total Staked
          </h5>
          <p className="text-gray-700 dark:text-gray-400">
            {totalStaked && (
              <>
                {Intl.NumberFormat(undefined, {
                  maximumFractionDigits: 4,
                }).format(totalStaked)}
                {totalStaked && apecoinPriceNumber && (
                  <>
                    {" "}
                    (
                    {Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    }).format(totalStaked * apecoinPriceNumber)}
                    )
                  </>
                )}
              </>
            )}
          </p>
        </div>
        <div
          className={`block border border-gray-200 bg-white p-4 
          dark:border-gray-700 dark:bg-gray-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Unclaimed Rewards
          </h5>
          <p className="text-gray-700 dark:text-gray-400">
            {totalUnclaimed && (
              <>
                {Intl.NumberFormat(undefined, {
                  maximumFractionDigits: 4,
                }).format(totalUnclaimed)}
                {totalUnclaimed && apecoinPriceNumber && (
                  <>
                    {" "}
                    (
                    {Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 2,
                    }).format(totalUnclaimed * apecoinPriceNumber)}
                    )
                  </>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}
