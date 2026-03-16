"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Briefcase, Wallet, UserCircle, TrendingUp, Plus } from "lucide-react";
import { B } from "@/lib/brand";
import { wallet as walletAPI, getToken, clearToken } from "@/lib/api";

const NAV = [
  { href: "/",          label: "Markets",   icon: LayoutGrid },
  { href: "/positions", label: "Positions", icon: Briefcase  },
  { href: "/wallet",    label: "Wallet",    icon: Wallet     },
  { href: "/profile",   label: "Profile",   icon: UserCircle },
];

export function Navbar() {
  const path = usePathname();
  const [balance, setBalance] = useState<number | null>(null);
  const loggedIn = !!getToken();

  useEffect(() => {
    if (!loggedIn) return;
    walletAPI.get()
      .then(r => setBalance(r.wallet.balance_kobo / 100))
      .catch(() => {});
  }, [loggedIn]);

  return (
    <>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 56, background: B.navy, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${B.teal} 30%,${B.tealMid} 50%,${B.teal} 70%,transparent)` }} />
        <div style={{ maxWidth: 1024, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>

          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: B.gradTeal, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp style={{ width: 15, height: 15, color: "white" }} strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.01em" }}>tabiri</span>
          </Link>

          <nav style={{ display: "none" }} className="md-nav">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} style={{ padding: "6px 14px", borderRadius: B.rBtn, fontSize: 13, fontWeight: 500, fontFamily: B.fontSans, textDecoration: "none", transition: "all 0.15s", background: path === href ? "rgba(255,255,255,0.1)" : "transparent", color: path === href ? "white" : "rgba(255,255,255,0.5)" }}>
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loggedIn && balance !== null && (
              <div className="nav-balance" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: B.rBtn, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: B.fontSans }}>Balance</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "white", fontFamily: B.fontMono }}>KES {balance.toLocaleString()}</span>
              </div>
            )}
            {!loggedIn && (
              <Link href="/auth/login" className="nav-balance" style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderRadius: B.rBtn, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.7)", textDecoration: "none", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: B.fontSans }}>
                Sign in
              </Link>
            )}
            <Link href="/wallet" style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: B.rBtn, background: B.gradGold, color: "white", textDecoration: "none", fontSize: 13, fontWeight: 700, fontFamily: B.fontDisplay, boxShadow: "0 2px 8px rgba(217,119,6,0.35)" }}>
              <Plus style={{ width: 13, height: 13 }} strokeWidth={3} />
              Deposit
            </Link>
          </div>
        </div>
      </header>

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: B.navy, borderTop: "1px solid rgba(255,255,255,0.07)" }} className="mobile-nav">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: 64, maxWidth: 1024, margin: "0 auto" }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 16px", borderRadius: B.rBtn, textDecoration: "none", color: active ? B.tealMid : "rgba(255,255,255,0.35)", transition: "color 0.15s" }}>
                <Icon style={{ width: 20, height: 20 }} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: 10, fontWeight: 600, fontFamily: B.fontSans }}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .md-nav { display: flex !important; gap: 4px; }
          .mobile-nav { display: none !important; }
          .nav-balance { display: flex !important; }
        }
        @media (max-width: 767px) {
          .nav-balance { display: none !important; }
        }
      `}</style>
    </>
  );
}
