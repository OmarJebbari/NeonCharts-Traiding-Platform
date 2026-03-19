let cachedCsrfToken: string | null = null;
let csrfInFlight: Promise<string> | null = null;

function readCookieToken(): string | null {
  if (typeof document === 'undefined') return null;

  const pair = document.cookie
    .split('; ')
    .find((item) => item.startsWith('tv_csrf='));
  if (!pair) return null;

  const value = pair.slice('tv_csrf='.length);
  return value ? decodeURIComponent(value) : null;
}

export async function getCsrfToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const fromCookie = readCookieToken();
    if (fromCookie) {
      cachedCsrfToken = fromCookie;
      return fromCookie;
    }
    if (typeof document === 'undefined' && cachedCsrfToken) return cachedCsrfToken;
  }

  if (csrfInFlight) return csrfInFlight;

  csrfInFlight = (async () => {
    const res = await fetch('/api/auth/csrf', {
      method: 'GET',
      credentials: 'include',
    });

    const isJson = res.headers.get('content-type')?.includes('application/json');
    const body = isJson ? await res.json() : null;

    if (!res.ok) {
      throw new Error(body?.error || `HTTP_${res.status}`);
    }

    const tokenFromBody = typeof body?.csrfToken === 'string' ? body.csrfToken : null;
    const token = tokenFromBody || readCookieToken();
    if (!token) {
      throw new Error('CSRF_TOKEN_MISSING');
    }

    cachedCsrfToken = token;
    return token;
  })();

  try {
    return await csrfInFlight;
  } finally {
    csrfInFlight = null;
  }
}

export async function withCsrfHeaders(options: RequestInit = {}): Promise<RequestInit> {
  const token = await getCsrfToken();
  const headers = new Headers(options.headers || {});
  headers.set('X-CSRF-Token', token);
  return { ...options, headers };
}
