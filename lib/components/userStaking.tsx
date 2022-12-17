"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import useAllStakes from "@/hooks/useAllStakes";
import { formatUnits } from "ethers/lib/utils.js";
import usePrice from "@/hooks/usePrice";

export default function UserStaking() {
  const { address } = useAccount();
  const { apecoinPrice } = usePrice();
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
          className={`block border border-zinc-200 bg-white p-4
          dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Address or ENS name:
          </h5>
          <input
            spellCheck="false"
            className="w-full border px-1 text-xs dark:border-zinc-500 dark:bg-zinc-800"
            value={statsAddress}
            placeholder={"enter address or ens name"}
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
          className={`block border border-zinc-200 bg-white p-4
          dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Total Staked
          </h5>
          <p className="text-zinc-700 dark:text-zinc-400">
            {totalStaked && (
              <>
                {Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 4,
                }).format(totalStaked)}
                {totalStaked && apecoinPriceNumber && (
                  <>
                    {" "}
                    (
                    {Intl.NumberFormat("en-US", {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(totalStaked * apecoinPriceNumber)}
                    )
                  </>
                )}
              </>
            )}
          </p>
        </div>
        <div
          className={`block border border-zinc-200 bg-white p-4
          dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Unclaimed Rewards
          </h5>
          <p className="text-zinc-700 dark:text-zinc-400">
            {totalUnclaimed && (
              <>
                {Intl.NumberFormat("en-US", {
                  maximumFractionDigits: 4,
                }).format(totalUnclaimed)}
                {totalUnclaimed && apecoinPriceNumber && (
                  <>
                    {" "}
                    (
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
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
