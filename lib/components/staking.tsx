"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import useAllStakes from "@/hooks/useAllStakes";
import { formatUnits } from "ethers/lib/utils.js";
import { ethers } from "ethers";
import usePrice from "@/hooks/usePrice";

export default function Staking() {
  const { address, isConnected } = useAccount();
  const { apecoinPrice } = usePrice();
  const [statsAddress, setStatsAddress] = useState<string>();
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const allStakes = useAllStakes(statsAddress!);
  const apeCoinStakes = allStakes.data?.filter((stake) => {
    if (stake.poolId.toNumber() === 0) {
      return true;
    }
  });

  const baycStakes = allStakes.data?.filter((stake) => {
    if (stake.poolId.toNumber() === 1) {
      return true;
    }
  });

  const maycStakes = allStakes.data?.filter((stake) => {
    if (stake.poolId.toNumber() === 2) {
      return true;
    }
  });

  const bakcStakes = allStakes.data?.filter((stake) => {
    if (stake.poolId.toNumber() === 3) {
      return true;
    }
  });

  const baycDepositedTotal =
    baycStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const maycDepositedTotal =
    maycStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const bakcDepositedTotal =
    bakcStakes?.reduce((total, token) => {
      return total.add(token.deposited);
    }, ethers.constants.Zero) || 0;

  const baycUnclaimedTotal =
    baycStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  const maycUnclaimedTotal =
    maycStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  const bakcUnclaimedTotal =
    bakcStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

  const withdrawArgs = (poolID: number, asString: boolean) => {
    if (poolID === 0) {
      const token = allStakes.data?.[0];
      if (token?.deposited.gt(0)) {
        return [asString ? token.deposited.toString() : token.deposited];
      } else {
        return [];
      }
    }
    return allStakes.data
      ?.filter((stake) => {
        if (stake.poolId.toNumber() === poolID) {
          return true;
        }
      })
      .map((token) => {
        if (token.deposited?.gt(0)) {
          if (asString) {
            return [token.tokenId.toNumber(), token.deposited.toString()];
          } else {
            return [
              {
                tokenId: token.tokenId,
                amount: token.deposited,
              },
            ];
          }
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
  };

  const withdrawBakcArgs = (mainTypePoolId: number, asString: boolean) => {
    return allStakes.data
      ?.filter((stake) => {
        if (
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId
        ) {
          return true;
        }
      })
      .map((token) => {
        if (token.deposited?.gt(0)) {
          if (asString) {
            return [
              token.pair.mainTokenId.toNumber(),
              token.tokenId.toNumber(),
              token.deposited.toString(),
              "true",
            ];
          } else {
            return [
              {
                mainTokenId: token.pair.mainTokenId,
                bakcTokenId: token.tokenId,
                amount: token.deposited,
                isUncommit: true,
              },
            ];
          }
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
  };

  const claimArgs = (poolID: number, asString: boolean) => {
    if (poolID === 0) {
      const token = allStakes.data?.[0];
      if (token?.unclaimed.gt(0)) {
        return [asString ? token.unclaimed.toString() : token.unclaimed];
      } else {
        return [];
      }
    }
    return allStakes.data
      ?.filter((stake) => {
        if (stake.poolId.toNumber() === poolID) {
          return true;
        }
      })
      .map((token) => {
        if (token.unclaimed?.gt(0)) {
          if (asString) {
            return [token.tokenId.toNumber(), token.unclaimed.toString()];
          } else {
            return [
              {
                tokenId: token.tokenId,
                amount: token.unclaimed,
              },
            ];
          }
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
  };

  const claimBakcArgs = (mainTypePoolId: number, asString: boolean) => {
    return allStakes.data
      ?.filter((stake) => {
        if (
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId
        ) {
          return true;
        }
      })
      .map((token) => {
        if (token.unclaimed?.gt(0)) {
          if (asString) {
            return [
              token.pair.mainTokenId.toNumber(),
              token.tokenId.toNumber(),
              token.unclaimed.toString(),
            ];
          } else {
            return [
              {
                mainTokenId: token.pair.mainTokenId,
                tokenId: token.tokenId,
                amount: token.unclaimed,
              },
            ];
          }
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
  };

  if (!isConnected) {
    return <h1>You must be connected to stake.</h1>;
  }

  return (
    <div className="mt-4">
      <div className="overflow-scroll">
        <h2 className="text-4xl font-extrabold">ApeCoin Staking Pool</h2>
        <table className="mt-4 w-full border dark:border-zinc-700">
          <thead className="border-b border-zinc-200 dark:border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Token ID
              </th>
              {/* <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Deposit
              </th> */}
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                ApeCoin Staked
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Unclaimed ApeCoin Rewards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {apeCoinStakes?.map((stake, i) => (
              <tr className="flex" key={i}>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  ApeCoin
                </td>
                {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  <input className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
                </td> */}
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.deposited)
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
                        +formatUnits(stake.deposited) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
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

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Batch Transaction:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Claim All
                </button>
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <textarea className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
              </td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F23`}
                >
                  withdrawSelfApeCoin
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawArgs(0, true))}
                />
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F14`}
                >
                  claimSelfApeCoin
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimArgs(0, true))}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Yacht Club Pool
        </h2>

        <table className="mt-4 w-full border dark:border-zinc-700">
          <thead className="border-b border-zinc-200 dark:border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Token ID
              </th>
              {/* <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Deposit
              </th> */}
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                ApeCoin Staked
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Unclaimed ApeCoin Rewards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {baycStakes?.map((stake, i) => (
              <tr className="flex" key={i}>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  BAYC #{stake.tokenId.toNumber()}
                </td>
                {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {+formatUnits(stake.deposited) === 10094 ? (
                    <>MAXED OUT</>
                  ) : (
                    <input className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
                  )}
                </td> */}
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.deposited)
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
                        +formatUnits(stake.deposited) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.unclaimed)
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
                        +formatUnits(stake.unclaimed) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
              </tr>
            ))}

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Totals Amounts:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(baycDepositedTotal)
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
                      +formatUnits(baycDepositedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(baycUnclaimedTotal)
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
                      +formatUnits(baycUnclaimedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Batch Transaction:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Claim All
                </button>
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <textarea className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
              </td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F24`}
                >
                  withdrawSelfBAYC
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawArgs(1, true))}
                />
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F8`}
                >
                  claimSelfBAYC
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimArgs(1, true))}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-10 text-4xl font-extrabold">
          Mutant Ape Yacht Club Pool
        </h2>

        <table className="mt-4 w-full border dark:border-zinc-700">
          <thead className="border-b border-zinc-200 dark:border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Token ID
              </th>
              {/* <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Deposit
              </th> */}
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                ApeCoin Staked
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Unclaimed ApeCoin Rewards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {maycStakes?.map((stake, i) => (
              <tr className="flex" key={i}>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  BAYC #{stake.tokenId.toNumber()}
                </td>
                {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {+formatUnits(stake.deposited) === 2042 ? (
                    <>MAXED OUT</>
                  ) : (
                    <input className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
                  )}
                </td> */}
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.deposited)
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
                        +formatUnits(stake.deposited) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.unclaimed)
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
                        +formatUnits(stake.unclaimed) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Totals:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {" "}
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(maycDepositedTotal)
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
                      +formatUnits(maycDepositedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(maycUnclaimedTotal)
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
                      +formatUnits(maycUnclaimedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Batch Transaction:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Claim All
                </button>
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <textarea className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
              </td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F25`}
                >
                  withdrawSelfMAYC
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawArgs(2, true))}
                />
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F9`}
                >
                  claimSelfMAYC
                </a>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimArgs(2, true))}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Kennel Club Pool
        </h2>

        <table className="mt-4 w-full border dark:border-zinc-700">
          <thead className="border-b border-zinc-200 dark:border-zinc-700">
            <tr className="flex">
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Token ID
              </th>
              {/* <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Deposit
              </th> */}
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                ApeCoin Staked
              </th>
              <th className="flex w-1/3 items-center p-4 text-left font-semibold tracking-wide">
                Unclaimed ApeCoin Rewards
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
            {bakcStakes?.map((stake, i) => (
              <tr className="flex" key={i}>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  BAKC #{stake.tokenId.toNumber()}
                </td>
                {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  <div className="grid grid-cols-4">
                    <div className="col-span-2">
                      {+formatUnits(stake.deposited) === 856 ? (
                        <>MAXED OUT</>
                      ) : (
                        <input className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
                      )}
                    </div>

                    <select
                      disabled
                      className="col-span-2 appearance-none  border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                    >
                      <option selected>
                        {stake.pair.mainTypePoolId.toNumber() === 1
                          ? "BAYC #"
                          : "MAYC #"}
                        {stake.pair.mainTokenId.toNumber()}
                      </option>
                    </select>
                  </div>
                </td> */}
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.deposited)
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
                        +formatUnits(stake.deposited) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
                <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                  {Intl.NumberFormat("en-us").format(
                    +formatUnits(stake.unclaimed)
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
                        +formatUnits(stake.unclaimed) *
                          +formatUnits(apecoinPrice, 8)
                      )}
                      )
                    </>
                  )}
                </td>
              </tr>
            ))}
            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Totals:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(bakcDepositedTotal)
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
                      +formatUnits(bakcDepositedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                {Intl.NumberFormat("en-us").format(
                  +formatUnits(bakcUnclaimedTotal)
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
                      +formatUnits(bakcUnclaimedTotal) *
                        +formatUnits(apecoinPrice, 8)
                    )}
                    )
                  </>
                )}
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Batch Transaction:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">0</td> */}
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Withdraw All
                </button>
              </td>
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <button className="border px-2 dark:border-zinc-500 dark:bg-zinc-800">
                  Claim All
                </button>
              </td>
            </tr>

            <tr className="flex">
              <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                Etherscan Contract:
              </td>
              {/* <td className="flex w-1/3 flex-wrap items-center gap-2 p-4">
                <textarea className="border px-2 dark:border-zinc-500 dark:bg-zinc-800" />
              </td> */}
              <td className="w-1/3 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F20`}
                >
                  withdrawBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawBakcArgs(1, true))}
                />
                <p className="text-sm">_maycPairs</p>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(withdrawBakcArgs(2, true))}
                />
              </td>
              <td className="w-1/3 p-4">
                <a
                  className="text-sm text-[#1da1f2] sm:text-base"
                  href={`https://etherscan.io/address/0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9#writeContract#F7`}
                >
                  claimBAKC
                </a>
                <p className="mt-4 text-sm">_baycPairs</p>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimBakcArgs(1, true))}
                />
                <p className="text-sm">_maycPairs</p>
                <textarea
                  className="border px-2 dark:border-zinc-500 dark:bg-zinc-800"
                  readOnly
                  value={JSON.stringify(claimBakcArgs(2, true))}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
