import Staking from "@/components/staking";

export default async function Page() {
  if (process.env.NEXT_PUBLIC_ENABLE_STAKE !== "TRUE") {
    return (
      <>
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 flex items-center text-4xl font-bold ">
              ApeCoin Staking{" "}
            </h1>
            <p className="mb-2">Alternative ApeCoin staking user interface. </p>
          </div>
        </div>
        <p className="mt-10">
          Not ready for the public, DM me for early access.
        </p>
        <p className="mt-2">
          Follow{" "}
          <a className="text-[#1da1f2]" href="https://twitter.com/ApeCollector">
            @ApeCollector
          </a>{" "}
          on twitter for announcements.
        </p>
      </>
    );
  }

  return <Staking />;
}
