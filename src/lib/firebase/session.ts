import { getAdminAuth, getAdminDb } from '@/lib/firebase/admin';

export interface SessionUser {
  uid: string;
  email: string;
  admin: boolean;
}

export async function verifySessionFromRequest(request: Request): Promise<SessionUser | null> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;

    if (!sessionCookie) {
      return null;
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email!,
      admin: decodedToken.admin === true,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(request: Request): Promise<SessionUser | { error: Response }> {
  const session = await verifySessionFromRequest(request);
  
  if (!session) {
    const { NextResponse } = await import('next/server');
    return {
      error: NextResponse.json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 }),
    };
  }

  if (!session.admin) {
    const { NextResponse } = await import('next/server');
    return {
      error: NextResponse.json({ status: 'error', code: 'FORBIDDEN', message: 'Admin access required' }, { status: 403 }),
    };
  }

  return session;
}

export async function getAdminIdentity(session: SessionUser) {
  const db = getAdminDb();
  const userDoc = await db.collection('users').doc(session.uid).get();
  
  return {
    adminId: session.uid,
    adminEmail: session.email,
    adminName: userDoc.exists ? userDoc.data()?.displayName || session.email : session.email,
  };
}

export async function createAdminLog(admin: { adminId: string; adminEmail: string; adminName: string }, action: string, targetType: string, targetId: string, details: string) {
  const db = getAdminDb();
  await db.collection('adminLogs').add({
    adminId: admin.adminId,
    adminEmail: admin.adminEmail,
    adminName: admin.adminName,
    action,
    targetType,
    targetId,
    details,
    createdAt: new Date(),
  });
}
