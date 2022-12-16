import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";

import PriceABI from "@/abis/price";
import { BigNumber } from "ethers";

export default function usePrice() {
  const [apecoinPrice, setApecoinPrice] = useState<BigNumber>();

  const priceContractRead = useContractRead({
    address: "0xD10aBbC76679a20055E167BB80A24ac851b37056",
    abi: PriceABI,
    functionName: "latestRoundData",
    watch: true,
    chainId: 1,
  });

  useEffect(() => {
    if (
      priceContractRead &&
      priceContractRead.data &&
      priceContractRead.isSuccess
    ) {
      setApecoinPrice(priceContractRead.data.answer);
    }
  }, [
    priceContractRead.isSuccess,
    priceContractRead.isRefetching,
    priceContractRead.data,
  ]);

  return apecoinPrice;
}
