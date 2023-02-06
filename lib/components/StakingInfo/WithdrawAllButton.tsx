"use client";

import { Chain } from "wagmi";
import { ethers } from "ethers";
import { poolStakesData } from "@/hooks/useAllStakes";
import { PoolType } from "@/types/constants";
import {
  useWithdrawBakc,
  useWithdrawSelfApecoin,
  useWithdrawSelfNft,
} from "@/hooks/useWithdraws";
import { PairNftWithAmount, SingleNft } from "@/types/contract";
import { IWithdrawArgsBakc, IWithdrawArgsNft } from "@/types/staking";

interface WithdrawAllButtonProps {
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined;
  apeCoinStakes: poolStakesData[] | undefined;
  withdrawArgsNft: IWithdrawArgsNft;
  withdrawArgsBakc: IWithdrawArgsBakc;
}

export const WithdrawAllButton = (props: WithdrawAllButtonProps) => {
  const { apeCoinStakes, withdrawArgsNft, withdrawArgsBakc } = props;
  const { withdrawSelfApecoin } = useWithdrawSelfApecoin({
    amount: apeCoinStakes?.[0].deposited ?? ethers.constants.Zero,
  });

  const { withdrawSelfNft: withdrawSelfBayc } = useWithdrawSelfNft({
    poolId: PoolType.BAYC,
    nfts: withdrawArgsNft(PoolType.BAYC, false) as SingleNft[],
  });

  const { withdrawSelfNft: withdrawSelfMayc } = useWithdrawSelfNft({
    poolId: PoolType.MAYC,
    nfts: withdrawArgsNft(PoolType.MAYC, false) as SingleNft[],
  });

  const { withdrawBakc } = useWithdrawBakc({
    bayc: withdrawArgsBakc(PoolType.BAYC, false) as PairNftWithAmount[],
    mayc: withdrawArgsBakc(PoolType.MAYC, false) as PairNftWithAmount[],
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
};
