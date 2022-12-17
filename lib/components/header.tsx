import Link from "next/link";
import ConnectButton from "@/components/connectButton";
import FixedData from "./fixedData";

export default function Header() {
  const pages = [
    { name: "Home", pathname: "/" },
    { name: "Data", pathname: "/data" },
    { name: "Stake", pathname: "/stake" },
    { name: "FAQ", pathname: "/faq" },
  ];

  return (
    <>
      <FixedData />
      <div className="flex h-8 items-center justify-between gap-x-4">
        <div className="flex gap-x-4">
          {pages.map((page) => (
            <Link
              shallow={true}
              key={page.name}
              className={"hover:text-black hover:dark:text-white"}
              href={page.pathname}
            >
              {page.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-x-4">
          <ConnectButton />
        </div>
      </div>
    </>
  );
}
