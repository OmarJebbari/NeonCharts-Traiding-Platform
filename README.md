<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=220&section=header&text=NeonCharts&fontSize=90&fontColor=ffffff&fontAlignY=36&desc=Advanced%20Financial%20Analytics%20%26%20Trading%20Ecosystem&descAlignY=62&descSize=20&animation=twinkling" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/⚡_LIVE_DEMO-00D4FF?style=for-the-badge&logoColor=white&labelColor=0D1117)](https://updatedsite-theta.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-95.6%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0D1117)](https://github.com/OmarJebbari/NeonCharts-Traiding-Platform)
[![Status](https://img.shields.io/badge/Status-Production_Ready-00FF88?style=for-the-badge&labelColor=0D1117)](https://updatedsite-theta.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-F0DB4F?style=for-the-badge&labelColor=0D1117)](LICENSE)

<br/>

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Node](https://img.shields.io/badge/Node.js_20_LTS-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![Postgres](https://img.shields.io/badge/PostgreSQL_15-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon_Serverless-00E5CC?style=flat-square&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=flat-square&logo=vercel&logoColor=white)
![OAuth](https://img.shields.io/badge/OAuth_2.0-EB5424?style=flat-square&logo=auth0&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white)

<br/><br/>

> **NeonCharts** is a production-grade financial analytics ecosystem engineered for real-time market intelligence, economic event orchestration, and AI-augmented trading insight. Built on a glassmorphism UI engine with a globally edge-distributed serverless backend.

```
╔══════════════════════════════════════════════════════════════════════╗
║   REAL-TIME · SERVERLESS · AI-AUGMENTED · RBAC-SECURED · EDGE-FIRST ║
╚══════════════════════════════════════════════════════════════════════╝
```

</div>

---

## 📑 Table of Contents

- [🎯 Platform Overview](#-platform-overview)
- [🏛️ System Architecture](#-system-architecture)
- [⚛️ Technology Stack](#-technology-stack)
- [✨ Feature Matrix](#-feature-matrix)
- [🔐 Security Architecture](#-security-architecture)
- [🗄️ Database Schema](#-database-schema)
- [📁 Repository Structure](#-repository-structure)
- [🚀 Deployment](#-deployment)
- [⚙️ Local Development](#-local-development)
- [🌐 Environment Variables](#-environment-variables)
- [👨‍💻 Engineering Team](#-engineering-team)
- [📜 License](#-license)

---

## 🎯 Platform Overview

**NeonCharts** is a TradingView-class analytics platform targeting quantitative analysts, institutional traders, and sophisticated retail investors who demand a high-signal, low-noise interface that matches their cognitive workflow.

| Capability | Specification |
|---|---|
| Global render latency | Sub-100ms via Vercel Edge Network POPs |
| Authentication | OAuth 2.0 federated identity (Google) + signed JWT |
| Session security | HttpOnly + SameSite=Strict — zero XSS token exposure |
| Access control | RBAC middleware-enforced premium route gating |
| AI layer | Google Gemini market sentiment engine (experimental) |
| Database | Neon serverless PostgreSQL with autoscale-to-zero |
| CI/CD | Zero-config — every push to `main` ships to production |

---

## 🏛️ System Architecture

```mermaid
graph TD
    U((("👤 Global User")))
    U -->|"HTTPS / TLS 1.3"| E

    subgraph EDGE ["☁️ Vercel Edge Network"]
        E["CDN · Static Assets"]
        M["Edge Middleware · JWT pre-validation"]
    end

    E --> SPA
    M --> API

    subgraph FRONTEND ["⚛️ Frontend Layer"]
        SPA["React 18 + Vite 5\nTypeScript · Tailwind CSS\nGlassmorphism UI Engine"]
    end

    subgraph BACKEND ["🛡️ Serverless API Layer"]
        API["Express.js / Node.js 20\nOAuth 2.0 · JWT · RBAC Guards"]
        GOOGLE["Google Identity\nOAuth 2.0"]
        GEMINI["Gemini AI\nSentiment Engine"]
    end

    subgraph DB ["🗄️ Persistence Layer"]
        NEON[("Neon Serverless\nPostgreSQL 15+\nACID · PITR · Autoscale")]
    end

    SPA <-->|"REST / JSON"| API
    API --> GOOGLE
    API --> GEMINI
    API --> NEON
```

### Architecture principles

| Principle | Implementation |
|---|---|
| **Stateless backend** | Every serverless function is ephemeral; state lives in Neon DB or client JWT |
| **Zero cold-start** | Vercel Edge maintains warm instances at globally distributed POPs |
| **Defense in depth** | Auth validated at Edge → API middleware → DB query level |
| **Least privilege** | RBAC enforced server-side; premium routes unreachable without valid `role` claim |
| **Separation of concerns** | Frontend SPA, API functions, and DB are fully independent deployable units |

---

## ⚛️ Technology Stack

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Build system | **Vite 5.x** | Sub-100ms HMR, ES Module bundling, aggressive tree-shaking |
| UI framework | **React 18** | Concurrent rendering, Suspense boundaries, automatic batching |
| Language | **TypeScript 5.x** | Strict mode, generics, discriminated unions for all state |
| Styling | **Tailwind CSS + Modular CSS** | Utility-first design system + scoped component styles |
| Design language | **Glassmorphism Engine** | `backdrop-filter: blur()` layered UI, neon accent palette |
| Icons | **Lucide React** | 1000+ consistent SVG icons, tree-shakeable |

### Backend & infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js 20 LTS** | V8 engine, async I/O, native Fetch API |
| Framework | **Express.js** | Route handling, middleware chaining, error propagation |
| Deployment | **Vercel Serverless** | Auto-scaling, zero-config CI/CD, edge routing |
| Auth protocol | **OAuth 2.0 — Google Identity** | Federated identity; zero passwords stored |
| Session tokens | **JWT HS256** | Stateless, signed, expiry-bound; embedded `role` claim |
| Cookie policy | **HttpOnly + SameSite=Strict** | XSS-proof; CSRF mitigated by SameSite |
| Access control | **RBAC Middleware** | Per-route role guards on all premium endpoints |

### Data persistence

| Component | Technology | Detail |
|---|---|---|
| Database | **Neon Serverless PostgreSQL** | Postgres 15+ with branch-based dev/staging |
| Driver | **Neon HTTP Driver** | No persistent pool — serverless optimized |
| Consistency | **ACID transactions** | Atomic subscription state mutations guaranteed |
| Recovery | **PITR** | Point-in-Time Recovery; branch-level snapshots |
| Scaling | **Autoscale-to-zero** | Compute pauses on inactivity; scales on demand |

---

## ✨ Feature Matrix

### Core tier — all users

| Feature | Description |
|---|---|
| Economic calendar | Real-time global events: CPI, NFP, FOMC, earnings, dividends |
| Dynamic charting | Candlestick + line charts with technical analysis overlays |
| Volatility filter | Events ranked Low / Medium / High impact; color-coded urgency |
| Geographic filter | By country, region, or market bloc (US, EU, APAC, EM) |
| Google OAuth | One-click sign-in; zero password friction |
| Responsive UI | Mobile-first; full feature parity across all breakpoints |

### Premium tier — authenticated + subscribed

| Feature | Description |
|---|---|
| SymbolDetailView | Deep-dive per-ticker: earnings history, analyst ratings, fundamentals |
| AI sentiment engine | Gemini-powered contextual analysis of market conditions |
| Advanced charting | Extended timeframes, custom indicators, multi-symbol overlays |
| Export pipeline | Structured data export for quantitative backtesting workflows |

---

## 🔐 Security Architecture

```
┌──────────────────────── THREAT MATRIX ─────────────────────────────┐
│  Attack Vector           Status   Mitigation                        │
│  ──────────────────────  ──────   ──────────────────────────────── │
│  XSS token theft         ✅ PASS  HttpOnly cookies — JS blind       │
│  CSRF attacks            ✅ PASS  SameSite=Strict cookie            │
│  SQL injection           ✅ PASS  Parameterized queries only        │
│  Privilege escalation    ✅ PASS  RBAC middleware per route         │
│  Secret exposure         ✅ PASS  .env blocked in .gitignore        │
│  Token replay            ✅ PASS  JWT exp + iat enforced            │
│  Brute force / spray     ✅ PASS  OAuth — no password surface       │
│  Auth rate limiting      ⚠️ WARN  Add express-rate-limit            │
│  HTTP security headers   ⚠️ WARN  Add helmet.js middleware          │
│  Dependency CVEs         ⚠️ WARN  Enable GitHub Dependabot          │
└────────────────────────────────────────────────────────────────────┘
```

**Authentication flow:**

```
1. User → Google OAuth consent screen
2. Google → returns authorization code to backend callback
3. Backend → exchanges code for Google ID token
4. Backend → issues signed JWT { sub, email, role, exp }
5. JWT → set as HttpOnly + SameSite=Strict cookie (JS-inaccessible)
6. API calls → validated by JWT middleware on every request
7. Premium routes → additionally assert role === "premium"
```

> **Recommended hardening:**
> - `npm install helmet` → `app.use(helmet())` — 12 security headers instantly
> - `npm install express-rate-limit` → apply to `/api/auth/*` routes
> - Enable **Dependabot** in GitHub Settings → Code security
> - Add `SECURITY.md` with responsible disclosure policy
> - Add `Content-Security-Policy` in `vercel.json`

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id     VARCHAR(255)  UNIQUE NOT NULL,
  email         VARCHAR(320)  UNIQUE NOT NULL,
  display_name  VARCHAR(255),
  avatar_url    TEXT,
  tier          VARCHAR(50)   DEFAULT 'free'
                              CHECK (tier IN ('free', 'premium')),
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        VARCHAR(50)   DEFAULT 'inactive',
  started_at    TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ
);

CREATE TABLE user_preferences (
  user_id       UUID          PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  config        JSONB         DEFAULT '{}',
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);
```

---

## 📁 Repository Structure

```
NeonCharts-Traiding-Platform/
│
├── DataBase/
│   └── schema.sql
│
├── updated_site/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── api/
│   │   ├── auth/
│   │   └── [data endpoints]
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Deployment

| Environment | Trigger | URL |
|---|---|---|
| Production | Push to `main` | https://updatedsite-theta.vercel.app |
| Preview | Any PR or feature branch | Auto-generated per-PR Vercel URL |
| Local | `npm run dev` | http://localhost:5173 |

---

## ⚙️ Local Development

**Prerequisites:** Node.js ≥ 20.0.0 · npm ≥ 10.0.0

```bash
git clone https://github.com/OmarJebbari/NeonCharts-Traiding-Platform.git
cd NeonCharts-Traiding-Platform/updated_site
npm install
cp .env.example .env.local
npm run dev
```

```bash
npm run dev        # Dev server with HMR — port 5173
npm run build      # Production build → /dist
npm run preview    # Preview production build locally
npm run lint       # ESLint + TypeScript strict type-check
```

---

## 🌐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Authentication
JWT_SECRET=minimum_32_char_cryptographically_random_string

# Google OAuth 2.0
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# AI Integration (optional)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 👨‍💻 Engineering Team

<div align="center">

| Engineer | Contributions |
|---|---|
| **Omar Jebbari** | System design · API architecture · Core infrastructure · Full-stack ownership |
| **Oussama Touate** | Serverless functions · PostgreSQL schema · Query optimization · Data modeling |
| **Zakaria Ammar** | React architecture · Glassmorphism design system · Performance · Component library |
| **Salma Bel Haj** | Auth protocol design · RBAC implementation · Test coverage · Security hardening |

</div>

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for the full text.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=0,2,2,5,30&height=120&section=footer&animation=twinkling" width="100%"/>

**Built with precision for the modern trading era.**

*Omar Jebbari · Oussama Touate · Zakaria Ammar · Salma Bel Haj*

<br/>

[![Launch NeonCharts](https://img.shields.io/badge/⚡_Launch_NeonCharts-00D4FF?style=for-the-badge&labelColor=0D1117)](https://updatedsite-theta.vercel.app)

</div>
