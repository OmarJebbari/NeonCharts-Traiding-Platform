import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const app = express();

// In dev, the frontend runs on http://localhost:3000 (see vite.config.ts).
// We still keep CORS permissive enough for local testing.
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Vercel Serverless Functions strip the `/api` prefix when routed.
// We restore it here so our `app.get('/api/...')` routes match perfectly.
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url === '/' ? '' : req.url);
  }
  next();
});

const PORT = Number(process.env.PORT || 5000);

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function dbQuery(sql, params) {
  let argIdx = 1;
  const pgSql = sql.replace(/\?/g, () => `$${argIdx++}`);
  const res = await pool.query(pgSql, params);
  const out = res.rows || [];
  if (res.command === 'INSERT' && out.length > 0 && out[0].id) {
    out.insertId = out[0].id;
  }
  return [out];
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev_localhost_secret_change_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || '').trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) : null;

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
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function getUserById(userId) {
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

// Attach req.user (if logged in)
app.use(authOptional);

// --------------------
// Health
// --------------------
app.get('/api/health', async (_req, res) => {
  try {
    const [r] = await dbQuery('SELECT 1 AS ok');
    res.json({ ok: true, db: r?.[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

// --------------------
// Auth (Email/Password)
// --------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password, fullName } = req.body || {};

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanUsername = String(username || '').trim() || null;
    const cleanPassword = String(password || '');
    const cleanFullName = String(fullName || '').trim() || null;

    if (!cleanEmail || !cleanPassword) {
      return res.status(400).json({ error: 'EMAIL_AND_PASSWORD_REQUIRED' });
    }
    if (cleanPassword.length < 6) {
      return res.status(400).json({ error: 'PASSWORD_TOO_SHORT' });
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
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body || {};

    const login = String(emailOrUsername || '').trim().toLowerCase();
    const cleanPassword = String(password || '');

    if (!login || !cleanPassword) {
      return res.status(400).json({ error: 'CREDENTIALS_REQUIRED' });
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
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// --------------------
// Auth (Google)
// --------------------
app.post('/api/auth/google', async (req, res) => {
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
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.get('/api/auth/me', authRequired, async (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/auth/logout', async (_req, res) => {
  res.clearCookie('tv_token', { path: '/' });
  res.json({ ok: true });
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
    res.status(500).json({ error: String(e?.message || e) });
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
