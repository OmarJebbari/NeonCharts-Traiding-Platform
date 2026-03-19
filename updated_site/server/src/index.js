import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(helmet());

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many AI requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Vercel Serverless Functions strip the `/api` prefix when routed.
// We restore it here so our `app.get('/api/...')` routes match perfectly.
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  next();
});

const PORT = Number(process.env.PORT || 5000);

const rawConnectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING || '';
const usingPlaceholderDb =
  !rawConnectionString ||
  /user:password@host/i.test(rawConnectionString) ||
  /\/dbname(\?|$)/i.test(rawConnectionString);
const connectionString = usingPlaceholderDb ? '' : rawConnectionString;

const useSsl =
  process.env.PGSSL === 'true' ||
  /sslmode=require/i.test(rawConnectionString) ||
  isProduction;

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    })
  : null;

if (usingPlaceholderDb) {
  console.warn('[startup] DATABASE_URL is missing/placeholder. Using in-memory dev fallback.');
}

async function dbQuery(sql, params) {
  if (!pool) {
    const err = new Error('DB_NOT_CONFIGURED');
    err.code = 'DB_NOT_CONFIGURED';
    throw err;
  }

  let argIdx = 1;
  const pgSql = sql.replace(/\?/g, () => `$${argIdx++}`);
  const res = await pool.query(pgSql, params);
  const out = res.rows || [];
  if (res.command === 'INSERT' && out.length > 0 && out[0].id) {
    out.insertId = out[0].id;
  }
  return [out];
}

const memoryUsers = [];
let memoryUserIdSeq = 1;

const FALLBACK_CALENDAR_SECTIONS = [
  {
    date: 'Monday, January 5',
    events: [
      {
        id: 'm1',
        time: '07:00',
        country: 'USA',
        countryCode: 'US',
        title: 'MBA Mortgage Applications',
        volatility: 2,
        category: 'Economic',
        actual: '4.2%',
        forecast: '0.5%',
        prior: '-2.1%',
      },
      {
        id: 'm2',
        time: '16:05',
        country: 'USA',
        countryCode: 'US',
        title: 'Westwood Salient Enhanced Midstream Income ETF',
        ticker: 'MDST',
        volatility: 1,
        category: 'Dividends',
        dividendAmount: '0.22 USD',
        exDividendDate: 'Jan 5, 2026',
        paymentDate: 'Jan 9, 2026',
        dividendYield: '10.29%',
      },
      {
        id: 'm3',
        time: '04:26',
        country: 'India',
        countryCode: 'IN',
        title: 'Metropolis Healthcare Ltd.',
        ticker: 'METROPOLIS',
        volatility: 2,
        category: 'Earnings',
        actual: '0.10 USD',
        forecast: '0.10 USD',
        surprise: '+4.33%',
        marketCap: '1.16 B USD',
        period: 'pre',
        logo: 'M',
      },
      {
        id: 'm4',
        time: '04:26',
        country: 'India',
        countryCode: 'IN',
        title: 'Metropolis Healthcare Ltd.',
        ticker: 'METROPOLIS',
        volatility: 2,
        category: 'Revenue',
        actual: '45.19 M USD',
        forecast: '44.18 M USD',
        surprise: '+2.27%',
        marketCap: '1.16 B USD',
        period: 'pre',
        logo: 'M',
      },
    ],
  },
  {
    date: 'Tuesday, January 6',
    events: [
      {
        id: 'm5',
        time: '10:30',
        country: 'USA',
        countryCode: 'US',
        title: 'EIA Crude Oil Inventories',
        volatility: 3,
        category: 'Economic',
        actual: '-2.5M',
        forecast: '-0.45M',
        prior: '1.2M',
      },
      {
        id: 'm6',
        time: '22:05',
        country: 'USA',
        countryCode: 'US',
        title: 'AAR CORP.',
        ticker: 'AIR',
        volatility: 2,
        category: 'Earnings',
        actual: '1.18 USD',
        forecast: '1.03 USD',
        surprise: '+14.19%',
        marketCap: '3.54 B USD',
        period: 'post',
        logo: 'A',
      },
    ],
  },
];

const JWT_SECRET = process.env.JWT_SECRET || (isProduction ? '' : 'dev_localhost_secret_change_me');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true' || isProduction;
const cookieSameSiteRaw = (process.env.COOKIE_SAME_SITE || 'strict').toLowerCase();
const COOKIE_SAME_SITE =
  cookieSameSiteRaw === 'lax' || cookieSameSiteRaw === 'none' ? cookieSameSiteRaw : 'strict';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in production.');
}

