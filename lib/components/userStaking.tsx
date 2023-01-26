"use client";

import { useEffect, useState } from "react";
import { useAccount, useNetwork, Chain } from "wagmi";

import useAllStakes, { poolStakesData } from "@/hooks/useAllStakes";
import { formatUnits } from "ethers/lib/utils.js";
import usePrice from "@/hooks/usePrice";

import { BigNumber, ethers } from "ethers";
import { PoolType, StakingContractAddresses } from "@/types/constants";
import {
  useWithdrawBakc,
  useWithdrawSelfApecoin,
  useWithdrawSelfNft,
} from "../hooks/useWithdraws";
import { PairNft, PairNftWithAmount, SingleNft } from "../types/contract";
import {
  IClaimArgsBakc,
  IClaimArgsNft,
  IWithdrawArgsBakc,
  IWithdrawArgsNft,
} from "./Staking/common/types";
import { formatToUSD } from "../utils/format";
import {
  useClaimSelfApecoin,
  useClaimSelfBakc,
  useClaimSelfNft,
} from "../hooks/useClaims";

interface ClaimAllProps {
  apeCoinStakes: poolStakesData[] | undefined;
  claimArgsNft: IClaimArgsNft;
  claimArgsBakc: IClaimArgsBakc;
}

function ClaimAll(props: ClaimAllProps) {
  const { apeCoinStakes, claimArgsNft, claimArgsBakc } = props;

  const { claimSelfApecoin } = useClaimSelfApecoin();

  const { claimSelfNft: claimSelfBayc } = useClaimSelfNft({
    poolId: PoolType.BAYC,
    tokenIds: claimArgsNft(PoolType.BAYC, false) as BigNumber[],
  });

  const { claimSelfNft: claimSelfMayc } = useClaimSelfNft({
    poolId: PoolType.MAYC,
    tokenIds: claimArgsNft(PoolType.MAYC, false) as BigNumber[],
  });

  const { claimSelfBakc } = useClaimSelfBakc({
    bayc: claimArgsBakc(PoolType.BAYC, false)[0] as PairNft[],
    mayc: claimArgsBakc(PoolType.MAYC, false)[0] as PairNft[],
  });
  return (
    <div>
      <button
        onClick={() => {
          if (apeCoinStakes?.[0]?.unclaimed.gt(0)) {
            claimSelfApecoin?.();
          }
          claimSelfBayc?.();
          claimSelfMayc?.();
          claimSelfBakc?.();
        }}
        className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
      >
        Claim All
      </button>
    </div>
  );
}

interface WithdrawAllProps {
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined;
  apeCoinStakes: poolStakesData[] | undefined;
  withdrawArgsNft: IWithdrawArgsNft;
  withdrawArgsBakc: IWithdrawArgsBakc;
}

function WithdrawAll(props: WithdrawAllProps) {
  const { apeCoinStakes, withdrawArgsNft, withdrawArgsBakc } = props;
  const { withdrawSelfApecoin } = useWithdrawSelfApecoin({
    amount: apeCoinStakes?.[0].deposited ?? ethers.constants.Zero,
  });

  const { withdrawSelfNft: withdrawSelfBayc } = useWithdrawSelfNft({
    poolId: PoolType.BAYC,
    nfts: withdrawArgsNft(PoolType.BAYC, false)[0] as SingleNft[],
  });

  const { withdrawSelfNft: withdrawSelfMayc } = useWithdrawSelfNft({
    poolId: PoolType.MAYC,
    nfts: withdrawArgsNft(PoolType.MAYC, false)[0] as SingleNft[],
  });

  const { withdrawBakc } = useWithdrawBakc({
    bayc: withdrawArgsBakc(1, false)[0] as PairNftWithAmount[],
    mayc: withdrawArgsBakc(2, false)[0] as PairNftWithAmount[],
  });

  return (
    <div>
      <button
        onClick={() => {
          withdrawSelfApecoin?.();
          withdrawSelfBayc?.();
          withdrawSelfMayc?.();
          withdrawBakc?.();
        }}
        className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
      >
        Withdraw All
      </button>
    </div>
  );
}

interface UserStakingProps {
  withdrawArgsNft: IWithdrawArgsNft;
  withdrawArgsBakc: IWithdrawArgsBakc;
  claimArgsNft: IClaimArgsNft;
  claimArgsBakc: IClaimArgsBakc;
}

export const UserStaking = (props: UserStakingProps) => {
  const { withdrawArgsNft, withdrawArgsBakc, claimArgsBakc, claimArgsNft } =
    props;
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { apecoinPrice } = usePrice();
  const [statsAddress, setStatsAddress] = useState<string>("");
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const { poolsContractRead: allStakes, apeCoinStakes } = useAllStakes(
    statsAddress!
  );

  const totalStaked = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.deposited);
  }, 0);

  const totalUnclaimed = allStakes.data?.reduce((sum, stake) => {
    return sum + +formatUnits(stake.unclaimed);
  }, 0);

  const apecoinPriceNumber = apecoinPrice && +formatUnits(apecoinPrice, 8);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <div
          className={`block border border-zinc-200 bg-white p-4
          dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-xl font-bold tracking-tight">
            Address or ENS:
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
                {address === statsAddress &&
                  process.env.NEXT_PUBLIC_ENABLE_STAKE === "TRUE" && (
                    <WithdrawAll
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
                {address === statsAddress &&
                  process.env.NEXT_PUBLIC_ENABLE_STAKE === "TRUE" && (
                    <ClaimAll
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
      </div>
    </>
  );
};
