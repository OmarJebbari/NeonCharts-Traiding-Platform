<div align="center">

# 🌌 NeonCharts

### Advanced Financial Analytics & Trading Ecosystem

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
![Neon](https://img.shields.io/badge/Neon_Serverless-00E5CC?style=flat-square)
![Vercel](https://img.shields.io/badge/Vercel_Edge-000000?style=flat-square&logo=vercel&logoColor=white)
![OAuth](https://img.shields.io/badge/OAuth_2.0-EB5424?style=flat-square&logo=auth0&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=jsonwebtokens)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white)

<br/>

> **NeonCharts** is a production-grade financial analytics ecosystem — engineered for real-time market intelligence, economic event orchestration, and AI-augmented trading insight. Built on a glassmorphism UI engine with a globally edge-distributed serverless backend.

```
╔══════════════════════════════════════════════════════════════════════╗
║   REAL-TIME · SERVERLESS · AI-AUGMENTED · RBAC-SECURED · EDGE-FIRST ║
╚══════════════════════════════════════════════════════════════════════╝
```

</div>

---

## 📑 Table of Contents

- [🎯 Platform Overview](#-platform-overview)
- [🏛️ System Architecture](#%EF%B8%8F-system-architecture)
- [⚛️ Technology Stack](#%EF%B8%8F-technology-stack)
- [✨ Feature Matrix](#-feature-matrix)
- [🗄️ Database Schema](#%EF%B8%8F-database-schema)
- [📁 Repository Structure](#-repository-structure)
- [🚀 Deployment](#-deployment)
- [⚙️ Local Development](#%EF%B8%8F-local-development)
- [🌐 Environment Variables](#-environment-variables)
- [👨‍💻 Engineering Team](#-engineering-team)
- [📜 License](#-license)

---

## 🎯 Platform Overview

**NeonCharts** is a TradingView-class analytics platform built for quantitative analysts, institutional traders, and sophisticated retail investors who demand precision and speed.

| Capability | Specification |
|---|---|
| Global render latency | Sub-100ms via Vercel Edge Network |
| Authentication | OAuth 2.0 + signed JWT (Google Identity) |
| Session security | HttpOnly + SameSite=Strict — zero XSS exposure |
| Access control | RBAC middleware-enforced premium route gating |
| AI layer | Google Gemini sentiment engine (experimental) |
| Database | Neon serverless PostgreSQL — autoscale-to-zero |
| CI/CD | Zero-config — every push to `main` ships live |

---

## 🏛️ System Architecture

```mermaid
graph TD
    U((("👤 Global User")))
    U -->|"HTTPS / TLS 1.3"| VE

    subgraph EDGE ["☁️ Vercel Edge Network"]
        VE["CDN · Static Assets · Cache"]
        EM["Edge Middleware · JWT Pre-validation"]
    end

    VE --> SPA
    EM --> API

    subgraph FRONT ["⚛️ Frontend Layer"]
        SPA["React 18 · Vite 5 · TypeScript 5\nTailwind CSS · Glassmorphism UI Engine"]
    end

    subgraph BACK ["🛡️ Serverless API Layer"]
        API["Express.js · Node.js 20 LTS\nOAuth 2.0 · JWT Middleware · RBAC Guards"]
        GI["Google Identity\nOAuth 2.0"]
        GA["Gemini AI\nSentiment Engine"]
    end

    subgraph PERSIST ["🗄️ Persistence Layer"]
        DB[("Neon Serverless\nPostgreSQL 15+\nACID · PITR · Autoscale")]
    end

    SPA <-->|"REST / JSON"| API
    API --> GI
    API --> GA
    API --> DB
```

### Architecture principles

| Principle | Implementation |
|---|---|
| **Stateless backend** | Ephemeral serverless functions — all state in Neon DB or client JWT |
| **Zero cold-start** | Vercel Edge keeps warm instances at distributed global POPs |
| **Defense in depth** | Auth enforced at Edge → API middleware → DB query level |
| **Least privilege** | RBAC server-side — premium routes unreachable without valid `role` claim |
| **Separation of concerns** | Frontend SPA, API, and DB are fully independent deployable units |

---

## ⚛️ Technology Stack

### Frontend

| Layer | Technology | Purpose |
|---|---|---|
| Build system | **Vite 5.x** | Sub-100ms HMR, ES Module bundling, tree-shaking |
| UI framework | **React 18** | Concurrent rendering, Suspense, automatic batching |
| Language | **TypeScript 5.x** | Strict mode, generics, discriminated unions |
| Styling | **Tailwind CSS + Modular CSS** | Glassmorphism design system |
| Design | **Glassmorphism Engine** | `backdrop-filter: blur()` layered UI, neon accent palette |
| Icons | **Lucide React** | 1000+ SVG icons, fully tree-shakeable |

### Backend & infrastructure

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | **Node.js 20 LTS** | V8 engine, async I/O, native Fetch |
| Framework | **Express.js** | Routing, middleware chaining, error propagation |
| Deployment | **Vercel Serverless** | Auto-scaling, zero-config CI/CD, edge routing |
| Auth | **OAuth 2.0 — Google Identity** | Federated identity — zero passwords stored |
| Sessions | **JWT HS256** | Stateless, signed, expiry-bound; embedded `role` claim |
| Cookies | **HttpOnly + SameSite=Strict** | XSS-proof; CSRF mitigated |
| Access | **RBAC Middleware** | Per-route guards on all premium endpoints |

### Data persistence

| Component | Technology | Detail |
|---|---|---|
| Database | **Neon Serverless PostgreSQL** | PG 15+, branch-based dev/staging |
| Driver | **Neon HTTP Driver** | No persistent pool — serverless-optimized |
| Consistency | **ACID Transactions** | Atomic subscription state mutations |
| Recovery | **PITR** | Point-in-Time Recovery, branch snapshots |
| Scaling | **Autoscale-to-zero** | Pauses on idle, scales instantly on demand |

---

## ✨ Feature Matrix

### Core tier — all users

| Feature | Description |
|---|---|
| Economic calendar | Real-time global events: CPI, NFP, FOMC, earnings, dividends |
| Dynamic charting | Candlestick + line charts with technical analysis overlays |
| Volatility filter | Low / Medium / High impact events, color-coded urgency |
| Geographic filter | US, EU, APAC, EM market blocs |
| Google OAuth | One-click sign-in — zero password friction |
| Responsive UI | Mobile-first — full parity across all breakpoints |

### Premium tier — authenticated + subscribed

| Feature | Description |
|---|---|
| SymbolDetailView | Earnings history, analyst ratings, fundamentals per ticker |
| AI sentiment engine | Gemini-powered contextual market analysis |
| Advanced charting | Extended timeframes, custom indicators, multi-symbol overlays |
| Export pipeline | Structured data export for quantitative backtesting |

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
│   └── schema.sql                    # SQL schema & migrations
│
├── updated_site/                     # Application source root
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   ├── pages/                    # Route-level page components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── api/                      # Typed API client utilities
│   │   ├── types/                    # TypeScript type definitions
│   │   └── utils/                    # Pure helper functions
│   │
│   ├── api/                          # Vercel serverless handlers
│   │   ├── auth/                     # OAuth callback + JWT issuance
│   │   └── [data endpoints]          # Market data, calendar, prefs
│   │
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .gitignore
├── LICENSE                           # MIT — Copyright 2026 Omar Jebbari
└── README.md
```

---

## 🚀 Deployment

| Environment | Trigger | URL |
|---|---|---|
| **Production** | Push to `main` | https://updatedsite-theta.vercel.app |
| **Preview** | Any PR or branch | Auto-generated per-PR Vercel URL |
| **Local** | `npm run dev` | http://localhost:5173 |

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

> **Never commit `.env.local`** — already excluded by `.gitignore`.
> Use **Vercel Environment Variables** for all production secrets.

---

## 👨‍💻 Engineering Team

<div align="center">

| Engineer | Contributions |
|---|---|
| **Omar Jebbari** | System design · API architecture · Core infrastructure · Full-stack ownership |
| **Oussama Touate** | Serverless functions · PostgreSQL schema · Query optimization · Data modeling |
| **Zakaria Ammar** | React architecture · Glassmorphism design system · Performance · Components |
| **Salma Bel Haj** | Auth protocols · RBAC design · Test coverage · Security hardening |

</div>

---

## 📜 License

Distributed under the **MIT License** — Copyright © 2026 Omar Jebbari.
See [`LICENSE`](./LICENSE) for the full text.

---

<div align="center">

**Built with precision for the modern trading era.**

*Omar Jebbari · Oussama Touate · Zakaria Ammar · Salma Belhaj*

<br/>

[![Launch NeonCharts](https://img.shields.io/badge/⚡_Launch_NeonCharts-00D4FF?style=for-the-badge&labelColor=0D1117)](https://updatedsite-theta.vercel.app)

</div>