if (!isProduction && JWT_SECRET === 'dev_localhost_secret_change_me') {
  console.warn('[security] Using fallback JWT_SECRET. Set JWT_SECRET in .env for safer local auth.');
}

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) : null;
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || '').trim();
const GEMINI_MODEL = (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();

function toPublicUser(row) {
  if (!row) return null;
  return {
    id: String(row.id),
    email: row.email,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    plan: row.plan,
  };
}

function signToken(userId) {
  return jwt.sign({ uid: String(userId) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function setAuthCookie(res, token) {
  // Cookie is domain-based (localhost) and works across ports.
  res.cookie('tv_token', token, {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function getUserById(userId) {
  if (!pool) {
    return memoryUsers.find((u) => String(u.id) === String(userId)) || null;
  }

  const [rows] = await dbQuery(
    'SELECT id, email, username, full_name, avatar_url, plan FROM users WHERE id = ? LIMIT 1',
    [userId]
  );
  return rows?.[0] || null;
}

async function authOptional(req, _res, next) {
  try {
    const token = req.cookies?.tv_token;
    if (!token) {
      req.user = null;
      return next();
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const uid = payload?.uid;
    if (!uid) {
      req.user = null;
      return next();
    }

    const user = await getUserById(uid);
    req.user = user ? toPublicUser(user) : null;
    return next();
  } catch {
    req.user = null;
    return next();
  }
}

function authRequired(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'AUTH_REQUIRED' });
  return next();
}

function premiumRequired(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'AUTH_REQUIRED' });
  if (req.user.plan !== 'premium') return res.status(403).json({ error: 'PREMIUM_REQUIRED' });
  return next();
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

function requireTrustedOrigin(req, res, next) {
  if (isAllowedOrigin(req.headers.origin)) return next();
  return res.status(403).json({ error: 'ORIGIN_NOT_ALLOWED' });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeText(value, maxLen = 160) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function ensureCsrfCookie(req, res) {
  const existing = req.cookies?.tv_csrf;
  if (existing) return existing;

  const token = crypto.randomBytes(24).toString('hex');
  res.cookie('tv_csrf', token, {
    httpOnly: false,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return token;
}

function csrfRequired(req, res, next) {
  const cookieToken = req.cookies?.tv_csrf;
  const headerToken = req.headers['x-csrf-token'];

  if (typeof cookieToken !== 'string' || !cookieToken) {
    return res.status(403).json({ error: 'CSRF_TOKEN_MISSING' });
  }
  if (typeof headerToken !== 'string' || !headerToken) {
    return res.status(403).json({ error: 'CSRF_TOKEN_INVALID' });
  }
  if (headerToken !== cookieToken) {
    return res.status(403).json({ error: 'CSRF_TOKEN_INVALID' });
  }

  return next();
}

async function callGemini(prompt, withSearch = false) {
  if (!GEMINI_API_KEY) {
    return { error: 'AI_NOT_CONFIGURED' };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    GEMINI_MODEL
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 320,
    },
    ...(withSearch ? { tools: [{ googleSearch: {} }] } : {}),
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error('[gemini] upstream error', response.status, text);
    return { error: 'AI_UPSTREAM_ERROR' };
  }

  const data = await response.json();
  const firstCandidate = data?.candidates?.[0];
  const text =
    firstCandidate?.content?.parts
      ?.map((part) => part?.text)
      ?.filter(Boolean)
      ?.join('\n')
      ?.trim() || '';

  const sources =
    firstCandidate?.groundingMetadata?.groundingChunks
      ?.map((chunk) => chunk?.web)
      ?.filter((web) => web?.uri)
      ?.map((web) => ({
        title: web.title || 'Source',
        uri: web.uri,
      })) || [];

  return { text, sources };
}

function safeServerError(res, scope, error) {
  console.error(`[${scope}]`, error);
  return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
}

// Attach req.user (if logged in)
app.use(authOptional);

// --------------------
// Health
// --------------------
app.get('/api/health', async (_req, res) => {
  if (!pool) {
    return res.json({ ok: true, db: false, mode: 'memory' });
  }

  try {
    const [r] = await dbQuery('SELECT 1 AS ok');
    res.json({ ok: true, db: r?.[0]?.ok === 1 });
  } catch (e) {
    console.error('[health]', e);
    res.status(500).json({ ok: false, error: 'INTERNAL_SERVER_ERROR' });
  }
});

app.get('/api/auth/csrf', requireTrustedOrigin, (req, res) => {
  const csrfToken = ensureCsrfCookie(req, res);
  return res.json({ csrfToken });
});

// --------------------
// Auth (Email/Password)
// --------------------
app.post('/api/auth/register', authRateLimit, requireTrustedOrigin, csrfRequired, async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body || {};

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanUsername = String(username || '').trim() || null;
    const cleanPassword = String(password || '');
    const cleanFullName = String(fullName || '').trim() || null;

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ error: 'EMAIL_AND_PASSWORD_REQUIRED' });
    }
    if (!isValidEmail(cleanEmail)) {
      return res.status(400).json({ error: 'INVALID_EMAIL' });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ error: 'PASSWORD_TOO_SHORT' });
    }

    if (!pool) {
      const exists = memoryUsers.some(
        (u) =>
          u.email === cleanEmail ||
          (cleanUsername && u.username && u.username.toLowerCase() === cleanUsername.toLowerCase())
      );
      if (exists) {
        return res.status(409).json({ error: 'USER_ALREADY_EXISTS' });
      }

      const passwordHash = await bcrypt.hash(cleanPassword, 10);
      const user = {
        id: memoryUserIdSeq++,
        email: cleanEmail,
        username: cleanUsername,
        password_hash: passwordHash,
        google_sub: null,
        full_name: cleanFullName,
        avatar_url: null,
        plan: 'free',
      };
      memoryUsers.push(user);

      const token = signToken(user.id);
      setAuthCookie(res, token);
      return res.json({ user: toPublicUser(user) });
    }

    // Check uniqueness
    const [existing] = await dbQuery(
      'SELECT id FROM users WHERE email = ? OR (? IS NOT NULL AND username = ?) LIMIT 1',
      [cleanEmail, cleanUsername, cleanUsername]
    );
    if (existing?.length) {
      return res.status(409).json({ error: 'USER_ALREADY_EXISTS' });
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    const [result] = await dbQuery(
      'INSERT INTO users (email, username, password_hash, full_name, plan) VALUES (?, ?, ?, ?, ?) RETURNING id',
      [cleanEmail, cleanUsername, passwordHash, cleanFullName, 'free']
    );

    const userId = result.insertId;
    const token = signToken(userId);
    setAuthCookie(res, token);

    const user = await getUserById(userId);
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    return safeServerError(res, 'auth_register', e);
  }
});

app.post('/api/auth/login', authRateLimit, requireTrustedOrigin, csrfRequired, async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};

    const login = String(emailOrUsername || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!login || !cleanPassword) {
      return res.status(400).json({ error: 'CREDENTIALS_REQUIRED' });
    }

    if (!pool) {
      const user = memoryUsers.find(
        (u) =>
          u.email.toLowerCase() === login ||
          (u.username ? u.username.toLowerCase() === login : false)
      );

      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
      }

      const ok = await bcrypt.compare(cleanPassword, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
      }

      const token = signToken(user.id);
      setAuthCookie(res, token);
      return res.json({ user: toPublicUser(user) });
    }

    const [rows] = await dbQuery(
      'SELECT id, email, username, full_name, avatar_url, plan, password_hash FROM users WHERE email = ? OR username = ? LIMIT 1',
      [login, login]
    );

    const user = rows?.[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    const ok = await bcrypt.compare(cleanPassword, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    const token = signToken(user.id);
    setAuthCookie(res, token);

    res.json({ user: toPublicUser(user) });
  } catch (e) {
    return safeServerError(res, 'auth_login', e);
  }
});

