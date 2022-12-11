import Link from "next/link";
import Countdown from "./countdown";
import Events from "./events";

export default async function Page() {
  return (
    <>
      <div className="mt-10 text-4xl font-bold">ApeCoinUI</div>
      <p className="mt-4">An open-source alternative user interface for all things apecoin.</p>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <Link
          shallow={true}
          href="/data"
          className={`block sm:max-w-sm p-6 bg-white border border-gray-200 
          hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">Data</h5>
          <p className="text-gray-700 dark:text-gray-400">
            Live staking data next to how many ApeCoin you can stake and daily rewards.
          </p>
        </Link>
        <Link
          shallow={true}
          href="/stake"
          className={`block sm:max-w-sm p-6 bg-white border border-gray-200 
          hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">
            Stake{" "}
            <span className="bg-red-100 text-red-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">
              NOT READY
            </span>
          </h5>
          <p className="text-gray-700 dark:text-gray-400">
            Manage your staking positions and staking contract apecoin allowance.
          </p>
        </Link>
        <Link
          shallow={true}
          href="/faq"
          className={`block sm:max-w-sm p-6 bg-white border border-gray-200 
          hover:bg-gray-100 dark:bg-gray-900 dark:border-gray-700 dark:hover:bg-gray-800`}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight">FAQ</h5>
          <p className="text-gray-700 dark:text-gray-400">
            Answers to common questions around staking, apecoin and how to protect yourself.
          </p>
        </Link>
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold">Staking Rewards Countdown:</h3>
        <div className="mt-5">
          <Countdown targetDate={1670864400000} />
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold">Live staking activity:</h3>
        <Events />
      </div>

      {/* <div className="mt-10 p-4 bg-white md:p-8 dark:bg-gray-800">
        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">73M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Staked</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">100M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Public repositories</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">1000s</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Open source projects</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">1B+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Contributors</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">90+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Top Forbes companies</dd>
          </div>
          <div className="flex flex-col items-center justify-center">
            <dt className="mb-2 text-3xl font-extrabold">4M+</dt>
            <dd className="font-light text-gray-500 dark:text-gray-400">Organizations</dd>
          </div>
        </dl>
      </div> */}
    </>
  );
}
