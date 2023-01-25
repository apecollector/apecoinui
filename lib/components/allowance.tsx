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
import {
  StakingContractAddresses,
  ApecoinContractAddresses,
} from "@/types/constants";

export default function Allowance() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: ApecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "allowance",
    args: [address as `0x${string}`, StakingContractAddresses[chain?.id || 1]],
  });

  const { config } = usePrepareContractWrite({
    enabled: isConnected && allowanceContractRead.isSuccess,
    address: ApecoinContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "approve",
    args: [
      StakingContractAddresses[chain?.id || 1],
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
