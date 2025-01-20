import React, { forwardRef } from "react";
import * as Headless from "@headlessui/react";
import Link from "next/link";
import { VariantProps } from "cva";
import { cn, cva } from "@/utils/cva";
import clsx from "clsx";
import { Spinner } from "@/components/primitives/Spinner";

export const buttonStyle = cva({
  base: clsx(
    "shrink-0 relative whitespace-nowrap select-none overflow-clip",
    "inline-flex items-center justify-center gap-1.5",
    "text-sm font-medium shadow-xs transition fv-style",
    "disabled:opacity-40 enabled:cursor-pointer",
    "h-(--button-height) active:scale-98 rounded-full",
  ),
  variants: {
    variant: {
      primary: clsx(
        "bg-gradient-to-b from-orange-600 to-orange-700",
        "dark:from-orange-700 dark:to-orange-800",
        "hover:saturate-150",
        "text-white shadow-[inset_0px_0.5px_0px_rgb(255_255_255_/_0.4)]",
        "border-transparent",
        // "dark:focus-visible:ring-zinc-500",
      ),
      outline: clsx(
        "border default-border-color",
        "hover:!border-zinc-300 hover:bg-zinc-200/50",
        "dark:hover:!border-zinc-600/80 dark:hover:bg-zinc-600/20",
        // "dark:focus-visible:ring-zinc-500",
      ),
      ghost: clsx(
        "border-transparent default-border-color dark:hover:bg-zinc-600/20",
        "dark:text-zinc-200",
        // "dark:focus-visible:ring-zinc-500",
      ),
      destructive: "bg-red-600 text-white ring-red-600/50 hover:bg-red-700",
    },
    size: {
      xs: "px-2 [--button-height:theme(spacing.6)]",
      sm: "px-3 [--button-height:theme(spacing.8)]",
      md: "px-4 [--button-height:theme(spacing.10)]",
    },
    square: {
      true: "w-(--button-height) px-0",
      false: "",
    },
  },
  defaultVariants: {
    variant: "outline",
    size: "sm",
  },
});

interface BaseButtonProps extends VariantProps<typeof buttonStyle> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

type ButtonProps = BaseButtonProps &
  (
    | Omit<Headless.ButtonProps, "as" | "className">
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
  );

export const Button = forwardRef(function Button(
  {
    children,
    className,
    variant,
    size,
    square,
    isLoading,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  const classes = cn(
    buttonStyle({ variant, size, square, className }),
    isLoading && "text-transparent",
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>{children}</TouchTarget>
      {isLoading && <LoadingSpinner size={size} />}
    </Link>
  ) : (
    <Headless.Button
      {...props}
      className={cn(classes, "cursor-default")}
      ref={ref}
    >
      <TouchTarget>{children}</TouchTarget>
      {isLoading && <LoadingSpinner size={size} />}
    </Headless.Button>
  );
});

function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}

function LoadingSpinner({
  size,
}: {
  size?: VariantProps<typeof buttonStyle>["size"];
}) {
  return (
    <span
      data-button-spinner
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-current"
    >
      <Spinner size={size} />
    </span>
  );
}
