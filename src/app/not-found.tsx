import Link from "next/link";
import { B } from "@/lib/brand";
export default function NotFound() {
  return (
    <div style={{ minHeight: "100svh", background: B.surface, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <div style={{ fontFamily: B.fontMono, fontWeight: 700, fontSize: 64, color: B.teal, lineHeight: 1 }}>404</div>
      <h1 style={{ fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 22, color: B.ink }}>Market not found</h1>
      <p style={{ fontSize: 14, color: B.muted, fontFamily: B.fontSans }}>This market doesn't exist — yet.</p>
      <Link href="/" style={{ marginTop: 8, padding: "11px 28px", borderRadius: B.rBtn, background: B.gradTeal, color: "white", textDecoration: "none", fontFamily: B.fontDisplay, fontWeight: 700, fontSize: 14 }}>
        Back to markets
      </Link>
    </div>
  );
}
