"use client";

import { motion } from "framer-motion";
import { Phone, Truck, AlertTriangle } from "lucide-react";

export default function EmergencySection() {
  return (
    <section id="emergency" className="py-24 bg-[#B91C1C]">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[rgba(0,0,0,0.2)] p-12 rounded-[40px] border border-[rgba(255,255,255,0.1)] backdrop-blur-xl">
          <div className="max-w-[600px]">
             <div className="flex items-center gap-4 mb-6">
               <AlertTriangle className="w-10 h-10 text-[var(--accent)] animate-pulse" />
               <span className="accent-font text-xl text-[var(--off-white)]">Emergency Breakdown?</span>
             </div>
             <h2 className="text-5xl md:text-8xl mb-8 text-white">Car Stuck? <span className="text-[var(--accent)]">Fixed in 20.</span></h2>
             <p className="text-white/80 text-xl leading-relaxed mb-10">
               India's fastest roadside assistance. Flat tyre, engine stall, or need a tow? We reach you in under 20 mins across major cities.
             </p>
             <div className="flex flex-col sm:flex-row gap-6">
                <a href="tel:+911800200300" className="btn bg-white text-[#B91C1C] text-xl px-12 group flex items-center justify-center gap-3">
                  <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
                  1800-200-300
                </a>
                <button className="btn bg-black text-white text-xl px-12 flex items-center justify-center gap-3">
                  <Truck className="w-6 h-6" /> 
                  Request Towing
                </button>
             </div>
          </div>
          
          <motion.div 
            initial={{ rotate: 10, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: 5, scale: 1, opacity: 1 }}
            className="hidden lg:block relative"
          >
             <div className="w-[400px] h-[300px] bg-[var(--dark)] rounded-3xl border-4 border-white/20 overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent" />
                <div className="p-8">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-mono uppercase tracking-widest text-white/50">Tracking Nearby Techs...</span>
                   </div>
                   <div className="space-y-4">
                      <div className="h-2 w-3/4 bg-white/10 rounded" />
                      <div className="h-2 w-1/2 bg-white/10 rounded" />
                      <div className="h-2 w-full bg-white/10 rounded" />
                   </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-[200px] flex items-center justify-center opacity-20">
                   <Truck className="w-40 h-40 text-white" />
                </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
