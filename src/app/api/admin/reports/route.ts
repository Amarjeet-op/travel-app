import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';
import { requireAdminSession, getAdminIdentity, createAdminLog } from '@/lib/firebase/session';

async function getUserDetails(userId: string, db: any) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) return null;
    const userData = userDoc.data();
    return {
      userId: userId,
      userName: userData?.displayName || 'Unknown',
      userEmail: userData?.email || '',
      userPhone: userData?.phone || '',
      emergencyContactName: userData?.emergencyContactName || userData?.emergencyContacts?.[0]?.name || '',
      emergencyContactPhone: userData?.emergencyContactPhone || userData?.emergencyContacts?.[0]?.phone || '',
      emergencyContactRelation: userData?.emergencyContactRelation || userData?.emergencyContactRelationship || userData?.emergencyContacts?.[0]?.relationship || '',
    };
  } catch (e) {
    console.error('Error fetching user details:', e);
    return null;
  }
}

async function createNotification(db: any, userId: string, type: string, title: string, message: string, reportId: string) {
  try {
    await db.collection('notifications').add({
      userId: userId,
      type: type,
      title: title,
      message: message,
      reportId: reportId,
      read: false,
      createdAt: new Date(),
    });
    console.log('Notification created for user:', userId);
  } catch (e) {
    console.error('Error creating notification:', e);
  }
}

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

    // Fetch user details for each report
    for (let report of allReports) {
      const targetUserId = report.userId || report.reporterId;
      if (targetUserId) {
        const userDetails = await getUserDetails(targetUserId, db);
        if (userDetails) {
          report.userName = userDetails.userName;
          report.userEmail = userDetails.userEmail;
          report.userPhone = userDetails.userPhone;
          report.emergencyContactName = userDetails.emergencyContactName;
          report.emergencyContactPhone = userDetails.emergencyContactPhone;
          report.emergencyContactRelation = userDetails.emergencyContactRelation;
        }
      }
    }

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
        const reportDoc = await db.collection('reports').doc(reportId).get();
        const reportData = reportDoc.data();
        const targetUserId = reportData?.userId || reportData?.reporterId;
        if (targetUserId) {
          await createNotification(db, targetUserId, 'investigation_started', 'SOS Investigation Started', 'Your SOS alert is being investigated by our team. We will update you shortly.', reportId);
        }
        break;
      case 'resolve':
        updates.status = 'resolved';
        updates.resolvedAt = new Date();
        updates.adminNotes = notes;
        const resolveReportDoc = await db.collection('reports').doc(reportId).get();
        const resolveReportData = resolveReportDoc.data();
        const resolveUserId = resolveReportData?.userId || resolveReportData?.reporterId;
        if (resolveUserId) {
          await createNotification(db, resolveUserId, 'sos_resolved', 'SOS Alert Resolved', 'Your SOS alert has been resolved. We are glad you are safe.', reportId);
        }
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
