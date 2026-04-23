"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Open App",
    desc: "Select your service and drop your location pin in seconds.",
    icon: "📱",
  },
  {
    num: "02",
    title: "We Dispatch",
    desc: "Nearest verified technician is assigned and arrives in ~30 mins.",
    icon: "🏎️",
  },
  {
    num: "03",
    title: "Done & Paid",
    desc: "Service completed, pay via UPI/cash, and rate your tech.",
    icon: "💳",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="container-custom">
        <h2 className="text-5xl md:text-7xl text-center mb-24">
          3 Steps. <span className="text-[var(--primary)]">Zero Hassle.</span>
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-[rgba(255,92,0,0.2)] z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 text-center"
            >
              <div className="font-bebas text-[10rem] leading-none absolute -top-12 left-1/2 -translate-x-1/2 opacity-[0.03] select-none text-[var(--primary)]">
                {step.num}
              </div>
              <div className="text-5xl mb-6">{step.icon}</div>
              <h4 className="text-3xl font-black mb-4">{step.title}</h4>
              <p className="text-[var(--muted)] text-lg px-8">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
