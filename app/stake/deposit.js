"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import useStakingStore from "../store";
import ABI from "../../lib/abis/staking";
import { ConfirmDeposit } from "./modal";
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils.js";

export default function Deposit({ poolID, args, refetch }) {
  const { isConnected } = useAccount();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const apeCoinAllowance = useStakingStore((state) => state.apeCoinAllowance);

  let functionName;
  switch (poolID) {
    case 0:
      functionName = "depositSelfApeCoin";
      break;
    case 1:
      functionName = "depositBAYC";
      break;
    case 2:
      functionName = "depositMAYC";
      break;
    case 3:
      functionName = "depositBAKC";
      break;
  }

  const totalAmount =
    poolID === 0
      ? args.reduce((partialSum, arg) => partialSum.add(arg), ethers.constants.Zero)
      : args.reduce((partialSum, arg) => partialSum.add(arg[0].amount), ethers.constants.Zero);
  const needsNewAllowance = apeCoinAllowance.gte(totalAmount);

  const allAboveZero = args.every((arg) => {
    const aboveZero =
      poolID === 0
        ? arg.gte(ethers.BigNumber.from(1))
        : arg[0].amount.gte(ethers.BigNumber.from(1));
    return aboveZero;
  });

  const { config } = usePrepareContractWrite({
    enabled: isConnected && allAboveZero && needsNewAllowance,
    address: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
    abi: ABI,
    functionName: functionName,
    args: args,
  });

  // console.log("config", config);

  const contractWrite = useContractWrite(config);

  // console.log("contractWrite", contractWrite.write);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess: () => {
      refetch();
    },
  });

  // if (contractWrite.isError) {
  //   return <>{contractWrite.error}</>;
  // }

  if (contractWrite.isLoading) {
    return (
      <button disabled className="border px-2 ml-2 disabled:text-gray-400">
        CHECK WALLET
      </button>
    );
  }

  if (waitForTransaction.isLoading) {
    return (
      <a
        className="border px-2 ml-2"
        target={"_blank"}
        href={`https://goerli.etherscan.io/tx/${contractWrite.data?.hash}`}
      >
        ETHERSCAN &#8618;
      </a>
    );
  }

  return (
    <>
      {/* <ConfirmDeposit
        open={confirmOpen}
        setOpen={setConfirmOpen}
        amount={amount}
        apeCoinAllowance={apeCoinAllowance}
      /> */}

      <button
        className="border px-2"
        onClick={() => {
          // setConfirmOpen(true);
          contractWrite.write?.();
        }}
      >
        DEPOSIT
      </button>
    </>
  );
}
