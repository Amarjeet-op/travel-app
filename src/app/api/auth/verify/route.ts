export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAdminAuth } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;

    if (!sessionCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);

    return NextResponse.json({
      authenticated: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
      admin: decodedToken.admin === true,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
