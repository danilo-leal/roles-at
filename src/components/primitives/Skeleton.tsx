import { cn } from "@/utils/cva";

export const Skeleton = ({
  className,
  ...props
}: React.ComponentPropsWithRef<"div">) => {
  return (
    <div
      className={cn("dark:bg-zinc-800/10 animate-pulse rounded-md", className)}
      {...props}
    />
  );
};
