"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, DataTable, PageHeader } from "@/components/dashboard/DashboardUI";
import { Search, Filter } from "lucide-react";

const bookings = [
  ["#BK-2891","Ravi Sharma","Rohan Auto","Puncture Repair","Koramangala","₹349", <Badge label="En Route" color="blue" />,"UPI"],
  ["#BK-2890","Priya M.","Fast Fix","Oil Change","Indiranagar","₹999", <Badge label="In Progress" color="orange" />,"Card"],
  ["#BK-2889","Amit K.","Star Care","Car Wash","HSR Layout","₹299", <Badge label="Completed" color="green" />,"UPI"],
  ["#BK-2888","Neha P.","Rohan Auto","Battery Replace","Whitefield","₹1,499", <Badge label="Pending" color="yellow" />,"Wallet"],
  ["#BK-2887","Suresh R.","Fast Fix","AC Service","JP Nagar","₹799", <Badge label="Cancelled" color="red" />,"—"],
  ["#BK-2886","Kiran M.","Star Care","Full Service","Marathahalli","₹2,499", <Badge label="Completed" color="green" />,"UPI"],
  ["#BK-2885","Deepa V.","Rohan Auto","Tyre Replace","Sarjapur","₹3,200", <Badge label="Completed" color="green" />,"Card"],
];

export default function AdminBookings() {
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="All Bookings"
        subtitle="Complete booking history across all cities and providers"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-gray-400" />
          <input placeholder="Search by customer, provider, ID..." className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1" />
        </div>
        {["All Status", "Pending", "En Route", "Completed", "Cancelled"].map(f => (
          <button key={f} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${f === "All Status" ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]"}`}>
            {f}
          </button>
        ))}
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]">
          <Filter className="w-3 h-3" /> More Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Today", value: "142", color: "text-white" },
          { label: "Completed", value: "98",   color: "text-emerald-400" },
          { label: "Active",     value: "26",  color: "text-[#FF6B00]" },
          { label: "Cancelled",  value: "18",  color: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <DataTable
          headers={["Booking ID","Customer","Provider","Service","Location","Amount","Status","Payment"]}
          rows={bookings}
        />
        <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
          <span>Showing 7 of 142 bookings</span>
          <div className="flex gap-2">
            {["←","1","2","3","...","18","→"].map((p,i) => (
              <button key={i} className={`w-7 h-7 rounded-lg ${p==="1" ? "bg-[#FF6B00] text-white" : "bg-[#2A2A2A] hover:bg-[#333]"} font-medium transition-colors`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
