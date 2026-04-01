import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';
import { APP_CONFIG } from '@/constants/config';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const authTime = decodedToken.auth_time || 0;
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - authTime > 5 * 60) {
      return NextResponse.json({ error: 'Recent sign-in required' }, { status: 401 });
    }

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: APP_CONFIG.sessionMaxAge * 1000,
    });

    const response = NextResponse.json({ status: 'success' });
    response.cookies.set(APP_CONFIG.sessionCookieName, sessionCookie, {
      maxAge: APP_CONFIG.sessionMaxAge,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' });
  response.cookies.set(APP_CONFIG.sessionCookieName, '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
