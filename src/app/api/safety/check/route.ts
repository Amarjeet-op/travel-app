import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const { area, city, travelerType, timeOfVisit, concerns } = await request.json();

    if (!area || !city || !travelerType || !timeOfVisit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { verifySessionFromRequest } = await import('@/lib/firebase/session');
    const session = await verifySessionFromRequest(request);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = getAdminDb();
    
    // Check if user is verified
    const userDoc = await db.collection('users').doc(session.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    if (!userData?.isVerified) {
      return NextResponse.json({ 
        error: 'Account not verified. AI Safety analysis is restricted to verified users.' 
      }, { status: 403 });
    }

    const cacheRef = db.collection('safetyCache');
    const cachedSnapshot = await cacheRef
      .where('city', '==', city.toLowerCase())
      .where('area', '==', area.toLowerCase())
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (!cachedSnapshot.empty) {
      const cachedDoc = cachedSnapshot.docs[0];
      const cachedData = cachedDoc.data();
      const expiresAt = cachedData.expiresAt?.toDate?.() || new Date(0);
      if (new Date() < expiresAt) {
        return NextResponse.json({ ...cachedData.result, cached: true });
      }
    }

    const { checkSafety } = await import('@/lib/gemini/safety-checker');
    const result = await checkSafety({ area, city, travelerType, timeOfVisit, concerns });

    await db.collection('safetyCache').add({
      city: city.toLowerCase(),
      area: area.toLowerCase(),
      travelerType,
      timeOfVisit,
      result,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return NextResponse.json({ ...result, cached: false });
  } catch (error: any) {
    console.error('Safety check error (Full Details):', {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }, 
      { status: 500 }
    );
  }
}
