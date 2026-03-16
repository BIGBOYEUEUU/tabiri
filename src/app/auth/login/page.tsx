"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { auth, setToken } from "@/lib/api";
import { B, card, btn, label, input } from "@/lib/brand";

export default function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [form,     setForm]     = useState({ phone: "", password: "" });
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    if (!form.phone || !form.password) { setError("Enter your phone and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await auth.login({ phone: form.phone, password: form.password });
      setToken(res.tokens.access_token, res.tokens.refresh_token);
      router.push("/");
    } catch (e: any) {
      setError(e.message || "Invalid phone or password");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100svh", background: B.surface, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 380 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: B.gradTeal, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp style={{ width: 17, height: 17, color: "white" }} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 24, color: B.navy }}>tabiri</span>
        </div>

        <div style={{ ...card(), padding: 28 }}>
          <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 22, color: B.ink, marginBottom: 4 }}>Welcome back</h1>
          <p style={{ fontSize: 13, color: B.muted, marginBottom: 24 }}>Sign in to your Tabiri account</p>

          {error && (
            <div style={{ padding: 10, borderRadius: B.rBtn, background: "#FEF2F2", color: B.danger, fontSize: 12, marginBottom: 16, textAlign: "center" }}>
              {error}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <span style={label()}>Phone number</span>
              <div style={{ position: "relative" }}>
                <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted }} />
                <input type="tel" placeholder="+254 712 345 678" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={input({ paddingLeft: 40 })} />
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: B.ink2, fontFamily: B.fontSans }}>Password</span>
                <Link href="/auth/forgot" style={{ fontSize: 11, fontWeight: 600, color: B.teal, textDecoration: "none" }}>Forgot?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted }} />
                <input type={showPass ? "text" : "password"} placeholder="Your password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  style={input({ paddingLeft: 40, paddingRight: 42 })} />
                <button onClick={() => setShowPass(s => !s)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: B.muted, display: "flex" }}>
                  {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                </button>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading}
              style={{ ...btn(B.gradTeal), marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: B.muted, marginTop: 16 }}>
          New to Tabiri?{" "}
          <Link href="/auth/register" style={{ color: B.teal, fontWeight: 700, textDecoration: "none" }}>Create account</Link>
        </p>
      </div>
    </div>
  );
}
