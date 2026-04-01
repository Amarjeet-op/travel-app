import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession, getAdminIdentity, createAdminLog } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor');

    const db = getAdminDb();
    let query: any = db.collection('feedback');

    let hasFilter = false;
    if (category) { query = query.where('category', '==', category); hasFilter = true; }
    if (status) { query = query.where('status', '==', status); hasFilter = true; }

    // Only apply orderBy if no filters are present, otherwise Firestore requires composite indexes
    if (!hasFilter) {
      query = query.orderBy('createdAt', 'desc');
    }

    if (cursor) {
      const cursorDoc = await db.collection('feedback').doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }

    const snapshot = await query.limit(limit + 1).get();
    const feedback = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    const hasMore = feedback.length > limit;
    if (hasMore) feedback.pop();
    const nextCursor = hasMore ? feedback[feedback.length - 1]?.id : null;

    return NextResponse.json({ feedback, nextCursor });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const session = sessionResult;
    const { feedbackId, status, notes } = await request.json();
    const db = getAdminDb();
    await db.collection('feedback').doc(feedbackId).update({
      status,
      adminNotes: notes,
      updatedAt: new Date(),
    });

    const adminIdentity = await getAdminIdentity(session);
    await createAdminLog(adminIdentity, 'review_feedback', 'feedback', feedbackId, notes || `Marked as ${status}`);

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
