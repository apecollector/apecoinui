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
import { useEffect, useState } from "react";
import { formatUnits, parseUnits } from "ethers/lib/utils.js";
import useStakingStore from "../store";
import ABI from "../../lib/abis/apecoin";
import { ConfirmAllowance } from "./modal";

const noLimitText = "No limit";

const apecoinContractAddresses = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x6729F254aaB029a9B076CdDF97D5CbEe3859340d",
};

const stakingContractAddresses = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0x8a98e5c8211d20c6c1c82c78c46f5a0528062881",
};

export default function Allowance({ setShowAllowanceUI }) {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: apecoinContractAddresses[chain?.id],
    abi: ABI,
    functionName: "allowance",
    args: [address, stakingContractAddresses[chain?.id]],
  });

  const apeCoinAllowance = useStakingStore((state) => state.apeCoinAllowance);
  const setApeCoinAllowance = useStakingStore((state) => state.setApeCoinAllowance);

  const allowanceAmount = formatUnits(apeCoinAllowance || 0);
  const approvedAmountString =
    apeCoinAllowance && apeCoinAllowance.eq(ethers.constants.MaxUint256)
      ? noLimitText
      : Math.round(allowanceAmount).toString();

  const [inputValueString, setInputValueString] = useState(approvedAmountString);
  const [inputValueBigNumber, setInputValueBigNumber] = useState(apeCoinAllowance);
  const [inputChanged, setInputChanged] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    setApeCoinAllowance(allowanceContractRead.data);
  }, [setApeCoinAllowance, allowanceContractRead.data]);

  useEffect(() => {
    setShowAllowanceUI(allowanceContractRead.isSuccess);
  }, [allowanceContractRead?.isSuccess]);

  useEffect(() => {
    setInputValueString(approvedAmountString);
  }, [approvedAmountString]);

  useEffect(() => {
    setInputValueBigNumber(apeCoinAllowance);
  }, [apeCoinAllowance]);

  useEffect(() => {
    setInputChanged(inputValueString !== approvedAmountString);
  }, [inputValueString]);

  const { config } = usePrepareContractWrite({
    enabled: isConnected && inputChanged && allowanceContractRead.isSuccess,
    address: "0x6729F254aaB029a9B076CdDF97D5CbEe3859340d",
    abi: ABI,
    functionName: "approve",
    args: ["0x8a98e5c8211d20c6c1c82c78c46f5a0528062881", inputValueBigNumber],
  });

  const contractWrite = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
    confirmations: 2,
    onSuccess() {
      allowanceContractRead.refetch();
      contractWrite.reset();
      setInputChanged(false);
      setConfirmOpen(false);
    },
  });

  return (
    <>
      <ConfirmAllowance
        open={confirmOpen}
        setOpen={setConfirmOpen}
        currentAllowance={approvedAmountString}
        newAllowance={
          inputValueBigNumber && inputValueBigNumber?.eq(ethers.constants.MaxUint256)
            ? noLimitText
            : formatUnits(inputValueBigNumber || 0)
        }
        contractWrite={contractWrite}
        waitForTransaction={waitForTransaction}
      />
      <input
        className="border pl-2 w-28"
        value={inputValueString}
        onFocus={(e) => {
          e.target.select();
        }}
        onChange={(e) => {
          const newValue = e.target.value;
          if (!isNaN(+newValue) && newValue != noLimitText && newValue != "") {
            setInputValueString(e.target.value);
            setInputValueBigNumber(parseUnits(e.target.value));
          }
          if (newValue === "") {
            setInputValueString("0");
            setInputValueBigNumber(parseUnits("0"));
          } else if (newValue === noLimitText) {
            setInputValueBigNumber(ethers.constants.MaxUint256);
          }
        }}
      />
      <button
        className="border px-2 ml-2 disabled:text-gray-400"
        disabled={inputValueString == 0 || inputValueString == ""}
        onClick={() => {
          setInputValueString("0");
          setInputValueBigNumber(parseUnits("0"));
        }}
      >
        MIN
      </button>

      <button
        className="border px-2 ml-2 disabled:text-gray-400"
        disabled={inputValueString == noLimitText}
        onClick={() => {
          setInputValueString(noLimitText);
          setInputValueBigNumber(ethers.constants.MaxUint256);
        }}
      >
        MAX
      </button>
      <button
        disabled={
          !inputChanged ||
          contractWrite.isLoading ||
          waitForTransaction.isFetching ||
          waitForTransaction.isLoading
        }
        className="border px-2 ml-2 disabled:text-gray-400"
        onClick={() => {
          setConfirmOpen(true);
        }}
      >
        UPDATE
      </button>
    </>
  );
}
