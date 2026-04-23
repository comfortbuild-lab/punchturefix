"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard, Badge, PageHeader } from "@/components/dashboard/DashboardUI";
import { TrendingUp, TrendingDown, BarChart2, Users, CalendarCheck, Wallet } from "lucide-react";

const monthlyRevenue = [
  { month: "Oct", gmv: 38000, platform: 7600  },
  { month: "Nov", gmv: 52000, platform: 10400 },
  { month: "Dec", gmv: 71000, platform: 14200 },
  { month: "Jan", gmv: 63000, platform: 12600 },
  { month: "Feb", gmv: 85000, platform: 17000 },
  { month: "Mar", gmv: 94000, platform: 18800 },
];
const maxGmv = Math.max(...monthlyRevenue.map(m => m.gmv));

const topProviders = [
  { name: "Rohan Auto Garage", city: "Bengaluru", jobs: 124, revenue: "₹43,400", rating: 4.8 },
  { name: "Fast Fix Motors",   city: "Delhi NCR", jobs: 98,  revenue: "₹34,300", rating: 4.5 },
  { name: "Quick Wheel Works", city: "Bengaluru", jobs: 87,  revenue: "₹30,450", rating: 4.7 },
  { name: "AutoPro Services",  city: "Mumbai",    jobs: 65,  revenue: "₹22,750", rating: 4.3 },
  { name: "Star Car Care",     city: "Hyderabad", jobs: 43,  revenue: "₹15,050", rating: 4.1 },
];

const serviceBreakdown = [
  { name: "Puncture Repair", count: 412, pct: 42, color: "#FF6B00" },
  { name: "Car Wash",        count: 231, pct: 24, color: "#3b82f6" },
  { name: "Oil Change",      count: 178, pct: 18, color: "#10b981" },
  { name: "Battery Replace", count: 98,  pct: 10, color: "#f59e0b" },
  { name: "AC Service",      count: 58,  pct: 6,  color: "#8b5cf6" },
];

export default function AdminReports() {
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Platform performance, revenue trends, and service insights"
        action={
          <button className="px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 rounded-xl text-xs font-semibold hover:border-[#FF6B00] transition-colors">
            ⬇ Export CSV
          </button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total GMV (Mar)"    value="₹94,000" change="+11% vs Feb" positive icon={Wallet} />
        <StatCard label="Platform Revenue"   value="₹18,800" change="+11% vs Feb" positive icon={TrendingUp} color="#10b981" />
        <StatCard label="Active Customers"   value="1,284"   change="+142 this month" positive icon={Users} color="#3b82f6" />
        <StatCard label="Total Bookings"     value="977"     change="+89 this month" positive icon={CalendarCheck} color="#f59e0b" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Bar Chart */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-sm">Monthly Revenue Trend</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#FF6B00]" />GMV</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500" />Platform Cut</span>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {monthlyRevenue.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-stretch gap-0.5" style={{ height: `${(m.gmv / maxGmv) * 100}%` }}>
                  <div className="flex-1 rounded-t-lg bg-[#FF6B00] opacity-30" />
                  <div className="rounded-lg bg-emerald-500" style={{ height: `${(m.platform / m.gmv) * 100}%` }} />
                </div>
                <span className="text-[10px] text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
          <h3 className="font-semibold text-sm mb-4">Service Breakdown</h3>
          <div className="space-y-3">
            {serviceBreakdown.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{s.name}</span>
                  <span className="text-gray-400">{s.count} jobs ({s.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[#2A2A2A] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.pct}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Providers */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-4">Top Performing Providers</h3>
        <div className="space-y-3">
          {topProviders.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 p-3 bg-[#111] rounded-xl border border-[#2A2A2A]">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${i === 0 ? "bg-[#FF6B00] text-white" : i === 1 ? "bg-gray-600 text-white" : "bg-[#2A2A2A] text-gray-400"}`}>
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-gray-400">{p.city} · ⭐ {p.rating}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">{p.revenue}</p>
                <p className="text-xs text-gray-500">{p.jobs} jobs</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
