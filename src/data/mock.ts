import { Market, Position, Wallet, User } from "@/types";

// All timestamps are FIXED offsets — no Date.now() at module level
// This prevents SSR/client hydration mismatches
const BASE = 1742000000000; // fixed base timestamp
const hour = 3_600_000;
const day  = 86_400_000;

// Fully deterministic price history — no Math.random()
function priceHistory(
  points: number[]
): { timestamp: number; probability: number }[] {
  return points.map((probability, i) => ({
    timestamp: BASE - (points.length - i) * (2 * hour),
    probability,
  }));
}

export const MOCK_MARKETS: Market[] = [
  {
    id: "m1",
    title: "Will USD/KES close above 130 this Friday?",
    category: "economics",
    status: "open",
    yesPrice: 67,
    volume: 48300,
    trades: 891,
    closesAt: BASE + 3 * hour + 14 * 60_000,
    priceHistory: priceHistory([55,56,58,57,60,59,61,63,62,64,63,65,64,65,66,65,67,66,68,67,66,67,68,67]),
    description: "Resolves YES if the official CBK mid-rate closes above 130 KES/USD on Friday 21 March 2026.",
    resolutionRules: "Source: Central Bank of Kenya daily rates published by 6 PM EAT.",
    liquidityB: 80,
    createdAt: BASE - 5 * day,
  },
  {
    id: "m2",
    title: "Kenya to win AFCON 2026?",
    category: "football",
    status: "open",
    yesPrice: 31,
    volume: 22100,
    trades: 443,
    closesAt: BASE + 4 * day,
    priceHistory: priceHistory([20,21,22,23,21,22,24,23,25,24,26,25,27,26,28,27,29,28,30,29,30,31,30,31]),
    description: "Resolves YES if Harambee Stars win the 2026 Africa Cup of Nations.",
    resolutionRules: "Source: CAF official results.",
    liquidityB: 100,
    createdAt: BASE - 3 * day,
  },
  {
    id: "m3",
    title: "Will parliament pass the Finance Bill before end of March?",
    category: "politics",
    status: "open",
    yesPrice: 44,
    volume: 71500,
    trades: 1204,
    closesAt: BASE + 12 * day,
    priceHistory: priceHistory([60,59,58,57,56,55,54,53,52,51,50,49,50,48,47,48,46,47,45,46,44,45,44,44]),
    description: "Resolves YES if the Finance Bill 2026 receives presidential assent before 31 March 2026.",
    resolutionRules: "Source: Kenya Gazette, official parliamentary records.",
    liquidityB: 150,
    createdAt: BASE - 8 * day,
  },
  {
    id: "m4",
    title: "Which song tops Kenyan Spotify charts this Sunday?",
    category: "entertainment",
    status: "open",
    yesPrice: 58,
    volume: 9800,
    trades: 267,
    closesAt: BASE + 2 * day,
    priceHistory: priceHistory([50,51,52,51,53,52,54,53,55,54,55,56,55,57,56,57,58,57,58,57,58,58,57,58]),
    description: "Will 'Wamlambez 2.0' be #1 on the Kenya Spotify Daily Top 50 this Sunday?",
    resolutionRules: "Source: Spotify Charts Kenya, published every Sunday midnight.",
    liquidityB: 60,
    createdAt: BASE - 2 * day,
  },
  {
    id: "m5",
    title: "Will it rain in Nairobi CBD this Saturday?",
    category: "weather",
    status: "open",
    yesPrice: 72,
    volume: 5200,
    trades: 198,
    closesAt: BASE + 1 * day + 6 * hour,
    priceHistory: priceHistory([60,61,62,63,62,64,63,65,64,66,65,67,66,68,67,68,69,70,69,71,70,71,72,72]),
    description: "Resolves YES if Nairobi CBD records measurable rainfall (≥0.1mm) on Saturday.",
    resolutionRules: "Source: Kenya Meteorological Department daily bulletin.",
    liquidityB: 50,
    createdAt: BASE - 1 * day,
  },
  {
    id: "m6",
    title: "Will Man City finish top of EPL this season?",
    category: "football",
    status: "open",
    yesPrice: 23,
    volume: 34600,
    trades: 712,
    closesAt: BASE + 60 * day,
    priceHistory: priceHistory([35,34,33,34,32,33,31,32,30,31,29,30,28,29,27,28,26,27,25,26,24,25,24,23]),
    description: "Resolves YES if Manchester City finish 1st in the 2025/26 Premier League table.",
    resolutionRules: "Source: Premier League official standings at season end.",
    liquidityB: 120,
    createdAt: BASE - 14 * day,
  },
];

export const MOCK_POSITIONS: Position[] = [
  {
    id: "p1",
    marketId: "m1",
    market: MOCK_MARKETS[0],
    side: "yes",
    shares: 50,
    avgCost: 58,
    totalCost: 2900,
    currentValue: 3350,
    pnl: 450,
    pnlPct: 15.5,
    createdAt: BASE - 2 * day,
  },
  {
    id: "p2",
    marketId: "m3",
    market: MOCK_MARKETS[2],
    side: "no",
    shares: 80,
    avgCost: 65,
    totalCost: 5200,
    currentValue: 4480,
    pnl: -720,
    pnlPct: -13.8,
    createdAt: BASE - 4 * day,
  },
  {
    id: "p3",
    marketId: "m5",
    market: MOCK_MARKETS[4],
    side: "yes",
    shares: 30,
    avgCost: 68,
    totalCost: 2040,
    currentValue: 2160,
    pnl: 120,
    pnlPct: 5.9,
    createdAt: BASE - 1 * day,
  },
];

export const MOCK_WALLET: Wallet = {
  balance: 12405,
  pendingWithdrawal: 0,
  totalDeposited: 25000,
  totalWithdrawn: 8000,
  transactions: [
    { id: "t1", type: "deposit",    amount:  5000,  description: "M-Pesa deposit",                    status: "completed", createdAt: BASE - 5 * day },
    { id: "t2", type: "buy",        amount: -2900,  description: "Bought YES · USD/KES > 130",        status: "completed", createdAt: BASE - 2 * day, marketId: "m1" },
    { id: "t3", type: "buy",        amount: -5200,  description: "Bought NO · Finance Bill March",    status: "completed", createdAt: BASE - 4 * day, marketId: "m3" },
    { id: "t4", type: "deposit",    amount: 10000,  description: "M-Pesa deposit",                    status: "completed", createdAt: BASE - 10 * day },
    { id: "t5", type: "withdrawal", amount: -8000,  description: "M-Pesa withdrawal",                 status: "completed", createdAt: BASE - 7 * day },
    { id: "t6", type: "buy",        amount: -2040,  description: "Bought YES · Rain in Nairobi",      status: "completed", createdAt: BASE - 1 * day, marketId: "m5" },
    { id: "t7", type: "payout",     amount:  1200,  description: "Payout · EPL Top Scorer (resolved)",status: "completed", createdAt: BASE - 3 * day },
  ],
};

export const MOCK_USER: User = {
  id: "u1",
  name: "Amara Osei",
  phone: "+254712345678",
  email: "amara@example.com",
  kycStatus: "verified",
  wallet: MOCK_WALLET,
  joinedAt: BASE - 30 * day,
};
