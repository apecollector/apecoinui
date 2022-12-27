"use client";

import { ethers } from "ethers";
import {
  useAccount,
  useNetwork,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import ABI from "@/abis/apecoin";
import { Map } from "@/types/map";

const apecoinContractAddresses: Map = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
};

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0xeF37717B1807a253c6D140Aca0141404D23c26D4",
};

export default function Allowance() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: apecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, stakingContractAddresses[chain?.id || 1]],
  });

  const { config } = usePrepareContractWrite({
    enabled: isConnected && allowanceContractRead.isSuccess,
    address: apecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "approve",
    args: [
      stakingContractAddresses[chain?.id || 1],
      ethers.constants.MaxUint256,
    ],
  });

  const contractWrite = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    confirmations: 2,
    onSuccess() {
      allowanceContractRead.refetch();
      contractWrite.reset();
    },
  });

  return (
    <>
      <button
        className="ml-2 border px-2 hover:border-gray-500 disabled:text-gray-400 disabled:hover:cursor-not-allowed dark:border-slate-500 dark:bg-slate-800  dark:hover:border-slate-300"
        disabled={
          contractWrite.isLoading ||
          waitForTransaction.isFetching ||
          waitForTransaction.isLoading
        }
        onClick={() => {
          contractWrite.write?.();
        }}
      >
        Approve ApeCoin Staking Unlimited Allowance
      </button>
    </>
  );
}
