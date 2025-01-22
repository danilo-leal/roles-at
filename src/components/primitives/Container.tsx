import React from "react";
import clsx from "clsx";
import { motion } from "motion/react";
import { Footer } from "@/components/primitives/Footer";
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
      className={clsx("min-h-screen relative isolate flex flex-col", className)}
    >
      <MeshGradient
        color1="#fb923c"
        color2="#431407"
        speed={0.05}
        style={{
          position: "fixed",
          width: "100vw",
          height: 200,
          opacity: 0.05,
          zIndex: -1,
          maskImage: "linear-gradient(to bottom, #ffffffad, transparent",
        }}
      />
      <div className="max-w-[740px] size-full mx-auto mb-auto mt-0 px-4 flex flex-col pb-4">
        {children}
      </div>
      <MeshGradient
        color1="#fb923c"
        color2="#431407"
        speed={0.05}
        style={{
          position: "fixed",
          bottom: 0,
          width: "100vw",
          height: 200,
          opacity: 0.1,
          zIndex: -1,
          maskImage: "linear-gradient(to top, #ffffffad, transparent",
        }}
      />
      <Footer />
    </motion.div>
  );
}

export function ContainerTransition({
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
      className={className}
    >
      {children}
    </motion.div>
  );
}
