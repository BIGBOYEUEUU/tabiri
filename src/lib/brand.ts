// ─── Tabiri Brand Tokens ─────────────────────────────────────────────
// Single source of truth — matches the Canva brand guidelines exactly

export const B = {
  // Core palette
  teal:      "#0F766E",   // Primary — buttons, links, probability bars
  tealMid:   "#14B8A6",   // Teal mid — gradients, hover
  tealLight: "#EDFAF6",   // Teal soft — YES button bg, badges
  tealDark:  "#0A5C55",   // Teal dark — YES text, headings on light

  navy:      "#0B2545",   // Dark surface — navbar, wallet card
  navyDim:   "#0F2A4A",   // Navy dim — secondary dark
  navyLight: "#EDF2FA",   // Navy soft — economics badge

  gold:      "#D97706",   // Accent — deposit CTA, countdowns, highlights
  goldMid:   "#F59E0B",   // Gold mid — gradient end
  goldLight: "#FFFBEB",   // Gold soft — warning bg, urgent badge

  ink:       "#0F172A",   // Primary text
  ink2:      "#475569",   // Secondary text
  muted:     "#94A3B8",   // Muted / captions
  surface:   "#F8FAFC",   // Page background
  card:      "#FFFFFF",   // Card background
  border:    "#E2E8F0",   // Default border

  success:   "#10B981",
  danger:    "#EF4444",

  // Gradients
  gradTeal:  "linear-gradient(135deg, #0F766E, #14B8A6)",
  gradNavy:  "linear-gradient(135deg, #0B2545, #0F766E)",
  gradGold:  "linear-gradient(135deg, #D97706, #F59E0B)",
  gradRed:   "linear-gradient(135deg, #DC2626, #EF4444)",

  // Typography
  fontDisplay: "'Syne', sans-serif",
  fontSans:    "'DM Sans', sans-serif",
  fontMono:    "'DM Mono', monospace",

  // Radii
  rCard: 16,
  rBtn:  10,
  rPill: 9999,

  // Shadows
  shadowCard:      "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
  shadowCardHover: "0 4px 20px rgba(0,0,0,0.09), 0 1px 3px rgba(0,0,0,0.04)",
  shadowFloat:     "0 8px 32px rgba(0,0,0,0.14)",
} as const;

// Category colours — maps category → brand-consistent colour set
export const CAT_COLOURS: Record<string, { accent: string; bg: string; text: string }> = {
  politics:      { accent: "#0F766E", bg: "#EDFAF6", text: "#0A5C55" },
  economics:     { accent: "#1A3F6F", bg: "#EDF2FA", text: "#0B2545" },
  football:      { accent: "#059669", bg: "#ECFDF5", text: "#065F46" },
  entertainment: { accent: "#D97706", bg: "#FFFBEB", text: "#92400E" },
  weather:       { accent: "#4F46E5", bg: "#EEF2FF", text: "#3730A3" },
  other:         { accent: "#64748B", bg: "#F1F5F9", text: "#475569" },
};

// Reusable style helpers
export const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: B.card,
  borderRadius: B.rCard,
  border: `1px solid ${B.border}`,
  boxShadow: B.shadowCard,
  overflow: "hidden",
  ...extra,
});

export const pill = (bg: string, text: string): React.CSSProperties => ({
  display: "inline-block",
  padding: "4px 10px",
  borderRadius: B.rPill,
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  background: bg,
  color: text,
  fontFamily: B.fontSans,
});

export const btn = (bg: string, color = "white", extra: React.CSSProperties = {}): React.CSSProperties => ({
  display: "block",
  width: "100%",
  padding: "13px 0",
  borderRadius: B.rBtn,
  border: "none",
  cursor: "pointer",
  background: bg,
  color,
  fontFamily: B.fontDisplay,
  fontWeight: 700,
  fontSize: 14,
  textAlign: "center" as const,
  transition: "opacity 0.15s",
  ...extra,
});

export const label = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: B.ink2,
  marginBottom: 6,
  fontFamily: B.fontSans,
  ...extra,
});

export const input = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  width: "100%",
  padding: "11px 12px",
  fontSize: 14,
  border: `1.5px solid ${B.border}`,
  borderRadius: B.rBtn,
  outline: "none",
  color: B.ink,
  fontFamily: B.fontSans,
  background: B.card,
  ...extra,
});

export const sectionTitle = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: B.fontDisplay,
  fontWeight: 800,
  fontSize: 28,
  color: B.ink,
  marginBottom: 4,
  ...extra,
});

export const mono = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: B.fontMono,
  ...extra,
});
