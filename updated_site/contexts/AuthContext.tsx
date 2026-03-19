import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { withCsrfHeaders } from '../services/csrf';

export type Plan = 'free' | 'premium';

export interface AuthUser {
  id: string;
  email: string;
  username?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  plan: Plan;
}

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  loginWithEmail: (emailOrUsername: string, password: string) => Promise<AuthUser>;
  registerWithEmail: (args: { email: string; username?: string; fullName?: string; password: string }) => Promise<AuthUser>;
  loginWithGoogle: (credential: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function apiJson(path: string, options: RequestInit = {}) {
  const method = String(options.method || 'GET').toUpperCase();
  const withCsrf =
    method === 'GET' || method === 'HEAD' ? options : await withCsrfHeaders(options);
  const headers = new Headers(withCsrf.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(path, {
    ...withCsrf,
    credentials: 'include',
    headers,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = body?.error || `HTTP_${res.status}`;
    throw new Error(error);
  }

  return body;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await apiJson('/api/auth/me', { method: 'GET' });
      setUser(data.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refresh();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithEmail = async (emailOrUsername: string, password: string) => {
    const data = await apiJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ emailOrUsername, password }),
    });
    setUser(data.user);
    return data.user;
  };

  const registerWithEmail = async (args: { email: string; username?: string; fullName?: string; password: string }) => {
    const data = await apiJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(args),
    });
    setUser(data.user);
    return data.user;
  };

  const loginWithGoogle = async (credential: string) => {
    const data = await apiJson('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      await apiJson('/api/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, refresh, loginWithEmail, registerWithEmail, loginWithGoogle, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider />');
  return ctx;
}
