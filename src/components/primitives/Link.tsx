import { AnchorHTMLAttributes } from "react";
import NextLink from "next/link";
import clsx from "clsx";
import { ArrowUpRight } from "lucide-react";

export const primaryDecorationStyles = clsx(
  "underline decoration-orange-600/20 hover:decoration-orange-700/20",
  "dark:decoration-orange-300/40 dark:hover:decoration-orange-400/40",
);

export const externalLinkStyles = clsx(
  "group relative inline cursor-pointer transition-all rounded-md",
);

export function Link({
  href,
  children,
  className,
  external = false,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href?: string;
  children?: React.ReactNode;
  external?: boolean;
}) {
  return (
    <NextLink
      className={clsx(
        "fv-style inline",
        "text-orange-800 dark:text-orange-300",
        "hover:text-orange-900 dark:hover:text-orange-400",
        primaryDecorationStyles,
        external && externalLinkStyles,
        className,
      )}
      href={href || "#"}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {children}
      {external && (
        <ArrowUpRight className="inline-block ml-0.5 size-3 group-hover:-translate-y-0.5 transition-transform" />
      )}
    </NextLink>
  );
}
