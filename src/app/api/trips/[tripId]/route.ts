import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';

export async function GET(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const db = getAdminDb();
    const tripDoc = await db.collection('trips').doc(params.tripId).get();
    if (!tripDoc.exists) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ id: tripDoc.id, ...tripDoc.data() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const data = await request.json();
    const db = getAdminDb();
    await db.collection('trips').doc(params.tripId).update({
      ...data,
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { tripId: string } }) {
  try {
    const db = getAdminDb();
    const tripId = params.tripId;
    
    // Soft delete trip
    await db.collection('trips').doc(tripId).update({
      status: 'deleted',
      updatedAt: new Date(),
    });

    // Update all associated conversations to post-trip status
    const convsSnap = await db.collection('conversations').where('tripId', '==', tripId).get();
    const batch = db.batch();
    convsSnap.docs.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'post_trip',
        updatedAt: new Date()
      });
    });
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
