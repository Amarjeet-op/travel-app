import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifySessionFromRequest } from '@/lib/firebase/session';

export async function POST(request: Request) {
  try {
    const session = await verifySessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
    }

    const { location } = await request.json();
    const db = getAdminDb();

    // Fetch user profile for reporter info
    const userDoc = await db.collection('users').doc(session.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    const reportData: any = {
      type: 'sos',
      userId: session.uid,
      reporterId: session.uid,
      reporterName: userData?.displayName || 'Unknown',
      reporterEmail: session.email,
      userPhone: userData?.phone || userData?.emergencyContactPhone || '',
      emergencyContactName: userData?.emergencyContactName || userData?.emergencyContacts?.[0]?.name || '',
      emergencyContactPhone: userData?.emergencyContactPhone || userData?.emergencyContacts?.[0]?.phone || '',
      emergencyContactRelation: userData?.emergencyContactRelationship || userData?.emergencyContacts?.[0]?.relationship || '',
      reportedUserId: null,
      reportedUserName: null,
      description: 'SOS alert triggered',
      location: location || null,
      evidenceURLs: [],
      isAnonymous: false,
      priority: 'urgent',
      status: 'pending',
      adminNotes: null,
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      resolvedAt: null,
    };

    const reportRef = await db.collection('reports').add(reportData);

    return NextResponse.json({ status: 'success', reportId: reportRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { reportId } = await request.json();
    const db = getAdminDb();
    await db.collection('reports').doc(reportId).update({
      status: 'resolved',
      resolvedAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
