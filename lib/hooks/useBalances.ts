import { useContractReads, useAccount, useNetwork } from "wagmi";
import { useEffect, useState } from "react";

import { Map } from "@/types/map";
import BalanceABI from "@/abis/balance";

const baycContractAddresses: Map = {
  1: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
  5: "0x9c4536F82bdDe595cF1F810309feE8a288aef89E",
} as const;

const maycContractAddresses: Map = {
  1: "0x60e4d786628fea6478f785a6d7e704777c86a7c6",
  5: "0x67d4266A52870879727EfFb903CE0030Fe86D6AC",
} as const;

const bakcContractAddresses: Map = {
  1: "0xba30e5f9bb24caa003e9f2f0497ad287fdf95623",
  5: "0xC84dE322c8403f8d8E2bAA3cB384A1e281664cF6",
} as const;

function useBalances(): {
  baycPoolStakable: number;
  maycPoolStakable: number;
  bakcPoolStakable: number;
} {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();

  const baycContract = {
    address: baycContractAddresses[chain?.id || 1],
    abi: BalanceABI,
  };

  const maycContract = {
    address: maycContractAddresses[chain?.id || 1],
    abi: BalanceABI,
  };

  const bakcContract = {
    address: bakcContractAddresses[chain?.id || 1],
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
