"use client";
import { useState } from "react";
import { bookingApi } from "@/lib/api";

const SERVICES = [
  { id: "puncture",  label: "Puncture Repair",     emoji: "🔧",  price: "₹149" },
  { id: "wash",      label: "Car Wash",             emoji: "🚗",  price: "₹299" },
  { id: "oil",       label: "Oil Change",           emoji: "⚙️",  price: "₹799" },
  { id: "battery",   label: "Battery Replace",      emoji: "🔋",  price: "₹999" },
  { id: "towing",    label: "Breakdown & Towing",   emoji: "🚨",  price: "₹499" },
  { id: "selfwash",  label: "Self-Wash Bay (30min)","emoji": "🪣", price: "₹99" },
];

export default function BookingWidgetConnected() {
  const [service, setService]   = useState("");
  const [address, setAddress]   = useState("");
  const [phone, setPhone]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState<{ id: string; status: string } | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const handleBook = async () => {
    if (!service || !address) return alert("Please select a service and enter your address.");
    setLoading(true); setError(null);
    try {
      const booking = await bookingApi.createOnDemand({
        serviceCategoryId: service,
        lat: 12.9716, lng: 77.5946,  // Default to Bangalore; replace with real geolocation
        address,
      });
      setResult(booking.booking);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="bg-[#1A1A1A] border border-emerald-500/40 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-emerald-400 mb-1">Booking Created!</h3>
        <p className="text-gray-400 text-sm mb-3">Searching for nearest provider...</p>
        <p className="font-mono text-xs text-gray-500">ID: #{result.id?.slice(0,8).toUpperCase()}</p>
        <p className="text-xs text-gray-500 mt-1 capitalize">Status: <span className="text-[#FF6B00]">{result.status}</span></p>
        <button onClick={() => setResult(null)} className="mt-4 text-xs text-gray-400 hover:text-white underline">
          Book another service
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#2A2A2A] rounded-2xl p-6 space-y-4">
      <h3 className="font-bold text-sm uppercase tracking-wider text-[#FF6B00]">Book a Service</h3>

      {/* Service selector */}
      <div className="grid grid-cols-2 gap-2">
        {SERVICES.map(s => (
          <button key={s.id} onClick={() => setService(s.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs border transition-all ${service === s.id ? "border-[#FF6B00] bg-[#FF6B00]/10 text-white" : "border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]/50"}`}>
            <span>{s.emoji}</span>
            <span className="flex-1 font-medium">{s.label}</span>
            <span className="text-[#FF6B00] font-bold">{s.price}</span>
          </button>
        ))}
      </div>

      {/* Address */}
      <input
        placeholder="📍 Enter your address or use GPS"
        value={address}
        onChange={e => setAddress(e.target.value)}
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#FF6B00] transition-colors"
      />

      {/* Phone */}
      <input
        placeholder="📱 Your phone number (+91...)"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-[#FF6B00] transition-colors"
      />

      {error && <p className="text-red-400 text-xs">⚠️ {error}</p>}

      <button
        onClick={handleBook}
        disabled={loading}
        className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors"
      >
        {loading ? "Finding Provider..." : "🔧 Book Now — Connect to API"}
      </button>

      <p className="text-[10px] text-gray-600 text-center">
        Connected to <span className="text-[#FF6B00]">localhost:5000</span> · No payment required to book
      </p>
    </div>
  );
}
