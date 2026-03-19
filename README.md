# NeonCharts Trading Platform

This repository is now organized around one active application:

- `updated_site/` -> full-stack app (React frontend + Express backend + Postgres)

## Quick Start

1. Go to the app folder:

```bash
cd updated_site
```

2. Copy env templates:

- `.env.example` -> `.env.local` (frontend)
- `server/.env.example` -> `server/.env` (backend)

3. Install dependencies:

```bash
npm install
```

4. Start backend (terminal 1):

```bash
npm run dev:server
```

5. Start frontend (terminal 2):

```bash
npm run dev
```

## Architecture

- Frontend: React + Vite + TypeScript
- Backend: Express API (`updated_site/server/src/index.js`)
- Database: Postgres/Neon via `DATABASE_URL`
- Auth: JWT cookie (`HttpOnly`) + Google OAuth + email/password
- AI: Gemini via backend proxy endpoints only

## Security

- Security policy: `SECURITY.md`
- Detailed technical hardening review: `updated_site/SECURITY_REVIEW.md`

## License

MIT (`LICENSE`)
