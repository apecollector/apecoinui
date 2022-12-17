import { useState, useEffect } from "react";

export default function useCountdown() {
  const [mounted, setMounted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const d = new Date();
      const m = 59 - d.getMinutes();
      const s = 59 - d.getSeconds();
      setSeconds(s);
      setMinutes(m);
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
