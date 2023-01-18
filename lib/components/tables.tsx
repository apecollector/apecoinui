"use client";

import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { ethers, BigNumber } from "ethers";
import useApeCoinBalance from "@/hooks/useApeCoinBalance";
import { useState } from "react";

const MAX_STAKES = {
  1: 10094,
  2: 2042,
  3: 856,
} as const;

interface poolStakesData {
  poolId: BigNumber;
  tokenId: BigNumber;
  deposited: BigNumber;
  unclaimed: BigNumber;
  rewards24hr: BigNumber;
  pair: { mainTokenId: BigNumber; mainTypePoolId: BigNumber };
}

export function ApeCoinTable({
  apeCoinStakes,
  apecoinPrice,
  withdrawArgs,
  claimArgs,
}: {
  apeCoinStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  withdrawArgs: (
    poolID: number,
    asString: boolean
  ) =>
    | string
    | BigNumber
    | (
        | (string | number)[]
        | { tokenId: BigNumber; amount: BigNumber }[]
        | undefined
      )[]
    | undefined;
  claimArgs: (
    poolID: number,
    asString: boolean
  ) => string | ethers.BigNumber | (number | undefined)[] | undefined;
}) {
  const { apeCoinBalance } = useApeCoinBalance();

  const [depositApeCoinAmount, setDepositApeCoinAmount] = useState<BigNumber>(
    ethers.constants.Zero
  );

  const depositedTotal =
    apeCoinStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const unclaimedTotal =
    apeCoinStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  return (
    <table className="mt-4 w-full border dark:border-zinc-700">
      <thead className="border-b border-zinc-200 dark:border-zinc-700">
        <tr className="flex">
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Token ID
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Deposit ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Staked ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Unclaimed ApeCoin
          </th>
        </tr>
      </thead>
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
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                    Deposit
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {depositedTotal.gt(0) && (
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                    Withdraw
                  </button>
                )}
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                {unclaimedTotal.gt(0) && (
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
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
                      value={`"${depositApeCoinAmount?.toString()}"`}
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
                      value={JSON.stringify(withdrawArgs(0, true))}
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
                      value={JSON.stringify(claimArgs(0, true))}
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
}

export function NftTable({
  poolId,
  tokenSymbol,
  poolStakes,
  apecoinPrice,
  withdrawArgs,
  claimArgs,
  depositFunctionID,
  claimFunctionID,
  withdrawFunctionID,
}: {
  poolId: number;
  tokenSymbol: string;
  claimFunctionID: string;
  withdrawFunctionID: string;
  depositFunctionID: string;
  poolStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  withdrawArgs: (
    poolID: number,
    asString: boolean
  ) =>
    | string
    | BigNumber
    | (
        | (string | number)[]
        | { tokenId: BigNumber; amount: BigNumber }[]
        | undefined
      )[]
    | undefined;
  claimArgs: (
    poolID: number,
    asString: boolean
  ) => string | ethers.BigNumber | (number | undefined)[] | undefined;
}) {
  const [depositAmounts, setDepositAmounts] = useState<{
    [key: number]: BigNumber;
  }>(
    poolStakes.reduce(
      (o, key) => ({ ...o, [key.tokenId.toNumber()]: ethers.constants.Zero }),
      {}
    )
  );

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
      <thead className="border-b border-zinc-200 dark:border-zinc-700">
        <tr className="flex">
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Token ID
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Deposit ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Staked ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Unclaimed ApeCoin
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {poolStakes.map((stake, i) => (
          <tr className="flex" key={i}>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {tokenSymbol} {stake.tokenId.toNumber()}
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              {+formatUnits(stake.deposited) === 10094 ? (
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
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(
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
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(
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
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(
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
                  <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
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
                      className="w-full border px-2 text-[10px] dark:border-zinc-500 dark:bg-zinc-800"
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
                      className="w-full border px-2 text-[10px] dark:border-zinc-500  dark:bg-zinc-800"
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
                      className="w-full border px-2 text-[10px] dark:border-zinc-500  dark:bg-zinc-800"
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
}

export function BakcTable({
  poolStakes,
  apecoinPrice,
  withdrawArgs,
  claimArgs,
  pairOptions,
}: {
  poolStakes: poolStakesData[];
  apecoinPrice: BigNumber | undefined;
  pairOptions: { label: string }[];
  withdrawArgs: (
    mainTypePoolId: number,
    asString: boolean
  ) =>
    | (
        | (string | number)[]
        | {
            mainTokenId: ethers.BigNumber;
            bakcTokenId: ethers.BigNumber;
            amount: ethers.BigNumber;
            isUncommit: boolean;
          }[]
        | undefined
      )[]
    | undefined;
  claimArgs: (
    poolID: number,
    asString: boolean
  ) =>
    | (string | ethers.BigNumber)[]
    | (
        | (string | number)[]
        | { tokenId: ethers.BigNumber; amount: ethers.BigNumber }[]
        | undefined
      )[]
    | undefined;
}) {
  const depositedTotal =
    poolStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const unclaimedTotal =
    poolStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  if (poolStakes.length === 0) {
    return <p className="mt-4">This wallet does not own any of these NFTs.</p>;
  }

  return (
    <table className="mt-4 w-full border dark:border-zinc-700">
      <thead className="border-b border-zinc-200 dark:border-zinc-700">
        <tr className="flex">
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Token ID
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Deposit ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Staked ApeCoin
          </th>
          <th className="flex w-1/4 items-center p-4 text-left font-semibold tracking-wide">
            Unclaimed ApeCoin
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
        {poolStakes.map((stake, i) => (
          <tr className="flex" key={i}>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              BAKC {stake.tokenId.toNumber()}
              <select className="h-7 w-1/2 appearance-none border px-2 py-0 dark:border-zinc-500 dark:bg-zinc-800">
                <option>PAIR WITH</option>
                {pairOptions.map((option) => (
                  <option key={option.label}>{option.label}</option>
                ))}
              </select>
            </td>
            <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
              <input className="w-2/5 border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
              <button>MAX</button>
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

        {(depositedTotal.gt(0) || unclaimedTotal.gt(0) || true) && (
          <>
            <tr className="flex">
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                Totals:
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                1,712
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
                    }).format(1712 * +formatUnits(apecoinPrice, 8))}
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
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(
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
                    {Intl.NumberFormat(undefined, {
                      maximumFractionDigits: 2,
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(
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
                <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                  Deposit All
                </button>
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/4 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300">
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
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F20`}
                >
                  withdrawBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="w-full border px-2 text-[10px] dark:border-zinc-500  dark:bg-zinc-800"
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
}
