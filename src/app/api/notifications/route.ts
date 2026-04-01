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
    let query = db.collection('notifications').where('userId', '==', uid);
    
    // Sort by createdAt only if we're sure the index exists
    // query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.limit(50).get();

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Client-side sort if index isn't ready
    notifications.sort((a: any, b: any) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

    const unreadCount = notifications.filter((n: any) => !n.read).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    console.error('NOTIF GET ERR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
    try {
      const cookieHeader = request.headers.get('cookie') || '';
      const sessionMatch = cookieHeader.match(/session=([^;]+)/);
      const sessionCookie = sessionMatch ? sessionMatch[1] : null;
      if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
      const adminAuth = getAdminAuth();
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
      const uid = decodedToken.uid;
  
      const { notificationId } = await request.json();
      const db = getAdminDb();
      
      if (notificationId) {
        await db.collection('notifications').doc(notificationId).update({ read: true });
      } else {
        // Mark all as read
        const snapshot = await db.collection('notifications')
          .where('userId', '==', uid)
          .where('read', '==', false)
          .get();
        
        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.update(doc.ref, { read: true }));
        await batch.commit();
      }
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
