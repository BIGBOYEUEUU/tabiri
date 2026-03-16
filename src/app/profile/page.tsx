"use client";
import { useState } from "react";
import { User, Shield, Bell, LogOut, ChevronRight, BarChart3, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { MOCK_USER } from "@/data/mock";
import { B, card } from "@/lib/brand";
import { formatKES, formatDate } from "@/lib/utils";

type RGLimit = "none" | "500" | "1000" | "2000" | "5000";

export default function ProfilePage() {
  const user = MOCK_USER;
  const [limit,   setLimit]   = useState<RGLimit>("none");
  const [session, setSession] = useState(true);
  const [excl,    setExcl]    = useState(false);

  const LIMITS: { v: RGLimit; l: string }[] = [
    { v: "none", l: "No limit" },
    { v: "500",  l: "KES 500/day" },
    { v: "1000", l: "KES 1,000/day" },
    { v: "2000", l: "KES 2,000/day" },
    { v: "5000", l: "KES 5,000/day" },
  ];

  const SETTINGS = [
    { icon: User,      label: "Edit profile",    sub: "Name, email, phone" },
    { icon: Bell,      label: "Notifications",   sub: "Push, SMS, email" },
    { icon: Shield,    label: "Security",        sub: "Password, 2FA" },
    { icon: BarChart3, label: "Trading history", sub: "All resolved markets" },
    { icon: Clock,     label: "Activity log",    sub: "Login and trade history" },
  ];

  return (
    <div style={{ paddingTop: 56, background: B.surface, minHeight: "100svh" }}>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 96px" }}>

        <div style={{ padding: "28px 0 20px" }}>
          <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 28, color: B.ink, marginBottom: 4 }}>Profile</h1>
          <p style={{ fontSize: 14, color: B.muted, fontFamily: B.fontSans }}>Account settings and responsible gambling</p>
        </div>

        {/* Profile card */}
        <div style={{ ...card(), marginBottom: 12 }}>
          <div style={{ padding: "16px 18px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 14 }}>
            {/* Avatar — navy bg, teal initials per spec */}
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: B.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 16, color: B.tealMid }}>
                {user.name.split(" ").map((n: string) => n[0]).join("")}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 16, color: B.ink }}>{user.name}</div>
              <div style={{ fontSize: 12, color: B.muted, fontFamily: B.fontSans }}>{user.phone}</div>
            </div>
            <span style={{ padding: "5px 12px", borderRadius: B.rPill, fontSize: 11, fontWeight: 700, fontFamily: B.fontSans, background: user.kycStatus === "verified" ? B.tealLight : B.goldLight, color: user.kycStatus === "verified" ? B.tealDark : B.gold }}>
              {user.kycStatus === "verified" ? "✓ Verified" : "Pending KYC"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { label: "Balance",      val: formatKES(user.wallet.balance) },
              { label: "Deposited",    val: formatKES(user.wallet.totalDeposited) },
              { label: "Member since", val: formatDate(user.joinedAt) },
            ].map(({ label, val }, i) => (
              <div key={label} style={{ padding: "12px 14px", textAlign: "center", borderRight: i < 2 ? `1px solid ${B.border}` : "none" }}>
                <div style={{ fontFamily: B.fontMono, fontWeight: 600, fontSize: 13, color: B.ink }}>{val}</div>
                <div style={{ fontSize: 10, color: B.muted, fontFamily: B.fontSans, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible gambling — brand: teal header icon */}
        <div style={{ ...card(), marginBottom: 12 }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: B.tealLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield style={{ width: 15, height: 15, color: B.teal }} />
            </div>
            <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 15, color: B.ink }}>Responsible gambling</span>
          </div>
          <div style={{ padding: 18 }}>

            {/* Daily deposit limit */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: B.fontSans, color: B.ink, marginBottom: 3 }}>Daily deposit limit</div>
              <div style={{ fontSize: 12, color: B.muted, fontFamily: B.fontSans, marginBottom: 10 }}>Limits apply from midnight EAT</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {LIMITS.map(o => (
                  <button key={o.v} onClick={() => setLimit(o.v)}
                    style={{ padding: "7px 14px", borderRadius: B.rPill, fontSize: 12, fontWeight: 600, fontFamily: B.fontSans, cursor: "pointer", transition: "all 0.15s", background: limit === o.v ? B.navy : B.card, color: limit === o.v ? "white" : B.ink2, border: limit === o.v ? `1.5px solid ${B.navy}` : `1.5px solid ${B.border}` }}>
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Session reminders */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 18, borderBottom: `1px solid ${B.surface}` }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, fontFamily: B.fontSans, color: B.ink, marginBottom: 2 }}>Session reminders</div>
                <div style={{ fontSize: 12, color: B.muted, fontFamily: B.fontSans }}>Alert after 2h of trading activity</div>
              </div>
              <button onClick={() => setSession(s => !s)}
                style={{ width: 44, height: 24, borderRadius: B.rPill, border: "none", cursor: "pointer", position: "relative", background: session ? B.teal : B.border, transition: "background 0.2s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 2, left: session ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
              </button>
            </div>

            {/* Self-exclusion */}
            <div style={{ marginTop: 16, padding: 14, borderRadius: B.rBtn, border: "1.5px solid rgba(239,68,68,0.2)", background: "#FEF2F2" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <AlertTriangle style={{ width: 15, height: 15, color: B.danger, flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, fontFamily: B.fontSans, color: "#B91C1C", marginBottom: 2 }}>Self-exclusion</div>
                  <div style={{ fontSize: 12, color: B.ink2, fontFamily: B.fontSans }}>Temporarily or permanently block access to your account</div>
                </div>
              </div>
              {!excl ? (
                <button onClick={() => setExcl(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: B.danger, fontFamily: B.fontSans }}>
                  Manage self-exclusion →
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["30 days", "90 days", "Permanent"].map(p => (
                    <button key={p} style={{ padding: "10px 14px", textAlign: "left", borderRadius: B.rBtn, border: "1.5px solid rgba(239,68,68,0.3)", background: "white", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#B91C1C", fontFamily: B.fontSans }}>
                      Exclude for {p}
                    </button>
                  ))}
                  <button onClick={() => setExcl(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: B.muted, fontFamily: B.fontSans }}>Cancel</button>
                </div>
              )}
            </div>
            <p style={{ fontSize: 11, color: B.muted, fontFamily: B.fontSans, marginTop: 12 }}>
              Need help? NACADA: <span style={{ fontFamily: B.fontMono }}>0800 723 253</span> (free, 24/7)
            </p>
          </div>
        </div>

        {/* Account settings */}
        <div style={{ ...card(), marginBottom: 12 }}>
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}` }}>
            <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 15, color: B.ink }}>Account settings</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {SETTINGS.map(({ icon: Icon, label, sub }, i) => (
              <li key={label} style={{ borderBottom: i < SETTINGS.length - 1 ? `1px solid ${B.surface}` : "none" }}>
                <button style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: B.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: 16, height: 16, color: B.ink2 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, fontFamily: B.fontSans, color: B.ink }}>{label}</div>
                    <div style={{ fontSize: 11, color: B.muted, fontFamily: B.fontSans }}>{sub}</div>
                  </div>
                  <ChevronRight style={{ width: 15, height: 15, color: B.border, flexShrink: 0 }} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Sign out */}
        <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", background: B.card, border: `1px solid ${B.border}`, borderRadius: B.rCard, fontSize: 14, fontWeight: 600, fontFamily: B.fontSans, color: B.danger, cursor: "pointer", boxShadow: B.shadowCard, marginBottom: 16 }}>
          <LogOut style={{ width: 15, height: 15 }} /> Sign out
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: B.border, fontFamily: B.fontSans }}>
          Tabiri Ltd · Licensed by GRA Kenya · Version 1.0.0-beta
        </p>
      </main>
    </div>
  );
}
