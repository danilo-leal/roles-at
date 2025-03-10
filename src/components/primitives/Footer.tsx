import * as React from "react";
import clsx from "clsx";
import { Link } from "@/components/primitives/Link";
import { Logo } from "@/components/primitives/Navbar";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        "mt-8 pt-4 pb-16 sm:pb-0 w-full",
        "border-t border-gray-200 dark:border-gray-600/20",
      )}
    >
      <div
        className={clsx(
          "max-w-[740px] pt-1 pb-6 px-4 m-auto",
          "flex justify-center items-center gap-1",
        )}
      >
        <Logo className="size-3.5 opacity-80" />
        <p className="text-xs text-center">
          roles.at © {currentYear}
          <span className="inline gap-0.5">
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <Link href="/about">Made by Designers</Link>
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <Link href="https://buy.stripe.com/8wM17b2ak1AN6YMcMM" className="">
              Support Us
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
}
