"use client";

import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Clock, BookOpen, ShieldCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

const valueProps = [
  {
    title: "High Earnings",
    desc: "Earn up to ₹40k - ₹60k per month with consistent service leads.",
    icon: <DollarSign className="w-8 h-8 text-[var(--primary)]" />,
  },
  {
    title: "Flexible Hours",
    desc: "Choose your own shifts. Work when you want, where you want.",
    icon: <Clock className="w-8 h-8 text-[var(--primary)]" />,
  },
  {
    title: "Free Training",
    desc: "Get certified in modern EV repair and advanced diagnostics.",
    icon: <BookOpen className="w-8 h-8 text-[var(--primary)]" />,
  },
  {
    title: "Insurance Cover",
    desc: "Accidental and health insurance for you and your family.",
    icon: <ShieldCheck className="w-8 h-8 text-[var(--primary)]" />,
  },
];

const faqs = [
  { q: "What are the requirements to join?", a: "You need a valid background check, basic tools, and a smartphone." },
  { q: "How often do I get paid?", a: "Payouts are processed every Tuesday directly to your bank account." },
  { q: "Do I need my own garage?", a: "No, you can join as a mobile technician or link your existing garage." },
];

export default function PartnershipPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Partner Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-[var(--dark)]">
         <div className="container-custom relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
               <h1 className="text-6xl md:text-9xl mb-8">Built for <span className="text-[var(--primary)]">Mechanics.</span></h1>
               <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 uppercase tracking-widest accent-font">
                 Join India's fastest growing doorstep service network.
               </p>
               <a href="#register" className="btn btn-primary px-12 py-5 text-xl">Apply to Partner &rarr;</a>
            </motion.div>
         </div>
      </section>

      {/* Value Grid */}
      <section className="py-24 bg-[var(--surface)]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-[var(--dark)] border border-[var(--border)]"
              >
                <div className="mb-6">{prop.icon}</div>
                <h3 className="text-2xl mb-4 font-black">{prop.title}</h3>
                <p className="text-[var(--muted)] text-sm">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container-custom max-w-3xl">
          <h2 className="text-5xl mb-12 text-center">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-[var(--border)] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center bg-[var(--surface)]"
                >
                  <span className="font-bold">{faq.q}</span>
                  <ChevronDown className={`transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="bg-[var(--dark)] px-6 py-4 text-[var(--muted)]"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Mock Form */}
      <section id="register" className="py-24 bg-gradient-to-t from-[rgba(255,92,0,0.1)] to-transparent">
        <div className="container-custom max-w-xl">
          <div className="bg-[var(--surface)] p-10 rounded-[40px] border border-[var(--primary)] shadow-2xl">
            <h2 className="text-4xl mb-8 text-center">Onboarding Form</h2>
            <div className="space-y-6">
              <input type="text" placeholder="Full Name" className="w-full bg-[var(--dark)] border border-[#333] p-4 rounded-xl outline-none focus:border-[var(--primary)] transition-all" />
              <input type="tel" placeholder="Mobile Number" className="w-full bg-[var(--dark)] border border-[#333] p-4 rounded-xl outline-none focus:border-[var(--primary)] transition-all" />
              <select className="w-full bg-[var(--dark)] border border-[#333] p-4 rounded-xl outline-none focus:border-[var(--primary)] transition-all appearance-none text-[var(--muted)]">
                <option>Select Your Expertise</option>
                <option>Tyre/Puncture Expert</option>
                <option>Engine Mechanic</option>
                <option>Garage Owner</option>
              </select>
              <button className="btn btn-primary w-full py-5 text-lg">Submit Application &rarr;</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
