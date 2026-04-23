"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, ArrowRight, Check, Car, Fuel, Calendar, Loader2 } from "lucide-react";

const providers = [
  { name: "Acko", price: "₹2,199", speed: "Instant", score: "4.8" },
  { name: "Digit", price: "₹2,350", speed: "5 Mins", score: "4.7" },
  { name: "HDFC ERGO", price: "₹2,800", speed: "Cashless", score: "4.9" },
];

export default function InsuranceSection() {
  const [regNo, setRegNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState<null | {
    model: string;
    fuel: string;
    year: string;
    owner: string;
  }>(null);
  const [showQuotes, setShowQuotes] = useState(false);

  const handleSearch = async () => {
    if (!regNo.trim()) return;
    
    setLoading(true);
    setVehicleDetails(null);
    setShowQuotes(false);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data based on registration number
    if (regNo.toUpperCase().includes("KA01")) {
      setVehicleDetails({
        model: "Tata Nexon EV",
        fuel: "Electric",
        year: "2022",
        owner: "Mukul ****",
      });
    } else if (regNo.toUpperCase().includes("DL01")) {
      setVehicleDetails({
        model: "Mahindra XUV700",
        fuel: "Diesel",
        year: "2023",
        owner: "Rahul ****",
      });
    } else {
      setVehicleDetails({
        model: "Maruti Swift",
        fuel: "Petrol",
        year: "2021",
        owner: "Guest ****",
      });
    }

    setLoading(false);
    
    // Show quotes after a brief delay for effect
    setTimeout(() => setShowQuotes(true), 800);
  };

  return (
    <section id="insurance" className="py-24 overflow-hidden bg-[radial-gradient(circle_at_100%_0%,rgba(255,92,0,0.03)_0%,transparent_40%)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4 mb-8">
               <Shield className="w-8 h-8 text-[var(--primary)]" />
               <h2 className="text-5xl md:text-7xl leading-none font-black uppercase">Smart <span className="text-[var(--primary)]">Insurance.</span></h2>
            </div>
            <p className="text-[var(--muted)] text-lg mb-10">
              Save up to 40% on car & bike premiums. Compare top Indian insurers and get your policy in under 2 minutes. Absolutely paperless.
            </p>
            <div className="space-y-4 mb-12">
               {["Lowest Premium Guarantee", "24/7 Claims Assistance", "Zero Paperwork"].map((f, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="bg-[var(--primary)]/10 p-1 rounded-full">
                     <Check className="w-4 h-4 text-[var(--primary)]" />
                   </div>
                   <span className="font-bold text-sm uppercase tracking-wider accent-font">{f}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-[var(--surface)] p-8 md:p-12 rounded-[48px] border border-[var(--border)] relative shadow-2xl overflow-hidden">
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex gap-4">
                  <button className="bg-[var(--primary)] text-[var(--dark)] px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider">Car</button>
                  <button className="bg-transparent border border-[#333] px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity">Bike</button>
               </div>
               <div className="relative flex-1 w-full">
                  <input 
                    type="text" 
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter Reg No. (e.g. KA01HA...)" 
                    className="w-full bg-[var(--dark)] border border-[#333] px-6 py-3 rounded-2xl outline-none focus:border-[var(--primary)] transition-all uppercase placeholder:capitalize font-bold tracking-widest text-[#FF6B00]"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary)] p-2 rounded-xl text-[var(--dark)] hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  </button>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {vehicleDetails ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-10 p-6 bg-[var(--dark)] border border-[var(--primary)]/30 rounded-3xl"
                >
                  <p className="text-[var(--primary)] text-[10px] uppercase font-bold tracking-[0.2em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                    Vehicle Identified
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Car className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Model</span>
                      </div>
                      <p className="font-black text-sm text-[var(--off-white)]">{vehicleDetails.model}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Fuel className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Fuel</span>
                      </div>
                      <p className="font-black text-sm text-[var(--off-white)]">{vehicleDetails.fuel}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[var(--muted)]">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Year</span>
                      </div>
                      <p className="font-black text-sm text-[var(--off-white)]">{vehicleDetails.year}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="inline-flex items-center gap-2 text-[var(--muted)]">
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Owner</span>
                      </div>
                      <p className="font-black text-sm text-[var(--off-white)]">{vehicleDetails.owner}</p>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {showQuotes && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-between items-center px-2 mb-2">
                    <p className="text-[10px] uppercase font-black text-[var(--muted)] tracking-widest">Recommended Quotes</p>
                    <p className="text-[10px] text-[var(--primary)] font-bold">Sort by Lowest Price</p>
                  </div>
                  {providers.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10, borderColor: "var(--primary)" }}
                      className="flex items-center justify-between p-6 bg-[var(--dark)] border border-[#222] rounded-3xl cursor-pointer group transition-all"
                    >
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xl italic text-[var(--primary)] group-hover:scale-110 transition-transform">{p.name[0]}</div>
                          <div>
                             <p className="font-black text-xl leading-none">{p.name}</p>
                             <p className="text-[var(--muted)] text-[10px] accent-font mt-1">⭐ {p.score} Rating</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[var(--primary)] font-black text-2xl">{p.price}</p>
                          <p className="text-[var(--muted)] text-[10px] uppercase tracking-tighter underline group-hover:text-[var(--off-white)]">View Details</p>
                       </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {!vehicleDetails && !loading && (
              <div className="h-[300px] flex flex-col items-center justify-center text-center p-8 opacity-30 select-none">
                <Shield className="w-16 h-16 mb-4 text-[#333]" />
                <p className="font-bold text-sm uppercase tracking-widest text-[#444]">Enter your vehicle number <br/> to get instant quotes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
