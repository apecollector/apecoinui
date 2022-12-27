"use client";

import ABI from "@/abis/staking";
import useAllStakes, { poolStakesData } from "@/hooks/useAllStakes";
import { Map } from "@/types/map";
import {
  CheckCircleIcon,
  ClockIcon,
  WalletIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { BigNumber, ethers } from "ethers";
import { Modal } from "flowbite-react";
import { Dispatch, useEffect, useState } from "react";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

const stakingContractAddresses: Map = {
  1: "0x5954aB967Bc958940b7EB73ee84797Dc8a2AFbb9",
  5: "0xeF37717B1807a253c6D140Aca0141404D23c26D4",
} as const;

function displayApeCoin(apecoin: BigNumber | number): string {
  return Intl.NumberFormat("en-US", {
    maximumFractionDigits: 4,
  }).format(+ethers.utils.formatUnits(apecoin));
}

const ClaimApeCoin = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { apeCoinStakes } = useAllStakes(address as string);

  const apeCoinPrepareContractWrite = usePrepareContractWrite({
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfApeCoin",
  });

  const apeCoinContractWrite = useContractWrite(
    apeCoinPrepareContractWrite.config
  );

  useEffect(() => {
    apeCoinContractWrite.write?.();
  }, []);

  if (!apeCoinStakes) return <>No apecoin</>;
  return (
    <>
      Claim {displayApeCoin(apeCoinStakes[0].unclaimed)} from ApeCoin Pool{" "}
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
      <a
        href=""
        className="text-sm text-green-800 hover:underline dark:text-green-400"
      >
        View Tx
      </a>
    </>
  );
};

const ClaimBayc = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { baycStakes } = useAllStakes(address as string);

  const [state, setState] = useState<string>();

  const args = baycStakes
    ?.map((token) => {
      if (token.unclaimed?.gt(0)) {
        return token.tokenId.toNumber();
      }
    })
    .filter((token) => {
      return token !== undefined;
    });

  const baycPrepareContractWrite = usePrepareContractWrite({
    address: stakingContractAddresses[chain?.id || 1],
    abi: ABI,
    functionName: "claimSelfBAYC",
    args: [args as any],
  });

  const baycContractWrite = useContractWrite(baycPrepareContractWrite.config);

  const baycPoolUnclaimed =
    baycStakes?.reduce((total, token) => {
      return total.add(token.unclaimed);
    }, ethers.constants.Zero) || 0;

//   useEffect(() => {
//     if (state !== "started") {
//       if (baycContractWrite.write) {
//         setState("started");
//         baycContractWrite.write();
//       }
//     }
//   }, [baycContractWrite.write]);

  if (!baycStakes) return <>No bayc rewards</>;
  return (
    <>
      Claim {displayApeCoin(baycPoolUnclaimed)} from BAYC Pool{" "}
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
      <a
        href=""
        className="text-sm text-green-800 hover:underline dark:text-green-400"
      >
        View Tx
      </a>
    </>
  );
};

const ClaimAllModal: React.FC<{
  show: boolean;
  setShow: Dispatch<boolean>;
  address: string;
}> = ({ show, setShow }) => {
  const onClose = () => {
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onClose={onClose}>
        <Modal.Header>Claim All Rewards</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm">
              To claim all your ApeCoin staking rewards you will need to create
              3 separate transactions from your wallet which should have opened
              automatically. If it did not open please check it manually.
            </p>

            <ol className="gap-y-4">
              <li className="flex items-center gap-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                <ClaimApeCoin />
              </li>

              <li className="flex items-center gap-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                <ClaimBayc />
              </li>
              {/* 1) Claim {displayApeCoin(apeCoinPoolUnclaimed)} from ApeCoin
                Pool <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <a
                  href=""
                  className="text-sm text-green-800 hover:underline dark:text-green-400"
                >
                  View Tx
                </a>
              </li>

              <li className="flex items-center gap-2 py-1 text-sm text-gray-500 dark:text-gray-400">
                1) Claim {displayApeCoin(baycPoolUnclaimed)} from ApeCoin Pool{" "}
                <XCircleIcon className="h-5 w-5 text-red-800 dark:text-red-500" />{" "}
                <span className="text-sm text-red-900 dark:text-red-400">
                  Rejected
                </span>
              </li>
              <li className="flex items-center gap-2 py-1 text-sm">
                2) Claim {displayApeCoin(baycPoolUnclaimed)} from BAYC Pool{" "}
                <WalletIcon className="h-5 w-5" />{" "}
                <span className="text-sms">Confirm</span>
              </li>
              <li className="flex items-center gap-2 py-1 text-sm">
                2) Claim {displayApeCoin(maycPoolUnclaimed)} from MAYC Pool{" "}
                <WalletIcon className="h-5 w-5" />{" "}
                <span className="text-sms">Confirm</span>
              </li>
              <li className="flex items-center gap-2 py-1 text-sm">
                2) Claim {displayApeCoin(baycPoolUnclaimed)} from BAYC Pool{" "}
                <ClockIcon className="h-5 w-5  text-blue-800 hover:underline dark:text-blue-500" />
                <a
                  href=""
                  className="text-sm text-blue-800 hover:underline dark:text-blue-400"
                >
                  View Tx
                </a>
              </li>
              <li className="flex items-center py-1 text-sm text-gray-500 dark:text-gray-400">
                3) Claim {displayApeCoin(bakcPoolUnclaimed)} from BAKC Pool{" "}
              </li> */}
            </ol>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ClaimAllModal;
