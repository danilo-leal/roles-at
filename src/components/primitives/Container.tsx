import React from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { MeshGradient } from "@paper-design/shaders-react";

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
      <MeshGradient
        color1="#fb923c"
        color2="#431407"
        speed={0.05}
        style={{
          position: "fixed",
          width: "100vw",
          height: 200,
          opacity: 0.1,
          zIndex: 1,
          maskImage: "linear-gradient(to bottom, #ffffffad, transparent",
        }}
      />
      <div className="z-10 max-w-[740px] size-full mx-auto mb-auto mt-0 px-4 flex flex-col pb-4">
        {children}
      </div>
    </motion.div>
  );
}

export function ContainerTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
