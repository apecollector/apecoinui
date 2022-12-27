"use client";

import { formatUnits } from "ethers/lib/utils.js";
import usePrice from "@/hooks/usePrice";
import useCountdown from "@/hooks/useCountdown";

export default function FixedData() {
  const { apecoinPrice, ethereumPrice } = usePrice();
  const { minutes, seconds, mounted } = useCountdown();

  return (
    <div className="fixed bottom-0 right-0 flex h-8 w-full items-center bg-zinc-100 text-sm uppercase dark:bg-black">
      <div className="container flex max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex gap-x-8">
          {apecoinPrice && (
            <span>
              APE:{" "}
              {Intl.NumberFormat("en-us", {
                maximumFractionDigits: 2,
                style: "currency",
                currency: "USD",
              }).format(+formatUnits(apecoinPrice, 8))}{" "}
            </span>
          )}

          {ethereumPrice && (
            <span>
              ETH:{" "}
              {Intl.NumberFormat("en-us", {
                maximumFractionDigits: 0,
                style: "currency",
                currency: "USD",
              }).format(+formatUnits(ethereumPrice, 8))}{" "}
            </span>
          )}
        </div>
        <div className="flex items-center gap-x-4">
          {mounted && (
            <>
              Staking Reward in{" "}
              {minutes === 0 && seconds === 0 ? (
                <>60M 00S</>
              ) : (
                <>
                  {minutes}M {seconds}S
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
