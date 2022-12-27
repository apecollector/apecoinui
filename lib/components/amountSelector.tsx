import { useId } from "react";
import useAmount from "@/hooks/useAmount";
import { Amount } from "@/types/data";

const AmountSelector: React.FC<{ classNames?: string }> = () => {
  const { amount, setAmount } = useAmount();

  const perRadioID = useId();
  const maxRadioID = useId();
  const perRadioName = useId();
  const maxRadioName = useId();

  return (
    <div className="mb-4 flex flex-wrap gap-4 text-sm">
      <div>Reward Amount:</div>
      <div className="flex items-center">
        <input
          type="radio"
          id={perRadioID}
          name={perRadioName}
          checked={amount === Amount.PerApe}
          onChange={() => setAmount(Amount.PerApe)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={perRadioID} className="ml-2">
          Per ApeCoin
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={maxRadioID}
          name={maxRadioName}
          checked={amount === Amount.Max}
          onChange={() => setAmount(Amount.Max)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={maxRadioID} className="ml-2">
          Max Stake
        </label>
      </div>
    </div>
  );
};

export default AmountSelector;
