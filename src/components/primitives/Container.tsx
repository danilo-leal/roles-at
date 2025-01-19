import React from "react";
import clsx from "clsx";
import { motion } from "motion/react";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={clsx("min-h-screen relative flex flex-col", className)}
    >
      {/* <div className="fixed left-1/2 top-0 ml-[-80rem] h-[16rem] sm:h-[24rem] w-[200rem] dark:[mask-image:linear-gradient(white,transparent)] z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFA057]/20 to-[#F76B15]/20 opacity-20 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#9a3412]/20 dark:to-[#9C330C]/30 dark:opacity-70" />
      </div> */}
      <div className="z-10 max-w-[740px] size-full mx-auto mb-auto mt-0 px-4 flex flex-col pb-4">
        {children}
      </div>
    </motion.div>
  );
}
