import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

async function getSessionUid(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/session=([^;]+)/);
  const sessionCookie = sessionMatch ? sessionMatch[1] : null;
  if (!sessionCookie) return null;
  const adminAuth = getAdminAuth();
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
  return decodedToken.uid;
}

export async function PATCH(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const uid = await getSessionUid(request);
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    const db = getAdminDb();
    
    // Clear unread count for this user
    await db.collection('conversations').doc(conversationId).update({
      [`unread.${uid}`]: 0,
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const uid = await getSessionUid(request);
    if (!uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    const db = getAdminDb();
    const admin = require('firebase-admin');

    // Add current user to deletedBy array so it's hidden from their list
    await db.collection('conversations').doc(conversationId).update({
      deletedBy: admin.firestore.FieldValue.arrayUnion(uid)
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
