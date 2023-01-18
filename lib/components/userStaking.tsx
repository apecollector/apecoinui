"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
  Chain,
} from "wagmi";

import useAllStakes, { poolStakesData } from "@/hooks/useAllStakes";
import { formatUnits } from "ethers/lib/utils.js";
import usePrice from "@/hooks/usePrice";
import ABI from "@/abis/staking";
import { Map } from "@/types/map";
import { BigNumber } from "ethers";

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0xeF37717B1807a253c6D140Aca0141404D23c26D4",
} as const;

function ClaimAll({
  chain,
  apeCoinStakes,
  baycStakes,
  maycStakes,
  bakcStakes,
}: {
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined;
  apeCoinStakes: poolStakesData[] | undefined;
  baycStakes: poolStakesData[] | undefined;
  maycStakes: poolStakesData[] | undefined;
  bakcStakes: poolStakesData[] | undefined;
}) {
  const apeCoinClaimPrepareContractWrite = usePrepareContractWrite({
    enabled:
      apeCoinStakes &&
      apeCoinStakes.length !== 0 &&
      !apeCoinStakes[0].unclaimed.isZero(),
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfApeCoin",
  });

  const apeCoinClaimContractWrite = useContractWrite(
    apeCoinClaimPrepareContractWrite.config
  );

  const args = baycStakes
    ?.map((token) => {
      if (token.unclaimed?.gt(0)) {
        return token.tokenId.toNumber();
      }
    })
    .filter((token) => {
      return token !== undefined;
    });

  const baycUnclaimed =
    baycStakes?.reduce((sum, stake) => {
      return sum + +formatUnits(stake.unclaimed);
    }, 0) || 0;

  const baycPrepareContractWrite = usePrepareContractWrite({
    enabled: baycStakes && baycStakes.length > 0 && baycUnclaimed > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfBAYC",
    args: args && ([args] as any),
  });

  const baycContractWrite = useContractWrite(baycPrepareContractWrite.config);

  const maycArgs = maycStakes
    ?.map((token) => {
      if (token.unclaimed?.gt(0)) {
        return token.tokenId.toNumber();
      }
    })
    .filter((token) => {
      return token !== undefined;
    });

  const maycPrepareContractWrite = usePrepareContractWrite({
    enabled: maycStakes && maycStakes.length > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfMAYC",
    args: [maycArgs as any],
  });

  const maycContractWrite = useContractWrite(maycPrepareContractWrite.config);

  interface bakcData {
    mainTokenId: BigNumber;
    bakcTokenId: BigNumber;
  }

  let bakcBaycArgs: bakcData[] = [];
  let bakcMaycArgs: bakcData[] = [];

  if (bakcStakes) {
    for (let i = 0; i < bakcStakes.length; i++) {
      const stake = bakcStakes[i];
      if (stake.unclaimed.gt(0) && stake.pair.mainTypePoolId.toNumber() === 1) {
        bakcBaycArgs.push({
          mainTokenId: stake.pair.mainTokenId,
          bakcTokenId: stake.tokenId,
        });
      }
    }
  }

  if (bakcStakes) {
    for (let i = 0; i < bakcStakes.length; i++) {
      const stake = bakcStakes[i];
      if (stake.unclaimed.gt(0) && stake.pair.mainTypePoolId.toNumber() === 2) {
        bakcMaycArgs.push({
          mainTokenId: stake.pair.mainTokenId,
          bakcTokenId: stake.tokenId,
        });
      }
    }
  }

  const bakcPrepareContractWrite = usePrepareContractWrite({
    enabled: bakcBaycArgs.length > 0 || bakcMaycArgs.length > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfBAKC",
    args: [bakcBaycArgs, bakcMaycArgs],
  });

  const bakcContractWrite = useContractWrite(bakcPrepareContractWrite.config);
  return (
    <div>
      <button
        onClick={() => {
          if (apeCoinStakes?.[0]?.unclaimed.gt(0)) {
            apeCoinClaimContractWrite.write?.();
          }
          baycContractWrite.write?.();
          maycContractWrite.write?.();
          bakcContractWrite.write?.();
        }}
        className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
      >
        Claim All
      </button>
    </div>
  );
}

