"use client";

import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { ethers, BigNumber } from "ethers";
import { ChangeEvent, useState } from "react";

import { poolStakesData } from "@/hooks/useAllStakes";
import { MAX_STAKES } from "@/types/constants";
import { PairNft, PairNftClaim, PairNftWithAmount } from "@/types/contract";
import { TableHead } from "./common/TableHead";
import { formatToUSD } from "@/utils/format";
import { IClaimArgsBakc, IWithdrawArgsBakc } from "./common/types";
import { PoolType } from "@/types/constants";
import { useBakcDeposits } from "@/hooks/useDeposits";
import { useWithdrawBakc } from "@/hooks/useWithdraws";
import { useClaimSelfBakc } from "@/hooks/useClaims";

export interface IPairOption {
  tokenId: number;
  poolId: PoolType.BAYC | PoolType.MAYC;
}

interface BakcTableProps {
  poolStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  pairOptions: IPairOption[];
  withdrawArgs: IWithdrawArgsBakc;
  claimArgs: IClaimArgsBakc;
}

export const BakcTable = (props: BakcTableProps) => {
  const { poolStakes, apecoinPrice, withdrawArgs, claimArgs, pairOptions } =
    props;

  const availableMainTokenIds = pairOptions.filter(
    (po) =>
      !poolStakes.find(
        (ps) =>
          ps.pair.mainTokenId.toNumber() === po.tokenId &&
          ps.pair.mainTypePoolId.toNumber() === po.poolId
      )
  );

  const depositedTotal =
    poolStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const { withdrawBakc } = useWithdrawBakc({
    bayc: withdrawArgs(PoolType.BAYC, false) as PairNftWithAmount[],
    mayc: withdrawArgs(PoolType.MAYC, false) as PairNftWithAmount[],
  });
  const { claimSelfBakc } = useClaimSelfBakc({
    bayc: claimArgs(PoolType.BAYC, false) as PairNftClaim[],
    mayc: claimArgs(PoolType.MAYC, false) as PairNftClaim[],
  });

  const [depositAmounts, setDepositAmounts] = useState<{
    [key: number]: PairNftWithAmount & {
      poolId: PoolType;
    };
  }>(
    poolStakes.reduce((acc, s) => {
      return {
        ...acc,
        [s.tokenId.toNumber()]: {
          bakcTokenId: s.tokenId,
          amount: ethers.constants.Zero,
          mainTokenId: s.pair.mainTokenId,
          poolId: s.pair.mainTypePoolId.toNumber(),
        },
      };
    }, {})
  );

  const depositArgs = (() => {
    return Object.values(depositAmounts)
      .filter((da) => da.amount.gt(0) && da.mainTokenId !== 0)
      .reduce(
        (acc, da) => {
          const key = da.poolId === PoolType.BAYC ? "bayc" : "mayc";
          return {
            ...acc,
            [key]: [
              ...acc[key],
              [da.mainTokenId, da.bakcTokenId, da.amount.toString()],
            ],
          };
        },
        { bayc: [], mayc: [] }
      );
  })();

  const { depositBakc } = useBakcDeposits(depositArgs);

  const handleSelectInputChangeForBakc =
    (bakcTokenId: number) => (e: ChangeEvent<HTMLSelectElement>) => {
      setDepositAmounts((prev) => ({
        ...prev,
        [bakcTokenId]: {
          ...prev[bakcTokenId],
          mainTokenId: Number(e.target.value.split("_")[1]),
          poolId: Number(e.target.value.split("_")[0]),
          isUncommit: true,
        },
      }));
    };

  const handleAmountChange = (bakcTokenId: number, amount: BigNumber) => {
    setDepositAmounts((prev) => ({
      ...prev,
      [bakcTokenId]: {
        ...prev[bakcTokenId],
        amount: BigNumber.from(amount),
      },
    }));
  };

  const unclaimedTotal =
    poolStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  const totalToDeposit = Object.values(depositAmounts).reduce(
    (acc, da) => acc.add(da.amount),
    ethers.constants.Zero
  );

  if (poolStakes.length === 0) {
    return <p className="mt-4">This wallet does not own any of these NFTs.</p>;
  }

  return (
    <table className="mt-4 w-full border dark:border-zinc-700">
      <TableHead />
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {poolStakes.map((ps) => {
          const depositedAmount = Number(
            ps.deposited.isZero() ? 0 : formatUnits(ps.deposited)
          );

          return (
            <tr className="flex" key={ps.tokenId.toNumber()}>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                BAKC {ps.tokenId.toNumber()}
                {ps.pair.mainTokenId.isZero() ||
                availableMainTokenIds.find(
                  (amt) =>
                    amt.poolId === ps.pair.mainTypePoolId.toNumber() &&
                    amt.tokenId === ps.pair.mainTokenId.toNumber()
                ) ? (
                  <select
                    className="h-7 w-1/2 appearance-none border px-2 py-0 dark:border-zinc-500 dark:bg-zinc-800"
                    name="mainTokenId"
                    onChange={handleSelectInputChangeForBakc(
                      ps.tokenId.toNumber()
                    )}
                    defaultValue="default"
                  >
                    <option value="default" disabled>
                      PAIR WITH
                    </option>
                    {availableMainTokenIds.map((o) => (
                      <option
                        key={`${o.poolId}_${o.tokenId}`}
                        value={`${o.poolId}_${o.tokenId}`}
                      >
                        {o.poolId === PoolType.BAYC ? "BAYC" : "MAYC"}{" "}
                        {o.tokenId}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span>
                    +{" "}
                    {ps.pair.mainTypePoolId.toNumber() === 1 ? "BAYC" : "MAYC"}{" "}
                    {ps.pair.mainTokenId.toNumber()}
                  </span>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {+formatUnits(ps.deposited) === MAX_STAKES[3] ? (
                  <span>MAXED OUT</span>
                ) : (
                  <>
                    {" "}
                    <input
                      className="w-2/5 border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                      value={
                        +formatUnits(
                          depositAmounts[ps.tokenId.toNumber()].amount || 0
                        )
                      }
                      max={Math.min(MAX_STAKES[3] - depositedAmount)}
                      onChange={(e) =>
                        handleAmountChange(
                          ps.tokenId.toNumber(),
                          e.target.value === ""
                            ? ethers.constants.Zero
                            : parseUnits(e.target.value.toString())
                        )
                      }
                      type="number"
                    />
                    <button
                      onClick={() =>
                        handleAmountChange(
                          ps.tokenId.toNumber(),
                          parseUnits(
                            (MAX_STAKES[3] - depositedAmount).toString()
                          )
                        )
                      }
                    >
                      MAX
                    </button>
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(+formatUnits(ps.deposited))}
                {apecoinPrice && (
                  <>
                    {" "}
                    (
                    {formatToUSD(
                      +formatUnits(ps.deposited) * +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(+formatUnits(ps.unclaimed))}
                {apecoinPrice && (
                  <>
                    {" "}
                    (
                    {formatToUSD(
                      +formatUnits(ps.unclaimed) * +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
            </tr>
          );
        })}

        {(depositedTotal.gt(0) || unclaimedTotal.gt(0) || true) && (
          <>
            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Totals:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(totalToDeposit)
                )}
                {apecoinPrice && (
                  <>
                    {" "}
                    (
                    {formatToUSD(
                      +formatUnits(totalToDeposit) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(depositedTotal)
                )}
                {apecoinPrice && (
                  <>
                    {" "}
                    (
                    {formatToUSD(
                      +formatUnits(depositedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(unclaimedTotal)
                )}
                {apecoinPrice && (
                  <>
                    {" "}
                    (
                    {formatToUSD(
                      +formatUnits(unclaimedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Batch Transaction:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                <button
                  disabled={!depositBakc}
                  onClick={() => depositBakc?.()}
                  className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                >
                  Deposit All
                </button>
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                <button
                  disabled={!withdrawBakc}
                  onClick={() => withdrawBakc?.()}
                  className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                >
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                <button
                  disabled={!claimSelfBakc}
                  onClick={() => claimSelfBakc?.()}
                  className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                >
                  Claim All
                </button>
              </td>
            </tr>

            <tr className="flex items-start justify-start">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              <td className="w-1/4 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F12`}
                >
                  depositBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(depositArgs.bayc)}
                />
                <p className="text-sm">_maycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(depositArgs.mayc)}
                />
              </td>
              <td className="w-1/4 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F20`}
                >
                  withdrawBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawArgs(1, true))}
                />
                <p className="text-sm">_maycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawArgs(2, true))}
                />
              </td>
              <td className="w-1/4 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F7`}
                >
                  claimBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimArgs(1, true))}
                />
                <p className="text-sm">_maycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimArgs(2, true))}
                />
              </td>
            </tr>
          </>
        )}
      </tbody>
    </table>
  );
};
