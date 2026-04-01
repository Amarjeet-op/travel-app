import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifySessionFromRequest } from '@/lib/firebase/session';

export async function POST(request: Request) {
  try {
    const session = await verifySessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
    }

    const { type, reportedUserId, description, evidenceURLs, isAnonymous, location } = await request.json();
    const db = getAdminDb();

    // Fetch user profile for reporter info
    const userDoc = await db.collection('users').doc(session.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // If reporting another user, fetch their info
    let reportedUserName = null;
    if (reportedUserId) {
      const reportedUserDoc = await db.collection('users').doc(reportedUserId).get();
      if (reportedUserDoc.exists) {
        reportedUserName = reportedUserDoc.data()?.displayName || 'Unknown';
      }
    }

    const docRef = await db.collection('reports').add({
      type: type || 'report',
      reporterId: isAnonymous ? null : session.uid,
      reporterName: isAnonymous ? 'Anonymous' : (userData?.displayName || 'Unknown'),
      reporterEmail: isAnonymous ? null : session.email,
      reportedUserId: reportedUserId || null,
      reportedUserName,
      description,
      evidenceURLs: evidenceURLs || [],
      isAnonymous: isAnonymous || false,
      location: location || null,
      status: 'pending',
      priority: 'normal',
      adminNotes: null,
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
    });
    return NextResponse.json({ status: 'success', reportId: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
