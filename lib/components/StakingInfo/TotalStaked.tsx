import useAllStakes from "@/hooks/useAllStakes";
import {
  getFnWithdrawArgsBakc,
  getFnWithdrawArgsNft,
} from "@/hooks/useWithdraws";
import { formatUnits } from "ethers/lib/utils.js";
import { useNetwork } from "wagmi";
import { formatToUSD } from "../../utils/format";
import { WithdrawAllButton } from "./WithdrawAllButton";

interface TotalStakedProps {
  apecoinPriceNumber?: number;
  connectedAddress?: string;
  statsAddress: string;
}

export const TotalStaked = (props: TotalStakedProps) => {
  const { apecoinPriceNumber, connectedAddress, statsAddress } = props;

  const { poolsContractRead: allStakes, apeCoinStakes } = useAllStakes(
    statsAddress!
  );
  const { chain } = useNetwork();

  const totalStaked = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.deposited);
  }, 0);

  const withdrawArgsNft = getFnWithdrawArgsNft(allStakes?.data ?? []);
  const withdrawArgsBakc = getFnWithdrawArgsBakc(allStakes?.data ?? []);

  return (
    <div
      className={`block border border-zinc-200 bg-white p-4
  dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
    >
      <h5 className="mb-2 text-xl font-bold tracking-tight">Total Staked</h5>
      <div className="flex flex-col flex-wrap gap-2 text-zinc-700 dark:text-zinc-400">
        {totalStaked ? (
          <>
            <div>
              {Intl.NumberFormat("en-US", {
                maximumFractionDigits: 4,
              }).format(totalStaked)}
              {totalStaked && apecoinPriceNumber && (
                <> ({formatToUSD(totalStaked * apecoinPriceNumber)})</>
              )}
            </div>
            {connectedAddress === statsAddress &&
              process.env.NEXT_PUBLIC_ENABLE_STAKE === "TRUE" && (
                <WithdrawAllButton
                  chain={chain}
                  withdrawArgsNft={withdrawArgsNft}
                  withdrawArgsBakc={withdrawArgsBakc}
                  apeCoinStakes={apeCoinStakes}
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
