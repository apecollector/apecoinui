import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";

import PriceABI from "@/abis/price";
import { BigNumber } from "ethers";

export default function usePrice() {
  const [apecoinPrice, setApecoinPrice] = useState<BigNumber>();

  const apecoinPriceContractRead = useContractRead({
    address: "0xD10aBbC76679a20055E167BB80A24ac851b37056",
    abi: PriceABI,
    functionName: "latestRoundData",
    watch: true,
    chainId: 1,
  });

  useEffect(() => {
    if (
      apecoinPriceContractRead &&
      apecoinPriceContractRead.data &&
      apecoinPriceContractRead.isSuccess
    ) {
      setApecoinPrice(apecoinPriceContractRead.data.answer);
    }
  }, [
    apecoinPriceContractRead.isSuccess,
    apecoinPriceContractRead.isRefetching,
    apecoinPriceContractRead.data,
  ]);

  const [ethereumPrice, setEthereumPrice] = useState<BigNumber>();

  const ethereumPriceContractRead = useContractRead({
    address: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
    abi: PriceABI,
    functionName: "latestRoundData",
    watch: true,
    chainId: 1,
  });

  useEffect(() => {
    if (
      ethereumPriceContractRead &&
      ethereumPriceContractRead.data &&
      ethereumPriceContractRead.isSuccess
    ) {
      setEthereumPrice(ethereumPriceContractRead.data.answer);
    }
  }, [
    ethereumPriceContractRead.isSuccess,
    ethereumPriceContractRead.isRefetching,
    ethereumPriceContractRead.data,
  ]);

  return { apecoinPrice, ethereumPrice };
}
