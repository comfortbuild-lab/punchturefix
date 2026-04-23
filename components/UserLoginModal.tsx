"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Chrome, ArrowRight, CheckCircle } from "lucide-react";

interface UserLoginModalProps {
  onClose: () => void;
  onSuccess?: (user: { name: string; phone: string }) => void;
}

export default function UserLoginModal({ onClose, onSuccess }: UserLoginModalProps) {
  const [method, setMethod]   = useState<"phone" | "google">("phone");
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [name, setName]       = useState("");
  const [step, setStep]       = useState<"input" | "otp" | "name">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const sendOtp = async () => {
    if (phone.length < 10) return setError("Enter a valid 10-digit number");
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setStep("otp");
  };

  const verifyOtp = async () => {
    if (otp.length < 4) return setError("Enter the OTP sent to your number");
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    // First-time user — ask for name; returning user — done
    setStep("name");
  };

  const finish = () => {
    const user = { name: name || "User", phone };
    localStorage.setItem("pw_user", JSON.stringify(user));
    onSuccess?.(user);
    onClose();
  };

  const googleLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const user = { name: "Google User", phone: "" };
    localStorage.setItem("pw_user", JSON.stringify(user));
    onSuccess?.(user);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: "spring", bounce: 0.2 }}
          className="relative bg-[#111] border border-[#2A2A2A] rounded-3xl p-8 w-full max-w-sm shadow-2xl"
        >
          {/* Close */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl hover:bg-[#2A2A2A] text-gray-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B00] flex items-center justify-center font-black text-white text-xs">PW</div>
            <span className="font-bold text-white text-sm tracking-wider">PUNCTUREfix</span>
          </div>

          {step === "input" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Sign in to continue</h2>
                <p className="text-gray-400 text-xs mt-1">Book services, track your mechanic, view history</p>
              </div>

              {/* Google */}
              <button onClick={googleLogin} disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-900 rounded-2xl font-semibold text-sm transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[#2A2A2A]" />
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-1 h-px bg-[#2A2A2A]" />
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-gray-400 font-semibold mb-1.5 block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center px-3 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-sm text-gray-400 flex-shrink-0">🇮🇳 +91</div>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g,'').slice(0,10))}
                    placeholder="98765 43210" maxLength={10}
                    className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors" />
                </div>
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
              </div>

              <button onClick={sendOtp} disabled={loading || phone.length < 10}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2">
                {loading ? "Sending..." : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">Enter OTP</h2>
                <p className="text-gray-400 text-xs mt-1">Sent to +91 {phone}</p>
              </div>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                placeholder="• • • • • •" maxLength={6}
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-4 text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors text-center text-2xl tracking-[0.8em]" />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={verifyOtp} disabled={loading || otp.length < 4}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 disabled:opacity-40 text-white font-bold rounded-2xl text-sm transition-colors">
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
              <button onClick={() => setStep("input")} className="w-full text-xs text-gray-500 hover:text-gray-300">← Change number</button>
            </div>
          )}

          {step === "name" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white">What's your name?</h2>
                <p className="text-gray-400 text-xs mt-1">So our mechanics know who to look for</p>
              </div>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-gray-600 outline-none focus:border-[#FF6B00] transition-colors" />
              <button onClick={finish}
                className="w-full py-3.5 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Let's Go!
              </button>
            </div>
          )}

          <p className="text-[10px] text-gray-600 text-center mt-4">
            By continuing, you agree to our <span className="text-[#FF6B00]">Terms</span> & <span className="text-[#FF6B00]">Privacy Policy</span>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
