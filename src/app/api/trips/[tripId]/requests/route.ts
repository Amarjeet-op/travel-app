import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');
    const status = searchParams.get('status');
    const db = getAdminDb();
    let q: any = db.collection('tripRequests').where('tripId', '==', tripId);
    if (status) q = q.where('status', '==', status);
    const snapshot = await q.orderBy('createdAt', 'desc').get();
    const requests = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { tripId: string } }) {
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
    const tripDoc = await db.collection('trips').doc(params.tripId).get();
    if (!tripDoc.exists) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    const trip = tripDoc.data();

    // Check if trip is already full
    if (trip!.currentCompanions >= trip!.maxCompanions) {
      return NextResponse.json({ error: 'Trip is already full' }, { status: 400 });
    }

    if (trip!.creatorId === uid) {
      return NextResponse.json({ error: 'You cannot join your own trip' }, { status: 400 });
    }

    // Check if user already has a pending request for this trip
    const existingRequestSnap = await db.collection('tripRequests')
      .where('tripId', '==', params.tripId)
      .where('requesterId', '==', uid)
      .where('status', '==', 'pending')
      .get();
    
    if (!existingRequestSnap.empty) {
      return NextResponse.json({ error: 'You have already requested to join this trip' }, { status: 400 });
    }

    const userDoc = await db.collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // Check if user is verified
    if (!userData?.isVerified) {
      return NextResponse.json({ 
        error: 'Account not verified. Please wait for admin approval to join trips.' 
      }, { status: 403 });
    }

    const { message } = await request.json();
    const docRef = await db.collection('tripRequests').add({
      tripId: params.tripId,
      tripTitle: `${trip!.fromCity} → ${trip!.toCity}`,
      requesterId: uid,
      requesterName: userData?.displayName || userData?.name || 'User',
      requesterPhoto: userData?.photoURL || userData?.photo || '',
      tripCreatorId: trip!.creatorId || trip!.createdBy || uid,
      message: message || '',
      status: 'pending',
      rejectionReason: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create notification for trip creator
    const creatorId = trip!.creatorId || trip!.createdBy;
    if (creatorId && creatorId !== uid) {
      await db.collection('notifications').add({
        userId: creatorId,
        type: 'trip_request',
        title: 'New Join Request',
        body: `${userData?.displayName || 'Someone'} wants to join your trip ${trip!.fromCity} → ${trip!.toCity}`,
        tripId: params.tripId,
        requestId: docRef.id,
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    console.error('Trip request error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create request' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { tripId, requestId, action, reason } = await request.json();
    const db = getAdminDb();
    
    // Check current status
    const reqDoc = await db.collection('tripRequests').doc(requestId).get();
    if (!reqDoc.exists) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    const reqData = reqDoc.data();
    
    if (reqData!.status !== 'pending') {
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    const updates: any = { status: action === 'accept' ? 'accepted' : 'rejected', updatedAt: new Date() };
    if (reason) updates.rejectionReason = reason;
    await db.collection('tripRequests').doc(requestId).update(updates);

    if (action === 'accept') {
      // Increment trip companions
      const tripRef = db.collection('trips').doc(tripId);
      const tripDoc = await tripRef.get();
      if (tripDoc.exists) {
        const tripData = tripDoc.data();
        await tripRef.update({
          currentCompanions: (tripData?.currentCompanions || 0) + 1
        });
      }
    }

    // Notify the requester
    if (reqData) {
      await db.collection('notifications').add({
        userId: reqData.requesterId,
        type: action === 'accept' ? 'trip_update' : 'system',
        title: action === 'accept' ? 'Request Accepted!' : 'Request Declined',
        body: action === 'accept'
          ? `You've been accepted to join ${reqData.tripTitle}. You can now chat with your companions!`
          : `Your request to join ${reqData.tripTitle} was declined.${reason ? ` Reason: ${reason}` : ''}`,
        tripId: reqData.tripId,
        requestId,
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
