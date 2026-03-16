"use client";
import { useState, useEffect, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { MarketCard } from "@/components/markets/MarketCard";
import { markets as marketsAPI, Market } from "@/lib/api";
import { B } from "@/lib/brand";
import { formatKESShort } from "@/lib/utils";

const CATS = [
  { id: "all",           label: "All" },
  { id: "football",      label: "⚽  Football" },
  { id: "politics",      label: "🏛  Politics" },
  { id: "economics",     label: "📈  Economics" },
  { id: "entertainment", label: "🎵  Entertainment" },
  { id: "weather",       label: "🌧  Weather" },
];

export default function Home() {
  const [cat,     setCat]     = useState("all");
  const [sort,    setSort]    = useState("volume");
  const [search,  setSearch]  = useState("");
  const [data,    setData]    = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    marketsAPI.list(cat)
      .then(res => { setData(res.markets || []); setError(null); })
      .catch(() => setError("Failed to load markets"))
      .finally(() => setLoading(false));
  }, [cat]);

  const markets = useMemo(() => {
    let m = data;
    if (search.trim()) {
      const q = search.toLowerCase();
      m = m.filter(x => x.title.toLowerCase().includes(q));
    }
    switch (sort) {
      case "volume":  return [...m].sort((a, b) => b.volume_kobo - a.volume_kobo);
      case "closing": return [...m].sort((a, b) => new Date(a.closes_at).getTime() - new Date(b.closes_at).getTime());
      default:        return [...m].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [data, sort, search]);

  const totalVol = data.reduce((s, m) => s + m.volume_kobo, 0);

  // Convert API market to the shape MarketCard expects
  const toCardMarket = (m: Market) => ({
    id: m.id,
    title: m.title,
    category: m.category as any,
    status: m.status as "open" | "closed" | "resolved",
    yesPrice: m.yes_price,
    volume: m.volume_kobo / 100,
    trades: m.trade_count,
    closesAt: new Date(m.closes_at).getTime(),
    priceHistory: [],
    description: m.description,
    resolutionRules: m.resolution_rules,
    liquidityB: m.liquidity_b,
    createdAt: new Date(m.created_at).getTime(),
  });

  return (
    <div style={{ paddingTop: 56, background: B.surface, minHeight: "100svh" }}>
      <main style={{ maxWidth: 1024, margin: "0 auto", padding: "0 16px 96px" }}>

        {/* Hero */}
        <div style={{ padding: "28px 0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: B.teal, display: "inline-block", animation: "pulseDot 1.8s ease infinite" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: B.teal, fontFamily: B.fontSans }}>
              {loading ? "Loading…" : `${markets.length} live markets`}
            </span>
          </div>
          <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 34, color: B.ink, lineHeight: 1.15, marginBottom: 6 }}>
            What happens next?
          </h1>
          <p style={{ fontSize: 14, color: B.ink2, fontFamily: B.fontSans }}>
            Trade on real events. Prices move with the crowd.
            {totalVol > 0 && (
              <span style={{ fontFamily: B.fontMono, fontWeight: 500, color: B.teal, marginLeft: 8 }}>
                {formatKESShort(totalVol / 100)} traded today
              </span>
            )}
          </p>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted, pointerEvents: "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <input type="text" placeholder="Search markets…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", height: 44, paddingLeft: 42, paddingRight: 16, fontSize: 14, fontFamily: B.fontSans, color: B.ink, background: B.card, border: `1.5px solid ${B.border}`, borderRadius: B.rBtn, outline: "none", boxShadow: B.shadowCard }}
            onFocus={e => (e.target.style.borderColor = B.teal)}
            onBlur={e  => (e.target.style.borderColor = B.border)} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              style={{ flexShrink: 0, padding: "8px 14px", borderRadius: B.rPill, fontSize: 12, fontWeight: 600, fontFamily: B.fontSans, whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.15s", background: cat === c.id ? B.navy : B.card, color: cat === c.id ? "white" : B.ink2, border: cat === c.id ? `1.5px solid ${B.navy}` : `1.5px solid ${B.border}` }}>
              {c.label}
            </button>
          ))}
          <div style={{ marginLeft: "auto", flexShrink: 0, position: "relative" }}>
            <select value={sort} onChange={e => setSort(e.target.value)}
              style={{ appearance: "none", paddingLeft: 12, paddingRight: 28, paddingTop: 8, paddingBottom: 8, fontSize: 12, fontWeight: 500, fontFamily: B.fontSans, cursor: "pointer", background: B.card, border: `1.5px solid ${B.border}`, borderRadius: B.rBtn, color: B.ink2, outline: "none" }}>
              <option value="volume">Most traded</option>
              <option value="closing">Closing soon</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, color: B.muted, pointerEvents: "none" }} />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: 280, borderRadius: B.rCard, background: B.border, animation: "shimmer 1.4s ease infinite", backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)" }} />
            ))}
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>⚠️</p>
            <p style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 16, color: B.ink, marginBottom: 6 }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ fontSize: 13, fontWeight: 600, color: B.teal, background: "none", border: "none", cursor: "pointer" }}>Try again</button>
          </div>
        ) : markets.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
            {markets.map((m, i) => <MarketCard key={m.id} market={toCardMarket(m)} delay={i * 60} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>🔍</p>
            <p style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18, color: B.ink, marginBottom: 6 }}>No markets yet</p>
            <p style={{ fontSize: 14, color: B.muted, fontFamily: B.fontSans }}>Markets will appear here once they are created</p>
          </div>
        )}
      </main>
      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      `}</style>
    </div>
  );
}
