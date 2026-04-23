"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import dynamic from "next/dynamic";

const UserLoginModal = dynamic(() => import("./UserLoginModal"), { ssr: false });

interface PwUser { name: string; phone: string; }

export default function Navbar() {
  const [isScrolled, setIsScrolled]             = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin]               = useState(false);
  const [user, setUser]                         = useState<PwUser | null>(null);
  const [showUserMenu, setShowUserMenu]         = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    try {
      const stored = localStorage.getItem("pw_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("pw_user");
    setUser(null);
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[1000] px-6 py-4 transition-all duration-300 ${
        isScrolled ? "bg-[var(--glass)] backdrop-blur-md border-b border-[var(--border)] py-3" : "bg-transparent"}`}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">

          <Link href="/" className="text-2xl font-black text-[var(--off-white)]">
            PUNCTURE<span className="text-[var(--primary)]">fix</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/#services"     className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all">Services</Link>
            <Link href="/#how-it-works" className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all">How It Works</Link>
            <Link href="/#pricing"      className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all">Pricing</Link>
            <Link href="/partnership"   className="text-sm opacity-80 hover:opacity-100 hover:text-[var(--primary)] transition-all">Partner</Link>
            <Link href="#emergency"     className="text-sm font-bold text-[#B91C1C] flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse" /> SOS
            </Link>

            {/* Auth button */}
            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF6B00] transition-colors rounded-full pl-1 pr-4 py-1">
                  <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold">
                    {user.name[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-white">{user.name.split(" ")[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-[#111] border border-[#2A2A2A] rounded-2xl py-2 w-44 shadow-xl">
                    <div className="px-4 py-2 border-b border-[#2A2A2A]">
                      <p className="text-xs font-bold text-white">{user.name}</p>
                      {user.phone && <p className="text-[10px] text-gray-400">+91 {user.phone}</p>}
                    </div>
                    <button onClick={logout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-[#2A2A2A] transition-colors">
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#FF6B00] text-white text-sm font-semibold rounded-full transition-colors">
                <User className="w-3.5 h-3.5" /> Login
              </button>
            )}

            <Link href="#book" className="btn btn-primary !px-6 !py-2.5 !text-sm">Book Now</Link>
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-3">
            {!user ? (
              <button onClick={() => setShowLogin(true)}
                className="text-xs font-bold text-[#FF6B00] border border-[#FF6B00]/40 px-3 py-1.5 rounded-full">
                Login
              </button>
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center text-white text-xs font-bold">
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <button className="text-[var(--off-white)]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[var(--dark)] border-b border-[var(--border)] p-6 md:hidden flex flex-col gap-4">
            <Link href="/#services"     onClick={() => setIsMobileMenuOpen(false)}>Services</Link>
            <Link href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
            <Link href="/#pricing"      onClick={() => setIsMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/partnership"   onClick={() => setIsMobileMenuOpen(false)}>Partner With Us</Link>
            <Link href="#emergency"     className="text-[#B91C1C] font-bold" onClick={() => setIsMobileMenuOpen(false)}>🆘 SOS / Emergency</Link>
            {!user ? (
              <button onClick={() => { setIsMobileMenuOpen(false); setShowLogin(true); }}
                className="flex items-center justify-center gap-2 py-3 border border-[#2A2A2A] rounded-xl text-sm font-semibold">
                <User className="w-4 h-4" /> Login / Sign Up
              </button>
            ) : (
              <button onClick={logout} className="text-sm text-red-400 text-left">Sign Out ({user.name})</button>
            )}
            <Link href="#book" className="btn btn-primary w-full text-center" onClick={() => setIsMobileMenuOpen(false)}>Book Now</Link>
          </div>
        )}
      </nav>

      {showLogin && (
        <UserLoginModal onClose={() => setShowLogin(false)} onSuccess={(u) => setUser(u)} />
      )}
    </>
  );
}
