"use client";

import { poolStakesData } from "@/hooks/useAllStakes";

import { BigNumber } from "ethers";
import { PoolType } from "@/types/constants";
import { PairNftClaim } from "@/types/contract";
import { IClaimArgsBakc, IClaimArgsNft } from "@/types/staking";
import {
  useClaimSelfApecoin,
  useClaimSelfBakc,
  useClaimSelfNft,
} from "@/hooks/useClaims";

interface ClaimAllButtonProps {
  apeCoinStakes: poolStakesData[] | undefined;
  claimArgsNft: IClaimArgsNft;
  claimArgsBakc: IClaimArgsBakc;
}

export const ClaimAllButton = (props: ClaimAllButtonProps) => {
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
    bayc: claimArgsBakc(PoolType.BAYC, false) as PairNftClaim[],
    mayc: claimArgsBakc(PoolType.MAYC, false) as PairNftClaim[],
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
};
