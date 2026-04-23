"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Standard",
    price: "₹499",
    period: "quarterly",
    features: ["1 Full Wash / Month", "Free Puncture Fixes", "24/7 Support", "GPS Tracking"],
    popular: false,
  },
  {
    name: "Fleet Pro",
    price: "₹1,299",
    period: "monthly",
    features: ["3 Full Washes / Month", "Priority Mechanic", "Oil Top-up Included", "Fleet Dashboard"],
    popular: true,
  },
  {
    name: "Elite Care",
    price: "₹4,999",
    period: "annually",
    features: ["Unlimited Washes", "Full Annual Service", "Engine Diagnostics", "Personal Manager"],
    popular: false,
  },
];

export default function SubscriptionPlans() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <h2 className="text-5xl md:text-7xl text-center mb-16">PUNCTUREfix Pass.</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-[40px] border border-[var(--border)] relative bg-[var(--surface)] flex flex-col ${
                plan.popular ? "border-[var(--primary)] scale-105 bg-gradient-to-br from-[var(--surface)] to-[#252525]" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-[var(--dark)] px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Best Value
                </div>
              )}
              <div className="mb-10">
                <h3 className="text-2xl font-black mb-4">{plan.name}</h3>
                <div className="text-5xl font-bebas text-[var(--primary)]">
                  {plan.price}<span className="text-sm text-[var(--muted)] font-sans">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-[var(--off-white)]">
                    <Check className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`btn w-full ${plan.popular ? "btn-primary" : "btn-outline"}`}>
                Get The Pass
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
