"use client";

import { motion } from "framer-motion";

type TraitMeterProps = {
  label: string;
  value: number;
  delay?: number;
};

export function TraitMeter({ label, value, delay = 0 }: TraitMeterProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="text-slate-300">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-700/40">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300"
        />
      </div>
    </div>
  );
}
