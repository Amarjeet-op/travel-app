export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { getAdminAuth } from '@/lib/firebase/admin';
import { createNotification } from '@/lib/firebase/notifications';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const db = getAdminDb();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const data = userDoc.data();

    const tripsPostedSnap = await db.collection('trips').where('creatorId', '==', uid).count().get();
    const tripsJoinedSnap = await db.collection('tripRequests').where('requesterId', '==', uid).where('status', '==', 'accepted').count().get();

    return NextResponse.json({
      id: userDoc.id,
      ...data,
      email: decodedToken.email,
      tripsPosted: tripsPostedSnap.data().count,
      tripsJoined: tripsJoinedSnap.data().count,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const data = await request.json();
    const db = getAdminDb();
    
    // Get current user data to check verification status change
    const currentUserDoc = await db.collection('users').doc(uid).get();
    const currentData = currentUserDoc.exists ? currentUserDoc.data() : {};
    const wasVerified = currentData?.isVerified === true;
    const willBeVerified = data.isVerified === true;

    await db.collection('users').doc(uid).set({
      ...data,
      updatedAt: new Date(),
    }, { merge: true });

    // Send verification notification if user just got verified
    if (!wasVerified && willBeVerified) {
      await createNotification(uid, 'account_verified', {
        title: 'Account Verified',
        body: 'Your account has been verified by an admin. You can now use all features!',
        link: '/profile'
      });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
