"use client";
import { useState, createContext, useContext, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarCheck, Wallet, Settings,
  LogOut, Bell, Moon, Sun, Menu, X, TrendingUp, Package,
  Wrench, MapPin, ChevronRight
} from "lucide-react";

interface SidebarItem { label: string; href: string; icon: any; badge?: number; }

interface DashboardContextType {
  darkMode: boolean; toggleDark: () => void;
  sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void;
}
const DashboardContext = createContext<DashboardContextType | null>(null);
export const useDashboard = () => useContext(DashboardContext)!;

const adminNav: SidebarItem[] = [
  { label: "Dashboard",  href: "/admin",          icon: LayoutDashboard },
  { label: "Providers",  href: "/admin/providers", icon: Wrench,  badge: 4 },
  { label: "Bookings",   href: "/admin/bookings",  icon: CalendarCheck },
  { label: "Payouts",    href: "/admin/payouts",   icon: Wallet },
  { label: "Reports",    href: "/admin/reports",   icon: TrendingUp },
  { label: "Users",      href: "/admin/users",     icon: Users },
  { label: "Settings",   href: "/admin/settings",  icon: Settings },
];

const providerNav: SidebarItem[] = [
  { label: "Dashboard",  href: "/provider/dashboard", icon: LayoutDashboard },
  { label: "Jobs",       href: "/provider/jobs",       icon: MapPin,  badge: 2 },
  { label: "My Services",href: "/provider/services",   icon: Wrench },
  { label: "Products",   href: "/provider/products",   icon: Package },
  { label: "Earnings",   href: "/provider/earnings",   icon: TrendingUp },
  { label: "Profile",    href: "/provider/profile",    icon: Users },
];

export function DashboardLayout({
  children, role = "admin"
}: { children: React.ReactNode; role?: "admin" | "provider" }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const nav = role === "admin" ? adminNav : providerNav;
  const toggleDark = () => setDarkMode(p => !p);

  const D = darkMode ? {
    bg: "bg-[#0E0E0E]", surface: "bg-[#1A1A1A]", border: "border-[#2A2A2A]",
    text: "text-white", muted: "text-gray-400", card: "bg-[#1A1A1A]", sidebar: "bg-[#111111]",
  } : {
    bg: "bg-gray-50", surface: "bg-white", border: "border-gray-200",
    text: "text-gray-900", muted: "text-gray-500", card: "bg-white", sidebar: "bg-white",
  };

  return (
    <DashboardContext.Provider value={{ darkMode, toggleDark, sidebarOpen, setSidebarOpen }}>
      <div className={`flex h-screen overflow-hidden ${D.bg} ${D.text} font-sans`}>
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-64" : "w-16"} flex-shrink-0 ${D.sidebar} ${D.border} border-r flex flex-col transition-all duration-300 overflow-hidden z-20`}>
          {/* Logo */}
          <div className={`flex items-center gap-3 px-4 py-5 border-b ${D.border}`}>
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center font-black text-white text-xs flex-shrink-0">PW</div>
            {sidebarOpen && <span className="font-bold tracking-wider text-sm">PUNCTUREfix</span>}
          </div>

          {/* Role Badge */}
          {sidebarOpen && (
            <div className="px-4 py-3">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${role === "admin" ? "bg-[#FF6B00]/20 text-[#FF6B00]" : "bg-emerald-500/20 text-emerald-400"}`}>
                {role === "admin" ? "Admin Panel" : "Provider Portal"}
              </span>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
            {nav.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/admin" && item.href !== "/provider/dashboard" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${active ? "bg-[#FF6B00] text-white" : `${D.muted} hover:${D.surface} hover:text-white`}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {sidebarOpen && <span className="flex-1 font-medium">{item.label}</span>}
                  {sidebarOpen && item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white text-[#FF6B00]" : "bg-[#FF6B00] text-white"}`}>{item.badge}</span>
                  )}
                  {!sidebarOpen && item.badge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B00] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className={`p-3 border-t ${D.border}`}>
            <button className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm w-full ${D.muted} hover:text-red-400 transition-colors`}>
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className={`flex items-center justify-between px-6 py-4 ${D.surface} ${D.border} border-b gap-4 flex-shrink-0`}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`${D.muted} hover:text-[#FF6B00] transition-colors`}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <button onClick={toggleDark} className={`p-2 rounded-lg ${D.surface} ${D.border} border ${D.muted} hover:text-[#FF6B00] transition-colors`}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className={`p-2 rounded-lg ${D.surface} ${D.border} border ${D.muted} hover:text-[#FF6B00] transition-colors relative`}>
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B00] rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold">AD</div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
