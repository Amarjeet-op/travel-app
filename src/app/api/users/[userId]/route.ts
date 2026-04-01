import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const db = getAdminDb();
    if (userId) {
      const doc = await db.collection('users').doc(userId).get();
      if (!doc.exists) return NextResponse.json({ error: 'User not found' }, { status: 404 });
      const { email, phone, emergencyContacts, ...publicData } = doc.data() || {};
      return NextResponse.json({ id: doc.id, ...publicData });
    }
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
