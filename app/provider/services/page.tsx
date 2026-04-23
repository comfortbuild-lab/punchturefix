"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, PageHeader } from "@/components/dashboard/DashboardUI";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const initServices = [
  { id: 1, name: "Tyre Puncture Repair", category: "Tyre",    price: 349,  unit: "per job", active: true  },
  { id: 2, name: "Oil & Filter Change",  category: "Engine",  price: 999,  unit: "per job", active: true  },
  { id: 3, name: "Car Exterior Wash",    category: "Car Wash",price: 299,  unit: "per job", active: true  },
  { id: 4, name: "Battery Replacement",  category: "Battery", price: 1499, unit: "per job", active: false },
  { id: 5, name: "AC Gas Top Up",        category: "AC",      price: 799,  unit: "per job", active: true  },
];

export default function ProviderServices() {
  const [services, setServices] = useState(initServices);
  const toggle = (id: number) => setServices(s => s.map(sv => sv.id === id ? { ...sv, active: !sv.active } : sv));

  return (
    <DashboardLayout role="provider">
      <PageHeader
        title="My Services"
        subtitle="Manage the services you offer and their pricing"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(svc => (
          <div key={svc.id} className={`bg-[#1A1A1A] border rounded-2xl p-5 transition-all ${svc.active ? "border-[#2A2A2A]" : "border-[#2A2A2A] opacity-60"}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-semibold text-sm">{svc.name}</p>
                <Badge label={svc.category} color="orange" />
              </div>
              <button onClick={() => toggle(svc.id)} className="text-gray-400 hover:text-[#FF6B00] transition-colors">
                {svc.active ? <ToggleRight className="w-6 h-6 text-emerald-400" /> : <ToggleLeft className="w-6 h-6" />}
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold">₹{svc.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{svc.unit}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-xl bg-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button className="p-2 rounded-xl bg-[#2A2A2A] text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
              <span className={`text-xs font-bold ${svc.active ? "text-emerald-400" : "text-gray-500"}`}>
                {svc.active ? "● Active" : "○ Inactive"}
              </span>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="border-2 border-dashed border-[#2A2A2A] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-500 transition-all group min-h-[160px]">
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Add New Service</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
