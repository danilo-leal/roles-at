import NextLink from "next/link";
import clsx from "clsx";

export const primaryDecorationStyles = clsx(
  "underline decoration-orange-600/20 hover:decoration-orange-700/20",
  "dark:decoration-orange-300/40 dark:hover:decoration-orange-400/40",
);

export function Link({
  href,
  children,
  title,
  className,
  ...rest
}: {
  href?: string;
  children?: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <NextLink
      className={clsx(
        "fv-style inline",
        "text-orange-800 dark:text-orange-300",
        "hover:text-orange-900 dark:hover:text-orange-400",
        primaryDecorationStyles,
        className,
      )}
      href={href || "#"}
      title={title}
      {...rest}
    >
      {children}
    </NextLink>
  );
}
