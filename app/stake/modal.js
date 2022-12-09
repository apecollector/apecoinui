import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatUnits } from "ethers/lib/utils.js";

function Steps({ steps }) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4">
        {steps.map((step) => (
          <li key={step.name}>
            {step.status === "complete" ? (
              <>
                <span className="flex text-2xl font-medium items-center">{step.name}</span>
              </>
            ) : step.status === "current" ? (
              <span className="flex text-2xl font-medium items-center text-indigo-500">
                <>{step.name}</>
              </span>
            ) : (
              <>
                <span className="flex text-2xl font-medium items-center text-gray-500">
                  {step.name}
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ConfirmDeposit({ open, setOpen, amount, allowance }) {
  let steps = [];
  if (allowance && amount.gt(allowance)) {
    steps = [
      { id: "1", name: "Confirm ApeCoin Approval", href: "#", status: "current" },
      { id: "2", name: "Confirm Staking Deposit", href: "#", status: "remaining" },
    ];
  } else {
    steps = [{ id: "1", name: "Confirm Staking Deposit", href: "#", status: "current" }];
  }

  const cancelButtonRef = useRef(null);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="">
                    <Steps steps={steps} />
                    {/* <Dialog.Title
                      as="h3"
                      className="text-2xl  text-center  font-medium leading-6 text-gray-900"
                    >
                      Confirm Staking Allowance
                    </Dialog.Title> */}
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        In order to deposit you must give the staking contract approval to use your
                        ApeCoin. This is done through an on-chain transaction to the ApeCoin
                        contract's approve function. You can choose to allow the exact amount needed
                        for this deposit or an unlimited amount to prevent further approvals in the
                        future.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Set Unlimited
                    <br />
                    ApeCoin Allowance
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Set {Math.round(formatUnits(amount))}
                    <br />
                    ApeCoin Allowance
                  </button>
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:text-sm"
                  onClick={() => setOpen(false)}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function ConfirmAllowance({ open, setOpen, currentAllowance, newAllowance, contractWrite }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="flex justify-between items-center">
                    <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-gray-900">
                      Confirm Staking Allowance
                    </Dialog.Title>
                    <button
                      className="p-2 rounded-2xl text-gray-300 hover:text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 13L13 1"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        ></path>
                        <path
                          d="M1 0.999999L13 13"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
                {contractWrite.isLoading || contractWrite.isSuccess ? (
                  <div className="pt-4">
                    {contractWrite.isLoading && <>Finish transaction in wallet...</>}
                    {contractWrite.isSuccess && (
                      <>
                        Waiting for{" "}
                        <a
                          className="text-blue-600"
                          href={`https://goerli.etherscan.io/tx/${contractWrite.data.hash}`}
                          target="_blank"
                        >
                          blockchain confirmation
                        </a>
                        ...
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mt-4">
                      <p className="text-md text-gray-500">Current allowance: {currentAllowance}</p>
                      <p className="text-md text-gray-500">Set new allowance: {newAllowance}</p>
                    </div>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:text-sm"
                      onClick={() => {
                        contractWrite.write();
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
