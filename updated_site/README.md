NeonCharts (updated_site)

Production-focused full-stack architecture:

- Frontend: React + Vite + TypeScript
- Backend: Express API in `server/src/index.js`
- Database: Postgres / Neon via `DATABASE_URL`
- Auth: Email/password + Google OAuth
- Session: JWT in HttpOnly cookie (`tv_token`)
- AI: Gemini proxied by backend (`/api/ai/*`) so no API key in browser bundle

Essential structure:

updated_site/
- App.tsx
- index.tsx
- components/
- contexts/
- services/
  - csrf.ts
  - geminiService.ts
- server/
  - src/index.js
  - db/schema.sql
  - db/seed.sql

Environment setup:

1) Frontend
- Copy `.env.example` to `.env.local`
- Set `VITE_GOOGLE_CLIENT_ID`

2) Backend
- Copy `server/.env.example` to `server/.env`
- Set at minimum:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `CORS_ORIGIN=http://localhost:3000`
- Optional AI:
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL=gemini-2.5-flash`

Run locally:

1) Install once

```bash
npm install
```

2) Start backend (terminal 1)

```bash
npm run dev:server
```

3) Start frontend (terminal 2)

```bash
npm run dev
```

4) Build frontend

```bash
npm run build
```

5) Health check backend
- `GET http://localhost:5000/api/health`
- If `DATABASE_URL` is missing/placeholder, backend starts in `memory` mode for local dev.

Security baseline:

- Helmet headers
- CORS allowlist from env
- Trusted origin enforcement on state-changing routes
- CSRF protection (double-submit cookie + `X-CSRF-Token` header)
- Auth + AI rate limits
- Input sanitization on AI/user payloads
- Internal error details are not returned to clients
- AI key remains backend-only

Operational notes:

- `vercel.json` routes `/api/*` to `server/src/index.js`
- Keep secrets only in env files, never in frontend source
- Use `updated_site/SECURITY_REVIEW.md` for current hardening status and next steps
