import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { verifySessionFromRequest } from '@/lib/firebase/session';

export async function POST(request: Request) {
  try {
    const session = await verifySessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ status: 'error', code: 'UNAUTHORIZED', message: 'Not authenticated' }, { status: 401 });
    }

    const { category, message, rating } = await request.json();
    const db = getAdminDb();

    // Fetch user profile for user info
    const userDoc = await db.collection('users').doc(session.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    await db.collection('feedback').add({
      userId: session.uid,
      userName: userData?.displayName || 'Unknown',
      userEmail: session.email,
      category: category || 'general',
      message,
      rating: rating || null,
      status: 'new',
      adminNotes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
