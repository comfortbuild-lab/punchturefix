"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Puncture? Fixed in 30 mins.",
    desc: "On-the-spot tube patching, tyre replacement, wheel balancing. Starting from ₹299.",
    icon: "🛞",
    tag: "Most Booked 🔥",
    size: "large",
  },
  {
    title: "Engine oil. Brakes. Done at home.",
    desc: "Oil changes, brake service, battery replacement, AC gas top-up — all at your parking spot. Starting from ₹799.",
    icon: "🔧",
    tag: "",
    size: "small",
  },
  {
    title: "Car Break-down & Towing.",
    desc: "24/7 emergency roadside assistance. Towing, jumpstart, and priority repair. Reaches you in ~20 mins.",
    icon: "🚨",
    tag: "Emergency 🆘",
    size: "small",
  },
];

export default function ServiceGrid() {
  return (
    <section id="services" className="py-24 bg-[var(--dark)]">
      <div className="container-custom">
        <h2 className="text-5xl md:text-7xl text-center mb-16 leading-tight">
          Everything Your Car Needs.<br />
          <span className="text-[var(--primary)]">At Your Doorstep.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:grid-rows-2 h-auto lg:min-h-[800px]">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`bg-[var(--surface)] p-12 rounded-[40px] border border-[var(--border)] relative flex flex-col justify-end group transition-colors hover:border-[var(--primary)] ${
                service.size === "large" ? "lg:col-span-2 lg:row-span-2" : "lg:col-span-1 lg:row-span-1"
              }`}
            >
              {service.tag && (
                <div className="absolute top-8 right-8 bg-[var(--accent)] text-[var(--dark)] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {service.tag}
                </div>
              )}
              <div className="text-6xl mb-8 group-hover:scale-110 transition-transform">{service.icon}</div>
              <h3 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{service.title}</h3>
              <p className="text-[var(--muted)] mb-8 text-lg font-medium">{service.desc}</p>
              <a href="#book" className="accent-font text-[var(--primary)] font-bold tracking-widest hover:underline decoration-2 underline-offset-8">
                Book Now &rarr;
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
