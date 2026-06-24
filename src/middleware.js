import { NextResponse } from 'next/server';

// Routes that require the user to be logged in
const PROTECTED_ROUTES = ['/dashboard', '/admin'];

// Routes that require admin role
const ADMIN_ROUTES = ['/dashboard/admin', '/admin'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isDashboardRoute) return NextResponse.next();

  // Forward the browser cookies to get-session to check auth state
  const cookieHeader = request.headers.get('cookie') || '';

  try {
    const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
      headers: { 'Cookie': cookieHeader }
    });

    if (!sessionRes.ok) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = await sessionRes.json();

    if (!session || !session.user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Block check — blocked users get redirected to a blocked page
    if (session.user.isBlocked === true) {
      return NextResponse.redirect(new URL('/blocked', request.url));
    }

    // Admin-only route check
    const isAdminRoute = ADMIN_ROUTES.some(route => pathname.startsWith(route));
    if (isAdminRoute && session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware auth error:', error.message);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/admin'],
};
