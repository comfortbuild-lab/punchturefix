/**
 * PUNCTUREfix — Shared API Client
 * All frontend/dashboard API calls go through this module.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// ── Token management ───────────────────────────────────────────────────────
let accessToken: string | null = null;

export const setAccessToken = (t: string | null) => { accessToken = t; };
export const getAccessToken = () => accessToken;

// ── Core fetch wrapper ─────────────────────────────────────────────────────
interface ApiOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, ...init } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  if (auth && accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include",  // send refresh-token cookie
    ...init,
    headers,
  });

  // Auto-refresh on 401
  if (res.status === 401 && auth) {
    const refreshed = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      const data = await refreshed.json();
      setAccessToken(data.accessToken);
      headers["Authorization"] = `Bearer ${data.accessToken}`;
      const retry = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: "include", ...init, headers,
      });
      if (!retry.ok) throw new Error(await retry.text());
      return retry.json();
    }
    setAccessToken(null);
    throw new Error("Session expired. Please login again.");
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `API error ${res.status}`);
  }

  return res.json();
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  googleLogin:  (idToken: string)       => apiFetch("/auth/google",       { method: "POST", body: JSON.stringify({ idToken }), auth: false }),
  verifyOtp:    (idToken: string, phone: string) => apiFetch("/auth/phone/verify", { method: "POST", body: JSON.stringify({ idToken, phone }), auth: false }),
  refresh:      ()                       => apiFetch("/auth/refresh",      { method: "POST", auth: false }),
  logout:       ()                       => apiFetch("/auth/logout",       { method: "POST" }),
  getMe:        ()                       => apiFetch("/auth/me"),
};

// ── Bookings ───────────────────────────────────────────────────────────────
export const bookingApi = {
  createOnDemand: (data: {
    serviceCategoryId: string; vehicleId?: string;
    lat: number; lng: number; address: string; notes?: string;
  }) => apiFetch("/bookings/on-demand", { method: "POST", body: JSON.stringify(data) }),

  createScheduled: (data: {
    serviceCategoryId: string; address: string; scheduledAt: string; notes?: string;
  }) => apiFetch("/bookings/scheduled", { method: "POST", body: JSON.stringify(data) }),

  createSelfWash: (data: { bayId: string; slotId: string; vehicleId?: string }) =>
    apiFetch("/bookings/self-wash", { method: "POST", body: JSON.stringify(data) }),

  createEmergency: (data: {
    serviceCategoryId: string; lat: number; lng: number; address: string;
  }) => apiFetch("/bookings/emergency", { method: "POST", body: JSON.stringify(data) }),

  track:   (id: string) => apiFetch(`/bookings/${id}/track`),
  cancel:  (id: string) => apiFetch(`/bookings/${id}/cancel`,  { method: "POST" }),
  review:  (id: string, rating: number, comment?: string) =>
    apiFetch(`/bookings/${id}/review`, { method: "POST", body: JSON.stringify({ rating, comment }) }),
};

// ── Customer ───────────────────────────────────────────────────────────────
export const customerApi = {
  getProfile:    ()           => apiFetch("/customer/profile"),
  updateProfile: (data: any)  => apiFetch("/customer/profile", { method: "PUT", body: JSON.stringify(data) }),
  getVehicles:   ()           => apiFetch("/customer/vehicles"),
  addVehicle:    (data: any)  => apiFetch("/customer/vehicles", { method: "POST", body: JSON.stringify(data) }),
  deleteVehicle: (id: string) => apiFetch(`/customer/vehicles/${id}`, { method: "DELETE" }),
  getBookings:   ()           => apiFetch("/customer/bookings"),
};

// ── Provider ───────────────────────────────────────────────────────────────
export const providerApi = {
  register:           (data: any)  => apiFetch("/provider/register",     { method: "POST", body: JSON.stringify(data) }),
  getDashboard:       ()           => apiFetch("/provider/dashboard"),
  toggleAvailability: ()           => apiFetch("/provider/availability",  { method: "PATCH" }),
  getServices:        ()           => apiFetch("/provider/services"),
  addService:         (data: any)  => apiFetch("/provider/services",      { method: "POST", body: JSON.stringify(data) }),
  updateService:  (id: string, data: any) => apiFetch(`/provider/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteService:      (id: string) => apiFetch(`/provider/services/${id}`, { method: "DELETE" }),
  getJobs:            (status?: string) => apiFetch(`/provider/jobs${status ? `?status=${status}` : ""}`),
  acceptJob:          (id: string) => apiFetch(`/provider/jobs/${id}/accept`,   { method: "PATCH" }),
  completeJob:        (id: string) => apiFetch(`/provider/jobs/${id}/complete`, { method: "PATCH" }),
  getEarnings:        ()           => apiFetch("/provider/earnings"),
  addProduct:         (data: any)  => apiFetch("/provider/products",      { method: "POST", body: JSON.stringify(data) }),
  getProducts:        ()           => apiFetch("/provider/products"),
};

// ── Payments ───────────────────────────────────────────────────────────────
export const paymentApi = {
  createOrder:        (bookingId: string)    => apiFetch("/payments/create-order",     { method: "POST", body: JSON.stringify({ bookingId }) }),
  verifyPayment:      (data: any)            => apiFetch("/payments/verify",            { method: "POST", body: JSON.stringify(data), auth: false }),
  createSubscription: (planType: string)     => apiFetch("/payments/subscription/create", { method: "POST", body: JSON.stringify({ planType }) }),
  getInvoice:         (bookingId: string)    => apiFetch(`/payments/${bookingId}/invoice`),
};

// ── Admin ──────────────────────────────────────────────────────────────────
export const adminApi = {
  getDashboard:     ()           => apiFetch("/admin/dashboard"),
  getProviders:     (status?: string) => apiFetch(`/admin/providers${status ? `?status=${status}` : ""}`),
  approveProvider:  (id: string) => apiFetch(`/admin/providers/${id}/approve`, { method: "PATCH" }),
  rejectProvider:   (id: string, reason?: string) => apiFetch(`/admin/providers/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) }),
  suspendProvider:  (id: string) => apiFetch(`/admin/providers/${id}/suspend`, { method: "PATCH" }),
  suspendUser:      (id: string) => apiFetch(`/admin/users/${id}/suspend`,     { method: "PATCH" }),
  getAllBookings:    (status?: string, page = 1) => apiFetch(`/admin/bookings?${status ? `status=${status}&` : ""}page=${page}`),
  processPayouts:   ()           => apiFetch("/admin/payouts/process",  { method: "POST" }),
  getRevenue:       ()           => apiFetch("/admin/reports/revenue"),
};

// ── Service Categories (public) ────────────────────────────────────────────
export const publicApi = {
  getHealth:       () => fetch("http://localhost:5000/health").then(r => r.json()),
  getCategories:   () => apiFetch("/services/categories", { auth: false }),
};
