import * as React from "react";
import clsx from "clsx";
import { Link } from "@/components/primitives/Link";

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
          "flex flex-col sm:flex-row justify-center items-center gap-4",
        )}
      >
        <p className="text-xs text-center">
          Roles.at © {currentYear}
          <span className="inline gap-0.5">
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <Link href="/about">Made by designers</Link>
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <Link href="https://buy.stripe.com/8wM17b2ak1AN6YMcMM" className="">
              Buy Us Coffee
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
}
