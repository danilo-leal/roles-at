import clsx from "clsx";

export function Kbd({ char }: { char: string }) {
  return (
    <kbd
      className={clsx(
        "hidden sm:flex",
        "items-center justify-center",
        "size-3.5 p-0.5 rounded-sm",
        "font-mono font-bold text-[10px]",
        "bg-zinc-100 dark:bg-zinc-900",
        "border border-zinc-300 dark:border-zinc-600/50",
      )}
    >
      {char}
    </kbd>
  );
}
