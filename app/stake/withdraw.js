"use client";

import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { ethers } from "ethers";

import ABI from "../../lib/abis/staking";

export default function Withdraw({ poolID, args, refetch }) {
  const { isConnected } = useAccount();

  let functionName;
  switch (poolID) {
    case 0:
      functionName = "withdrawSelfApeCoin";
      break;
    case 1:
      functionName = "withdrawSelfBAYC";
      break;
    case 2:
      functionName = "withdrawSelfMAYC";
      break;
    case 3:
      functionName = "withdrawSelfBAKC";
      break;
  }

  const totalAmount =
    poolID === 0
      ? args.reduce((partialSum, arg) => partialSum.add(arg), ethers.constants.Zero)
      : args.reduce((partialSum, arg) => partialSum.add(arg[0].amount), ethers.constants.Zero);

  const allAboveZero = args.every((arg) => {
    const aboveZero =
      poolID === 0
        ? arg.gte(ethers.BigNumber.from(1))
        : arg[0].amount.gte(ethers.BigNumber.from(1));
    return aboveZero;
  });

  const { config } = usePrepareContractWrite({
    enabled: isConnected && totalAmount.gt(0) && allAboveZero && args.length,
    address: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
    abi: ABI,
    functionName: functionName,
    args: args,
  });

  const contractWrite = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    onSuccess: () => {
      refetch();
    },
  });

  // if (contractWrite.isError) {
  //   return <>{contractWrite.error.reason}</>;
  // }

  if (contractWrite.isLoading) {
    return (
      <button disabled className="border px-2 disabled:text-gray-400">
        CHECK WALLET
      </button>
    );
  }

  if (waitForTransaction.isLoading || waitForTransaction.data?.status) {
    return (
      <a
        className="border px-2 ml-2"
        target={"_blank"}
        href={`https://goerli.etherscan.io/tx/${contractWrite.data?.hash}`}
      >
        ETHERSCAN
      </a>
    );
  }

  return (
    <button
      className="border px-2"
      onClick={() => {
        contractWrite.write?.();
      }}
    >
      WITHDRAW
    </button>
  );
}
