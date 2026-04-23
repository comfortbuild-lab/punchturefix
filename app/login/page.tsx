"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [tab, setTab]         = useState<"admin" | "provider">("admin");
  const [email, setEmail]     = useState("");
  const [password, setPassword]= useState("");
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [step, setStep]       = useState<"input" | "otp">("input");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder: connect to Firebase / backend auth
    await new Promise(r => setTimeout(r, 1000));
    router.push("/admin");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setStep("otp");
    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push("/provider/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FF6B0015_0%,_transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] flex items-center justify-center font-black text-white text-sm">PW</div>
            <span className="font-bold text-white text-xl tracking-wider">PUNCTUREfix</span>
          </div>
          <p className="text-gray-400 text-sm">Operations Platform Login</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-1 mb-6">
          {(["admin", "provider"] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setStep("input"); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? "bg-[#FF6B00] text-white" : "text-gray-400 hover:text-white"}`}>
              {t === "admin" ? "🔐 Admin Panel" : "🔧 Provider Portal"}
            </button>
          ))}
        </div>

        {/* Login Card */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
          {tab === "admin" ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Admin Sign In</h2>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="admin@PUNCTUREfix.com"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="accent-[#FF6B00]" /> Remember me
                </label>
                <button type="button" className="text-[#FF6B00] hover:underline">Forgot password?</button>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
                {loading ? "Signing in..." : "Sign In to Admin Panel →"}
              </button>
            </form>
          ) : step === "input" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Provider Login</h2>
              <p className="text-xs text-gray-400">We'll send a one-time password to your registered mobile number.</p>
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 py-3 bg-[#111] border border-[#2A2A2A] rounded-xl text-sm text-gray-400">🇮🇳 +91</span>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                    placeholder="98765 43210" maxLength={10}
                    className="flex-1 bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Enter OTP</h2>
              <p className="text-xs text-gray-400">6-digit OTP sent to +91 {phone}</p>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required
                placeholder="• • • • • •" maxLength={6}
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors text-center text-xl tracking-[0.5em]" />
              <button type="submit" disabled={loading}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-colors">
                {loading ? "Verifying..." : "Verify & Enter Portal →"}
              </button>
              <button type="button" onClick={() => setStep("input")} className="w-full text-xs text-gray-500 hover:text-gray-300">← Change number</button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          PUNCTUREfix Operations Platform · <a href="/" className="text-[#FF6B00] hover:underline">Back to website</a>
        </p>
      </div>
    </div>
  );
}
