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
      const { data } = await authClient.jwt();
      token = data?.jwt || '';
      if (token) {
        localStorage.setItem('token', token);
      }
    } catch (e) {
      console.error('Error fetching JWT', e);
    }
  }
  return token;
};