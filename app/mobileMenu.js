import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function MobileMenu({ pages }) {
  const pathname = usePathname();
  return (
    <Menu as="div" className="mt-2">
      <div>
        <Menu.Button>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-10 top-1 z-10 mt-2 w-56 origin-top-right bg-white dark:bg-slate-900">
          <div className="py-1">
            {pages.map((page) => (
              <Menu.Item key={page.name}>
                <Link
                  href={page.pathname}
                  className={classNames(
                    pathname === page.pathname ? "" : "",
                    "block px-4 py-2 text-sm  "
                  )}
                >
                  {page.name}
                </Link>
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
