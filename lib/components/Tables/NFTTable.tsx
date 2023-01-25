import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { ethers, BigNumber } from "ethers";
import { useState } from "react";

import { poolStakesData } from "@/hooks/useAllStakes";
import { MAX_STAKES } from "@/types/constants";
import { TableHead } from "./common/TableHead";
import { formatToUSD } from "../../utils/format";
import { IClaimArgs, IWithdrawArgs } from "./common/types";
import { SingleNft, useNftDeposits } from "@/hooks/useDeposits";

interface NftTableProps {
  tokenSymbol: string;
  claimFunctionID: string;
  withdrawFunctionID: string;
  depositFunctionID: string;
  poolStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  poolId: 1 | 2;
  withdrawArgs: IWithdrawArgs;
  claimArgs: IClaimArgs;
}
export const NftTable = (props: NftTableProps) => {
  const {
    tokenSymbol,
    poolStakes,
    apecoinPrice,
    depositFunctionID,
    claimFunctionID,
    withdrawFunctionID,
    withdrawArgs,
    claimArgs,
    poolId,
  } = props;

  const [depositAmounts, setDepositAmounts] = useState<{
    [key: number]: BigNumber;
  }>(
    poolStakes.reduce(
      (o, key) => ({ ...o, [key.tokenId.toNumber()]: ethers.constants.Zero }),
      {}
    )
  );

  const { depositNft } = useNftDeposits({
    poolId,
    nfts: Object.entries(depositAmounts).reduce(
      (acc: SingleNft[], [key, value]) => [
        ...acc,
        { tokenId: BigNumber.from(key), amount: value },
      ],
      []
    ),
  });

  const depositArgs = () => {
    const args = Object.entries(depositAmounts)
      .map((token) => {
        if (token[1].gt(0)) {
          return [token[0], token[1].toString()];
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
    return args.length === 0 ? [] : args;
  };

  const depositedTotal = poolStakes.reduce((total, token) => {
    return total.add(token.deposited);
  }, ethers.constants.Zero);

  const unclaimedTotal = poolStakes.reduce((total, token) => {
    return total.add(token.unclaimed);
  }, ethers.constants.Zero);

  const totalToDeposit = Object.values(depositAmounts).reduce(
    (total, amount) => total.add(amount),
    ethers.constants.Zero
  );

  if (poolStakes.length === 0) {
    return <p className="mt-4">This wallet does not own any of these NFTs.</p>;
  }

  return (
    <table className="mt-4 w-full border dark:border-zinc-700">
      <TableHead />

      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {poolStakes.map((stake, i) => (
          <tr className="flex" key={i}>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {tokenSymbol} {stake.tokenId.toNumber()}
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {+formatUnits(stake.deposited) === MAX_STAKES[poolId] ? (
                <>MAXED OUT</>
              ) : (
                <>
                  <input
                    value={Math.round(
                      +formatUnits(
                        depositAmounts[stake.tokenId.toNumber()] || 0
                      )
                    )}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setDepositAmounts({
                          ...depositAmounts,
                          [stake.tokenId.toNumber()]: ethers.constants.Zero,
                        });
                      } else if (!isNaN(+e.target.value)) {
                        setDepositAmounts({
                          ...depositAmounts,
                          [stake.tokenId.toNumber()]: parseUnits(
                            e.target.value
                          ),
                        });
                      }
                    }}
                    className="w-2/5 border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  />
                  {!depositAmounts[stake.tokenId.toNumber()].eq(
                    parseUnits(
                      MAX_STAKES[
                        stake.poolId.toNumber() as keyof typeof MAX_STAKES
                      ].toString()
                    )
                  ) && (
                    <button
                      onClick={() => {
                        setDepositAmounts({
                          ...depositAmounts,
                          [stake.tokenId.toNumber()]: parseUnits(
                            MAX_STAKES[
                              stake.poolId.toNumber() as keyof typeof MAX_STAKES
                            ].toString()
                          ),
                        });
                      }}
                    >
                      MAX
                    </button>
                  )}

                  {depositAmounts[stake.tokenId.toNumber()].gt(0) && (
                    <button
                      onClick={() => {
                        setDepositAmounts({
                          ...depositAmounts,
                          [stake.tokenId.toNumber()]: ethers.constants.Zero,
                        });
                      }}
                    >
                      CLEAR
                    </button>
                  )}
                </>
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
              {Intl.NumberFormat("en-us").format(+formatUnits(stake.unclaimed))}
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
          totalToDeposit.gt(0)) && (
          <>
            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Totals Amounts:
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
                {totalToDeposit.gt(0) && (
                  <button
                    disabled={!depositNft}
                    className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
                    onClick={() => depositNft?.()}
                  >
                    Deposit All
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositedTotal.gt(0) && (
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                    Withdraw All
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {unclaimedTotal.gt(0) && (
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                    Claim All
                  </button>
                )}
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {totalToDeposit.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F${depositFunctionID}`}
                    >
                      deposit{tokenSymbol}
                    </a>
                    <textarea
                      className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                      readOnly
                      value={JSON.stringify(depositArgs())}
                    />
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositedTotal.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F${withdrawFunctionID}`}
                    >
                      withdrawSelf{tokenSymbol}
                    </a>
                    <textarea
                      className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                      readOnly
                      value={JSON.stringify(withdrawArgs(poolId, true))}
                    />
                  </>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {unclaimedTotal.gt(0) && (
                  <>
                    <a
                      className="text-sm text-[#1da1f2] sm:text-base"
                      href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F${claimFunctionID}`}
                    >
                      claimSelf{tokenSymbol}
                    </a>
                    <textarea
                      className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                      readOnly
                      value={JSON.stringify(claimArgs(poolId, true))}
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
