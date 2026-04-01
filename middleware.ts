import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/trips',
  '/messages',
  '/safety-checker',
  '/profile',
  '/settings',
  '/notifications',
];

const ADMIN_PREFIXES = ['/admin'];
const AUTH_PREFIXES = ['/auth', '/admin-login', '/onboarding', '/forgot-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAdminRoute = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected || isAdminRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    try {
      const res = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: { Cookie: `session=${sessionCookie.value}` },
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL('/auth', request.url));
      }

      const data = await res.json();

      if (isAdminRoute && !data.admin) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
  }

  if (isAuthRoute && sessionCookie) {
    try {
      const res = await fetch(`${request.nextUrl.origin}/api/auth/verify`, {
        headers: { Cookie: `session=${sessionCookie.value}` },
      });
      if (res.ok) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/trips/:path*', '/messages/:path*', '/safety-checker/:path*', '/profile/:path*', '/settings/:path*', '/notifications/:path*', '/admin/:path*', '/auth', '/admin-login', '/onboarding', '/forgot-password'],
};
