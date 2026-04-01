import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: Request) {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection('savedSafetyChecks').orderBy('savedAt', 'desc').get();
    const checks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ checks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const db = getAdminDb();
    const docRef = await db.collection('savedSafetyChecks').add({ ...data, savedAt: new Date() });
    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
