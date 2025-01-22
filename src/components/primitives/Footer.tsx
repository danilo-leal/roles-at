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
          "max-w-[740px] pt-1 pb-4 px-4 m-auto",
          "flex justify-between items-center",
        )}
      >
        <p className="text-xs">
          Roles.at © {currentYear}
          <span className="inline-flex gap-0.5">
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <span className="opacity-60">Single-purpose Software</span>
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <span className="opacity-60">Made by designers</span>
          </span>
        </p>
        <div className="text-xs inline-flex items-center gap-2">
          <Link className="">Contact Us</Link>
          <span className="opacity-50">&nbsp;/&nbsp;</span>
          <Link className="">Buy Us Coffee</Link>
        </div>
      </div>
    </footer>
  );
}
