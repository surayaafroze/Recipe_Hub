import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"),
    plugins: [jwtClient()]
});

export const { signIn, signUp, useSession } = authClient;

export const getValidToken = async () => {
  if (typeof window === 'undefined') return '';
  let token = localStorage.getItem('token');
  
  if (!token || token === 'undefined' || token === 'null') {
      try {
        const res = await fetch('/api/auth/get-token');
        if (res.ok) {
          const data = await res.json();
          if (data?.token) {
            token = data.token;
            localStorage.setItem('token', token);
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
  const token = await getValidToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
  return fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  });
};