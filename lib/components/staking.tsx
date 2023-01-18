"use client";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import useAllStakes from "@/hooks/useAllStakes";
import { ethers, BigNumber } from "ethers";
import usePrice from "@/hooks/usePrice";
import useAutoConnecting from "@/hooks/useAutoConnecting";
import { ApeCoinTable, NftTable, BakcTable } from "@/components/tables";
import useAllowance from "@/hooks/useAllowance";
import Allowance from "./allowance";
import { formatUnits } from "ethers/lib/utils.js";
import UserStaking from "./userStaking";

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

  const { poolsContractRead: allStakes } = useAllStakes(statsAddress);

  if (!isConnected) {
    return <h1>You must be connected to stake.</h1>;
  }

  if (!allStakes || !allStakes.data) {
    return <h1>Loading staking contract data...</h1>;
  }

  const apeCoinStakes: poolStakesData[] | undefined = allStakes.data?.filter(
    (stake) => {
      if (stake.poolId.toNumber() === 0) {
        return true;
      }
    }
  );

  const baycStakes: poolStakesData[] | undefined = allStakes.data.filter(
    (stake) => {
      if (stake.poolId.toNumber() === 1) {
        return true;
      }
    }
  );

  const maycStakes: poolStakesData[] | undefined = allStakes.data.filter(
    (stake) => {
      if (stake.poolId.toNumber() === 2) {
        return true;
      }
    }
  );

  const bakcStakes: poolStakesData[] | undefined = allStakes.data.filter(
    (stake) => {
      if (stake.poolId.toNumber() === 3) {
        return true;
      }
    }
  );

  const withdrawArgs = (poolID: number, asString: boolean) => {
    if (poolID === 0) {
      const token = allStakes.data?.[0];
      if (token?.deposited.gt(0)) {
        return asString ? token.deposited.toString() : token.deposited;
      } else {
        return "";
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
        return asString ? token.unclaimed.toString() : token.unclaimed;
      } else {
        return "";
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
            return token.tokenId.toNumber();
          } else {
            return;
            {
              tokenId: token.tokenId;
            }
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

  const baycOptions = baycStakes.map((data) => {
    return { label: `BAYC ${data.tokenId}` };
  });

  const maycOptions = maycStakes.map((data) => {
    return { label: `MAYC ${data.tokenId}` };
  });

  const options = baycOptions.concat(maycOptions);

  return (
    <div>
      <div>
        <UserStaking />
      </div>

      <div className="mt-10 overflow-scroll">
        {/* {allowance?.data?.eq(0) ? (
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
        )} */}

        <h2 className="text-4xl font-extrabold">ApeCoin Staking Pool</h2>
        <ApeCoinTable
          apeCoinStakes={apeCoinStakes}
          withdrawArgs={withdrawArgs}
          claimArgs={claimArgs}
          apecoinPrice={apecoinPrice}
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Yacht Club Pool
        </h2>

        <NftTable
          poolId={1}
          tokenSymbol="BAYC"
          poolStakes={baycStakes}
          withdrawArgs={withdrawArgs}
          claimArgs={claimArgs}
          apecoinPrice={apecoinPrice}
          withdrawFunctionID="24"
          claimFunctionID="8"
          depositFunctionID="12"
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Mutant Ape Yacht Club Pool
        </h2>

        <NftTable
          poolId={2}
          tokenSymbol={"MAYC"}
          poolStakes={maycStakes}
          withdrawArgs={withdrawArgs}
          claimArgs={claimArgs}
          apecoinPrice={apecoinPrice}
          withdrawFunctionID="25"
          claimFunctionID="9"
          depositFunctionID="13"
        />

        <h2 className="mt-10 text-4xl font-extrabold">
          Bored Ape Kennel Club Pool
        </h2>

        <BakcTable
          poolStakes={bakcStakes}
          withdrawArgs={withdrawBakcArgs}
          claimArgs={claimBakcArgs}
          apecoinPrice={apecoinPrice}
          pairOptions={options}
        />
      </div>
    </div>
  );
}
