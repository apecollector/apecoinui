import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { ethers, BigNumber } from "ethers";
import { useState } from "react";

import useApeCoinBalance from "@/hooks/useApeCoinBalance";
import { poolStakesData } from "@/hooks/useAllStakes";
import { TableHead } from "./common/TableHead";
import { IClaimArgsApecoin, IWithdrawArgsApecoin } from "./common/types";
import { useWithdrawSelfApecoin } from "@/hooks/useWithdraws";
import { useDeposits } from "@/hooks/useDeposits";
import { useClaimSelfApecoin } from "@/hooks/useClaims";

interface ApeCoinTableProps {
  apeCoinStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  withdrawArgs: IWithdrawArgsApecoin;
  claimArgs: IClaimArgsApecoin;
}

export const ApeCoinTable = (props: ApeCoinTableProps) => {
  const { apeCoinStakes, apecoinPrice, withdrawArgs, claimArgs } = props;
  const { apeCoinBalance } = useApeCoinBalance();

  const [depositApeCoinAmount, setDepositApeCoinAmount] = useState<BigNumber>(
    ethers.constants.Zero
  );
  const { depositApecoin } = useDeposits({ amount: depositApeCoinAmount });

  const depositedTotal =
    apeCoinStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;
  const { withdrawSelfApecoin } = useWithdrawSelfApecoin({
    amount: depositedTotal,
  });
  const { claimSelfApecoin } = useClaimSelfApecoin();

  const unclaimedTotal = apeCoinStakes?.reduce(
    (total, token) => total.add(token.unclaimed),
    ethers.constants.Zero
  );

  return (
    <table className="mt-4 w-full border dark:border-zinc-700">
      <TableHead />
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {apeCoinStakes.map((stake, i) => (
          <tr className="flex" key={i}>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              ApeCoin
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              <input
                value={Math.round(+formatUnits(depositApeCoinAmount || 0))}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setDepositApeCoinAmount(ethers.constants.Zero);
                  } else if (!isNaN(+e.target.value)) {
                    setDepositApeCoinAmount(parseUnits(e.target.value));
                  }
                }}
                className="w-2/5 border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                type="number"
              />
              {apeCoinBalance?.gt(0) &&
                !depositApeCoinAmount.eq(apeCoinBalance) && (
                  <button
                    onClick={() => {
                      setDepositApeCoinAmount(apeCoinBalance!);
                    }}
                  >
                    MAX
                  </button>
                )}

              {depositApeCoinAmount.gt(0) && (
                <button
                  onClick={() => {
                    setDepositApeCoinAmount(ethers.constants.Zero);
                  }}
                >
                  CLEAR
                </button>
              )}
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {Intl.NumberFormat("en-us").format(+formatUnits(stake.deposited))}
              {apecoinPrice && (
                <>
                  {" "}
                  (
                  {Intl.NumberFormat(undefined, {
                    maximumFractionDigits: 2,
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(
                    +formatUnits(stake.deposited) *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {Intl.NumberFormat("en-us", {
                notation: "compact",
                compactDisplay: "short",
              }).format(+formatUnits(stake.unclaimed))}
              {apecoinPrice && (
                <>
                  {" "}
                  (
                  {Intl.NumberFormat(undefined, {
                    maximumFractionDigits: 2,
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(
                    +formatUnits(stake.unclaimed) *
                      +formatUnits(apecoinPrice, 8)
                  )}
                  )
                </>
              )}
            </td>
          </tr>
        ))}

        {(depositedTotal.gt(0) ||
          unclaimedTotal.gt(0) ||
          depositApeCoinAmount.gt(0)) && (
          <>
            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Transaction:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositApeCoinAmount.gt(0) && (
                  <button
                    disabled={!depositApecoin}
                    className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                    onClick={() => depositApecoin?.()}
                  >
                    Deposit
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositedTotal.gt(0) && (
                  <button
                    disabled={!withdrawSelfApecoin}
                    onClick={() => withdrawSelfApecoin?.()}
                    className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                  >
                    Withdraw
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {unclaimedTotal.gt(0) && (
                  <button
                    disabled={unclaimedTotal.isZero()}
                    onClick={() => claimSelfApecoin?.()}
                    className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                  >
                    Claim
                  </button>
                )}
              </td>
            </tr>
            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositApeCoinAmount.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F14`}
                    >
                      depositSelfApeCoin
                    </a>
                    <textarea
                      value={`["${depositApeCoinAmount?.toString()}"]`}
                      className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                    />
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositedTotal.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F23`}
                    >
                      withdrawSelfApeCoin
                    </a>
                    <textarea
                      className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                      readOnly
                      value={JSON.stringify(withdrawArgs(true))}
                    />
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {unclaimedTotal.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F14`}
                    >
                      claimSelfApeCoin
                    </a>
                    <textarea
                      className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                      readOnly
                      value={JSON.stringify(claimArgs(true))}
                    />
                  </>
                )}
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};
