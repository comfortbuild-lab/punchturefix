"use client";
import { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Badge, DataTable, PageHeader } from "@/components/dashboard/DashboardUI";
import { CheckCircle2, XCircle, Eye, RefreshCw } from "lucide-react";
import { useApi } from "@/lib/hooks";
import { adminApi } from "@/lib/api";

const STATUS_COLOR: Record<string, "green" | "yellow" | "red"> = {
  APPROVED: "green", PENDING: "yellow", REJECTED: "red", SUSPENDED: "red",
};

export default function AdminProviders() {
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [acting, setActing] = useState<string | null>(null);
  const { data: providers, loading, error, refetch } = useApi(
    () => adminApi.getProviders(filter),
    [filter]
  );

  const handle = useCallback(async (id: string, action: "approve" | "reject" | "suspend") => {
    setActing(id);
    try {
      if (action === "approve") await adminApi.approveProvider(id);
      else if (action === "reject") await adminApi.rejectProvider(id, "Does not meet criteria");
      else await adminApi.suspendProvider(id);
      refetch();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActing(null);
    }
  }, [refetch]);

  const list = Array.isArray(providers) ? providers : [];
  const pendingCount = list.filter((p: any) => p.verificationStatus === "PENDING").length;

  const rows = list.map((p: any) => [
    <span className="font-mono text-xs text-gray-400">{p.id?.slice(0, 8)}</span>,
    <span className="font-semibold text-sm">{p.businessName}</span>,
    p.user?.city || "—",
    <span className="text-gray-400 text-xs">{p.verificationStatus}</span>,
    p.avgRating ? <span className="text-yellow-400 font-bold">⭐ {p.avgRating.toFixed(1)}</span> : <span className="text-gray-500">New</span>,
    p.totalJobs ?? 0,
    <Badge label={p.verificationStatus} color={STATUS_COLOR[p.verificationStatus] || "gray"} />,
    <span className="text-xs text-gray-400">{new Date(p.joinedAt).toLocaleDateString("en-IN")}</span>,
    <div className="flex gap-2">
      {p.verificationStatus === "PENDING" && <>
        <button disabled={acting === p.id} onClick={() => handle(p.id, "approve")}
          className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 transition-colors disabled:opacity-50">
          <CheckCircle2 className="w-4 h-4" />
        </button>
        <button disabled={acting === p.id} onClick={() => handle(p.id, "reject")}
          className="p-1.5 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50">
          <XCircle className="w-4 h-4" />
        </button>
      </>}
      <button className="p-1.5 rounded-lg bg-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] transition-colors">
        <Eye className="w-4 h-4" />
      </button>
    </div>
  ]);

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Service Providers"
        subtitle="Manage onboarding, verification, and suspensions"
        action={
          <div className="flex items-center gap-3">
            {pendingCount > 0 && <span className="px-3 py-1.5 rounded-lg bg-yellow-500/15 text-yellow-400 font-semibold text-xs">{pendingCount} Pending Review</span>}
            <button onClick={refetch} className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-gray-400 hover:text-[#FF6B00] transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        }
      />
      <div className="flex gap-2 mb-6 flex-wrap">
        {[{ label: "All", val: undefined }, { label: "Approved", val: "APPROVED" }, { label: "Pending", val: "PENDING" }, { label: "Suspended", val: "SUSPENDED" }].map(f => (
          <button key={f.label} onClick={() => setFilter(f.val)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${filter === f.val ? "bg-[#FF6B00] text-white border-[#FF6B00]" : "border-[#2A2A2A] text-gray-400 hover:border-[#FF6B00]"}`}>
            {f.label}
          </button>
        ))}
      </div>
      {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">⚠️ {error}</div>}
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5">
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Fetching providers from API...</div>
        ) : rows.length > 0 ? (
          <DataTable headers={["ID", "Provider", "City", "Services", "Rating", "Jobs", "Status", "Joined", "Actions"]} rows={rows} />
        ) : (
          <div className="text-center py-12 text-gray-500 text-sm">No providers found. <span className="text-[#FF6B00]">Connect a database to see live data.</span></div>
        )}
      </div>
    </DashboardLayout>
  );
}
