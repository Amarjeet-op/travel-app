import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession, getAdminIdentity, createAdminLog } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const verified = searchParams.get('verified');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor');

    const db = getAdminDb();
    let query: any = db.collection('users');

    // Fetch more for in-memory filtering if searching or filtering
    // Since this is an admin panel for a small/medium user base, this is safe
    const snapshot = await query.limit(500).get();
    let allUsers = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    // In-memory Filter
    let filteredUsers = allUsers.filter((u: any) => {
      let matches = true;
      if (status && u.status !== status) matches = false;
      if (verified !== null) {
        const isVerifiedBool = (verified === 'true');
        const userVerified = !!u.isVerified; // true if true, false if false/undefined/null
        if (userVerified !== isVerifiedBool) {
          matches = false;
        }
      }
      if (search) {
        const s = search.toLowerCase();
        if (!(u.displayName?.toLowerCase().includes(s) || u.email?.toLowerCase().includes(s))) {
          matches = false;
        }
      }
      return matches;
    });

    // Sort by createdAt desc in memory
    filteredUsers.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    // Handle pagination (basic for now)
    const paginatedUsers = filteredUsers.slice(0, limit);
    const hasMore = filteredUsers.length > limit;
    const nextCursor = hasMore ? paginatedUsers[paginatedUsers.length - 1].id : null;

    return NextResponse.json({ users: paginatedUsers, nextCursor });
  } catch (error: any) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const session = sessionResult;
    const { userId, action, notes } = await request.json();
    const db = getAdminDb();

    const updates: any = { updatedAt: new Date() };

    switch (action) {
      case 'verify':
        updates.isVerified = true;
        break;
      case 'suspend':
        updates.status = 'suspended';
        break;
      case 'unsuspend':
        updates.status = 'active';
        break;
      case 'make_admin':
        updates.role = 'admin';
        break;
    }

    await db.collection('users').doc(userId).set(updates, { merge: true });

    const adminIdentity = await getAdminIdentity(session);
    await createAdminLog(adminIdentity, action, 'user', userId, notes || `Admin action: ${action}`);

    // Create notification for user if verified
    if (action === 'verify') {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        await db.collection('notifications').add({
          userId,
          type: 'account_verified',
          title: 'Account Verified',
          body: 'Your account has been verified by an admin.',
          link: '/profile',
          read: false,
          data: {},
          createdAt: new Date(),
        });
      }
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
