import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Formatters ──────────────────────────────────────────────────────────────

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatKESShort(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `KES ${(amount / 1_000).toFixed(1)}K`;
  return `KES ${amount}`;
}

export function formatPct(n: number): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function formatCountdown(closesAt: number): string {
  const diff = closesAt - Date.now();
  if (diff <= 0) return "Closed";

  const days    = Math.floor(diff / 86_400_000);
  const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000)  / 60_000);

  if (days > 0)   return `${days}d ${hours}h`;
  if (hours > 0)  return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

// ── LMSR pricing ─────────────────────────────────────────────────────────────

export function lmsrCost(qYes: number, qNo: number, b: number): number {
  return b * Math.log(Math.exp(qYes / b) + Math.exp(qNo / b));
}

export function lmsrPrice(qYes: number, qNo: number, b: number): number {
  const eY = Math.exp(qYes / b);
  const eN = Math.exp(qNo / b);
  return eY / (eY + eN);
}

export function costToBuy(
  qYes: number,
  qNo: number,
  shares: number,
  side: "yes" | "no",
  b: number
): number {
  const before = lmsrCost(qYes, qNo, b);
  const after  = side === "yes"
    ? lmsrCost(qYes + shares, qNo, b)
    : lmsrCost(qYes, qNo + shares, b);
  return after - before;
}

// ── Category helpers ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  politics:      "Politics",
  economics:     "Economics",
  football:      "Football",
  entertainment: "Entertainment",
  weather:       "Weather",
  other:         "Other",
};

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  politics:      { bg: "bg-teal-50",  text: "text-teal-800" },
  economics:     { bg: "bg-navy-50",  text: "text-navy-600" },
  football:      { bg: "bg-teal-100", text: "text-teal-800" },
  entertainment: { bg: "bg-gold-50",  text: "text-gold-800" },
  weather:       { bg: "bg-neutral-100", text: "text-neutral-600" },
  other:         { bg: "bg-neutral-100", text: "text-neutral-600" },
};
