"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, DataTable, PageHeader, StatCard } from "@/components/dashboard/DashboardUI";
import { Wallet, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

const payouts = [
  ["Rohan Auto Garage", "1–7 Apr", "₹24,800", "₹4,960", "₹19,840", <Badge label="Pending" color="yellow" />, "Process"],
  ["Fast Fix Motors",   "1–7 Apr", "₹18,200", "₹3,640", "₹14,560", <Badge label="Pending" color="yellow" />, "Process"],
  ["Star Car Care",     "1–7 Apr", "₹8,400",  "₹1,680", "₹6,720",  <Badge label="Pending" color="yellow" />, "Process"],
  ["Quick Wheel Works", "25–31 Mar","₹31,200", "₹6,240", "₹24,960", <Badge label="Paid" color="green" />,    "View"],
  ["AutoPro Services",  "25–31 Mar","₹14,500", "₹2,900", "₹11,600", <Badge label="Paid" color="green" />,    "View"],
  ["Speedy Garage",     "18–24 Mar","₹19,300", "₹3,860", "₹15,440", <Badge label="Failed" color="red" />,   "Retry"],
];

export default function AdminPayouts() {
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Payouts"
        subtitle="Weekly provider settlements — Platform fee: 20%"
        action={
          <button className="px-5 py-2.5 bg-[#FF6B00] text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            Process All Pending →
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="This Week Payable" value="₹51,120" change="3 providers" positive icon={Wallet} />
        <StatCard label="Platform Revenue"  value="₹10,280" change="+18% vs last week" positive icon={TrendingUp} color="#10b981" />
        <StatCard label="Pending Payouts"   value="3"       change="₹51,120 total"     positive={false} icon={Clock} color="#f59e0b" />
        <StatCard label="Paid This Month"   value="₹2.1L"   change="12 providers paid"  positive icon={CheckCircle2} color="#3b82f6" />
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm">Payout Ledger</h3>
          <div className="flex gap-2">
            {["This Week","Last Week","This Month"].map((t,i) => (
              <button key={t} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${i===0 ? "border-[#FF6B00] text-[#FF6B00]" : "border-[#2A2A2A] text-gray-400"}`}>{t}</button>
            ))}
          </div>
        </div>
        <DataTable
          headers={["Provider", "Period", "GMV", "Platform Cut (20%)", "Provider Gets", "Status", "Action"]}
          rows={payouts.map(([provider, period, gmv, cut, gets, status, action]) => [
            <span className="font-semibold text-sm">{provider}</span>,
            <span className="text-gray-400 text-xs font-mono">{period}</span>,
            <span className="font-bold">{gmv}</span>,
            <span className="text-[#FF6B00]">{cut}</span>,
            <span className="text-emerald-400 font-bold">{gets}</span>,
            status,
            <button className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${action === "Retry" ? "bg-red-500/15 text-red-400 hover:bg-red-500/30" : action === "Process" ? "bg-[#FF6B00]/15 text-[#FF6B00] hover:bg-[#FF6B00]/30" : "bg-[#2A2A2A] text-gray-400 hover:bg-[#333]"}`}>{action}</button>
          ])}
        />
      </div>
    </DashboardLayout>
  );
}
