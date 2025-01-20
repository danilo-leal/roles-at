import * as React from "react";
import clsx from "clsx";

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
          <span className="hidden sm:inline-flex gap-0.5">
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <span className="opacity-60">Single-purpose Software</span>
            <span className="opacity-50">&nbsp;/&nbsp;</span>
            <span className="opacity-60">Made by designers</span>
          </span>
        </p>
        {/* <IconsSocial /> */}
      </div>
    </footer>
  );
}
