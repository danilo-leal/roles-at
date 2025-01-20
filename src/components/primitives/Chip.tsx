import React from "react";
import clsx from "clsx";

const chipColorStyle = {
  orange:
    "bg-orange-50 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-700/50 dark:text-orange-300",
  red: "bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-300",
  blue: "bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-700/50 dark:text-blue-300",
  green:
    "bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-300",
  zinc: "bg-zinc-50 text-zinc-800 border border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-700/50 dark:text-zinc-200",
};

const textTransform = {
  uppercase: "uppercase",
  none: "none",
};

const textSize = {
  normal: "text-[0.6875rem]", // 11px
  small: "text-[0.59375rem]", // 9.5px
};

const letterTransform = {
  medium: "tracking-[2px]",
  small: "tracking-[0.2px]",
};

const fontWeight = {
  bold: "font-bold",
  semibold: "font-semibold",
};

type ChipProps = {
  children: React.ReactNode;
  color?: keyof typeof chipColorStyle;
  text?: keyof typeof textTransform;
  size?: keyof typeof textSize;
  tracking?: keyof typeof letterTransform;
  weight?: keyof typeof fontWeight;
  className?: string;
};

export function Chip({
  children,
  color = "orange",
  text = "none",
  size = "normal",
  tracking = "small",
  weight = "semibold",
  className,
}: ChipProps) {
  const computedClassName = clsx(
    "px-1.5 py-[3px] w-fit",
    "inline-flex items-center shrink-0 grow-0",
    "rounded-full transition-all",
    "focus:outline-none leading-none",
    chipColorStyle[color],
    textTransform[text],
    textSize[size],
    letterTransform[tracking],
    fontWeight[weight],
    className,
  );

  return <div className={computedClassName}>{children}</div>;
}
