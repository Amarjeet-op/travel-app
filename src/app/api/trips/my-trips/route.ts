import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const db = getAdminDb();
    const now = new Date();

    // Posted trips
    const postedSnap = await db.collection('trips').where('creatorId', '==', uid).get();
    const posted = postedSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));

    // Requests I SENT to others
    const mySentReqSnap = await db.collection('tripRequests').where('requesterId', '==', uid).get();
    const mySentRequests = mySentReqSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));

    // Requests RECEIVED for my trips
    const receivedReqSnap = await db.collection('tripRequests').where('tripCreatorId', '==', uid).get();
    const receivedRequests = receivedReqSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));

    // Pending requests are those RECEIVED that need action
    const pendingRequests = receivedRequests.filter((r: any) => r.status === 'pending');
    
    // Rejected requests (I sent that were rejected)
    const rejectedRequests = mySentRequests.filter((r: any) => r.status === 'rejected');

    // Accepted requests = trips I joined
    const joinedRequests = mySentRequests.filter((r: any) => r.status === 'accepted');

    // Past trips (I posted, departure date in the past, not cancelled)
    const pastTrips = posted.filter((t: any) => {
      const depDate = t.departureDate?.toDate ? t.departureDate.toDate() : new Date(t.departureDate);
      return depDate < now && t.status !== 'cancelled';
    });

    // Active trips (I posted, departure date in the future, status active)
    const activeTrips = posted.filter((t: any) => {
      const depDate = t.departureDate?.toDate ? t.departureDate.toDate() : new Date(t.departureDate);
      return depDate >= now && t.status === 'active';
    });

    // Fetch trip details for joined trips (only if not cancelled)
    const joined: any[] = [];
    for (const req of joinedRequests) {
      const tripDoc = await db.collection('trips').doc(req.tripId).get();
      const tripData = tripDoc.data();
      if (tripDoc.exists && tripData) {
        if (tripData.status !== 'cancelled' && tripData.status !== 'deleted') {
          joined.push({ id: tripDoc.id, ...tripData, requestStatus: req.status, requestId: req.id });
        }
      }
    }

    return NextResponse.json({
      posted,
      activeTrips,
      pastTrips,
      pendingRequests, // Received for my trips
      rejectedRequests, // My sent requests that were rejected
      joined, // Trips I am joining
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
