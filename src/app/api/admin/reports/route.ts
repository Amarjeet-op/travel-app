import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession, getAdminIdentity, createAdminLog } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = getAdminDb();
    let query: any = db.collection('reports');

    const snapshot = await query.limit(500).get();
    let allReports = snapshot.docs.map((doc: any) => ({ 
      id: doc.id, 
      ...doc.data() 
    }));

    // In-memory Filter
    let filteredReports = allReports.filter((r: any) => {
      let matches = true;
      if (type && r.type !== type) matches = false;
      if (status && r.status !== status) matches = false;
      if (priority && r.priority !== priority) matches = false;
      return matches;
    });

    // Sort by createdAt desc
    filteredReports.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    const paginatedReports = filteredReports.slice(0, limit);
    const hasMore = filteredReports.length > limit;
    const nextCursor = hasMore ? paginatedReports[paginatedReports.length - 1].id : null;

    return NextResponse.json({ reports: paginatedReports, nextCursor });
  } catch (error: any) {
    console.error('Admin reports GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const session = sessionResult;
    const { reportId, action, notes } = await request.json();
    const db = getAdminDb();
    const updates: any = { updatedAt: new Date() };

    switch (action) {
      case 'assign':
        updates.assignedTo = session.uid;
        updates.status = 'investigating';
        break;
      case 'investigate':
        updates.status = 'investigating';
        break;
      case 'resolve':
        updates.status = 'resolved';
        updates.resolvedAt = new Date();
        updates.adminNotes = notes;
        break;
      case 'dismiss':
        updates.status = 'dismissed';
        updates.adminNotes = notes;
        break;
    }

    await db.collection('reports').doc(reportId).update(updates);

    const adminIdentity = await getAdminIdentity(session);
    const actionLogMap: Record<string, string> = {
      assign: 'assign_report',
      investigate: 'investigate_report',
      resolve: 'resolve_report',
      dismiss: 'dismiss_report',
    };
    await createAdminLog(adminIdentity, actionLogMap[action] || action, 'report', reportId, notes || `Admin action: ${action}`);

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
