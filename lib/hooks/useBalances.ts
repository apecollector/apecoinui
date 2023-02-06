import { useContractReads, useAccount, useNetwork } from "wagmi";
import { useEffect, useState } from "react";

import BalanceABI from "@/abis/balance";
import {
  BakcContractAddresses,
  BaycContractAddresses,
  MaycContractAddresses,
} from "@/types/constants";

function useBalances(): {
  baycPoolStakable: number;
  maycPoolStakable: number;
  bakcPoolStakable: number;
} {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  const baycContract = {
    address: BaycContractAddresses[chain?.id || 1],
    abi: BalanceABI,
  };

  const maycContract = {
    address: MaycContractAddresses[chain?.id || 1],
    abi: BalanceABI,
  };

  const bakcContract = {
    address: BakcContractAddresses[chain?.id || 1],
    abi: BalanceABI,
  };

  const { data, isSuccess, isRefetching } = useContractReads({
    enabled: isConnected,
    watch: true,
    contracts: [
      {
        ...baycContract,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        ...maycContract,
        functionName: "balanceOf",
        args: [address!],
      },
      {
        ...bakcContract,
        functionName: "balanceOf",
        args: [address!],
      },
    ],
  });

  const [baycPoolStakable, setBaycPoolStakable] = useState(0);
  const [maycPoolStakable, setMaycPoolStakable] = useState(0);
  const [bakcPoolStakable, setBakcPoolStakable] = useState(0);

  useEffect(() => {
    if (isSuccess && data) {
      setBaycPoolStakable(data?.[0]?.toNumber() || 0);
      setMaycPoolStakable(data?.[1]?.toNumber() || 0);
      setBakcPoolStakable(data?.[2]?.toNumber() || 0);
    }
  }, [address, isSuccess, data, isRefetching]);

  return { baycPoolStakable, maycPoolStakable, bakcPoolStakable };
}

export default useBalances;
