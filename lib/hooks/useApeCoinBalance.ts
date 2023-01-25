import { useAccount, useBalance, useNetwork } from "wagmi";
import { useEffect } from "react";

import useStore from "@/stores/store";
import { ApecoinContractAddresses } from "../types/constants";

const useApeCoinBalance = () => {
  const apeCoinBalance = useStore((state) => state.apeCoinBalance);
  const setApeCoinBalance = useStore((state) => state.setApeCoinBalance);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({
    enabled: isConnected,
    address: address,
    token: ApecoinContractAddresses[chain?.id!] as `0x{String}`,
    watch: true,
  });

  useEffect(() => {
    if (balance.data) {
      setApeCoinBalance(balance.data.value);
    }
  }, [balance.isSuccess, balance.isRefetching, balance.data]);

  useEffect(() => {
    if (!isConnected) {
      setApeCoinBalance(undefined);
    }
  }, [isConnected]);

  return { apeCoinBalance, setApeCoinBalance };
};

export default useApeCoinBalance;
