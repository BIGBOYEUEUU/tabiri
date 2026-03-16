"use client";
import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Phone, Mail, Lock, Eye, EyeOff, Upload, CheckCircle, ArrowRight, Shield, Camera } from "lucide-react";
import { B, card, btn, label, input } from "@/lib/brand";

type Step = "account" | "otp" | "kyc" | "done";
const STEPS = ["account","otp","kyc","done"] as const;

function Steps({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  const labels = ["Account","Verify","Identity","Ready"];
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {STEPS.map((s, i) => {
        const done = i < idx, active = i === idx;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, fontFamily: B.fontDisplay, background: done ? B.teal : active ? B.navy : B.border, color: done || active ? "white" : B.muted, flexShrink: 0 }}>
                {done ? <CheckCircle style={{ width: 14, height: 14 }} /> : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, fontFamily: B.fontSans, color: active ? B.navy : done ? B.teal : B.muted, whiteSpace: "nowrap" }}>{labels[i]}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? B.teal : B.border, margin: "0 6px", marginBottom: 14 }} />}
          </div>
        );
      })}
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("account");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [otp, setOtp] = useState(["","","","","",""]);
  const [dob, setDob] = useState("");
  const [idDone, setIdDone] = useState(false);
  const [selfieDone, setSelfieDone] = useState(false);

  const advance = () => setStep(s => STEPS[STEPS.indexOf(s) + 1] ?? s);
  const handleOtp = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const n = [...otp]; n[i] = v; setOtp(n);
    if (v && i < 5) (document.getElementById(`o${i+1}`) as HTMLInputElement)?.focus();
  };
  const otpFull = otp.every(d => d);
  const kycOk   = idDone && selfieDone && dob;

  const titles: Record<Step, string> = { account: "Create your account", otp: "Verify your phone", kyc: "Verify your identity", done: "You're verified!" };

  return (
    <div style={{ minHeight: "100svh", background: B.surface, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: B.gradTeal, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp style={{ width: 17, height: 17, color: "white" }} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: B.fontDisplay, fontWeight: 800, fontSize: 24, color: B.navy }}>tabiri</span>
        </div>

        <div style={{ ...card(), padding: "24px 28px" }}>
          <Steps current={step} />
          <h2 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 20, color: B.ink, marginBottom: 20 }}>{titles[step]}</h2>

          {/* ── Account step ── */}
          {step === "account" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={label()}>Full name</span>
                <input type="text" placeholder="Amara Osei" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={input()} />
              </div>
              <div>
                <span style={label()}>Phone number (M-Pesa)</span>
                <div style={{ position: "relative" }}>
                  <Phone style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted }} />
                  <input type="tel" placeholder="+254 712 345 678" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={input({ paddingLeft: 40 })} />
                </div>
                <p style={{ fontSize: 11, color: B.muted, fontFamily: B.fontSans, marginTop: 4 }}>Used for M-Pesa deposits and withdrawals</p>
              </div>
              <div>
                <span style={label()}>Email address</span>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted }} />
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={input({ paddingLeft: 40 })} />
                </div>
              </div>
              <div>
                <span style={label()}>Password</span>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: B.muted }} />
                  <input type={showPass ? "text" : "password"} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={input({ paddingLeft: 40, paddingRight: 42 })} />
                  <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: B.muted, display: "flex" }}>
                    {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                  </button>
                </div>
              </div>
              <div style={{ padding: 12, borderRadius: B.rBtn, background: B.goldLight, border: `1px solid ${B.gold}30`, fontSize: 12, color: B.gold, fontFamily: B.fontSans }}>
                <strong>Age requirement:</strong> You must be 21+ to trade on Tabiri (GRA regulation).
              </div>
              <button onClick={advance} style={{ ...btn(B.gradTeal), display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                Continue <ArrowRight style={{ width: 15, height: 15 }} />
              </button>
            </div>
          )}

          {/* ── OTP step ── */}
          {step === "otp" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: B.tealLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <Phone style={{ width: 22, height: 22, color: B.teal }} />
                </div>
                <p style={{ fontSize: 13, color: B.ink2, fontFamily: B.fontSans }}>We sent a 6-digit code to</p>
                <p style={{ fontSize: 14, fontWeight: 600, fontFamily: B.fontSans, color: B.ink }}>{form.phone || "+254 712 345 678"}</p>
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
                {otp.map((d, i) => (
                  <input key={i} id={`o${i}`} type="text" inputMode="numeric" maxLength={1} value={d} onChange={e => handleOtp(i, e.target.value)}
                    style={{ width: 44, height: 52, textAlign: "center", fontSize: 22, fontFamily: B.fontMono, fontWeight: 600, border: `2px solid ${d ? B.teal : B.border}`, borderRadius: 12, outline: "none", color: B.teal }} />
                ))}
              </div>
              <button onClick={advance} disabled={!otpFull}
                style={{ ...btn(otpFull ? B.gradTeal : B.border, otpFull ? "white" : B.muted), opacity: otpFull ? 1 : 0.5 }}>
                Verify phone
              </button>
              <button style={{ ...btn("transparent", B.muted), boxShadow: "none", fontSize: 12, marginTop: 6 }}>Resend code</button>
            </div>
          )}

          {/* ── KYC step ── */}
          {step === "kyc" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ padding: 12, borderRadius: B.rBtn, background: B.navyLight, border: `1px solid ${B.navy}20`, fontSize: 12, color: B.navy, fontFamily: B.fontSans, display: "flex", gap: 8 }}>
                <Shield style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }} />
                <span>Required by the GRA of Kenya. Your documents are encrypted and stored securely.</span>
              </div>
              <div>
                <span style={label()}>Date of birth</span>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={input()} />
                <p style={{ fontSize: 11, color: B.muted, fontFamily: B.fontSans, marginTop: 4 }}>Must be 21 or older</p>
              </div>
              {[
                { label: "National ID (front & back)", done: idDone, set: setIdDone, icon: Upload, hint: "JPG, PNG · Max 5MB" },
                { label: "Selfie holding your ID",    done: selfieDone, set: setSelfieDone, icon: Camera, hint: "Hold your ID clearly in frame" },
              ].map(({ label: l, done, set, icon: Icon, hint }) => (
                <div key={l}>
                  <span style={label()}>{l}</span>
                  <button onClick={() => set(true)}
                    style={{ width: "100%", padding: "24px 16px", borderRadius: B.rCard, border: `2px dashed ${done ? B.teal : B.border}`, background: done ? B.tealLight : B.card, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                    {done
                      ? <><CheckCircle style={{ width: 24, height: 24, color: B.teal }} /><span style={{ fontSize: 13, fontWeight: 600, color: B.teal, fontFamily: B.fontSans }}>Uploaded</span></>
                      : <><Icon style={{ width: 24, height: 24, color: B.muted }} /><span style={{ fontSize: 13, color: B.ink2, fontFamily: B.fontSans }}>Tap to upload</span><span style={{ fontSize: 11, color: B.muted, fontFamily: B.fontSans }}>{hint}</span></>
                    }
                  </button>
                </div>
              ))}
              <button onClick={advance} disabled={!kycOk}
                style={{ ...btn(kycOk ? B.gradTeal : B.border, kycOk ? "white" : B.muted), opacity: kycOk ? 1 : 0.5 }}>
                Submit for verification
              </button>
              <p style={{ fontSize: 11, color: B.muted, textAlign: "center", fontFamily: B.fontSans }}>Typically under 2 minutes · Powered by Smile Identity</p>
            </div>
          )}

          {/* ── Done step ── */}
          {step === "done" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: B.tealLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle style={{ width: 32, height: 32, color: B.teal }} />
              </div>
              <p style={{ fontSize: 14, color: B.ink2, fontFamily: B.fontSans, marginBottom: 20 }}>Your account is ready. Deposit via M-Pesa and start trading.</p>
              <div style={{ background: B.tealLight, borderRadius: B.rBtn, padding: 16, marginBottom: 20, textAlign: "left" }}>
                {["Browse live prediction markets", "Buy YES or NO positions", "Collect payouts when you're right", "Withdraw winnings to M-Pesa"].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: B.tealDark, marginBottom: 8, fontFamily: B.fontSans }}>
                    <CheckCircle style={{ width: 13, height: 13, flexShrink: 0 }} />{item}
                  </div>
                ))}
              </div>
              <Link href="/" style={{ ...btn(B.gradGold), display: "block", textDecoration: "none", marginBottom: 12 }}>Deposit & Start Trading</Link>
              <Link href="/" style={{ fontSize: 13, color: B.teal, textDecoration: "none", fontFamily: B.fontSans, fontWeight: 600 }}>Browse markets first</Link>
            </div>
          )}
        </div>

        {step !== "done" && (
          <p style={{ textAlign: "center", fontSize: 13, color: B.muted, fontFamily: B.fontSans, marginTop: 16 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: B.teal, fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}
