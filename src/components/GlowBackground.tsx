"use client";

import { motion, useReducedMotion } from "framer-motion";

export function GlowBackground() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(129,140,248,0.24),transparent_25%),radial-gradient(circle_at_85%_18%,rgba(45,212,191,0.22),transparent_29%),radial-gradient(circle_at_50%_82%,rgba(168,85,247,0.24),transparent_35%)]" />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, 24, -16, 0],
                y: [0, -18, 10, 0],
                scale: [1, 1.06, 0.98, 1],
              }
        }
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-300/12 blur-[90px]"
      />

      <motion.div
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: [0, -24, 18, 0],
                y: [0, 16, -14, 0],
                scale: [1, 0.95, 1.08, 1],
              }
        }
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute bottom-[-10rem] right-[-8rem] h-[24rem] w-[24rem] rounded-full bg-violet-300/15 blur-[90px]"
      />

      <div className="mirrormind-particles absolute inset-0 opacity-60" />
    </div>
  );
}
