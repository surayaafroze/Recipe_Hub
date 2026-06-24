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
  if (!token) {
    try {
      let { data } = await authClient.jwt().catch(() => ({ data: null }));
      if (data?.jwt) {
        token = data.jwt;
      } else {
        // Fallback to getting the session token which is also a JWT
        const sessionRes = await authClient.getSession();
        if (sessionRes?.data?.session?.token) {
          token = sessionRes.data.session.token;
        }
      }
      
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (e) {
      console.error('Error fetching JWT', e);
    }
  }
  return token;
};