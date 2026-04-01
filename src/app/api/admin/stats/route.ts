import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { requireAdminSession } from '@/lib/firebase/session';

export async function GET(request: Request) {
  try {
    const sessionResult = await requireAdminSession(request);
    if ('error' in sessionResult) return sessionResult.error;
    const db = getAdminDb();
    const usersSnap = await db.collection('users').get();
    const allUsers = usersSnap.docs.map(d => d.data());
    const totalUsers = allUsers.length;
    const pendingVerifications = allUsers.filter(u => !u.isVerified).length;
    const tripsSnap = await db.collection('trips').where('status', '==', 'active').count().get();
    const sosSnap = await db.collection('reports').where('type', '==', 'sos').where('status', '==', 'pending').count().get();
    const reportsSnap = await db.collection('reports').where('type', '==', 'report').where('status', '==', 'pending').count().get();
    const feedbackSnap = await db.collection('feedback').where('status', '==', 'new').count().get();

    return NextResponse.json({
      totalUsers,
      pendingVerifications,
      activeTrips: tripsSnap.data().count,
      activeSOSAlerts: sosSnap.data().count,
      pendingReports: reportsSnap.data().count,
      unreadFeedback: feedbackSnap.data().count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
