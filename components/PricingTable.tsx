"use client";

import { motion } from "framer-motion";

const prices = [
  { service: "Tyre Puncture (Tube/Tubeless)", price: "₹299" },
  { service: "Wheel Balancing (4 Wheels)", price: "₹599" },
  { service: "Full Car Wash + Vacuum", price: "₹499" },
  { service: "Engine Oil Change (Synth)", price: "₹1,899" },
  { service: "Brake Pad Replacement", price: "₹899" },
  { service: "Battery Jumpstart", price: "₹399" },
];

export default function PricingTable() {
  return (
    <section id="pricing" className="py-24 bg-[var(--dark)]">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl mb-4">Transparent Pricing.</h2>
          <p className="text-[var(--muted)] accent-font">No hidden fees · Fixed rates</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--primary)]">
                <th className="p-6 text-[var(--muted)] accent-font">Service Type</th>
                <th className="p-6 text-[var(--muted)] accent-font text-right">Starting From</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((item, i) => (
                <motion.tr
                  key={i}
                  whileHover={{ backgroundColor: "rgba(255, 92, 0, 0.05)" }}
                  className="border-b border-[#222]"
                >
                  <td className="p-6 text-xl font-medium">{item.service}</td>
                  <td className="p-6 text-xl font-black text-[var(--primary)] text-right">{item.price}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
