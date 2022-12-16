"use client";

import { useEffect } from "react";

export default function Error({ error }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1 className="mt-10 text-4xl font-bold">ApeCoinUI</h1>
      <p className="mt-4">Something went wrong!</p>
      <p className="mt-4">
        Please try refreshing the page or contacting{" "}
        <a className="text-[#1da1f2]" href="https://twitter.com/ApeCollector">
          @ApeCollector
        </a>{" "}
        on twitter.
      </p>
    </div>
  );
}
