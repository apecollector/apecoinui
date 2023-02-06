"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import { formatUnits } from "ethers/lib/utils.js";

import usePrice from "@/hooks/usePrice";

import { Allowance } from "./Allowance";
import { TotalStaked } from "./TotalStaked";
import { UnclaimedRewards } from "./UnclaimedRewards";
import { StatsAddressInput } from "./StatsAddressInput";

interface StakingInfoProps {}

export const StakingInfo = (props: StakingInfoProps) => {
  const { address } = useAccount();
  const pathname = usePathname();
  const { apecoinPrice } = usePrice();
  const [statsAddress, setStatsAddress] = useState<string>("");
  useEffect(() => {
    if (address) {
      setStatsAddress(address);
    }
  }, [address]);

  const apecoinPriceNumber = apecoinPrice && +formatUnits(apecoinPrice, 8);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {pathname?.includes("/stake") ? <Allowance /> : null}
      {pathname?.includes("/data") ? (
        <StatsAddressInput
          statsAddress={statsAddress}
          setStatsAddress={setStatsAddress}
        />
      ) : null}
      <TotalStaked
        apecoinPriceNumber={apecoinPriceNumber}
        connectedAddress={address}
        statsAddress={statsAddress}
      />
      <UnclaimedRewards
        apecoinPriceNumber={apecoinPriceNumber}
        connectedAddress={address}
        statsAddress={statsAddress}
      />
    </div>
  );
};
