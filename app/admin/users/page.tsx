"use client";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, DataTable, PageHeader } from "@/components/dashboard/DashboardUI";
import { Search, UserX } from "lucide-react";

const users = [
  { id: "USR-001", name: "Ravi Sharma",  phone: "+91 98765 43210", email: "ravi@example.com",   city: "Bengaluru", bookings: 14, joined: "Jan 5, 2026",  status: "active"    },
  { id: "USR-002", name: "Priya Mehta",  phone: "+91 87654 32109", email: "priya@example.com",  city: "Delhi NCR", bookings: 8,  joined: "Feb 2, 2026",  status: "active"    },
  { id: "USR-003", name: "Amit Kumar",   phone: "+91 76543 21098", email: "amit@example.com",   city: "Mumbai",    bookings: 22, joined: "Dec 11, 2025", status: "active"    },
  { id: "USR-004", name: "Neha Patel",   phone: "+91 65432 10987", email: "neha@example.com",   city: "Bengaluru", bookings: 3,  joined: "Mar 20, 2026", status: "active"    },
  { id: "USR-005", name: "Suresh Reddy", phone: "+91 54321 09876", email: "suresh@example.com", city: "Hyderabad", bookings: 1,  joined: "Mar 30, 2026", status: "suspended" },
  { id: "USR-006", name: "Kavita Jain",  phone: "+91 43210 98765", email: "kavita@example.com", city: "Mumbai",    bookings: 6,  joined: "Feb 18, 2026", status: "active"    },
];

export default function AdminUsers() {
  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Customer Management"
        subtitle="View, search, and manage all registered customers"
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-gray-400" />
          <input placeholder="Search by name, phone or email..." className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-none flex-1" />
        </div>
        {["All Users", "Active", "Suspended"].map((f, i) => (
          <button key={f} className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${i === 0 ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]"}`}>{f}</button>
        ))}
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: "Total Users", v: "1,284", c: "text-white" }, { label: "Active", v: "1,261", c: "text-emerald-400" }, { label: "Suspended", v: "23", c: "text-red-400" }].map(s => (
          <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        <DataTable
          headers={["ID", "Name", "Phone", "Email", "City", "Bookings", "Joined", "Status", "Action"]}
          rows={users.map(u => [
            <span className="font-mono text-xs text-gray-400">{u.id}</span>,
            <span className="font-semibold text-sm">{u.name}</span>,
            <span className="text-xs text-gray-400">{u.phone}</span>,
            <span className="text-xs text-gray-400">{u.email}</span>,
            u.city,
            <span className="font-bold">{u.bookings}</span>,
            <span className="text-xs text-gray-400">{u.joined}</span>,
            <Badge label={u.status.toUpperCase()} color={u.status === "active" ? "green" : "red"} />,
            <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Suspend user">
              <UserX className="w-4 h-4" />
            </button>
          ])}
        />
      </div>
    </DashboardLayout>
  );
}
