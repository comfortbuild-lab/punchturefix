"use client";
import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard, StatusDot, PageHeader } from "@/components/dashboard/DashboardUI";
import { Wallet, CalendarCheck, Star, TrendingUp, CheckCircle2, MapPin, RefreshCw } from "lucide-react";
import { useApi, useLiveApi } from "@/lib/hooks";
import { providerApi } from "@/lib/api";

export default function ProviderDashboard() {
  const [toggling, setToggling] = useState(false);
  const { data: dash, loading, error, refetch } = useLiveApi(() => providerApi.getDashboard(), 10000);
  const { data: jobs, refetch: refetchJobs } = useLiveApi(() => providerApi.getJobs(), 10000);

  const provider = dash?.provider;
  const stats    = dash?.stats;
  const isOnline = provider?.isAvailable ?? false;
  const recentJobs = (Array.isArray(jobs) ? jobs : []).slice(0, 4);

  const toggleOnline = useCallback(async () => {
    setToggling(true);
    try {
      await providerApi.toggleAvailability();
      refetch();
    } catch (e: any) { alert(e.message); }
    finally { setToggling(false); }
  }, [refetch]);

  const activeJob = recentJobs.find((j: any) => j.status === "ASSIGNED" || j.status === "IN_PROGRESS");

  return (
    <DashboardLayout role="provider">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Good evening, {provider?.businessName?.split(" ")[0] ?? "Provider"} 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Here's your live activity</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={refetch} className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button onClick={toggleOnline} disabled={toggling || loading}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg disabled:opacity-50 ${isOnline ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" : "bg-[#2A2A2A] text-gray-400 hover:bg-[#333]"}`}>
            <span className={`w-3 h-3 rounded-full ${isOnline ? "bg-white animate-pulse" : "bg-gray-500"}`} />
            {toggling ? "Updating..." : isOnline ? "🟢 You're Online" : "⚫ Go Online"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">⚠️ {error} — showing cached state</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today's Earnings"  value={loading ? "—" : `₹${(stats?.totalEarnings ?? 0).toLocaleString("en-IN")}`} icon={Wallet} />
        <StatCard label="Jobs Today"        value={loading ? "—" : stats?.todayJobs ?? 0} icon={CalendarCheck} color="#10b981" />
        <StatCard label="Your Rating"       value={loading ? "—" : `${(stats?.avgRating ?? 0).toFixed(1)} ⭐`} icon={Star} color="#f59e0b" positive change={`${stats?.totalJobs ?? 0} total`} />
        <StatCard label="Pending Jobs"      value={loading ? "—" : stats?.pendingJobs ?? 0} icon={TrendingUp} color="#3b82f6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Card */}
        {activeJob && (
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/40 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6B00]">Active Job</span>
              <StatusDot live label={activeJob.status} />
            </div>
            <h3 className="text-lg font-bold mb-1">{activeJob.customer?.name || "Customer"}</h3>
            <p className="text-gray-400 text-sm mb-1">{activeJob.serviceCategory?.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
              <MapPin className="w-3 h-3" /> {activeJob.locationAddress}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-[#FF6B00]">₹{activeJob.totalAmount}</span>
              <button onClick={async () => { await providerApi.completeJob(activeJob.id); refetchJobs(); }}
                className="px-3 py-1.5 bg-[#FF6B00] text-white text-xs rounded-lg font-semibold">
                Mark Complete
              </button>
            </div>
          </div>
        )}

        {/* Recent Jobs */}
        <div className={`${activeJob ? "lg:col-span-2" : "lg:col-span-3"} bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Recent Jobs (Live)</h3>
            <a href="/provider/jobs" className="text-xs text-[#FF6B00] hover:underline">View all →</a>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">Loading jobs from API...</div>
          ) : recentJobs.length > 0 ? (
            <div className="space-y-3">
              {recentJobs.map((job: any) => (
                <div key={job.id} className="flex items-center gap-4 p-3 bg-[#111] rounded-xl border border-[#2A2A2A]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${job.status === "COMPLETED" ? "bg-emerald-500/20" : "bg-[#FF6B00]/20"}`}>
                    <CheckCircle2 className={`w-4 h-4 ${job.status === "COMPLETED" ? "text-emerald-400" : "text-[#FF6B00]"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{job.customer?.name || "Customer"}</p>
                    <p className="text-xs text-gray-400">{job.serviceCategory?.name} • {job.locationAddress?.split(",")[0]}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-400">₹{job.totalAmount}</p>
                    <p className="text-[10px] text-gray-500">{new Date(job.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">No jobs yet. Be online to receive bookings!</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
