"use client";
import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, CheckCircle, Smartphone, TrendingUp, ChevronRight } from "lucide-react";
import { wallet as walletAPI, Wallet, Transaction, getToken } from "@/lib/api";
import { B, card, btn } from "@/lib/brand";
import { formatKES, formatDate } from "@/lib/utils";

const AMOUNTS = [100, 200, 500, 1000, 2000, 5000];
type Step = "amount" | "confirm" | "waiting" | "done";

function DepositModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState<Step>("amount");
  const [amt, setAmt]   = useState("500");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const amtN   = parseFloat(amt) || 0;
  const excise = amtN * 0.05;
  const credit = amtN - excise;

  const handleDeposit = async () => {
    setStep("waiting");
    try {
      await walletAPI.deposit(amtN, phone);
      setStep("done");
      onSuccess();
    } catch (e: any) {
      setError(e.message);
      setStep("confirm");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 16, background: "rgba(11,37,69,0.75)", backdropFilter: "blur(4px)" }}>
      <div style={{ ...card(), width: "100%", maxWidth: 400 }}>
        {step === "amount" && (
          <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18, color: B.ink, marginBottom: 4 }}>Deposit via M-Pesa</h2>
            <p style={{ fontSize: 12, color: B.muted, marginBottom: 20 }}>Enter your M-Pesa number and amount</p>
            <input type="tel" placeholder="+254 712 345 678" value={phone} onChange={e => setPhone(e.target.value)}
              style={{ width: "100%", padding: "11px 12px", fontSize: 14, border: `1.5px solid ${B.border}`, borderRadius: B.rBtn, outline: "none", marginBottom: 12 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
              {AMOUNTS.map(a => (
                <button key={a} onClick={() => setAmt(String(a))}
                  style={{ padding: "10px 0", borderRadius: B.rBtn, border: "none", cursor: "pointer", fontFamily: B.fontMono, fontSize: 13, fontWeight: 600, background: amtN === a ? B.navy : B.surface, color: amtN === a ? "white" : B.ink2 }}>
                  {a >= 1000 ? `${a/1000}K` : a}
                </button>
              ))}
            </div>
            <input type="number" value={amt} onChange={e => setAmt(e.target.value)} min={50}
              style={{ width: "100%", padding: "11px 12px", fontSize: 14, fontFamily: B.fontMono, border: `1.5px solid ${B.border}`, borderRadius: B.rBtn, outline: "none", marginBottom: 16 }} />
            {amtN > 0 && (
              <div style={{ background: B.surface, borderRadius: B.rBtn, padding: 12, marginBottom: 16 }}>
                {[["You send", formatKES(amtN), B.ink], ["Excise (5%)", `−${formatKES(excise)}`, B.danger], ["Wallet credit", formatKES(credit), B.teal]].map(([l, v, c], i) => (
                  <div key={String(l)} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: i < 2 ? 6 : 0, paddingTop: i === 2 ? 8 : 0, borderTop: i === 2 ? `1px solid ${B.border}` : "none", color: B.ink2 }}>
                    <span>{l}</span><span style={{ fontFamily: B.fontMono, fontWeight: 600, color: String(c) }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => amtN >= 50 && phone && setStep("confirm")} disabled={amtN < 50 || !phone}
              style={{ ...btn(amtN >= 50 && phone ? B.gradGold : B.border, amtN >= 50 && phone ? "white" : B.muted) }}>
              Continue
            </button>
            <button onClick={onClose} style={{ ...btn("transparent", B.muted), boxShadow: "none", marginTop: 6 }}>Cancel</button>
          </div>
        )}
        {step === "confirm" && (
          <div style={{ padding: 24 }}>
            <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 18, color: B.ink, marginBottom: 16 }}>Confirm deposit</h2>
            <div style={{ padding: "20px 16px", background: B.tealLight, borderRadius: B.rCard, textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 36, color: B.teal }}>{formatKES(amtN)}</div>
              <div style={{ fontSize: 12, color: B.teal, opacity: 0.7, marginTop: 4 }}>to {phone}</div>
            </div>
            {error && <p style={{ fontSize: 12, color: B.danger, marginBottom: 12, textAlign: "center" }}>{error}</p>}
            <button onClick={handleDeposit} style={{ ...btn(B.gradGold), display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
              <Smartphone style={{ width: 16, height: 16 }} /> Send M-Pesa push
            </button>
            <button onClick={() => setStep("amount")} style={{ ...btn("transparent", B.muted), boxShadow: "none" }}>Back</button>
          </div>
        )}
        {step === "waiting" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: `2px solid ${B.tealLight}`, borderTopColor: B.teal, animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
            <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 16, color: B.ink, marginBottom: 4 }}>Waiting for M-Pesa</h2>
            <p style={{ fontSize: 12, color: B.muted }}>Check your phone for the push notification</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {step === "done" && (
          <div style={{ padding: 40, textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: B.tealLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle style={{ width: 30, height: 30, color: B.teal }} />
            </div>
            <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 22, color: B.ink, marginBottom: 4 }}>STK Push Sent!</h2>
            <p style={{ fontSize: 12, color: B.muted, marginBottom: 24 }}>Enter your M-Pesa PIN to complete the deposit</p>
            <button onClick={onClose} style={btn(B.gradTeal)}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

const TX_CFG: Record<string, { icon: typeof ArrowDownLeft; color: string; bg: string }> = {
  deposit:    { icon: ArrowDownLeft, color: B.teal,    bg: B.tealLight },
  withdrawal: { icon: ArrowUpRight,  color: B.danger,  bg: "#FEF2F2"   },
  buy:        { icon: TrendingUp,    color: B.navy,    bg: B.navyLight },
  sell:       { icon: TrendingUp,    color: B.ink2,    bg: B.surface   },
  payout:     { icon: CheckCircle,   color: B.success, bg: "#ECFDF5"   },
  fee:        { icon: ChevronRight,  color: B.muted,   bg: B.surface   },
  excise:     { icon: ChevronRight,  color: B.muted,   bg: B.surface   },
};

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [walletData,  setWalletData]  = useState<Wallet | null>(null);
  const [txns,        setTxns]        = useState<Transaction[]>([]);
  const [loading,     setLoading]     = useState(true);
  const loggedIn = !!getToken();

  const load = async () => {
    if (!loggedIn) { setLoading(false); return; }
    try {
      const [w, t] = await Promise.all([walletAPI.get(), walletAPI.transactions()]);
      setWalletData(w.wallet);
      setTxns(t.transactions || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const balance = walletData?.balance_kobo ?? 0;
  const deposited = walletData?.total_deposited ?? 0;
  const withdrawn = walletData?.total_withdrawn ?? 0;

  return (
    <div style={{ paddingTop: 56, background: B.surface, minHeight: "100svh" }}>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px 96px" }}>
        <div style={{ padding: "28px 0 20px" }}>
          <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 28, color: B.ink, marginBottom: 4 }}>Wallet</h1>
          <p style={{ fontSize: 14, color: B.muted }}>Manage your balance and transactions</p>
        </div>

        {!loggedIn ? (
          <div style={{ ...card({ padding: 32 }), textAlign: "center" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: B.ink, marginBottom: 8 }}>Sign in to view your wallet</p>
            <a href="/auth/login" style={{ ...btn(B.gradTeal), display: "inline-block", width: "auto", padding: "11px 28px", textDecoration: "none" }}>Sign in</a>
          </div>
        ) : (
          <>
            {/* Wallet hero */}
            <div style={{ padding: "24px 20px", marginBottom: 16, borderRadius: B.rCard, background: B.gradNavy, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -24, right: -24, width: 120, height: 120, borderRadius: "50%", background: "rgba(20,184,166,0.12)" }} />
              <div style={{ position: "relative" }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>Available balance</div>
                <div style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 36, color: "white", marginBottom: 20 }}>
                  {loading ? "Loading…" : formatKES(balance / 100)}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setShowDeposit(true)}
                    style={{ flex: 1, padding: "11px 0", borderRadius: B.rBtn, border: "none", cursor: "pointer", fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 14, color: "white", background: B.gradGold }}>
                    + Deposit
                  </button>
                  <button style={{ flex: 1, padding: "11px 0", borderRadius: B.rBtn, border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer", fontFamily: B.fontSans, fontSize: 14, color: "white", background: "rgba(255,255,255,0.08)" }}>
                    Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total deposited", val: formatKES(deposited / 100), icon: ArrowDownLeft, color: B.teal, bg: B.tealLight },
                { label: "Total withdrawn",  val: formatKES(withdrawn / 100), icon: ArrowUpRight,  color: B.danger, bg: "#FEF2F2" },
              ].map(({ label, val, icon: Icon, color, bg }) => (
                <div key={label} style={{ ...card({ padding: 16 }) }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                  <div style={{ fontFamily: B.fontMono, fontWeight: 700, fontSize: 16, color: B.ink }}>{val}</div>
                  <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Transactions */}
            <div style={card()}>
              <div style={{ padding: "14px 18px", borderBottom: `1px solid ${B.border}` }}>
                <span style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 15, color: B.ink }}>Transaction history</span>
              </div>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: B.muted, fontSize: 14 }}>Loading…</div>
              ) : txns.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: B.muted, fontSize: 14 }}>No transactions yet</div>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {txns.map((tx, i) => {
                    const { icon: Icon, color, bg } = TX_CFG[tx.type] ?? TX_CFG.fee;
                    return (
                      <li key={tx.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", borderBottom: i < txns.length - 1 ? `1px solid ${B.border}` : "none" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon style={{ width: 16, height: 16, color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: B.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.description}</div>
                          <div style={{ fontSize: 11, color: B.muted, marginTop: 1 }}>{formatDate(new Date(tx.created_at).getTime())}</div>
                        </div>
                        <div style={{ fontFamily: B.fontMono, fontWeight: 700, fontSize: 13, flexShrink: 0, color: tx.amount_kobo > 0 ? B.teal : B.ink2 }}>
                          {tx.amount_kobo > 0 ? "+" : ""}{formatKES(Math.abs(tx.amount_kobo) / 100)}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} onSuccess={load} />}
    </div>
  );
}
