import { useId } from "react";
import useTimeframe from "@/hooks/useTimeframe";
import { TimeFrame } from "@/types/timeframe";

const TimeframeSelector: React.FC<{ classNames?: string }> = () => {
  const { timeframe: selectedTimeframe, setTimeframe: setSelectedTimeframe } =
    useTimeframe();

  const hourlyRadioID = useId();
  const hourlyRadioName = useId();

  const dailyRadioID = useId();
  const dailyRadioName = useId();

  const weeklyRadioID = useId();
  const weeklyRadioName = useId();

  const monthlyRadioID = useId();
  const monthlyRadioName = useId();

  return (
    <div className="mb-4 flex flex-wrap gap-4 text-sm">
      <div>Reward Timeframe:</div>
      <div className="flex items-center">
        <input
          type="radio"
          id={hourlyRadioID}
          name={hourlyRadioName}
          checked={selectedTimeframe === TimeFrame.Hourly}
          onChange={() => setSelectedTimeframe(TimeFrame.Hourly)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={hourlyRadioID} className="ml-2">
          Hourly
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={dailyRadioID}
          name={dailyRadioName}
          checked={selectedTimeframe === TimeFrame.Daily}
          onChange={() => setSelectedTimeframe(TimeFrame.Daily)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={dailyRadioID} className="ml-2">
          Daily
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={weeklyRadioID}
          name={weeklyRadioName}
          checked={selectedTimeframe === TimeFrame.Weekly}
          onChange={() => setSelectedTimeframe(TimeFrame.Weekly)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={weeklyRadioID} className="ml-2">
          Weekly
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id={monthlyRadioID}
          name={monthlyRadioName}
          checked={selectedTimeframe === TimeFrame.Monthly}
          onChange={() => setSelectedTimeframe(TimeFrame.Monthly)}
          className="h-3 w-3 border-zinc-300 bg-zinc-100 text-blue-600"
        />
        <label htmlFor={monthlyRadioID} className="ml-2">
          Monthly
        </label>
      </div>
    </div>
  );
};

export default TimeframeSelector;
