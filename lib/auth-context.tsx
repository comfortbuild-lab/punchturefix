"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, setAccessToken, getAccessToken } from "./api";

interface User {
  id: string; firebaseUid: string; name: string | null; email: string | null;
  phone: string | null; role: string; avatarUrl: string | null;
  provider?: any; vehicles?: any[];
}

interface AuthContextType {
  user: User | null; loading: boolean;
  login: (idToken: string, type: "google" | "phone", phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const me = await authApi.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  // Attempt silent token refresh on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await authApi.refresh();
        setAccessToken(data.accessToken);
        await fetchUser();
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchUser]);

  const login = async (idToken: string, type: "google" | "phone", phone?: string) => {
    const data = type === "google"
      ? await authApi.googleLogin(idToken)
      : await authApi.verifyOtp(idToken, phone!);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    await authApi.logout();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}
