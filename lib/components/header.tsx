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
      <div className="absolute top-0 right-0 flex h-8 w-full bg-blue-100 text-sm text-blue-700  dark:bg-blue-200 dark:text-blue-800">
        <div className="container flex max-w-6xl items-center justify-center px-4 md:px-8">
          <div className="flex gap-x-8">
            <a href="https://snapshot.org/#/apecoin.eth/proposal/0x0fb1d66dc79f164290a485fa2227c6e086dab1a87257db8139a4de4c27892c9c">
              <span className="font-medium ">
                ApeCoin DAO – Special Council Elections - Term Beginning January
                2023
              </span>{" "}
              Voting ends on Dec 28
            </a>
          </div>
        </div>
      </div>

      <FixedData />
      <div className="mt-8 flex h-8 items-center justify-between gap-x-4">
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
