import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    const db = getAdminDb();
    await db.collection('savedSafetyChecks').doc(id).delete();
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
