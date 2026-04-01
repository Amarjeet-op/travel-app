import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const db = getAdminDb();
    const tripsRef = db.collection('trips');
    const snapshot = await tripsRef.orderBy('departureDate', 'asc').limit(12).get();
    const trips = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ trips });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const userData = userDoc.exists ? userDoc.data() : null;

    // Check if user is verified
    if (!userData?.isVerified) {
      return NextResponse.json({ 
        error: 'Account not verified. Please wait for admin approval to create trips.' 
      }, { status: 403 });
    }

    const data = await request.json();
    const docRef = await db.collection('trips').add({
      ...data,
      creatorId: uid,
      creatorName: userData?.displayName || userData?.name || 'Unknown',
      creatorPhoto: userData?.photoURL || userData?.photo || '',
      creatorVerified: userData?.verified || false,
      currentCompanions: 1,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
