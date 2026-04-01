import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

async function getSessionUser(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionMatch = cookieHeader.match(/session=([^;]+)/);
  const sessionCookie = sessionMatch ? sessionMatch[1] : null;
  if (!sessionCookie) return null;
  const adminAuth = getAdminAuth();
  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
  return decodedToken;
}

export async function GET(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    const { searchParams } = new URL(request.url);
    const before = searchParams.get('before');
    const limit = parseInt(searchParams.get('limit') || '30');
    
    const db = getAdminDb();
    let q: any = db.collection('conversations').doc(conversationId).collection('messages').orderBy('createdAt', 'desc').limit(limit);
    
    if (before) {
      const beforeDoc = await db.collection('conversations').doc(conversationId).collection('messages').doc(before).get();
      if (beforeDoc.exists) q = q.startAfter(beforeDoc);
    }
    
    const snapshot = await q.get();
    const messages = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    
    // Clear unread count on visit
    await db.collection('conversations').doc(conversationId).update({ [`unread.${user.uid}`]: 0 });

    return NextResponse.json({ messages, hasMore: messages.length === limit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const user = await getSessionUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { conversationId } = params;
    const { type, content } = await request.json();
    const db = getAdminDb();
    const admin = require('firebase-admin');

    const convRef = db.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    if (!convDoc.exists) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    const convData = convDoc.data() || {};

    // Check if sender is verified
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;
    if (!userData?.isVerified) {
      return NextResponse.json({ 
        error: 'Account not verified. You can only send messages once an admin approves your profile.' 
      }, { status: 403 });
    }

    // Check if trip is deleted and requires re-acceptance
    if (convData.status === 'post_trip') {
      // Find who is the creator (the one who can accept)
      // Usually the one who has the 'admin' power here is the trip creator.
      // For now, let's assume tripCreatorId was stored or check trip back.
      const tripRef = db.collection('trips').doc(convData.tripId);
      const tripDoc = await tripRef.get();
      const tripData = tripDoc.data();
      
      // If user is NOT the creator, they can only send a "request to resume"
      if (tripData?.creatorId !== user.uid) {
        // Here we could block and ask to accept, or just mark as a request
        return NextResponse.json({ 
          error: 'The trip has been deleted or completed. You need to wait for the creator to accept your new chat request.', 
          requiresAcceptance: true 
        }, { status: 403 });
      }
    }

    // Add message
    const docRef = await convRef.collection('messages').add({
      type,
      content,
      senderId: user.uid,
      senderName: user.name || 'User',
      senderPhoto: user.picture || '',
      readBy: [],
      createdAt: new Date(),
    });

    // Handle Tagging (@name)
    const mentions = content.match(/@(\w+)/g);
    if (mentions) {
      for (const mention of mentions) {
        const nameToFind = mention.substring(1).toLowerCase();
        // Find participant with this name
        const taggedId = Object.keys(convData.participants || {}).find(pid => 
          convData.participants[pid].name.toLowerCase().replace(/\s+/g, '') === nameToFind
        );

        if (taggedId && taggedId !== user.uid) {
          await db.collection('notifications').add({
            userId: taggedId,
            type: 'mention',
            title: 'You were mentioned!',
            message: `${user.name || 'User'} tagged you in ${convData.tripTitle || 'a chat'}`,
            conversationId,
            senderId: user.uid,
            senderName: user.name || 'User',
            createdAt: new Date(),
            read: false
          });
        }
      }
    }

    // Restore visibility and update unread count for ALL participants except sender
    const updatePayload: any = {
      lastMessage: content,
      lastMessageAt: new Date(),
      deletedBy: [], 
      updatedAt: new Date(),
      status: 'active'
    };

    // Increment unread for all others in group
    (convData.participantIds || []).forEach((pid: string) => {
      if (pid !== user.uid) {
        updatePayload[`unread.${pid}`] = admin.firestore.FieldValue.increment(1);
      }
    });

    await convRef.update(updatePayload);

    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    console.error('MSG POST Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
