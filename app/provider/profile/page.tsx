"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader, Badge } from "@/components/dashboard/DashboardUI";
import { Camera, Save, Star, MapPin, Phone, Mail } from "lucide-react";

export default function ProviderProfile() {
  const [name, setName]       = useState("Rohan Auto Garage");
  const [bio, setBio]         = useState("Professional doorstep auto service with 5+ years of experience. Specializing in puncture repair, oil changes, and car wash.");
  const [phone, setPhone]     = useState("+91 98765 43210");
  const [email, setEmail]     = useState("rohan.garage@example.com");
  const [city, setCity]       = useState("Bengaluru");
  const [address, setAddress] = useState("HSR Layout, Sector 2, Bengaluru - 560102");
  const [saved, setSaved]     = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <DashboardLayout role="provider">
      <PageHeader
        title="My Profile"
        subtitle="Manage your public-facing business profile"
        action={
          <button onClick={save}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#FF6B00] hover:bg-orange-600 text-white"}`}>
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col items-center text-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-[#FF6B00] flex items-center justify-center text-white font-black text-3xl">R</div>
            <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#2A2A2A] border border-[#3A3A3A] rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h2 className="font-bold text-lg">{name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{city}</p>
          </div>
          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge label="APPROVED" color="green" />
            <Badge label="TOP RATED" color="orange" />
          </div>
          {/* Stats */}
          <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-[#2A2A2A]">
            {[{ v: "4.8", l: "Rating" }, { v: "124", l: "Jobs" }, { v: "98%", l: "Completion" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-bold text-[#FF6B00]">{s.v}</p>
                <p className="text-[10px] text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
          {/* Reviews */}
          <div className="w-full space-y-2 pt-2">
            {[{ name: "Ravi S.", rating: 5, text: "Super fast! Fixed in 15 mins." }, { name: "Priya M.", rating: 5, text: "Very professional service." }].map(r => (
              <div key={r.name} className="text-left bg-[#111] rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">{r.name}</span>
                  <span className="text-yellow-400 text-xs">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-xs text-gray-400">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-4">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Business Name", icon: null, value: name, setter: setName, type: "text" },
                { label: "City", icon: MapPin, value: city, setter: setCity, type: "text" },
                { label: "Phone", icon: Phone, value: phone, setter: setPhone, type: "tel" },
                { label: "Email", icon: Mail, value: email, setter: setEmail, type: "email" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block">{f.label}</label>
                  <div className="relative">
                    {f.icon && <f.icon className="absolute left-3 top-3 w-4 h-4 text-gray-500" />}
                    <input type={f.type} value={f.value} onChange={e => f.setter(e.target.value)}
                      className={`w-full bg-[#111] border border-[#2A2A2A] rounded-xl py-2.5 text-sm text-white outline-none focus:border-[#FF6B00] transition-colors ${f.icon ? "pl-10 pr-4" : "px-4"}`} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Full Address</label>
              <input value={address} onChange={e => setAddress(e.target.value)}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF6B00] transition-colors" />
            </div>
            <div className="mt-4">
              <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Business Description</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#FF6B00] transition-colors resize-none" />
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-4">Documents & Verification</h3>
            <div className="space-y-3">
              {[
                { label: "Aadhaar / PAN Card", status: "Verified" },
                { label: "GST Certificate",    status: "Verified" },
                { label: "Vehicle Insurance",  status: "Pending"  },
              ].map(d => (
                <div key={d.label} className="flex items-center justify-between p-3 bg-[#111] rounded-xl border border-[#2A2A2A]">
                  <span className="text-sm">{d.label}</span>
                  <div className="flex items-center gap-3">
                    <Badge label={d.status} color={d.status === "Verified" ? "green" : "yellow"} />
                    <button className="text-xs text-[#FF6B00] hover:underline">
                      {d.status === "Verified" ? "View" : "Upload →"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
