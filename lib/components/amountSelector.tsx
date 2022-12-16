import { useId } from "react";
import useAmount from "@/hooks/useAmount";
import { Amount } from "@/types/data";

const AmountSelector: React.FC<{ classNames?: string }> = () => {
  const { amount, setAmount } = useAmount();

  const dailyRadioID = useId();
  const hourlyRadioID = useId();
  const hourlyRadioName = useId();

  return (
    <div className="mb-4 flex gap-4">
      <div>Reward Amount:</div>
      <div className="flex items-center">
        <input
          type="radio"
          id={dailyRadioID}
          name={hourlyRadioName}
          checked={amount === Amount.PerApe}
          onChange={() => setAmount(Amount.PerApe)}
          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600"
        />
        <label htmlFor={dailyRadioID} className="ml-2">
          Per ApeCoin Staked
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={hourlyRadioID}
          name={hourlyRadioName}
          checked={amount === Amount.Max}
          onChange={() => setAmount(Amount.Max)}
          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600"
        />
        <label htmlFor={hourlyRadioID} className="ml-2">
          Max Stake
        </label>
      </div>
    </div>
  );
};

export default AmountSelector;
