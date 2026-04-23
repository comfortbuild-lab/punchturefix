"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, PageHeader } from "@/components/dashboard/DashboardUI";
import { MapPin, Phone, CheckCircle2, XCircle, Play, Navigation } from "lucide-react";
import { providerApi } from "@/lib/api";

export default function ProviderJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await providerApi.getJobs();
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "blue";
      case "pending": return "yellow";
      case "completed": return "green";
      default: return "gray";
    }
  };

  return (
    <DashboardLayout role="provider">
      <PageHeader title="My Jobs" subtitle="Manage all incoming and completed service requests" />

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["All Jobs", "Pending", "Active", "Completed"].map((t, i) => (
          <button key={t} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${i === 0 ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]"}`}>{t}</button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-gray-500">Loading your jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center text-gray-500 bg-[#111] rounded-3xl border border-dashed border-[#222]">
             <p>No active jobs found.</p>
             <p className="text-xs mt-2 uppercase tracking-widest text-[#FF6B00]/50 font-bold">Go online to receive new requests</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className={`bg-[#1A1A1A] border rounded-2xl p-5 transition-all ${job.status === "PENDING" ? "border-yellow-500/40" : job.status === "ASSIGNED" ? "border-[#FF6B00]/40" : "border-[#2A2A2A]"}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${job.status === "COMPLETED" ? "bg-emerald-500/15" : "bg-[#FF6B00]/15"}`}>
                    {job.status === "COMPLETED" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Play className="w-5 h-5 text-[#FF6B00]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">{job.customer?.user?.name || "Customer"}</span>
                      <Badge label={job.status} color={getStatusColor(job.status.toLowerCase()) as any} />
                    </div>
                    <p className="text-sm text-gray-400">{job.serviceCategory?.name || "General Service"}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 text-[#FF6B00]" />
                      <span className="hover:text-[var(--primary)] transition-colors">{job.locationAddress}</span>
                    </div>
                    {job.locationLat && (
                      <button 
                        onClick={() => handleNavigate(job.locationLat, job.locationLng)}
                        className="flex items-center gap-2 mt-2 text-[10px] text-[#FF6B00] font-black uppercase tracking-widest hover:underline"
                      >
                        <Navigation className="w-3 h-3" /> Open in Google Maps
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="text-right">
                    <span className="text-xl font-bold text-emerald-400">₹{job.totalAmount}</span>
                    <p className="text-[10px] text-gray-500">Earn: ₹{job.providerPayout}</p>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">#{job.id.slice(0,8).toUpperCase()} • {new Date(job.createdAt).toLocaleTimeString()}</span>
                  <div className="flex gap-2">
                    {job.status === "PENDING" && (
                       <button className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald-600 transition-colors">Accept Job</button>
                    )}
                    {job.status === "ASSIGNED" && (
                       <button className="bg-[#FF6B00] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#e56100] transition-colors">Start Service</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
