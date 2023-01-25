import Link from "next/link";
import Events from "@/components/events";
import Countdown from "@/components/countdown";

export default async function Page() {
  return (
    <>
      <h1 className="text-4xl font-bold">ApeCoinUI</h1>
      <p className="mt-4">
        An open-source alternative user interface for all things apecoin.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          shallow={true}
          href="/data"
          className={`block border border-zinc-200 bg-white p-6 hover:bg-zinc-100
          dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">Data</h5>
          <p className="text-zinc-700 dark:text-zinc-400">
            Live staking data next to how many ApeCoin you can stake and daily
            rewards.
          </p>
        </Link>
        <Link
          shallow={true}
          href="/stake"
          className={`block border border-zinc-200 bg-white p-6 hover:bg-zinc-100
          dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">
            Stake{" "}
            <span className="mr-2 rounded bg-yellow-200 px-2.5 py-0.5 text-sm font-semibold text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900">
              BETA
            </span>
          </h5>
          <p className="text-zinc-700 dark:text-zinc-400">
            Manage your staking positions and staking contract apecoin
            allowance.
          </p>
        </Link>
        <Link
          shallow={true}
          href="/faq"
          className={`block border border-zinc-200 bg-white p-6 hover:bg-zinc-100
          dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 sm:max-w-sm`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">FAQ</h5>
          <p className="text-zinc-700 dark:text-zinc-400">
            Answers to common questions around staking, apecoin and how to
            protect yourself.
          </p>
        </Link>
      </div>

      {/* <div className="mt-10">
        <h3 className="text-3xl font-bold">Live Staking Activity:</h3>
        <Events />
      </div> */}
    </>
  );
}
