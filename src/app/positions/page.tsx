"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ArrowRight, Clock } from "lucide-react";
import { orders as ordersAPI, markets as marketsAPI, Position, Market, getToken } from "@/lib/api";
import { B, CAT_COLOURS, card, pill } from "@/lib/brand";
import { formatKES, formatCountdown, CATEGORY_LABELS } from "@/lib/utils";

function Countdown({ closesAt }: { closesAt: number }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const upd = () => setLabel(formatCountdown(closesAt));
    upd();
    const t = setInterval(upd, 30_000);
    return () => clearInterval(t);
  }, [closesAt]);
  if (!label) return null;
  return <span style={{ fontFamily: B.fontMono, fontSize: 11 }}>{label}</span>;
}

interface PositionWithMarket extends Position {
  market?: Market;
}

export default function PositionsPage() {
  const [positions, setPositions] = useState<PositionWithMarket[]>([]);
  const [loading,   setLoading]   = useState(true);
  const loggedIn = !!getToken();

  useEffect(() => {
    if (!loggedIn) { setLoading(false); return; }
    const load = async () => {
      try {
        const { positions: pos } = await ordersAPI.positions();
        // Fetch market data for each position
        const withMarkets = await Promise.all(
          (pos || []).map(async p => {
            try {
              const { market } = await marketsAPI.get(p.market_id);
              return { ...p, market };
            } catch {
              return p;
            }
          })
        );
        setPositions(withMarkets);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const totalCost = positions.reduce((s, p) => s + p.total_cost_kobo / 100, 0);

  return (
    <div style={{ paddingTop: 56, background: B.surface, minHeight: "100svh" }}>
      <main style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px 96px" }}>

        <div style={{ padding: "28px 0 20px" }}>
          <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 28, color: B.ink, marginBottom: 4 }}>Positions</h1>
          <p style={{ fontSize: 14, color: B.muted }}>Your open trades</p>
        </div>

        {!loggedIn ? (
          <div style={{ ...card({ padding: 32 }), textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: B.ink, marginBottom: 8 }}>Sign in to view your positions</p>
            <a href="/auth/login" style={{ ...pill(B.teal, "white"), fontSize: 14, padding: "11px 28px", textDecoration: "none", display: "inline-block" }}>Sign in</a>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: B.muted }}>Loading positions…</div>
        ) : positions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>📊</div>
            <p style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18, color: B.ink, marginBottom: 6 }}>No open positions</p>
            <p style={{ fontSize: 14, color: B.muted, marginBottom: 20 }}>Browse markets and place your first trade</p>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: B.rBtn, background: B.gradTeal, color: "white", textDecoration: "none", fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 14 }}>
              Browse markets <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {positions.map(pos => {
              const m = pos.market;
              const yesPrice = m?.yes_price ?? 50;
              const cat = CAT_COLOURS[m?.category ?? "other"] ?? CAT_COLOURS.other;
              const closesAt = m ? new Date(m.closes_at).getTime() : Date.now();
              // All in KES — shares × current price per share
              const currentPriceKES = pos.side === "yes" ? yesPrice : (100 - yesPrice);
              const currentValueKES = pos.shares * currentPriceKES;
              const costKES = pos.total_cost_kobo / 100;
              const pnlKES = currentValueKES - costKES;
              const pw = pnlKES >= 0;

              return (
                <Link key={pos.id} href={`/markets/${pos.market_id}`} style={{ textDecoration: "none" }}>
                  <div style={card()}>
                    <div style={{ height: 3, background: `linear-gradient(90deg,${pw ? B.teal : B.danger},transparent)` }} />
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                        <span style={pill(pos.side === "yes" ? B.tealLight : "#FEF2F2", pos.side === "yes" ? B.tealDark : "#B91C1C")}>{pos.side}</span>
                        <p style={{ flex: 1, fontSize: 14, fontWeight: 500, color: B.ink, lineHeight: 1.4, margin: 0 }}>
                          {m?.title ?? pos.market_id}
                        </p>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 15, color: pw ? B.teal : B.danger }}>
                            {pw ? "+" : ""}{formatKES(pnlKES)}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: B.muted, marginBottom: 10 }}>
                        <span>
                          <span style={{ fontFamily: B.fontMono, fontWeight: 600, color: B.ink }}>{pos.shares}</span> shares ·
                          cost <span style={{ fontFamily: B.fontMono, color: B.ink2 }}>{formatKES(costKES)}</span>
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock style={{ width: 11, height: 11 }} />
                          <Countdown closesAt={closesAt} />
                        </span>
                      </div>
                      <div style={{ height: 6, background: "#FEE2E2", borderRadius: B.rPill, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${yesPrice}%`, background: B.gradTeal, borderRadius: B.rPill }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
