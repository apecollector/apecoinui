import { formatUnits } from "ethers/lib/utils.js";
import useAllStakes from "@/hooks/useAllStakes";
import { ClaimAllButton } from "./ClaimAllButton";
import { getFnClaimArgsBakc, getFnClaimArgsNft } from "@/hooks/useClaims";

interface UnclaimedRewardsProps {
  statsAddress?: string;
  apecoinPriceNumber?: number;
  connectedAddress?: string;
}

export const UnclaimedRewards = (props: UnclaimedRewardsProps) => {
  const { statsAddress, apecoinPriceNumber, connectedAddress } = props;
  const { poolsContractRead: allStakes, apeCoinStakes } = useAllStakes(
    statsAddress!
  );

  const totalUnclaimed = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.unclaimed);
  }, 0);

  const claimArgsNft = getFnClaimArgsNft(allStakes?.data ?? []);
  const claimArgsBakc = getFnClaimArgsBakc(allStakes?.data ?? []);

  return (
    <div
      className={`block border border-zinc-200 bg-white p-4
  dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
    >
      <h5 className="mb-2 text-xl font-bold tracking-tight">
        Unclaimed Rewards
      </h5>
      <div className="flex flex-col flex-wrap gap-2 text-zinc-700 dark:text-zinc-400">
        {totalUnclaimed ? (
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
            {connectedAddress === statsAddress &&
              process.env.NEXT_PUBLIC_ENABLE_STAKE === "TRUE" && (
                <ClaimAllButton
                  apeCoinStakes={apeCoinStakes}
                  claimArgsNft={claimArgsNft}
                  claimArgsBakc={claimArgsBakc}
                />
              )}
          </>
        ) : (
          <>0</>
        )}
      </div>
    </div>
  );
};
