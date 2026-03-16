"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Users, BarChart3, Info, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { markets as marketsAPI, orders as ordersAPI, Market, PricePoint, getToken } from "@/lib/api";
import { B, CAT_COLOURS } from "@/lib/brand";
import { formatKES, formatKESShort, formatCountdown, formatDate, CATEGORY_LABELS, costToBuy } from "@/lib/utils";

const S = {
  card: { background: "white", borderRadius: 16, border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden" } as React.CSSProperties,
};

function ChartTip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: B.navy, color: "white", padding: "8px 12px", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
      <div style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18 }}>{d.probability}%</div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
        {new Date(d.recorded_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

function TradePanel({ market }: { market: Market }) {
  const [side,   setSide]  = useState<"yes" | "no">("yes");
  const [amount, setAmt]   = useState("100");
  const [loading, setLoading] = useState(false);
  const [msg,    setMsg]   = useState("");
  const amtN    = parseFloat(amount) || 0;
  const priceKES = side === "yes" ? market.yes_price : (100 - market.yes_price);
  const shares   = amtN > 0 && priceKES > 0 ? Math.floor(amtN / priceKES) : 0;
  const fee      = Math.max(5, amtN * 0.035);
  const excise   = amtN * 0.05;
  const total    = amtN + fee + excise;
  const payout   = shares * 100;
  const profit   = payout - total;
  const roi      = total > 0 ? (profit / total) * 100 : 0;
  const QUICK    = [50, 100, 200, 500];
  const loggedIn = !!getToken();

  const handleBuy = async () => {
    if (!loggedIn) { setMsg("Sign in to trade"); return; }
    setLoading(true); setMsg("");
    try {
      await ordersAPI.buy(market.id, side, amtN);
      setMsg("✓ Order placed successfully!");
    } catch (e: any) {
      setMsg(e.message || "Failed to place order");
    }
    setLoading(false);
  };

  return (
    <div style={S.card}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 15, color: B.ink }}>Place trade</span>
      </div>
      <div style={{ padding: 16 }}>
        {/* Side toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "#F1F5F9", padding: 4, borderRadius: 12, marginBottom: 16 }}>
          {(["yes", "no"] as const).map(s => (
            <button key={s} onClick={() => setSide(s)} style={{
              padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
              fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 13, transition: "all 0.15s",
              background: side === s ? (s === "yes" ? B.teal : "#DC2626") : "transparent",
              color: side === s ? "white" : B.muted,
              boxShadow: side === s ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
            }}>
              {s.toUpperCase()} <span style={{ fontFamily: B.fontMono, fontWeight: 400, opacity: 0.8, fontSize: 12 }}>
                {s === "yes" ? market.yes_price : 100 - market.yes_price}%
              </span>
            </button>
          ))}
        </div>

        {/* Quick amounts */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => setAmt(String(q))} style={{
              padding: "7px 0", borderRadius: 8, cursor: "pointer",
              fontFamily: B.fontMono, fontSize: 12, fontWeight: 500, transition: "all 0.15s",
              background: amtN === q ? B.navy : B.surface,
              color: amtN === q ? "white" : B.ink2,
              border: amtN === q ? `1.5px solid ${B.navy}` : `1.5px solid ${B.border}`,
            }}>{q}</button>
          ))}
        </div>

        {/* Custom amount */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: B.muted, fontFamily: B.fontMono }}>KES</span>
          <input type="number" value={amount} onChange={e => setAmt(e.target.value)} min={50}
            style={{ width: "100%", paddingLeft: 44, paddingRight: 12, paddingTop: 10, paddingBottom: 10, fontSize: 14, fontFamily: B.fontMono, border: `1.5px solid ${B.border}`, borderRadius: 10, outline: "none", color: B.ink }} />
        </div>

        {/* Breakdown */}
        {amtN >= 50 && (
          <>
            <div style={{ background: B.surface, borderRadius: 10, padding: 12, marginBottom: 8 }}>
              {[["Shares received", String(shares), B.ink], ["Fee (3.5%)", formatKES(fee), B.ink2], ["Excise (5%)", formatKES(excise), B.ink2]].map(([l, v, c]) => (
                <div key={String(l)} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: B.ink2 }}>
                  <span>{l}</span><span style={{ fontFamily: B.fontMono, color: String(c) }}>{v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, paddingTop: 8, borderTop: `1px solid ${B.border}`, color: B.ink }}>
                <span>You pay</span><span style={{ fontFamily: B.fontMono }}>{formatKES(total)}</span>
              </div>
            </div>

            <div style={{ borderRadius: 10, padding: 12, marginBottom: 14, border: `1.5px solid ${B.teal}30`, background: B.tealLight }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: B.teal, marginBottom: 10 }}>If {side.toUpperCase()} wins</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5, color: B.ink2 }}>
                <span>Payout ({shares} × KES 100)</span>
                <span style={{ fontFamily: B.fontMono, color: B.ink, fontWeight: 600 }}>{formatKES(payout)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: B.ink2, paddingBottom: 10, borderBottom: `1px solid ${B.teal}20` }}>
                <span>Profit</span>
                <span style={{ fontFamily: B.fontMono, color: profit >= 0 ? B.teal : B.danger, fontWeight: 600 }}>
                  {profit >= 0 ? "+" : ""}{formatKES(profit)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10 }}>
                <span style={{ fontSize: 12, color: B.ink2 }}>ROI</span>
                <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 20, color: profit >= 0 ? B.teal : B.danger }}>
                  {roi >= 0 ? "+" : ""}{roi.toFixed(1)}%
                </span>
              </div>
            </div>
          </>
        )}

        {msg && (
          <div style={{ padding: 10, borderRadius: 10, marginBottom: 12, fontSize: 12, textAlign: "center", background: msg.startsWith("✓") ? B.tealLight : "#FEF2F2", color: msg.startsWith("✓") ? B.teal : B.danger }}>
            {msg}
          </div>
        )}

        <button onClick={handleBuy} disabled={amtN < 50 || loading} style={{
          width: "100%", padding: "13px 0", borderRadius: 10, border: "none",
          cursor: amtN >= 50 ? "pointer" : "not-allowed",
          fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 14, color: "white",
          background: amtN >= 50 ? (side === "yes" ? B.gradTeal : "linear-gradient(135deg,#DC2626,#EF4444)") : B.border,
          opacity: loading ? 0.7 : 1,
        }}>
          {loading ? "Placing order…" : amtN >= 50 ? `Buy ${side.toUpperCase()} · ${formatKES(amtN)}` : "Minimum KES 50"}
        </button>
        <p style={{ fontSize: 10, color: B.muted, textAlign: "center", marginTop: 10 }}>Regulated by GRA Kenya · Funds held securely</p>
      </div>
    </div>
  );
}