// --------------------
// Auth (Google)
// --------------------
app.post('/api/auth/google', authRateLimit, requireTrustedOrigin, csrfRequired, async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(500).json({ error: 'GOOGLE_CLIENT_ID_NOT_CONFIGURED' });
    }

    const { credential } = req.body || {};
    const idToken = String(credential || '').trim();
    if (!idToken) {
      return res.status(400).json({ error: 'CREDENTIAL_REQUIRED' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleSub = payload?.sub;
    const email = (payload?.email || '').toLowerCase();
    const fullName = payload?.name || null;
    const avatarUrl = payload?.picture || null;

    if (!googleSub || !email) {
      return res.status(401).json({ error: 'INVALID_GOOGLE_TOKEN' });
    }

    if (!pool) {
      let user = memoryUsers.find((u) => u.google_sub === googleSub || u.email === email);

      if (!user) {
        user = {
          id: memoryUserIdSeq++,
          email,
          username: null,
          password_hash: null,
          google_sub: googleSub,
          full_name: fullName,
          avatar_url: avatarUrl,
          plan: 'free',
        };
        memoryUsers.push(user);
      } else {
        user.google_sub = googleSub;
        user.full_name = user.full_name || fullName;
        user.avatar_url = user.avatar_url || avatarUrl;
      }

      const token = signToken(user.id);
      setAuthCookie(res, token);
      return res.json({ user: toPublicUser(user) });
    }

    // Find by google_sub, else by email
    const [rows] = await dbQuery(
      'SELECT id, email, username, full_name, avatar_url, plan FROM users WHERE google_sub = ? OR email = ? LIMIT 1',
      [googleSub, email]
    );

    let userId;
    if (rows?.length) {
      userId = rows[0].id;
      await dbQuery(
        'UPDATE users SET google_sub = ?, full_name = COALESCE(?, full_name), avatar_url = COALESCE(?, avatar_url) WHERE id = ?',
        [googleSub, fullName, avatarUrl, userId]
      );
    } else {
      const [result] = await dbQuery(
        'INSERT INTO users (email, google_sub, full_name, avatar_url, plan) VALUES (?, ?, ?, ?, ?) RETURNING id',
        [email, googleSub, fullName, avatarUrl, 'free']
      );
      userId = result.insertId;
    }

    const token = signToken(userId);
    setAuthCookie(res, token);

    const user = await getUserById(userId);
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    return safeServerError(res, 'auth_google', e);
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', requireTrustedOrigin, csrfRequired, async (_req, res) => {
  res.clearCookie('tv_token', {
    path: '/',
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
  });
  res.clearCookie('tv_csrf', {
    path: '/',
    httpOnly: false,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
  });
  res.json({ ok: true });
});

// --------------------
// AI API (server-side Gemini proxy)
// --------------------
app.post('/api/ai/event-analysis', aiRateLimit, requireTrustedOrigin, csrfRequired, async (req, res) => {
  try {
    const event = req.body?.event || {};

    const title = sanitizeText(event.title, 180);
    const country = sanitizeText(event.country, 80);
    const category = sanitizeText(event.category, 40);
    const ticker = sanitizeText(event.ticker, 32);
    const actual = sanitizeText(event.actual, 64);
    const forecast = sanitizeText(event.forecast, 64);
    const prior = sanitizeText(event.prior, 64);
    const surprise = sanitizeText(event.surprise, 64);
    const volatility = sanitizeText(event.volatility, 8);

    if (!title || !country || !category) {
      return res.status(400).json({ error: 'INVALID_EVENT_PAYLOAD' });
    }

    const prompt = `
You are a senior financial analyst.
Write a concise analysis in at most 2 sentences.
Focus on what Actual vs Forecast implies for short-term market reaction.
If Actual is unavailable, explain what a higher-than-expected or lower-than-expected reading would generally imply.

Event: ${title}${ticker ? ` (${ticker})` : ''}
Country: ${country}
Category: ${category}
Actual: ${actual || 'N/A'}
Forecast: ${forecast || 'N/A'}
Prior: ${prior || 'N/A'}
Surprise: ${surprise || 'N/A'}
Volatility: ${volatility || 'N/A'}/3
    `.trim();

    const ai = await callGemini(prompt, false);
    if (ai.error === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
    }
    if (ai.error) {
      return res.status(502).json({ error: 'AI_UPSTREAM_ERROR' });
    }

    return res.json({
      text: ai.text || 'Analysis currently unavailable.',
    });
  } catch (e) {
    return safeServerError(res, 'ai_event_analysis', e);
  }
});

app.post('/api/ai/market-analysis', aiRateLimit, requireTrustedOrigin, csrfRequired, async (req, res) => {
  try {
    const symbol = sanitizeText(req.body?.symbol, 20).toUpperCase();
    const sector = sanitizeText(req.body?.sector, 60);

    if (!symbol || !/^[A-Z0-9._:-]{1,20}$/.test(symbol)) {
      return res.status(400).json({ error: 'INVALID_SYMBOL' });
    }

    const prompt = `
You are a stock market analyst.
In 3 to 4 concise sentences, summarize the latest short-term sentiment for ${symbol}${sector ? ` (${sector})` : ''}.
Use recent web context and focus on catalysts, price action drivers, and short-term risk.
    `.trim();

    const ai = await callGemini(prompt, true);
    if (ai.error === 'AI_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'AI_NOT_CONFIGURED' });
    }
    if (ai.error) {
      return res.status(502).json({ error: 'AI_UPSTREAM_ERROR' });
    }

    return res.json({
      text: ai.text || 'Market analysis unavailable.',
      sources: ai.sources || [],
    });
  } catch (e) {
    return safeServerError(res, 'ai_market_analysis', e);
  }
});

// --------------------
// Calendar API
// --------------------
function formatDayLabel(isoDate) {
  const parts = String(isoDate).split('T')[0].split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const dNum = parseInt(parts[2], 10);
    const d = new Date(y, m, dNum);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
    const month = d.toLocaleDateString('en-US', { month: 'long' });
    const day = d.getDate();
    return `${weekday}, ${month} ${day}`;
  }
  return `DEBUG_ISODATE: ${isoDate}`;
}

