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
    const convsRef = db.collection('conversations');
    
    // Fetch all conversations where user is a participant
    const snapshot = await convsRef
      .where('participantIds', 'array-contains', uid)
      .orderBy('lastMessageAt', 'desc')
      .get();

    const conversations = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (data.deletedBy?.includes(uid)) return null;

        let otherInfo: any = {};
        let otherId: string | null = null;
        
        if (data.isGroup) {
          // For group chat, we can summarize other participants
          const others = data.participantIds.filter((id: string) => id !== uid);
          otherId = others[0] || null; // Just for fallback
          otherInfo = {
            name: `${data.tripTitle} (Group)`,
            photo: '', // Group icon logic could go here
            isGroup: true,
            totalParticipants: data.participantIds.length
          };
        } else {
          // For 1-on-1, keep specific info
          otherId = data.participantIds.find((id: string) => id !== uid);
          otherInfo = data.participants?.[otherId!] || { name: 'User', photo: '' };
        }

        return {
          id: doc.id,
          ...data,
          otherParticipant: {
            id: otherId,
            ...otherInfo
          }
        };
      })
      .filter(Boolean);

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('CONV GET Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
