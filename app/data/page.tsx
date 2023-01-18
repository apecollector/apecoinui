import Events from "@/components/events";
import Data from "@/components/data";
import Calculator from "@/components/calculator";
import UserStaking from "@/components/userStaking";

export default async function Page() {
  return (
    <>
      <div>
        <UserStaking />
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold">Live staking data:</h3>
        <Data />
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold">Staking calculator:</h3>
        <Calculator />
      </div>

      {/* <div className="mt-10">
        <h3 className="text-3xl font-bold">Live staking activity:</h3>
        <Events />
      </div> */}
    </>
  );
}
