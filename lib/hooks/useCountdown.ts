import { useState, useEffect } from "react";

export default function useCountdown() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const m = 60 - d.getMinutes();
      const s = 60 - d.getSeconds();
      setSeconds(s == 60 ? 0 : s);
      setMinutes(s === 0 ? m : m - 1);
      setMounted(true);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return {
    seconds,
    minutes,
    mounted,
  };
}
