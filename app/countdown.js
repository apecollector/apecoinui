"use client";

import useCountdown from "../lib/hooks/useCountdown";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export default function Countdown(targetDate) {
  const { mounted, hours, minutes, seconds, pastTarget } = useCountdown(targetDate);

  if (!mounted) return <>Getting initial reward timestamp from contract...</>;

  if (pastTarget) {
    return (
      <>
        Staking rewards started in{" "}
        <span className="font-medium text-gray-900 dark:text-white">
          {padTo2Digits(hours)} hours {padTo2Digits(minutes)} minutes {padTo2Digits(seconds)}{" "}
          seconds
        </span>{" "}
        ago
      </>
    );
  }

  return (
    <>
      Staking rewards begin in{" "}
      <span className="font-medium text-gray-900 dark:text-white">
        {padTo2Digits(hours)} hours {padTo2Digits(minutes)} minutes {padTo2Digits(seconds)} seconds
      </span>{" "}
      from now
    </>
  );
}
