import { useAccount, useBalance, useNetwork } from "wagmi";
import { useEffect } from "react";

interface Map {
  [key: number]: string;
}
const apecoinContractAddresses: Map = {
  1: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  5: "0x6729F254aaB029a9B076CdDF97D5CbEe3859340d",
} as const;

import useStore from "@/stores/store";

const useApeCoinBalance = () => {
  const apeCoinBalance = useStore((state) => state.apeCoinBalance);
  const setApeCoinBalance = useStore((state) => state.setApeCoinBalance);

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const balance = useBalance({
    enabled: isConnected,
    address: address,
    token: apecoinContractAddresses[chain?.id!] as `0x{String}`,
    watch: true,
  });

  useEffect(() => {
    if (balance.data) {
      setApeCoinBalance(+balance.data.formatted);
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