function WithdrawAll({
  chain,
  apeCoinStakes,
  baycStakes,
  maycStakes,
  bakcStakes,
}: {
  chain: (Chain & { unsupported?: boolean | undefined }) | undefined;
  apeCoinStakes: poolStakesData[] | undefined;
  baycStakes: poolStakesData[] | undefined;
  maycStakes: poolStakesData[] | undefined;
  bakcStakes: poolStakesData[] | undefined;
}) {
  const apeCoinWithdrawPrepareContractWrite = usePrepareContractWrite({
    enabled: !apeCoinStakes?.[0]?.deposited.isZero(),
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "withdrawSelfApeCoin",
    args: apeCoinStakes?.[0]?.deposited && [apeCoinStakes[0].deposited],
  });

  const apeCoinWithdrawContractWrite = useContractWrite(
    apeCoinWithdrawPrepareContractWrite.config
  );

  interface withdrawData {
    tokenId: BigNumber;
    amount: BigNumber;
  }

  let baycWithdrawArgs: withdrawData[] = [];

  if (baycStakes) {
    for (let i = 0; i < baycStakes.length; i++) {
      const stake = baycStakes[i];
      if (stake.deposited.gt(0)) {
        baycWithdrawArgs.push({
          tokenId: stake.tokenId,
          amount: stake.deposited,
        });
      }
    }
  }

  const baycWithdrawPrepareContractWrite = usePrepareContractWrite({
    enabled: baycStakes && baycStakes.length > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "withdrawSelfBAYC",
    args: baycWithdrawArgs && ([baycWithdrawArgs] as any),
  });

  const baycWithdrawContractWrite = useContractWrite(
    baycWithdrawPrepareContractWrite.config
  );

  let maycWithdrawArgs: withdrawData[] = [];

  if (maycStakes) {
    for (let i = 0; i < maycStakes.length; i++) {
      const stake = maycStakes[i];
      if (stake.deposited.gt(0)) {
        maycWithdrawArgs.push({
          tokenId: stake.tokenId,
          amount: stake.deposited,
        });
      }
    }
  }

  const maycWithdrawPrepareContractWrite = usePrepareContractWrite({
    enabled: maycStakes && maycStakes.length > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "withdrawSelfMAYC",
    args: maycWithdrawArgs && ([maycWithdrawArgs] as any),
  });

  const maycWithdrawContractWrite = useContractWrite(
    maycWithdrawPrepareContractWrite.config
  );

  interface bakcData {
    mainTokenId: number;
    bakcTokenId: number;
    amount: BigNumber;
    isUncommit: boolean;
  }

  let bakcBaycArgs: bakcData[] = [];
  let bakcMaycArgs: bakcData[] = [];

  if (bakcStakes) {
    for (let i = 0; i < bakcStakes.length; i++) {
      const stake = bakcStakes[i];
      if (stake.unclaimed.gt(0) && stake.pair.mainTypePoolId.toNumber() === 1) {
        bakcBaycArgs.push({
          mainTokenId: stake.pair.mainTokenId.toNumber(),
          bakcTokenId: stake.tokenId.toNumber(),
          amount: stake.deposited,
          isUncommit: true,
        });
      }
    }
  }

  if (bakcStakes) {
    for (let i = 0; i < bakcStakes.length; i++) {
      const stake = bakcStakes[i];
      if (stake.unclaimed.gt(0) && stake.pair.mainTypePoolId.toNumber() === 2) {
        bakcMaycArgs.push({
          mainTokenId: stake.pair.mainTokenId.toNumber(),
          bakcTokenId: stake.tokenId.toNumber(),
          amount: stake.deposited,
          isUncommit: true,
        });
      }
    }
  }

  const bakcPrepareContractWrite = usePrepareContractWrite({
    enabled: bakcBaycArgs.length > 0 || bakcMaycArgs.length > 0,
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "withdrawBAKC",
    args: [bakcBaycArgs, bakcMaycArgs],
  });

  const bakcContractWrite = useContractWrite(bakcPrepareContractWrite.config);
  return (
    <div>
      <button
        onClick={() => {
          if (apeCoinStakes?.[0]?.unclaimed.gt(0)) {
            apeCoinWithdrawContractWrite.write?.();
          }
          baycWithdrawContractWrite.write?.();
          maycWithdrawContractWrite.write?.();
          bakcContractWrite.write?.();
        }}
        className="border px-2 hover:border-zinc-500 dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
      >
        Withdraw All
      </button>
    </div>
  );
}

export default function UserStaking() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { apecoinPrice } = usePrice();
  const [statsAddress, setStatsAddress] = useState<string>("");
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const {
    poolsContractRead: allStakes,
    apeCoinStakes,
    baycStakes,
    maycStakes,
    bakcStakes,
  } = useAllStakes(statsAddress!);

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
                    <>
                      {" "}
                      (
                      {Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 2,
                        style: "currency",
                        currency: "USD",
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(totalStaked * apecoinPriceNumber)}
                      )
                    </>
                  )}
                </div>
                {address === statsAddress &&
                  process.env.NEXT_PUBLIC_ENABLE_STAKE === "TRUE" && (
                    <WithdrawAll
                      chain={chain}
                      apeCoinStakes={apeCoinStakes}
                      baycStakes={baycStakes}
                      maycStakes={maycStakes}
                      bakcStakes={bakcStakes}
                    />
                  )}
              </>
            ) : (
              <>{baycStakes && <>0</>}</>
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
                      chain={chain}
                      apeCoinStakes={apeCoinStakes}
                      baycStakes={baycStakes}
                      maycStakes={maycStakes}
                      bakcStakes={bakcStakes}
                    />
                  )}
              </>
            ) : (
              <>{baycStakes && <>0</>}</>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
