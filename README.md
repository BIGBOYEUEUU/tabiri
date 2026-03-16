# Tabiri — The Future, Priced.

Africa's prediction market platform. Trade on politics, economics, football, and more.

## Getting started

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Pages

| Route | Description |
|---|---|
| `/` | Home feed — market list, search, category filter |
| `/markets/[id]` | Market detail — probability chart, order panel |
| `/wallet` | Wallet — balance, M-Pesa deposit modal, transactions |
| `/positions` | Open positions with live P&L |
| `/profile` | Account settings, responsible gambling controls |
| `/auth/register` | 4-step KYC registration flow |
| `/auth/login` | Sign in |

## Brand

- Primary: Teal `#0F766E`
- Dark surface: Navy `#0B2545`
- Accent/CTA: Gold `#D97706`
- Font: DM Sans + DM Mono

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom Tabiri tokens)
- Recharts (probability chart)
- lucide-react (icons)

## Next steps

- [ ] Connect to Go API backend
- [ ] WebSocket price feed (real-time probability updates)
- [ ] M-Pesa Daraja API integration (real deposits)
- [ ] Admin dashboard
- [ ] PWA / Android app
