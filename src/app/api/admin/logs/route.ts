import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const action = searchParams.get('action');
    const targetType = searchParams.get('targetType');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor');

    const db = getAdminDb();
    let query: any = db.collection('adminLogs');

    let hasFilter = false;
    if (adminId) { query = query.where('adminId', '==', adminId); hasFilter = true; }
    if (action) { query = query.where('action', '==', action); hasFilter = true; }
    if (targetType) { query = query.where('targetType', '==', targetType); hasFilter = true; }

    // Only apply orderBy if no filters are present, otherwise Firestore requires composite indexes
    if (!hasFilter) {
      query = query.orderBy('createdAt', 'desc');
    }

    if (cursor) {
      const cursorDoc = await db.collection('adminLogs').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.limit(limit + 1).get();
    const logs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const hasMore = logs.length > limit;
    if (hasMore) logs.pop();
    const nextCursor = hasMore ? logs[logs.length - 1]?.id : null;

    return NextResponse.json({ logs, nextCursor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
