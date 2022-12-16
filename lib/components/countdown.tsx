"use client";

import useCountdown from "@/hooks/useCountdown";

function padTo2Digits(num: number) {
  return num.toString().padStart(2, "0");
}

export default function Countdown() {
  const { minutes, seconds, mounted } = useCountdown();

  if (!mounted)
    return (
      <div className="mt-4 text-zinc-600 dark:text-zinc-400">
        Getting reward timestamp from contract...
      </div>
    );

  return (
    <div className="mt-4">
      Next reward in{" "}
      <span className="font-medium text-zinc-900 dark:text-white">
        {padTo2Digits(minutes)} minutes {padTo2Digits(seconds)} seconds
      </span>{" "}
      from now
    </div>
  );
}
