// ── Tabiri API Client ─────────────────────────────────────────
// All API calls to the Go backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tabiri-api-production.up.railway.app";

// ── Auth token management ─────────────────────────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("tabiri_token");
}

export function setToken(token: string, refresh: string) {
  localStorage.setItem("tabiri_token", token);
  localStorage.setItem("tabiri_refresh", refresh);
}

export function clearToken() {
  localStorage.removeItem("tabiri_token");
  localStorage.removeItem("tabiri_refresh");
}

// ── Base fetch wrapper ────────────────────────────────────────

async function req<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────

export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  password: string;
  date_of_birth: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: { access_token: string; refresh_token: string; expires_in: number };
}

export const auth = {
  register: (data: RegisterData) =>
    req<AuthResponse>("/v1/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: LoginData) =>
    req<AuthResponse>("/v1/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () =>
    req("/v1/auth/logout", { method: "POST" }),
};

// ── Markets ───────────────────────────────────────────────────

export interface Market {
  id: string;
  title: string;
  description?: string;
  resolution_rules?: string;
  category: string;
  status: string;
  liquidity_b: number;
  q_yes: number;
  q_no: number;
  yes_price: number;
  volume_kobo: number;
  trade_count: number;
  closes_at: string;
  resolved_at?: string;
  outcome?: string;
  created_at: string;
}

export interface PricePoint {
  id: string;
  market_id: string;
  probability: number;
  recorded_at: string;
}

export const markets = {
  list: (category?: string) =>
    req<{ markets: Market[]; count: number }>(
      `/v1/markets${category && category !== "all" ? `?category=${category}` : ""}`
    ),

  get: (id: string) =>
    req<{ market: Market }>(`/v1/markets/${id}`),

  history: (id: string) =>
    req<{ history: PricePoint[] }>(`/v1/markets/${id}/history`),
};

// ── Orders ────────────────────────────────────────────────────

export interface TradePreview {
  market_id: string;
  side: string;
  amount_kes: number;
  shares: number;
  fee_kes: number;
  excise_kes: number;
  total_kes: number;
  payout_kes: number;
  profit_kes: number;
  roi_pct: number;
  price_impact: number;
  new_yes_price: number;
}

export interface Position {
  id: string;
  user_id: string;
  market_id: string;
  side: string;
  shares: number;
  avg_cost_kobo: number;
  total_cost_kobo: number;
  settled: boolean;
  payout_kobo?: number;
  created_at: string;
}

export const orders = {
  preview: (market_id: string, side: string, amount_kes: number) =>
    req<TradePreview>("/v1/orders/preview", {
      method: "POST",
      body: JSON.stringify({ market_id, side, amount_kes }),
    }),

  buy: (market_id: string, side: string, amount_kes: number) =>
    req("/v1/orders/buy", {
      method: "POST",
      body: JSON.stringify({ market_id, side, amount_kes }),
    }),

  positions: () =>
    req<{ positions: Position[] }>("/v1/orders/positions"),
};

// ── Wallet ────────────────────────────────────────────────────

export interface Wallet {
  id: string;
  user_id: string;
  balance_kobo: number;
  pending_kobo: number;
  total_deposited: number;
  total_withdrawn: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount_kobo: number;
  balance_after_kobo: number;
  description: string;
  status: string;
  created_at: string;
}

export const wallet = {
  get: () =>
    req<{ wallet: Wallet; balance_kes: number }>("/v1/wallet"),

  transactions: () =>
    req<{ transactions: Transaction[] }>("/v1/wallet/transactions"),

  deposit: (amount_kes: number, phone: string) =>
    req("/v1/mpesa/deposit", {
      method: "POST",
      body: JSON.stringify({ amount_kes, phone }),
    }),

  withdraw: (amount_kes: number, phone: string) =>
    req("/v1/mpesa/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount_kes, phone }),
    }),

  setLimit: (limit_kes: number | null) =>
    req("/v1/wallet/limits", {
      method: "PUT",
      body: JSON.stringify({ limit_kes }),
    }),
};

// ── User ──────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  kyc_status: string;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────

export function formatKES(kobo: number): string {
  return `KES ${(kobo / 100).toLocaleString("en-KE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
