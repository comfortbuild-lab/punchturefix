"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard, Badge, StatusDot, DataTable, PageHeader } from "@/components/dashboard/DashboardUI";
import { TrendingUp, CalendarCheck, Users, Wallet, Wrench, Activity, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { useLiveApi } from "@/lib/hooks";
import { adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const { data: stats, loading, error, refetch } = useLiveApi(() => adminApi.getDashboard(), 10000);
  const { data: bookingsData } = useLiveApi(() => adminApi.getAllBookings(undefined, 1), 15000);

  const bookings = bookingsData ?? [];

  const statusColor: Record<string, any> = {
    PENDING: "yellow", ASSIGNED: "blue", IN_PROGRESS: "orange",
    COMPLETED: "green", CANCELLED: "red",
  };

  const recentRows = (Array.isArray(bookings) ? bookings : []).slice(0, 5).map((b: any) => [
    <span className="font-mono text-xs text-gray-400">#{b.id?.slice(0, 8).toUpperCase()}</span>,
    b.customer?.name || "—",
    b.serviceCategory?.name || "—",
    b.locationAddress || "—",
    <Badge label={b.status} color={statusColor[b.status] || "gray"} />,
    `₹${b.totalAmount}`,
  ]);

  const liveActivity = [
    { msg: stats ? `${stats.totalBookings} total bookings on platform` : "Loading...", time: "Now",    type: "info" },
    { msg: stats ? `₹${stats.totalRevenue?.toLocaleString("en-IN")} total revenue generated` : "—",     time: "Now",    type: "success" },
    { msg: stats ? `${stats.totalProviders} providers registered` : "—",               time: "Today",  type: "info" },
    { msg: stats ? `${stats.totalUsers} registered customers` : "—",                   time: "Total",  type: "success" },
  ];

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Platform Overview"
        subtitle="Live operations dashboard"
        action={
          <div className="flex items-center gap-3">
            <StatusDot live label="Live" />
            <button onClick={refetch} className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          ⚠️ Could not connect to backend: {error}. Using cached data.
        </div>
      )}

      {/* KPI Cards — live from /admin/dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Bookings" value={loading ? "—" : stats?.totalBookings ?? 0} icon={CalendarCheck} />
        <StatCard label="Providers" value={loading ? "—" : stats?.totalProviders ?? 0} icon={Wrench} color="#10b981"
          change={loading ? "" : "registered"} positive />
        <StatCard label="Gross Revenue" value={loading ? "—" : `₹${(stats?.totalRevenue ?? 0).toLocaleString("en-IN")}`}
          icon={TrendingUp} color="#3b82f6" change="cumulative" positive />
        <StatCard label="Total Users" value={loading ? "—" : stats?.totalUsers ?? 0} icon={Users} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Stats */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Platform Stats</h3>
            <StatusDot live label="Live" />
          </div>
          <div className="space-y-3">
            {liveActivity.map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.type === "success" ? "bg-emerald-400" : "bg-blue-400"}`} />
                <div>
                  <p className="text-xs text-gray-200 leading-snug">{item.msg}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-4">Quick Metrics</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avg Response", value: "18 min", icon: Activity },
              { label: "Active Issues", value: "—",     icon: AlertTriangle },
              { label: "Uptime",        value: "99.9%", icon: CheckCircle2 },
            ].map(s => (
              <div key={s.label} className="text-center p-4 bg-[#111] rounded-xl">
                <s.icon className="w-5 h-5 mx-auto mb-2 text-[#FF6B00]" />
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[10px] text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#111] rounded-xl">
            <p className="text-xs text-gray-400 text-center">
              Connected to <span className="text-[#FF6B00] font-bold">localhost:5000</span> — Data refreshes every 10s
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings — live */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Recent Bookings (Live)</h3>
          <a href="/admin/bookings" className="text-xs text-[#FF6B00] hover:underline">View all →</a>
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500 text-sm">Loading bookings from API...</div>
        ) : recentRows.length > 0 ? (
          <DataTable headers={["ID", "Customer", "Service", "Location", "Status", "Amount"]} rows={recentRows} />
        ) : (
          <div className="text-center py-8 text-gray-500 text-sm">No bookings yet. <span className="text-[#FF6B00]">Connect a database to see live data.</span></div>
        )}
      </div>
    </DashboardLayout>
  );
}
