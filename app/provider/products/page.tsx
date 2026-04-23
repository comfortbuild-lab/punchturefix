"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, PageHeader } from "@/components/dashboard/DashboardUI";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

const initProducts = [
  { id: 1, name: "Puncture Repair Kit",   brand: "Tyre Pro",   price: 199,  stock: 24, category: "Tyre",    active: true  },
  { id: 2, name: "Engine Oil (1L)",        brand: "Castrol",    price: 599,  stock: 12, category: "Engine",  active: true  },
  { id: 3, name: "Car Air Freshener",      brand: "Ambi Pur",   price: 149,  stock: 50, category: "Accessory",active: true  },
  { id: 4, name: "Brake Fluid (500ml)",   brand: "Bosch",      price: 249,  stock: 8,  category: "Brakes",  active: false },
  { id: 5, name: "Jumper Cable Set",       brand: "Generic",    price: 399,  stock: 6,  category: "Battery", active: true  },
];

const catColor: Record<string, any> = {
  Tyre: "orange", Engine: "blue", Accessory: "gray", Battery: "yellow", Brakes: "red",
};

export default function ProviderProducts() {
  const [products, setProducts] = useState(initProducts);

  const stockColor = (n: number) => n <= 5 ? "text-red-400" : n <= 15 ? "text-yellow-400" : "text-emerald-400";

  return (
    <DashboardLayout role="provider">
      <PageHeader
        title="My Products"
        subtitle="Manage spare parts and accessories you sell at service time"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Products", v: products.length,               c: "text-white" },
          { label: "Active",         v: products.filter(p => p.active).length, c: "text-emerald-400" },
          { label: "Low Stock (≤5)", v: products.filter(p => p.stock <= 5).length, c: "text-red-400" },
        ].map(s => (
          <div key={s.label} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className={`bg-[#1A1A1A] border rounded-2xl p-5 transition-all ${!p.active && "opacity-60"} border-[#2A2A2A]`}>
            {/* Icon + Badges */}
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FF6B00]" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge label={p.category} color={catColor[p.category]} />
                {!p.active && <Badge label="INACTIVE" color="gray" />}
              </div>
            </div>

            <h4 className="font-semibold text-sm mb-0.5">{p.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{p.brand}</p>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-bold">₹{p.price}</span>
              <span className={`text-xs font-semibold ${stockColor(p.stock)}`}>
                {p.stock} in stock{p.stock <= 5 ? " ⚠️" : ""}
              </span>
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#2A2A2A]">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] text-xs font-semibold transition-colors">
                <Pencil className="w-3 h-3" /> Edit
              </button>
              <button
                onClick={() => setProducts(prev => prev.filter(x => x.id !== p.id))}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Add new */}
        <button className="border-2 border-dashed border-[#2A2A2A] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-500 transition-all min-h-[200px] group">
          <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">Add Product</span>
        </button>
      </div>
    </DashboardLayout>
  );
}
