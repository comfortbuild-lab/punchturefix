"use client";

import { motion } from "framer-motion";

const items = [
  "✅ Background-checked technicians",
  "🔧 30-day service warranty",
  "💳 UPI / Cards / Cash",
  "📍 Live GPS tracking",
  "⭐ 4.8 rated service",
  "🚗 50,000+ cars served",
];

export default function TrustTicker() {
  return (
    <div className="bg-[var(--primary)] py-6 overflow-hidden relative border-y border-[rgba(0,0,0,0.1)]">
      <motion.div
        animate={{ x: "-50%" }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-4 text-[var(--dark)] font-black uppercase text-lg mx-12"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
