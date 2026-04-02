import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/firebase/session';

async function getUserName(db: any, userId: string): Promise<string> {
  if (!userId) return 'Unknown';
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      return data?.displayName || data?.email || userId.slice(0, 8);
    }
  } catch (e) {}
  return userId.slice(0, 8);
}

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;

    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType');
    const limit = parseInt(searchParams.get('limit') || '50');

    const db = getAdminDb();
    let query: any = db.collection('adminLogs');

    if (targetType) query = query.where('targetType', '==', targetType);
    query = query.orderBy('createdAt', 'desc').limit(limit);

    const snapshot = await query.get();
    let logs = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    // Get admin names and target names
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      
      // Get admin name
      const adminName = await getUserName(db, log.adminId);
      log.adminDisplayName = adminName;
      
      // Get target name based on type
      let targetId = log.targetId || log.userId || log.reportId || log.tripId || log.id;
      let targetName = 'Unknown';
      
      // Also check for userId directly in case it's a user target
      const directUserId = log.userId || log.targetId;
      
      if (targetId) {
        // For user-related actions, always try to get user name
        if (log.targetType === 'user' || log.action?.includes('user')) {
          targetName = await getUserName(db, directUserId || targetId);
        } else if (log.targetType === 'sos') {
          // For SOS, fetch from reports collection (since SOS are stored as type='sos' in reports)
          try {
            const sosDoc = await db.collection('reports').doc(targetId).get();
            if (sosDoc.exists) {
              const sosData = sosDoc.data();
              const userIdFromSos = sosData?.userId || sosData?.reporterId;
              if (userIdFromSos) {
                targetName = await getUserName(db, userIdFromSos);
              } else {
                targetName = 'SOS Alert';
              }
            } else {
              targetName = 'SOS Alert';
            }
          } catch (e) {
            targetName = 'SOS Alert';
          }
        } else if (log.targetType === 'report') {
          // For reports, fetch the report to get the user who made/is the subject of the report
          try {
            const reportDoc = await db.collection('reports').doc(targetId).get();
            if (reportDoc.exists) {
              const reportData = reportDoc.data();
              const userIdFromReport = reportData?.userId || reportData?.reporterId;
              if (userIdFromReport) {
                targetName = await getUserName(db, userIdFromReport);
              } else {
                targetName = 'Report';
              }
            } else {
              targetName = 'Report';
            }
          } catch (e) {
            targetName = 'Report';
          }
        } else if (log.targetType === 'trip') {
          targetName = 'Trip';
        } else if (log.targetType === 'feedback') {
          targetName = 'Feedback';
        } else {
          targetName = targetId.slice(0, 8);
        }
      }
      log.targetDisplayName = targetName;
    }

    return NextResponse.json({ logs, nextCursor: null });
  } catch (error: any) {
    console.error('Admin logs GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
