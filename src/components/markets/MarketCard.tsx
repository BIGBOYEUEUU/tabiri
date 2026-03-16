"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Market } from "@/types";
import { B, CAT_COLOURS, card, pill } from "@/lib/brand";
import { formatKESShort, formatCountdown, CATEGORY_LABELS } from "@/lib/utils";

interface Props { market: Market; delay?: number; }

export function MarketCard({ market, delay = 0 }: Props) {
  const { id, title, category, yesPrice, volume, trades, closesAt, priceHistory } = market;
  const noPrice = 100 - yesPrice;
  const cat = CAT_COLOURS[category] ?? CAT_COLOURS.other;

  const [countdown, setCountdown] = useState<string | null>(null);
  const [isHot, setIsHot] = useState(false);

  useEffect(() => {
    const upd = () => {
      setCountdown(formatCountdown(closesAt));
      setIsHot(closesAt - Date.now() < 6 * 3_600_000);
    };
    upd();
    const t = setInterval(upd, 30_000);
    return () => clearInterval(t);
  }, [closesAt]);

  const trend = priceHistory.length >= 2
    ? priceHistory[priceHistory.length - 1].probability - priceHistory[0].probability : 0;

  return (
    <Link href={`/markets/${id}`}
      style={{ textDecoration: "none", display: "block", animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms both` }}>
      <div style={card()}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = B.shadowCardHover; el.style.borderColor = `${B.teal}40`; el.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = B.shadowCard; el.style.borderColor = B.border; el.style.transform = "none"; }}
        className="market-card-inner">

        {/* Category accent line — brand spec */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${cat.accent}, transparent)` }} />

        <div style={{ padding: 16 }}>

          {/* Row 1: category badge + trend */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={pill(cat.bg, cat.text)}>{CATEGORY_LABELS[category]}</span>
            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: B.fontMono, color: trend > 2 ? B.teal : trend < -2 ? B.danger : B.muted, display: "flex", alignItems: "center", gap: 3 }}>
              {trend > 2  ? <TrendingUp  style={{ width: 12, height: 12 }} /> :
               trend < -2 ? <TrendingDown style={{ width: 12, height: 12 }} /> :
                            <Minus        style={{ width: 12, height: 12 }} />}
              {trend > 0 ? "+" : ""}{trend.toFixed(0)}%
            </span>
          </div>

          {/* Row 2: title — DM Sans medium, 14px per spec */}
          <h3 style={{
            fontFamily: B.fontSans, fontWeight: 500, fontSize: 14, color: B.ink,
            lineHeight: 1.45, marginBottom: 14, minHeight: 40,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{title}</h3>

          {/* Row 3: probability — Syne bold per spec */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
            <div style={{ lineHeight: 1 }}>
              <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 28, color: B.teal }}>{yesPrice}</span>
              <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18, color: `${B.teal}50` }}>%</span>
            </div>
            <div style={{ flex: 1, paddingBottom: 3 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, fontFamily: B.fontSans, color: B.muted, marginBottom: 5 }}>
                <span>YES</span><span>NO</span>
              </div>
              {/* Probability bar — teal gradient per spec */}
              <div style={{ height: 8, background: "#FEE2E2", borderRadius: B.rPill, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${yesPrice}%`, background: B.gradTeal, borderRadius: B.rPill, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>

          {/* Row 4: YES/NO buttons — per brand spec: teal-soft / red-soft */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <button onClick={e => e.preventDefault()} style={{
              padding: "9px 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: B.fontSans,
              background: B.tealLight, color: B.tealDark,
              border: `1.5px solid ${B.teal}30`, borderRadius: B.rBtn,
            }}>YES <span style={{ fontFamily: B.fontMono, fontWeight: 400 }}>{yesPrice}%</span>
            </button>
            <button onClick={e => e.preventDefault()} style={{
              padding: "9px 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: B.fontSans,
              background: "#FEF2F2", color: "#B91C1C",
              border: "1.5px solid rgba(239,68,68,0.25)", borderRadius: B.rBtn,
            }}>NO <span style={{ fontFamily: B.fontMono, fontWeight: 400 }}>{noPrice}%</span>
            </button>
          </div>

          {/* Row 5: meta — volume + countdown */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11, fontFamily: B.fontMono, color: B.muted }}>
              {formatKESShort(volume)} · {trades.toLocaleString()} trades
            </span>
            {countdown !== null && (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                fontSize: 11, fontWeight: 600, fontFamily: B.fontSans,
                padding: "3px 8px", borderRadius: B.rPill,
                background: isHot ? B.goldLight : "transparent",
                color: isHot ? B.gold : B.muted,
              }}>
                {isHot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: B.gold, display: "inline-block", animation: "pulseDot 1.8s ease infinite" }} />}
                <Clock style={{ width: 11, height: 11 }} />
                {countdown}
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.35} }
        .market-card-inner { transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s; }
      `}</style>
    </Link>
  );
}
