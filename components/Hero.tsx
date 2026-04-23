"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header className="relative min-h-[90vh] flex items-center overflow-hidden bg-[radial-gradient(circle_at_70%_30%,rgba(255,92,0,0.1)_0%,transparent_50%)]">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_100px,var(--primary)_100px,var(--primary)_200px)] animate-pulse" />
      </div>

      <div className="container-custom relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="accent-font inline-flex items-center gap-2 bg-[rgba(255,92,0,0.1)] text-[var(--primary)] px-4 py-2 rounded-full border border-[var(--border)] mb-8">
            <span>⚡</span> Avg. 28-min response time
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.85] mb-8">
            Car Trouble?<br />
            We Come To <span className="text-[var(--primary)]">YOU.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted)] max-w-[600px] mb-10 font-medium">
            Doorstep tyre repair, car service & wash — anywhere in Bangalore. In 30 minutes or less.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#book" className="btn btn-primary">Book Repair Now</a>
            <a href="#wash" className="btn btn-outline">Schedule a Wash</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 10 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hidden md:flex justify-end perspective-[1000px]"
        >
          <div className="w-[300px] h-[600px] bg-[var(--surface)] rounded-[40px] border-[8px] border-[#222] relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden animate-float">
             <div className="p-8">
                <div className="accent-font text-lg mb-8">P-WALA</div>
                <div className="bg-[#252525] p-6 rounded-[20px] border border-[var(--border)]">
                  <div className="accent-font text-[10px] text-[var(--muted)]">SELECT SERVICE</div>
                  <div className="h-10 bg-[#333] my-4 rounded-xl" />
                  <div className="h-10 bg-[#333] mb-4 rounded-xl" />
                  <div className="btn btn-primary w-full !py-3 !text-sm">FIND TECHNICIAN</div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
