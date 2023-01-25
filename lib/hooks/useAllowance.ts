import { useAccount, useContractRead, useNetwork } from "wagmi";
import ApeCoinABI from "@/abis/apecoin";
import {
  StakingContractAddresses,
  ApecoinContractAddresses,
} from "@/types/constants";

function useAllowance() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const allowanceContractRead = useContractRead({
    enabled: address !== undefined,
    address: ApecoinContractAddresses[chain?.id || 1],
    abi: ApeCoinABI,
    functionName: "allowance",
    args: [
      address as `0x${string}`,
      StakingContractAddresses[chain?.id || 1] as `0x${string}`,
    ],
  });

  return allowanceContractRead;
}

export default useAllowance;
