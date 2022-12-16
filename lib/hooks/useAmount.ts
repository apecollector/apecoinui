import useStore from "@/stores/store";

const useAmount = () => {
  const amount = useStore((state) => state.amount);
  const setAmount = useStore((state) => state.setAmount);
  return { amount, setAmount };
};

export default useAmount;
