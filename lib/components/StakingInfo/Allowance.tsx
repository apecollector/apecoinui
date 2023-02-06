"use client";

import { useState } from "react";
import { BigNumber, ethers } from "ethers";
import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import ABI from "@/abis/apecoin";
import {
  StakingContractAddresses,
  ApecoinContractAddresses,
} from "@/types/constants";
import useAllowance from "@/hooks/useAllowance";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";

const getAllowanceToDisplay = (allowance: BigNumber | undefined) => {
  if (!allowance) {
    return "";
  }

  return +formatUnits(allowance?.toString()!) >= 1e9
    ? "Unlimited"
    : formatUnits(allowance?.toString()!);
};

export const Allowance = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { allowance } = useAllowance();
  const [inputValue, setInputValue] = useState("");

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: ApecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, StakingContractAddresses[chain?.id || 1]],
  });

  const isSetAllowanceButtonEnabled =
    inputValue.toLowerCase() === "unlimited" ||
    (inputValue !== "" &&
      !isNaN(Number(inputValue)) &&
      BigNumber.from(Number(inputValue))._isBigNumber);

  const { config } = usePrepareContractWrite({
    enabled:
      isConnected &&
      allowanceContractRead.isSuccess &&
      isSetAllowanceButtonEnabled,
    address: ApecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "approve",
    args: [
      StakingContractAddresses[chain?.id || 1],
      inputValue.toLowerCase() === "unlimited" || !isSetAllowanceButtonEnabled
        ? ethers.constants.MaxUint256
        : parseUnits(inputValue),
    ],
  });

  const contractWrite = useContractWrite({ ...config });

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    confirmations: 2,
    onSuccess() {
      allowanceContractRead.refetch();
      contractWrite.reset();
      setInputValue("");
    },
  });

  return (
    <div
      className={`block border border-zinc-200 bg-white p-4
          dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
    >
      <h5 className="mb-2 text-xl font-bold tracking-tight">
        Apecoin Allowance
      </h5>
      <div>
        Current:{" "}
        <span className="font-bold">{getAllowanceToDisplay(allowance)}</span>
      </div>
      <div className="my-3 flex justify-between">
        <input
          placeholder="Allowance amount"
          className="w-4/5 border px-2 dark:border-zinc-500 dark:bg-zinc-800"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="w-1/5" onClick={() => setInputValue("Unlimited")}>
          MAX
        </button>
        <button className="w-1/5" onClick={() => setInputValue("")}>
          CLEAR
        </button>
      </div>
      <button
        className="w-full border px-2 hover:border-zinc-500 disabled:text-gray-400 disabled:hover:cursor-not-allowed dark:border-zinc-500 dark:bg-zinc-800 dark:hover:border-zinc-300"
        disabled={
          !isSetAllowanceButtonEnabled ||
          contractWrite.isLoading ||
          waitForTransaction.isFetching ||
          waitForTransaction.isLoading
        }
        onClick={() => {
          contractWrite.write?.();
        }}
      >
        Set Allowance
      </button>
    </div>
  );
};
