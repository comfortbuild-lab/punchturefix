"use client";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string; value: string | number; change?: string;
  positive?: boolean; icon: LucideIcon; color?: string; dark?: boolean;
}

export function StatCard({ label, value, change, positive = true, icon: Icon, color = "#FF6B00", dark = true }: StatCardProps) {
  const bg = dark ? "bg-[#1A1A1A] border-[#2A2A2A]" : "bg-white border-gray-200";
  const text = dark ? "text-white" : "text-gray-900";
  const muted = dark ? "text-gray-400" : "text-gray-500";
  return (
    <div className={`${bg} border rounded-2xl p-5 flex flex-col gap-3 hover:border-[${color}]/40 transition-all group`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${muted}`}>{label}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${text}`}>{value}</div>
      {change && (
        <div className={`text-xs font-medium flex items-center gap-1 ${positive ? "text-emerald-400" : "text-red-400"}`}>
          <span>{positive ? "▲" : "▼"}</span> {change}
        </div>
      )}
    </div>
  );
}

interface BadgeProps { label: string; color?: "orange" | "green" | "red" | "yellow" | "blue" | "gray"; }
export function Badge({ label, color = "gray" }: BadgeProps) {
  const colors = {
    orange: "bg-[#FF6B00]/15 text-[#FF6B00]",
    green:  "bg-emerald-500/15 text-emerald-400",
    red:    "bg-red-500/15 text-red-400",
    yellow: "bg-yellow-500/15 text-yellow-400",
    blue:   "bg-blue-500/15 text-blue-400",
    gray:   "bg-gray-500/15 text-gray-400",
  };
  return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${colors[color]}`}>{label}</span>;
}

interface StatusDotProps { live?: boolean; label?: string; }
export function StatusDot({ live = true, label }: StatusDotProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${live ? "bg-emerald-400 animate-pulse" : "bg-gray-500"}`} />
      {label && <span className={`text-xs ${live ? "text-emerald-400" : "text-gray-500"}`}>{label}</span>}
    </div>
  );
}

interface TableProps { headers: string[]; rows: (string | React.ReactNode)[][]; dark?: boolean; }
export function DataTable({ headers, rows, dark = true }: TableProps) {
  const border = dark ? "border-[#2A2A2A]" : "border-gray-200";
  const hBg   = dark ? "bg-[#111]"       : "bg-gray-50";
  const hText = dark ? "text-gray-400"   : "text-gray-500";
  const rHover= dark ? "hover:bg-[#222]" : "hover:bg-gray-50";
  const rText = dark ? "text-gray-200"   : "text-gray-800";
  return (
    <div className={`overflow-x-auto rounded-2xl border ${border}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className={hBg}>
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${hText} first:pl-6 last:pr-6`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className={`border-t ${border} ${rHover} transition-colors`}>
              {row.map((cell, ci) => (
                <td key={ci} className={`px-4 py-3.5 ${rText} first:pl-6 last:pr-6`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
