import Link from "next/link";

export default async function Page() {
  return (
    <>
      <div className="mt-10 text-4xl font-bold">ApeCoinUI</div>
      <p className="mt-4">An open-source alternative user interface for all things apecoin.</p>

      <ul className="mt-4 list-disc list-inside">
        <li>Check and change your apecoin contract allowances</li>
        <li>Manage staking and calculate rewards and other information</li>
        <li>Learn about apecoin token and the surronding ecosystem</li>
      </ul>

      <div className="mt-10 grid grid-cols-3 gap-4">
        <Link href="/data">
          <div className="p-4 hover:border-black border cursor-pointer">
            <h2 className="text-xl">Data</h2>
            <p className="text-sm">
              View live staking data, calculate how many ApeCoin you can stake and daily rewards.
            </p>
          </div>
        </Link>
        <Link href="/stake">
          <div className="p-4 hover:border-black border">
            <h2 className="text-xl">Stake (NOT LIVE YET)</h2>
            <p className="text-sm">
              Manage your staking positions, update or revoke staking contract apecoin allowance.
            </p>
          </div>
        </Link>
        <Link href="/faq">
          <div className="p-4 hover:border-black border">
            <h2 className="text-xl">FAQ</h2>
            <p className="text-sm">
              Answers to common questions around staking, apecoin and how to protect yourself.
            </p>
          </div>
        </Link>
      </div>
    </>
  );
}