function timeToHHMM(t) {
  if (!t) return '00:00';
  return String(t).slice(0, 5);
}

function rowToEvent(row) {
  return {
    id: String(row.id),
    time: timeToHHMM(row.event_time),
    country: row.country,
    countryCode: row.country_code,
    title: row.title,
    ticker: row.ticker ?? undefined,
    volatility: row.volatility ?? 1,
    category: row.category,
    actual: row.actual ?? undefined,
    forecast: row.forecast ?? undefined,
    prior: row.prior ?? undefined,
    surprise: row.surprise ?? undefined,
    marketCap: row.market_cap ?? undefined,
    period: row.period ?? undefined,
    logo: row.logo ?? undefined,
    dividendAmount: row.dividend_amount ?? undefined,
    exDividendDate: row.ex_dividend_date ?? undefined,
    paymentDate: row.payment_date ?? undefined,
    dividendYield: row.dividend_yield ?? undefined,
  };
}

// Returns DaySection[] (same shape as your frontend constants.ts)
app.get('/api/calendar', async (req, res) => {
  if (!pool) {
    return res.json(FALLBACK_CALENDAR_SECTIONS);
  }

  try {
    const { start, end, q, category, impact } = req.query;

    const where = [];
    const params = [];

    if (typeof q === 'string' && q.trim()) {
      where.push('(title LIKE ? OR country LIKE ? OR country_code LIKE ? OR ticker LIKE ?)');
      const like = `%${q.trim()}%`;
      params.push(like, like, like, like);
    } else {
      if (typeof start === 'string' && typeof end === 'string') {
        where.push('event_date BETWEEN ? AND ?');
        params.push(start, end);
      }
    }

    if (typeof category === 'string' && category.trim()) {
      where.push('category = ?');
      params.push(category.trim());

      if (category.trim() === 'Economic' && typeof impact === 'string' && impact !== 'All') {
        if (impact === 'High') where.push('volatility = 3');
        else if (impact === 'Medium') where.push('volatility = 2');
        else if (impact === 'Low') where.push('volatility = 1');
      }
    }

    const sql = `
      SELECT
        id, event_date, event_time,
        category, country, country_code, title, ticker,
        volatility, actual, forecast, prior, surprise,
        market_cap, period, logo,
        dividend_amount, ex_dividend_date, payment_date, dividend_yield
      FROM calendar_events
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY event_date ASC, event_time ASC, id ASC
    `;

    const [rows] = await dbQuery(sql, params);

    const map = new Map();
    for (const row of rows) {
      let iso = '';
      if (row.event_date instanceof Date) {
        iso = row.event_date.toISOString().split('T')[0];
      } else {
        iso = String(row.event_date).slice(0, 10);
      }

      if (!map.has(iso)) {
        map.set(iso, { date: formatDayLabel(iso), events: [] });
      }
      map.get(iso).events.push(rowToEvent(row));
    }

    res.json(Array.from(map.values()));
  } catch (e) {
    return safeServerError(res, 'calendar_list', e);
  }
});

// Example of a premium-only endpoint (optional for future use)
app.get('/api/premium/ping', premiumRequired, (_req, res) => {
  res.json({ ok: true, premium: true });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log('Health check: GET /api/health');
    console.log('Calendar data: GET /api/calendar');
  });
}

export default app;
