"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard, PageHeader } from "@/components/dashboard/DashboardUI";
import { TrendingUp, Wallet, Clock, Star } from "lucide-react";

const weeklyData = [
  { day: "Mon", amount: 1240 }, { day: "Tue", amount: 2100 },
  { day: "Wed", amount: 890  }, { day: "Thu", amount: 1750 },
  { day: "Fri", amount: 2840 }, { day: "Sat", amount: 3200 },
  { day: "Sun", amount: 1980 },
];
const maxVal = Math.max(...weeklyData.map(d => d.amount));

const payouts = [
  { period: "1–7 Apr 2026",   amount: "₹19,840", status: "Upcoming",  date: "Apr 8, 2026" },
  { period: "25–31 Mar 2026", amount: "₹24,960", status: "Paid",      date: "Apr 1, 2026" },
  { period: "18–24 Mar 2026", amount: "₹18,200", status: "Paid",      date: "Mar 25, 2026"},
  { period: "11–17 Mar 2026", amount: "₹21,440", status: "Paid",      date: "Mar 18, 2026"},
];

export default function ProviderEarnings() {
  return (
    <DashboardLayout role="provider">
      <PageHeader title="Earnings" subtitle="Track your income, payouts, and performance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Today" value="₹2,847" change="4 jobs"         positive icon={Wallet} />
        <StatCard label="This Week" value="₹14,000" change="+22% vs last" positive icon={TrendingUp} color="#10b981" />
        <StatCard label="This Month" value="₹44,320" change="31 jobs done" positive icon={Star} color="#3b82f6" />
        <StatCard label="Lifetime"   value="₹2,47,800" change="Since Mar 2025" positive icon={Clock} color="#8b5cf6" />
      </div>

      {/* Earnings Bar Chart */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-sm">This Week's Earnings</h3>
          <span className="text-xs text-gray-400">Mar 26 – Apr 1, 2026</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map(d => {
            const pct = (d.amount / maxVal) * 100;
            const isMax = d.amount === maxVal;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] text-gray-400">₹{(d.amount / 1000).toFixed(1)}k</span>
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{ height: `${pct}%`, background: isMax ? "#FF6B00" : "#2A2A2A" }}>
                  {isMax && <div className="absolute inset-0 bg-gradient-to-t from-[#FF6B00] to-orange-400" />}
                </div>
                <span className={`text-xs font-bold ${isMax ? "text-[#FF6B00]" : "text-gray-500"}`}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <h3 className="font-semibold text-sm mb-4">Payout History</h3>
        <div className="space-y-3">
          {payouts.map(p => (
            <div key={p.period} className="flex items-center justify-between p-4 bg-[#111] rounded-xl border border-[#2A2A2A]">
              <div>
                <p className="text-sm font-semibold">{p.period}</p>
                <p className="text-xs text-gray-400">{p.status === "Upcoming" ? `Expected: ${p.date}` : `Paid on ${p.date}`}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${p.status === "Upcoming" ? "text-[#FF6B00]" : "text-emerald-400"}`}>{p.amount}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === "Upcoming" ? "bg-[#FF6B00]/15 text-[#FF6B00]" : "bg-emerald-500/15 text-emerald-400"}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
