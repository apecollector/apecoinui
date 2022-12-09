"use client";

import { z } from "zod";
import { Fragment, useEffect, useState } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import { ethers } from "ethers";
import { useAccount, useConnect, useContractRead, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import useStakingStore from "../store";
import ABI from "../../lib/abis/staking";
import { BigNumber } from "ethers";
import Deposit from "./deposit";
import Withdraw from "./withdraw";
import Allowance from "./allowance";

const READY = false;

const BAYC_MAX_STAKE = 10094;
const MAYC_MAX_STAKE = 2042;
const BAKC_MAX_STAKE = 856;

const stakingContractAddresses = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
};

const depositFunctionIDs = {
  0: "#writeContract#F14",
  1: "#writeContract#F12",
  2: "#writeContract#F13",
  3: "#writeContract#F11",
};

const withdrawFunctionIDs = {
  0: "#writeContract#F23",
  1: "#writeContract#F24",
  2: "#writeContract#F25",
  3: "#writeContract#F20",
};

const claimFunctionIDs = {
  0: "#writeContract#F6",
  1: "#writeContract#F8",
  2: "#writeContract#F9",
  3: "#writeContract#F7",
};

export default function Staking() {
  const [showTablesUI, setShowTablesUI] = useState(false);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const allStakesData = useContractRead({
    enabled: isConnected,
    address: stakingContractAddresses[chain?.id],
    abi: ABI,
    functionName: "getAllStakes",
    args: [address],
  });

  const autoConnecting = useStakingStore((state) => state.autoConnecting);

  const apeCoinBalance = useStakingStore((state) => state.apeCoinBalance);

  const apePoolTokens = useStakingStore((state) => state.apePoolTokens);
  const baycPoolTokens = useStakingStore((state) => state.baycPoolTokens);
  const maycPoolTokens = useStakingStore((state) => state.maycPoolTokens);
  const bakcPoolTokens = useStakingStore((state) => state.bakcPoolTokens);

  const setApePoolTokens = useStakingStore((state) => state.setApePoolTokens);
  const setBaycPoolTokens = useStakingStore((state) => state.setBaycPoolTokens);
  const setMaycPoolTokens = useStakingStore((state) => state.setMaycPoolTokens);
  const setBakcPoolTokens = useStakingStore((state) => state.setBakcPoolTokens);

  const updateApePoolToken = useStakingStore((state) => state.updateApePoolToken);
  const updateBaycPoolToken = useStakingStore((state) => state.updateBaycPoolToken);
  const updateMaycPoolToken = useStakingStore((state) => state.updateMaycPoolToken);
  const updateBakcPoolToken = useStakingStore((state) => state.updateBakcPoolToken);

  const button = (
    <button className="p-2 border" onClick={() => connect()}>
      Connect Wallet
    </button>
  );

  useEffect(() => {
    if (allStakesData.isSuccess && allStakesData.fetchStatus === "idle" && allStakesData.data) {
      setShowTablesUI(true);
      const stakingData = allStakesData.data.map((data) => {
        return {
          poolID: data[0].toNumber(),
          tokenID: data[1].toNumber(),
          deposited: data[2],
          unclaimed: data[3],
          dayReward: data[4],
        };
      });

      const apeStakingData = stakingData.filter((d) => {
        if (d.poolID === 0) {
          return d;
        }
      });
      setApePoolTokens(apeStakingData);

      const baycStakingData = stakingData.filter((d) => {
        if (d.poolID === 1) {
          return d;
        }
      });
      setBaycPoolTokens(baycStakingData);

      const maycStakingData = stakingData.filter((d) => {
        if (d.poolID === 2) {
          return d;
        }
      });
      setMaycPoolTokens(maycStakingData);

      const bakcStakingData = stakingData.filter((d) => {
        if (d.poolID === 3) {
          return d;
        }
      });
      setBakcPoolTokens(bakcStakingData);
    }
  }, [allStakesData.isSuccess, allStakesData.fetchStatus]);

  const poolIDsToAcronym = {
    0: "APECOIN",
    1: "BAYC",
    2: "MAYC",
    3: "BAKC",
  };

  const poolIDsToStoreTokens = {
    0: apePoolTokens,
    1: baycPoolTokens,
    2: maycPoolTokens,
    3: bakcPoolTokens,
  };

  const MAX_STAKE_VALUES = {
    0: apeCoinBalance,
    1: BAYC_MAX_STAKE,
    2: MAYC_MAX_STAKE,
    3: BAKC_MAX_STAKE,
  };

  const apePoolCurrentAmoutToStakeTotal = apePoolTokens.reduce((total, token) => {
    return total + (token.amountToStake || 0);
  }, 0);

  const baycPoolCurrentAmoutToStakeTotal = baycPoolTokens.reduce((total, token) => {
    return total + (token.amountToStake || 0);
  }, 0);

  const maycPoolCurrentAmoutToStakeTotal = maycPoolTokens.reduce((total, token) => {
    return total + (token.amountToStake || 0);
  }, 0);

  const bakcPoolCurrentAmoutToStakeTotal = bakcPoolTokens.reduce((total, token) => {
    return total + (token.amountToStake || 0);
  }, 0);

  const apePoolCurrentStakedTotal = apePoolTokens.reduce((total, token) => {
    return total + token.deposited;
  }, 0);

  const baycPoolCurrentStakedTotal = baycPoolTokens.reduce((total, token) => {
    return total.add(token.deposited);
  }, ethers.constants.Zero);

  const maycPoolCurrentStakedTotal = maycPoolTokens.reduce((total, token) => {
    return total.add(token.deposited);
  }, ethers.constants.Zero);

  const bakcPoolCurrentStakedTotal = bakcPoolTokens.reduce((total, token) => {
    return total.add(token.deposited);
  }, ethers.constants.Zero);

  const apePoolCurrentRewardsTotal = apePoolTokens.reduce((total, token) => {
    return total.add(token.unclaimed);
  }, ethers.constants.Zero);

  const baycPoolCurrentRewardsTotal = baycPoolTokens.reduce((total, token) => {
    return total.add(token.unclaimed);
  }, ethers.constants.Zero);

  const maycPoolCurrentRewardsTotal = maycPoolTokens.reduce((total, token) => {
    return total.add(token.unclaimed);
  }, ethers.constants.Zero);

  const bakcPoolCurrentRewardsTotal = bakcPoolTokens.reduce((total, token) => {
    return total.add(token.unclaimed);
  }, ethers.constants.Zero);

  const baycOptions = baycPoolTokens
    ? baycPoolTokens.map((data) => {
        return { label: `BAYC #${data.tokenID}` };
      })
    : [];

  const maycOptions = maycPoolTokens
    ? maycPoolTokens.map((data) => {
        return { label: `MAYC #${data.tokenID}` };
      })
    : [];

  const options = baycOptions.concat(maycOptions);

  const depositArg = (poolID, tokenID) => {
    if (poolID === 0) {
      const token = poolIDsToStoreTokens[poolID][0];
      if (token?.amountToStake > 0) {
        return [parseUnits(token.amountToStake.toString())];
      } else {
        return [];
      }
    }
    return [
      poolIDsToStoreTokens[poolID]
        .map((token) => {
          if (token.amountToStake && token.tokenID === tokenID) {
            const amountToStakeBigNumber = parseUnits(token.amountToStake.toString());
            return {
              tokenId: token.tokenID,
              amount: amountToStakeBigNumber,
            };
          }
        })
        .filter((token) => {
          return token !== undefined;
        }),
    ];
  };

  const depositArgs = (poolID, asString) => {
    if (poolID === 0) {
      const token = poolIDsToStoreTokens[poolID][0];
      if (token?.amountToStake > 0) {
        return [
          asString
            ? parseUnits(token.amountToStake.toString()).toString()
            : parseUnits(token.amountToStake.toString()),
        ];
      } else {
        return null;
      }
    }

    const args = poolIDsToStoreTokens[poolID]
      .map((token) => {
        if (token.amountToStake) {
          const amountToStakeBigNumber = parseUnits(token.amountToStake.toString());
          if (asString) {
            return [token.tokenID, amountToStakeBigNumber.toString()];
          } else {
            return {
              tokenId: token.tokenID,
              amount: amountToStakeBigNumber,
            };
          }
        }
      })
      .filter((token) => {
        return token !== undefined;
      });
    return args.length === 0 ? null : args;
  };

  const withdrawArg = (poolID, tokenID) => {
    if (poolID === 0) {
      const token = poolIDsToStoreTokens[poolID][0];
      if (token?.deposited.gt(0)) {
        return [parseUnits(token.deposited.toString())];
      } else {
        return [];
      }
    }
    return [
      poolIDsToStoreTokens[poolID]
        .map((token) => {
          if (token.deposited && token.tokenID === tokenID) {
            return {
              tokenId: token.tokenID,
              amount: token.deposited,
            };
          }
        })
        .filter((token) => {
          return token !== undefined;
        }),
    ];
  };

  const withdrawArgs = (poolID, asString) => {
    if (poolID === 0) {
      const token = poolIDsToStoreTokens[poolID][0];
      if (token.deposited.gt(0)) {
        return [asString ? token.deposited.toString() : token.deposited];
      } else {
        return [];
      }
    }
    return poolIDsToStoreTokens[poolID]
      .map((token) => {
        if (token.deposited?.gt(0)) {
          if (asString) {
            return [token.tokenID, token.deposited.toString()];
          } else {
            return [
              {
                tokenId: token.tokenID,
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

  const claimArgs = (poolID, asString) => {
    if (poolID === 0) {
      const token = poolIDsToStoreTokens[poolID][0];
      if (token.unclaimed.gt(0)) {
        return [asString ? token.unclaimed.toString() : token.unclaimed];
      } else {
        return [];
      }
    }
    return poolIDsToStoreTokens[poolID]
      .map((token) => {
        if (token.unclaimed?.gt(0)) {
          return [token.tokenID, asString ? token.unclaimed.toString() : token.unclaimed];
        }
      })
      .filter((token) => {
        if (token?.[1]) {
          return true;
        }
      });
  };

  const apeInputOnChange = (tokenID, value) => {
    const valueAsNumber = parseInt(value || 0);
    const validation = z.number().gte(0);
    const res = validation.safeParse(valueAsNumber);
    if (res.success === true) {
      updateApePoolToken({
        tokenID: tokenID,
        amountToStake: valueAsNumber,
      });
    }
  };

  const baycInputOnChange = (tokenID, value) => {
    const valueAsNumber = parseInt(value || 0);
    const validation = z.number().gte(0).lte(BAYC_MAX_STAKE);
    const res = validation.safeParse(valueAsNumber);
    if (res.success === true) {
      updateBaycPoolToken({
        tokenID: tokenID,
        amountToStake: valueAsNumber,
      });
    }
  };

  const maycInputOnChange = (tokenID, value) => {
    const valueAsNumber = parseInt(value || 0);
    const validation = z.number().gte(0).lte(MAYC_MAX_STAKE);
    const res = validation.safeParse(valueAsNumber);
    if (res.success === true) {
      updateMaycPoolToken({
        tokenID: tokenID,
        amountToStake: valueAsNumber,
      });
    }
  };

  const bakcInputOnChange = (tokenID, value) => {
    const valueAsNumber = parseInt(value || 0);
    const validation = z.number().gte(0).lte(BAKC_MAX_STAKE);
    const res = validation.safeParse(valueAsNumber);
    if (res.success === true) {
      updateBakcPoolToken({
        tokenID: tokenID,
        amountToStake: valueAsNumber,
      });
    }
  };

  const stakingData = {
    0: {
      poolID: 0,
      name: "ApeCoin Token Pool",
      tokens: apePoolTokens,
      amoutToStakeTotal: apePoolCurrentAmoutToStakeTotal,
      stakedTotal: apePoolCurrentStakedTotal,
      rewardsTotal: apePoolCurrentRewardsTotal,
      depositContractArgs: depositArgs(0, true),
    },
    1: {
      poolID: 1,
      name: "Bored Ape Yacht Club NFT Pool",
      tokens: baycPoolTokens,
      amoutToStakeTotal: baycPoolCurrentAmoutToStakeTotal,
      stakedTotal: baycPoolCurrentStakedTotal,
      rewardsTotal: baycPoolCurrentRewardsTotal,
      depositContractArgs: depositArgs(1, true),
    },
    2: {
      poolID: 2,
      name: "Mutant Ape Yacht Club NFT Pool",
      tokens: maycPoolTokens,
      amoutToStakeTotal: maycPoolCurrentAmoutToStakeTotal,
      stakedTotal: maycPoolCurrentStakedTotal,
      rewardsTotal: maycPoolCurrentRewardsTotal,
      depositContractArgs: depositArgs(2, true),
    },
    3: {
      poolID: 3,
      name: "Bored Ape Kennel Club NFT Pool",
      tokens: bakcPoolTokens,
      amoutToStakeTotal: bakcPoolCurrentAmoutToStakeTotal,
      stakedTotal: bakcPoolCurrentStakedTotal,
      rewardsTotal: bakcPoolCurrentRewardsTotal,
      depositContractArgs: depositArgs(3, true),
    },
  };

  const poolIDsToStakingAmountOnchange = {
    0: apeInputOnChange,
    1: baycInputOnChange,
    2: maycInputOnChange,
    3: bakcInputOnChange,
  };

  const [showAllowanceUI, setShowAllowanceUI] = useState(false);

  const header = (
    <div className="md:flex md:items-center md:justify-between mt-10">
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center ">
          ApeCoin Staking{" "}
          <span
            onClick={() => {
              allStakesData.refetch();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3.5}
              stroke="currentColor"
              className={`w-6 h-6 ml-4 top-0.5 relative cursor-pointer ${
                allStakesData.isFetching && "animate-spin"
              }`}
            >
              <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </span>
        </h1>
        <p className="mb-2">Alternative ApeCoin staking user interface. </p>
      </div>
      <div
        className={`flex flex-col md:border md:p-4 ${showAllowanceUI ? "visible" : "invisible"}`}
      >
        <p className="pb-2">Staking Contract Allowance: </p>
        <div>
          <Allowance setShowAllowanceUI={setShowAllowanceUI} />
        </div>
      </div>
    </div>
  );

  if (!READY) {
    return (
      <>
        <div className="md:flex md:items-center md:justify-between mt-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4 flex items-center ">ApeCoin Staking </h1>
            <p className="mb-2">Alternative ApeCoin staking user interface. </p>
          </div>
        </div>
        <p className="mt-10">
          Not ready for the public, please follow{" "}
          <a className="text-[#1da1f2]" href="https://twitter.com/ApeCollector">
            @ApeCollector
          </a>{" "}
          on twitter for announcements.
        </p>
      </>
    );
  }

  if (autoConnecting || !showTablesUI) {
    return header;
  }

  if (!isConnected) {
    return (
      <>
        {header}
        <div className="flex flex-col mt-4">
          <p>You must connect your wallet in order to interact with the staking contract.</p>
          <div className="mt-6">{button}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {header}
      {allStakesData.isError && <>{JSON.stringify(allStakesData.error)}</>}
      {allStakesData.isSuccess && (
        <div className="">
          {Object.keys(stakingData).map((pool) => (
            <Fragment key={pool}>
              <h2 className="text-xl font-bold pt-8 pl-1 pb-2">{stakingData[pool].name}</h2>
              {stakingData[pool].tokens.length === 0 ? (
                <>
                  <p>You don't have any tokens needed join this pool.</p>
                </>
              ) : (
                <>
                  <table className="table-fixed w-full">
                    <thead>
                      <tr>
                        <th scope="col" className="p-2 text-left border w-2/12">
                          Token ID
                        </th>
                        <th scope="col" className="p-2 text-left border w-4/12">
                          <div className="flex justify-between">Deposit </div>
                        </th>
                        <th scope="col" className="p-2 text-left border w-3/12">
                          <div className="flex justify-between">
                            <span>Withdraw</span>
                          </div>
                        </th>
                        <th scope="col" className="p-2 text-left border w-3/12">
                          <div className="flex justify-between">
                            <span>Claim Rewards</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakingData[pool].tokens.map((data, i) => (
                        <tr key={data.tokenID} className={`${i % 2 === 1 && ""}`}>
                          <td className="border p-2 text-left">
                            {stakingData[pool].poolID === 0
                              ? "ApeCoin"
                              : `${poolIDsToAcronym[data.poolID]} #${data.tokenID}`}
                          </td>
                          <td className="border p-2 text-left">
                            <div>
                              <div className="flex flex-col md:flex-row">
                                <input
                                  onClick={(e) => {
                                    e.target.select();
                                  }}
                                  className="md:w-20 px-1 border border-b-0 md:border-b md:border-r-0 text-center"
                                  value={
                                    poolIDsToStoreTokens[pool].find((token) => {
                                      return token.tokenID == data.tokenID;
                                    }).amountToStake || 0
                                  }
                                  onChange={(e) => {
                                    poolIDsToStakingAmountOnchange[pool](
                                      data.tokenID,
                                      e.target.value
                                    );
                                  }}
                                />

                                {!poolIDsToStoreTokens[pool].find((token) => {
                                  return token.tokenID == data.tokenID;
                                }).amountToStake && (
                                  <button
                                    onClick={() => {
                                      poolIDsToStakingAmountOnchange[pool](
                                        data.tokenID,
                                        MAX_STAKE_VALUES[pool]
                                      );
                                    }}
                                    className="border px-2 hover:border-gray-500"
                                  >
                                    MAX
                                  </button>
                                )}

                                {data.poolID === 3 && (
                                  <select
                                    className={`px-2 border border-b-0 md:border-b md:border-r-0 text-center appearance-none cursor-pointer ${
                                      data.poolID === 3 &&
                                      poolIDsToStoreTokens[data.poolID].find((token) => {
                                        return token.tokenID == data.tokenID;
                                      }).amountToStake > 0
                                        ? "inline"
                                        : "invisible"
                                    }`}
                                  >
                                    <option>LINK TO</option>
                                    {options.map((option) => (
                                      <option key={option.label}>{option.label}</option>
                                    ))}
                                  </select>
                                )}

                                {poolIDsToStoreTokens[pool].find((token) => {
                                  return token.tokenID == data.tokenID;
                                }).amountToStake > 0 && (
                                  <>
                                    <Deposit
                                      refetch={allStakesData.refetch}
                                      poolID={stakingData[pool].poolID}
                                      amount={BigNumber.from(
                                        poolIDsToStoreTokens[data.poolID].find((token) => {
                                          return token.tokenID == data.tokenID;
                                        }).amountToStake || BigNumber.from(0)
                                      )}
                                      args={depositArg(stakingData[pool].poolID, data.tokenID)}
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="border p-2 text-left">
                            <div className="flex flex-col md:flex-row">
                              {data.deposited == 0 ? (
                                <div className="md:w-20 px-1 text-center">0</div>
                              ) : (
                                <>
                                  <input
                                    className="md:w-20 px-1 border border-b-0 md:border-b md:border-r-0 text-center"
                                    value={Math.round(formatUnits(data.deposited))}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                    }}
                                  />
                                  <Withdraw
                                    refetch={allStakesData.refetch}
                                    poolID={stakingData[pool].poolID}
                                    // amount={
                                    //   poolIDsToStoreTokens[pool].find((token) => {
                                    //     return token.tokenID == data.tokenID;
                                    //   }).deposited || BigNumber.from(0)
                                    // }
                                    args={withdrawArg(stakingData[pool].poolID, data.tokenID)}
                                  />
                                </>
                              )}
                            </div>
                          </td>
                          <td className="border p-2 text-left">
                            <div className="flex flex-col md:flex-row">
                              {data.unclaimed == 0 ? (
                                <div className="md:w-20 px-1 text-center">0</div>
                              ) : (
                                <>
                                  <input
                                    className="md:w-20 px-1 border border-b-0 md:border-b md:border-r-0 text-center"
                                    value={Math.round(formatUnits(data.unclaimed))}
                                    onChange={(e) => {
                                      console.log(e.target.value);
                                    }}
                                  />
                                  <button className="border px-2" onClick={() => {}}>
                                    CLAIM
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {(stakingData[pool].amoutToStakeTotal > 0 ||
                        stakingData[pool].stakedTotal > 0 ||
                        stakingData[pool].rewardsTotal > 0) && (
                        <>
                          {stakingData[pool].poolID !== 0 && (
                            <tr>
                              <td className="border p-2 text-left">BATCH</td>
                              <td className="border p-2 text-left">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-20 px-1 text-center">
                                    {stakingData[pool].amoutToStakeTotal > 0 && (
                                      <>{stakingData[pool].amoutToStakeTotal}</>
                                    )}
                                  </div>
                                  {stakingData[pool].amoutToStakeTotal > 0 && (
                                    <button
                                      className="border px-2"
                                      onClick={() => write?.()}
                                      // disabled={!write}
                                    >
                                      DEPOSIT ALL
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="border p-2 text-left">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-20 px-1 text-center">
                                    {stakingData[pool].stakedTotal.gt(0) && (
                                      <>{Math.round(+formatUnits(stakingData[pool].stakedTotal))}</>
                                    )}
                                  </div>
                                  {stakingData[pool].stakedTotal.gt(0) && (
                                    <button
                                      className="border px-2"
                                      onClick={() => write?.()}
                                      // disabled={!write}
                                    >
                                      WITHDRAW ALL
                                    </button>
                                  )}
                                </div>
                              </td>
                              <td className="border p-2 text-left">
                                <div className="flex flex-col md:flex-row">
                                  <div className="md:w-20 px-1 text-center">
                                    {stakingData[pool].rewardsTotal.gt(0) && (
                                      <>
                                        {Math.round(+formatUnits(stakingData[pool].rewardsTotal))}
                                      </>
                                    )}
                                  </div>
                                  {stakingData[pool].rewardsTotal.gt(0) && (
                                    <button
                                      className="border px-2"
                                      onClick={() => write?.()}
                                      // disabled={!write}
                                    >
                                      CLAIM ALL
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}

                          <tr>
                            <td className="border p-2 text-left">Data</td>
                            <td className="border p-2 ">
                              {stakingData[pool].depositContractArgs !== null && (
                                <>
                                  <a
                                    className="mb-2 underline text-sm sm:text-base"
                                    href={`https://${
                                      chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
                                    }/address/${stakingContractAddresses[chain?.id]}${
                                      depositFunctionIDs[stakingData[pool].poolID]
                                    }`}
                                  >
                                    Contract Function
                                  </a>
                                  <textarea
                                    readOnly
                                    className="w-full text-center md:text-left"
                                    onFocus={(e) => {
                                      e.target.select();
                                    }}
                                    value={JSON.stringify(stakingData[pool].depositContractArgs)}
                                  />
                                </>
                              )}
                            </td>
                            <td className="border p-2">
                              <>
                                <a
                                  className="mb-2 underline text-sm sm:text-base"
                                  href={`https://${
                                    chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
                                  }/address/${stakingContractAddresses[chain?.id]}${
                                    withdrawFunctionIDs[stakingData[pool].poolID]
                                  }`}
                                >
                                  Contract Function
                                </a>
                                <textarea
                                  readOnly
                                  className="w-full text-center md:text-left"
                                  onFocus={(e) => {
                                    e.target.select();
                                  }}
                                  value={JSON.stringify(
                                    withdrawArgs(stakingData[pool].poolID, true)
                                  )}
                                />
                              </>
                            </td>
                            <td className="border p-2">
                              <>
                                <a
                                  className="mb-2 underline text-sm sm:text-base"
                                  href={`https://${
                                    chain?.id === 5 ? "goerli.etherscan.io" : "etherscan.io"
                                  }/address/${stakingContractAddresses[chain?.id]}${
                                    claimFunctionIDs[stakingData[pool].poolID]
                                  }`}
                                >
                                  Contract Function
                                </a>
                                <textarea
                                  readOnly
                                  className="w-full text-center md:text-left"
                                  onFocus={(e) => {
                                    e.target.select();
                                  }}
                                  value={JSON.stringify(claimArgs(stakingData[pool].poolID, true))}
                                />
                              </>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
