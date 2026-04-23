"use client";
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/DashboardUI";
import { Bell, Shield, Sliders, Globe, Save } from "lucide-react";

export default function AdminSettings() {
  const [platformFee, setPlatformFee]       = useState("20");
  const [minProviders, setMinProviders]     = useState("3");
  const [otpExpiry, setOtpExpiry]           = useState("5");
  const [supportEmail, setSupportEmail]     = useState("support@PUNCTUREfix.com");
  const [supportPhone, setSupportPhone]     = useState("+91 1800 123 4567");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailAlerts, setEmailAlerts]       = useState(true);
  const [smsAlerts, setSmsAlerts]           = useState(true);
  const [saved, setSaved]                   = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const section = (icon: any, title: string, children: React.ReactNode) => {
    const Icon = icon;
    return (
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="w-4 h-4 text-[#FF6B00]" />
          <h3 className="font-semibold text-sm">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
      </div>
    );
  };

  const field = (label: string, child: React.ReactNode, hint?: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
      </div>
      <div>{child}</div>
    </div>
  );

  const input = (value: string, setter: (v: string) => void, suffix?: string) => (
    <div className="flex items-center gap-2">
      <input value={value} onChange={e => setter(e.target.value)}
        className="flex-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#FF6B00] transition-colors" />
      {suffix && <span className="text-xs text-gray-500">{suffix}</span>}
    </div>
  );

  const toggle = (value: boolean, setter: (v: boolean) => void) => (
    <button onClick={() => setter(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-[#FF6B00]" : "bg-[#2A2A2A]"}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "left-7" : "left-1"}`} />
    </button>
  );

  return (
    <DashboardLayout role="admin">
      <PageHeader
        title="Platform Settings"
        subtitle="Configure global platform behaviour, fees, and notifications"
        action={
          <button onClick={save} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-[#FF6B00] hover:bg-orange-600 text-white"}`}>
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        }
      />

      {section(Sliders, "Business Rules", <>
        {field("Platform Commission Rate", input(platformFee, setPlatformFee, "%"), "Cut taken from each transaction")}
        {field("Min Online Providers (Dispatch)", input(minProviders, setMinProviders, "providers"))}
        {field("OTP Expiry Time", input(otpExpiry, setOtpExpiry, "minutes"))}
      </>)}

      {section(Globe, "Contact & Support", <>
        {field("Support Email", input(supportEmail, setSupportEmail))}
        {field("Support Phone", input(supportPhone, setSupportPhone))}
      </>)}

      {section(Bell, "Alert Notifications", <>
        {field("Email Alerts for New Bookings", toggle(emailAlerts, setEmailAlerts))}
        {field("SMS Alerts for Provider Offline", toggle(smsAlerts, setSmsAlerts))}
      </>)}

      {section(Shield, "System Controls", <>
        {field("Maintenance Mode", toggle(maintenanceMode, setMaintenanceMode), "Disables all new bookings for customers")}
        {field("API Version",
          <span className="text-sm font-mono text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-1 rounded-lg">v1.0.0</span>
        )}
        {field("Environment",
          <span className="text-sm font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">development</span>
        )}
      </>)}
    </DashboardLayout>
  );
}
