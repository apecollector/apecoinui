import { Dispatch, SetStateAction } from "react";
import useAllStakes from "@/hooks/useAllStakes";

interface StatsAddressInputProps {
  statsAddress?: string;
  setStatsAddress: Dispatch<SetStateAction<string>>;
}

export const StatsAddressInput = (props: StatsAddressInputProps) => {
  const { statsAddress, setStatsAddress } = props;
  const { poolsContractRead: allStakes } = useAllStakes(statsAddress!);

  return (
    <div
      className={`block border border-zinc-200 bg-white p-4
  dark:border-zinc-700 dark:bg-zinc-900 sm:max-w-sm`}
    >
      <h5 className="mb-2 text-xl font-bold tracking-tight">Address or ENS:</h5>
      <input
        spellCheck="false"
        className="w-full border px-1 text-xs dark:border-zinc-500 dark:bg-zinc-800"
        value={statsAddress}
        placeholder={"enter address or ens name"}
        onChange={(e) => setStatsAddress(e.target.value)}
      />
      {statsAddress &&
        allStakes.isError &&
        allStakes.error &&
        "Invalid address or ENS name"}
    </div>
  );
};
