import { useState, useEffect } from "react";
import { useContractRead } from "wagmi";

import PriceABI from "../../lib/abis/price";

export default function usePrice() {
  const [apecoinPrice, setApecoinPrice] = useState(null);

  const priceContractRead = useContractRead({
    address: "0xD10aBbC76679a20055E167BB80A24ac851b37056",
    abi: PriceABI,
    functionName: "latestRoundData",
    watch: true,
    chainId: 1,
  });

  useEffect(() => {
    if (priceContractRead.isSuccess) {
      setApecoinPrice(priceContractRead.data.answer);
    }
  }, [priceContractRead.isSuccess, priceContractRead.isRefetching, priceContractRead.data]);

  return apecoinPrice;
}
