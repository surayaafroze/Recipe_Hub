import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"),
    plugins: [jwtClient()]
});

export const { signIn, signUp, useSession } = authClient;

export const getValidToken = async (forceRefresh = false) => {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('token');
  
  if (forceRefresh || !token || token === 'undefined' || token === 'null') {
      try {
        const res = await fetch('/api/auth/get-token', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data?.token) {
            token = data.token;
            localStorage.setItem('token', token);
          } else {
            token = '';
            localStorage.removeItem('token');
          }
        }
      } catch (e) {
        console.error('Failed to fetch session token', e);
      }
  }
  return token || '';
};

// ─── Authenticated fetch helper ───────────────────────────────────────────────
// Automatically attaches Bearer token for cross-origin API calls on production.
// Falls back gracefully if token is unavailable.
export const authFetch = async (url, options = {}) => {
  let token = await getValidToken();
  const getHeaders = (t) => ({
    ...(options.headers || {}),
    ...(t ? { 'Authorization': `Bearer ${t}` } : {}),
  });

  let response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: getHeaders(token),
  });

  // If unauthorized, token might be stale. Force refresh and retry once.
  if (response.status === 401) {
    token = await getValidToken(true);
    if (token) {
      response = await fetch(url, {
        credentials: 'include',
        ...options,
        headers: getHeaders(token),
      });
    }
  }

  return response;
};