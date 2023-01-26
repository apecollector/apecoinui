"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import useAllStakes from "@/hooks/useAllStakes";
import { BigNumber } from "ethers";
import usePrice from "@/hooks/usePrice";
import useAutoConnecting from "@/hooks/useAutoConnecting";
import { BakcTable, IPairOption } from "./Tables/BakcTable";
import { ApeCoinTable } from "./Tables/ApeCoinTable";
import { NftTable } from "./Tables/NFTTable";
import useAllowance from "@/hooks/useAllowance";
import Allowance from "./allowance";
import { formatUnits } from "ethers/lib/utils.js";
import { UserStaking } from "./userStaking";
import { PoolType } from "@/types/constants";

interface poolStakesData {
  poolId: BigNumber;
  tokenId: BigNumber;
  deposited: BigNumber;
  unclaimed: BigNumber;
  rewards24hr: BigNumber;
  pair: { mainTokenId: BigNumber; mainTypePoolId: BigNumber };
}

export default function Staking() {
  const { address, isConnected } = useAccount();
  const { apecoinPrice } = usePrice();
  const autoConnecitng = useAutoConnecting();
  const allowance = useAllowance();
  const [statsAddress, setStatsAddress] = useState<string>("");
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const {
    poolsContractRead: allStakes,
    apeCoinStakes,
    bakcStakes,
    baycStakes,
    maycStakes,
  } = useAllStakes(statsAddress);

  if (!isConnected) {
    return <h1>You must be connected to stake.</h1>;
  }

  if (!allStakes || !allStakes.data) {
    return <h1>Loading staking contract data...</h1>;
  }

  const withdrawArgsApecoin = (asString: boolean = true) => {
    const token = allStakes.data?.[0];
    if (token?.deposited.gt(0)) {
      return asString ? token.deposited.toString() : token.deposited;
    } else {
      return "";
    }
  };

  const withdrawArgsNft = (
    poolId: PoolType.BAYC | PoolType.MAYC,
    asString = true
  ) => {
    return (allStakes.data ?? [])
      .filter(
        (stake) => stake.poolId.toNumber() === poolId && stake.deposited?.gt(0)
      )
      .map((token) =>
        asString
          ? [token.tokenId.toNumber(), token.deposited.toString()]
          : [
              {
                tokenId: token.tokenId,
                amount: token.deposited,
              },
            ]
      )
      .filter((token) => token !== undefined);
  };

  const withdrawArgsBakc = (mainTypePoolId: number, asString: boolean) => {
    return (allStakes.data ?? [])
      .filter(
        (stake) =>
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId &&
          stake.deposited?.gt(0)
      )
      .map((token) =>
        asString
          ? [
              token.pair.mainTokenId.toNumber(),
              token.tokenId.toNumber(),
              token.deposited.toString(),
            ]
          : [
              {
                mainTokenId: token.pair.mainTokenId,
                bakcTokenId: token.tokenId,
                amount: token.deposited,
              },
            ]
      );
  };

  const claimArgsApecoin = (asString: boolean) => {
    const token = allStakes.data?.[0];
    if (token?.unclaimed.gt(0)) {
      return asString ? token.unclaimed.toString() : token.unclaimed;
    } else {
      return "";
    }
  };

  const claimArgsNft = (poolId: number, asString: boolean) => {
    return (allStakes.data ?? [])
      .filter(
        (stake) => stake.poolId.toNumber() === poolId && stake.unclaimed?.gt(0)
      )
      .map((token) => (asString ? token.tokenId.toNumber() : token.tokenId));
  };

  const claimArgsBakc = (mainTypePoolId: number, asString: boolean) => {
    return (allStakes.data ?? [])
      .filter(
        (stake) =>
          stake.poolId.toNumber() === 3 &&
          stake.pair.mainTypePoolId.toNumber() === mainTypePoolId &&
          stake.unclaimed?.gt(0)
      )
      .map((token) =>
        asString
          ? [token.pair.mainTokenId.toNumber(), token.tokenId.toNumber()]
          : [
              {
                mainTokenId: token.pair.mainTokenId,
                bakcTokenId: token.tokenId,
              },
            ]
      );
  };

  const baycOptions: IPairOption[] = baycStakes.map((data) => ({
    tokenId: data.tokenId.toNumber(),
    poolId: PoolType.BAYC,
  }));

  const maycOptions: IPairOption[] = maycStakes.map((data) => ({
    tokenId: data.tokenId.toNumber(),
    poolId: PoolType.MAYC,
  }));

  const options = baycOptions.concat(maycOptions);

  return (
    <div>
      <div>
        <UserStaking
          withdrawArgsBakc={withdrawArgsBakc}
          withdrawArgsNft={withdrawArgsNft}
          claimArgsBakc={claimArgsBakc}
          claimArgsNft={claimArgsNft}
        />
      </div>

      <div className="mt-10 overflow-scroll">
        {allowance?.data?.eq(0) ? (
          <>
            <div>ApeCoin Staking Contract Allowance Approval not set:</div>
            <Allowance />
          </>
        ) : (
          <div>
            ApeCoin Staking Contract Allowance set to{" "}
            {+formatUnits(allowance.data?.toString()!) >= 1e9
              ? "Unlimited"
              : formatUnits(allowance.data?.toString()!)}
            <Allowance />
          </div>
        )}

        <h2 className="text-4xl font-extrabold">ApeCoin Staking Pool</h2>
        <ApeCoinTable
          apeCoinStakes={apeCoinStakes}
          withdrawArgs={withdrawArgsApecoin}
          claimArgs={claimArgsApecoin}
          apecoinPrice={apecoinPrice}
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Yacht Club Pool
        </h2>

        <NftTable
          poolId={1}
          tokenSymbol="BAYC"
          poolStakes={baycStakes}
          apecoinPrice={apecoinPrice}
          withdrawFunctionID="24"
          claimFunctionID="8"
          depositFunctionID="12"
          withdrawArgs={withdrawArgsNft}
          claimArgs={claimArgsNft}
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Mutant Ape Yacht Club Pool
        </h2>

        <NftTable
          poolId={2}
          tokenSymbol={"MAYC"}
          poolStakes={maycStakes}
          apecoinPrice={apecoinPrice}
          withdrawFunctionID="25"
          claimFunctionID="9"
          depositFunctionID="13"
          withdrawArgs={withdrawArgsNft}
          claimArgs={claimArgsNft}
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Kennel Club Pool
        </h2>

        <BakcTable
          poolStakes={bakcStakes}
          withdrawArgs={withdrawArgsBakc}
          claimArgs={claimArgsBakc}
          apecoinPrice={apecoinPrice}
          pairOptions={options}
        />
      </div>
    </div>
  );
}
