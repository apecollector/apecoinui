import { useState, useEffect } from "react";

export default function useCountdown({ targetDate }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setMounted(true);
      setTimeLeft(new Date(targetDate).getTime() - new Date().getTime());
    }, 1000);
    return () => clearInterval(intervalId);
  }, [targetDate]);

  let seconds = Math.floor(timeLeft / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return {
    seconds,
    minutes,
    hours,
    mounted,
    pastTarget: timeLeft < 0
  };
}
