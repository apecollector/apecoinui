import { useAccount, useContractRead, useNetwork } from "wagmi";
import ApeCoinABI from "@/abis/apecoin";
import { Map } from "@/types/map";

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0xeF37717B1807a253c6D140Aca0141404D23c26D4",
} as const;

const apecoinContractAddresses: Map = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x328507DC29C95c170B56a1b3A758eB7a9E73455c",
} as const;

function useAllowance() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: apecoinContractAddresses[chain?.id || 1],
    abi: ApeCoinABI,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      stakingContractAddresses[chain?.id || 1] as `0x${string}`,
    ],
  });

  return allowanceContractRead;
}

export default useAllowance;
