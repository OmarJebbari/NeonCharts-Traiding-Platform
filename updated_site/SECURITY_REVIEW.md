# Security Review (updated_site)

Date: 2026-03-19

## Fixed in this cleanup

1. High: Gemini API key exposure in frontend
- Before: frontend injected and used Gemini key directly in browser bundle.
- Risk: key theft, quota abuse, billing abuse.
- Fix: all Gemini calls moved to backend proxy endpoints (`/api/ai/event-analysis`, `/api/ai/market-analysis`).

2. Medium: CSRF protection missing on state-changing routes
- Before: cookie-based auth without CSRF token verification.
- Fix: added CSRF double-submit protection.
  - Backend issues `tv_csrf` via `GET /api/auth/csrf`.
  - Frontend sends `X-CSRF-Token` on POST requests.
  - Backend enforces token match on auth/logout/AI endpoints.

3. Medium: Auth cookie policy too weak by default
- Before: cookie was always `secure: false`, `sameSite: lax`.
- Fix: secure, env-driven cookie policy (`COOKIE_SECURE`, `COOKIE_SAME_SITE`).

4. Medium: CORS and trusted origin controls too static
- Before: hardcoded single origin and no state-changing origin enforcement.
- Fix: env allowlist (`CORS_ORIGIN`) + origin middleware on sensitive routes.

5. Medium: Internal error detail leakage
- Before: raw server errors returned in API responses.
- Fix: standardized safe internal error responses.

6. Supply-chain security
- Fix: dependency audit cleanup (`npm audit fix`); currently no known vulnerabilities in frontend lockfile.

## Remaining risks / recommended next steps

1. Add schema validation library (zod/joi) for strict request validation on all endpoints.
2. Add authentication + CSRF automated tests.
3. Add centralized audit logging for auth failures and rate-limit hits.
4. Add CI checks: `npm audit`, build, and API smoke tests on every PR.
5. Add stricter CSP once inline scripts are removed from `index.html`.