export default function MarketPage() {
  const { id } = useParams<{ id: string }>();
  const [market,  setMarket]  = useState<Market | null>(null);
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [{ market: m }, { history: h }] = await Promise.all([
          marketsAPI.get(id),
          marketsAPI.history(id),
        ]);
        setMarket(m);
        setHistory(h || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    if (!market) return;
    const closesAt = new Date(market.closes_at).getTime();
    const upd = () => setCountdown(formatCountdown(closesAt));
    upd();
    const t = setInterval(upd, 30_000);
    return () => clearInterval(t);
  }, [market]);

  if (loading) return (
    <div style={{ paddingTop: 56, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100svh" }}>
      <p style={{ color: B.muted, fontSize: 14 }}>Loading market…</p>
    </div>
  );

  if (!market) return (
    <div style={{ paddingTop: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100svh", gap: 12 }}>
      <p style={{ fontSize: 14, color: B.ink2 }}>Market not found</p>
      <Link href="/" style={{ color: B.teal, fontSize: 14 }}>Back to markets</Link>
    </div>
  );

  const noPrice  = 100 - market.yes_price;
  const closesAt = new Date(market.closes_at).getTime();
  const cat      = CAT_COLOURS[market.category] ?? CAT_COLOURS.other;

  // Format history for chart
  const chartData = history.map(p => ({
    probability: p.probability,
    recorded_at: p.recorded_at,
  }));

  return (
    <div style={{ paddingTop: 56, background: B.surface, minHeight: "100svh" }}>
      <main style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px 96px" }}>

        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: B.ink2, textDecoration: "none", padding: "16px 0 8px" }}>
          <ArrowLeft style={{ width: 16, height: 16 }} /> Back to markets
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }} className="md-2col">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Market header */}
            <div style={S.card}>
              <div style={{ height: 4, background: `linear-gradient(90deg,${cat.accent},transparent)` }} />
              <div style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 9999, textTransform: "uppercase", letterSpacing: "0.06em", background: cat.bg, color: cat.text }}>
                    {CATEGORY_LABELS[market.category] || market.category}
                  </span>
                  {countdown && (
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 9999, background: B.surface, color: B.muted }}>
                      <Clock style={{ width: 12, height: 12 }} />{countdown}
                    </span>
                  )}
                </div>

                <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 20, color: B.ink, lineHeight: 1.35, marginBottom: 20 }}>
                  {market.title}
                </h1>

                <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
                  <div>
                    <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 52, color: B.teal, lineHeight: 1 }}>{market.yes_price}</span>
                    <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 28, color: `${B.teal}35` }}>%</span>
                    <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>chance YES</div>
                  </div>
                  <div style={{ flex: 1, paddingBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: B.fontMono, fontWeight: 600, marginBottom: 6 }}>
                      <span style={{ color: B.teal }}>YES · {market.yes_price}%</span>
                      <span style={{ color: B.danger }}>NO · {noPrice}%</span>
                    </div>
                    <div style={{ height: 12, background: "#FEE2E2", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${market.yes_price}%`, background: B.gradTeal, borderRadius: 9999 }} />
                    </div>
                    <div style={{ fontSize: 11, color: B.muted, marginTop: 6 }}>
                      Closes {formatDate(closesAt)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 16, borderTop: `1px solid ${B.border}` }}>
                  {[
                    { icon: BarChart3, label: "Volume",  val: formatKESShort(market.volume_kobo / 100), bg: B.tealLight, color: B.teal },
                    { icon: Users,     label: "Trades",  val: market.trade_count.toLocaleString(),       bg: B.navyLight, color: B.navy },
                  ].map(({ icon: Icon, label, val, bg, color }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon style={{ width: 16, height: 16, color }} />
                      </div>
                      <div>
                        <div style={{ fontFamily: B.fontMono, fontWeight: 600, fontSize: 14, color: B.ink }}>{val}</div>
                        <div style={{ fontSize: 10, color: B.muted }}>{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div style={S.card}>
              <div style={{ padding: "16px 20px 4px" }}>
                <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 15, color: B.ink }}>Probability history</span>
              </div>
              <div style={{ height: 200, padding: "0 8px 12px" }}>
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
                      <defs>
                        <linearGradient id="tG" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#0F766E" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#0F766E" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="recorded_at" tickFormatter={v => new Date(v).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                        tick={{ fontSize: 10, fill: B.muted }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                      <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: B.muted }} axisLine={false} tickLine={false} />
                      <ReferenceLine y={50} stroke={B.border} strokeDasharray="4 2" />
                      <Tooltip content={<ChartTip />} cursor={{ stroke: B.teal, strokeWidth: 1, strokeDasharray: "3 3" }} />
                      <Area type="monotone" dataKey="probability" stroke={B.teal} strokeWidth={2.5} fill="url(#tG)"
                        dot={false} activeDot={{ r: 5, fill: B.teal, stroke: "white", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: B.muted, fontSize: 13 }}>
                    Chart will populate as trades occur
                  </div>
                )}
              </div>
            </div>

            {/* Resolution rules */}
            {market.description && (
              <div style={S.card}>
                <div style={{ padding: 16, display: "flex", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: B.tealLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Info style={{ width: 14, height: 14, color: B.teal }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 14, color: B.ink, marginBottom: 6 }}>Resolution rules</div>
                    <p style={{ fontSize: 13, color: B.ink2, lineHeight: 1.6 }}>{market.description}</p>
                    {market.resolution_rules && (
                      <p style={{ fontSize: 11, fontFamily: B.fontMono, color: B.muted, marginTop: 8, background: B.surface, padding: "6px 10px", borderRadius: 8 }}>
                        {market.resolution_rules}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — trade panel */}
          <div>
            <div style={{ position: "sticky", top: 72 }}>
              <TradePanel market={market} />
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .md-2col { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
