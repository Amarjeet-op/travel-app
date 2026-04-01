import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession, getAdminIdentity, createAdminLog } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor');

    const db = getAdminDb();
    let query: any = db.collection('trips');

    if (status) {
      query = query.where('status', '==', status);
    } else {
      // Only apply orderBy if no status filter is present, otherwise Firestore requires composite indexes
      query = query.orderBy('createdAt', 'desc');
    }

    if (cursor) {
      const cursorDoc = await db.collection('trips').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.limit(limit + 1).get();
    const trips = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const hasMore = trips.length > limit;
    if (hasMore) trips.pop();
    const nextCursor = hasMore ? trips[trips.length - 1]?.id : null;

    return NextResponse.json({ trips, nextCursor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const session = sessionResult;
    const { tripId, action, notes } = await request.json();
    const db = getAdminDb();

    const updates: any = { updatedAt: new Date() };

    switch (action) {
      case 'cancel':
        updates.status = 'cancelled';
        break;
      case 'restore':
        updates.status = 'active';
        break;
    }

    await db.collection('trips').doc(tripId).update(updates);

    const adminIdentity = await getAdminIdentity(session);
    await createAdminLog(adminIdentity, 'remove_trip', 'trip', tripId, notes || `Admin action: ${action}`);

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
