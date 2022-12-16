import useStore from "@/stores/store";

const useTimeframe = () => {
  const timeframe = useStore((state) => state.timeframe);
  const setTimeframe = useStore((state) => state.setTimeframe);
  return {timeframe, setTimeframe};
};

export default useTimeframe;
