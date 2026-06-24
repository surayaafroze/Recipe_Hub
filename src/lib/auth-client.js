import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
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