export type MarketCategory = "politics" | "economics" | "football" | "entertainment" | "weather" | "other";
export type MarketStatus = "open" | "closed" | "resolving" | "resolved";
export type MarketOutcome = "yes" | "no" | null;

export interface PricePoint {
  timestamp: number;
  probability: number;
}

export interface Market {
  id: string;
  title: string;
  category: MarketCategory;
  status: MarketStatus;
  yesPrice: number;       // 0–100 (probability %)
  volume: number;         // KES
  trades: number;
  closesAt: number;       // unix ms
  resolvedAt?: number;
  outcome?: MarketOutcome;
  priceHistory: PricePoint[];
  description?: string;
  resolutionRules?: string;
  liquidityB?: number;    // LMSR b parameter
  createdAt: number;
}

export interface Position {
  id: string;
  marketId: string;
  market: Market;
  side: "yes" | "no";
  shares: number;
  avgCost: number;        // KES per share
  totalCost: number;      // KES
  currentValue: number;   // KES (mark-to-market)
  pnl: number;            // KES
  pnlPct: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "buy" | "sell" | "payout" | "fee";
  amount: number;         // KES (positive = credit, negative = debit)
  description: string;
  marketId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: number;
}

export interface Wallet {
  balance: number;        // KES available
  pendingWithdrawal: number;
  totalDeposited: number;
  totalWithdrawn: number;
  transactions: Transaction[];
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  kycStatus: "pending" | "verified" | "rejected";
  wallet: Wallet;
  joinedAt: number;
}
