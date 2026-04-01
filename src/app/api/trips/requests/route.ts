import { NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth } from '@/lib/firebase/admin';

export async function PATCH(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const sessionMatch = cookieHeader.match(/session=([^;]+)/);
    const sessionCookie = sessionMatch ? sessionMatch[1] : null;
    if (!sessionCookie) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminAuth = getAdminAuth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedToken.uid;

    const { requestId, action } = await request.json();
    const db = getAdminDb();

    const reqDoc = await db.collection('tripRequests').doc(requestId).get();
    if (!reqDoc.exists) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    const reqData = reqDoc.data();

    // Verify user is the trip creator
    if (reqData?.tripCreatorId !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const updates: any = {
      status: action === 'accept' ? 'accepted' : 'rejected',
      updatedAt: new Date(),
    };
    await db.collection('tripRequests').doc(requestId).update(updates);

    // If accepted, update trip companion count AND create a conversation
    if (action === 'accept' && reqData?.tripId) {
      const tripRef = db.collection('trips').doc(reqData.tripId);
      const tripDoc = await tripRef.get();
      if (tripDoc.exists) {
        const tripData = tripDoc.data();
        const currentCount = tripData?.currentCompanions || 0;
        const maxCompanions = tripData?.maxCompanions || 0;
        
        // Check if trip is already full
        if (currentCount >= maxCompanions) {
          return NextResponse.json({ error: 'Trip is already full' }, { status: 400 });
        }
        
        await tripRef.update({ currentCompanions: currentCount + 1 });
      }

      // Group Chat Logic: One conversation per trip
      const convsRef = db.collection('conversations');
      const groupConvQuery = await convsRef
        .where('tripId', '==', reqData.tripId)
        .where('isGroup', '==', true)
        .limit(1)
        .get();

      const admin = require('firebase-admin');

      if (groupConvQuery.empty) {
        // Create new group chat for this trip
        await convsRef.add({
          isGroup: true,
          tripId: reqData.tripId,
          tripTitle: reqData.tripTitle,
          participantIds: [uid, reqData.requesterId],
          participants: {
            [uid]: { name: decodedToken.name || 'Creator', photo: decodedToken.picture || '' },
            [reqData.requesterId]: { name: reqData.requesterName || 'Traveler', photo: reqData.requesterPhoto || '' }
          },
          lastMessage: "Welcome to the group chat!",
          lastMessageAt: new Date(),
          deletedBy: [],
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          unread: {
            [uid]: 0,
            [reqData.requesterId]: 1 // Newly joined user gets a welcome message
          }
        });
      } else {
        // Add user to existing group chat
        const convDoc = groupConvQuery.docs[0];
        await convDoc.ref.update({
          participantIds: admin.firestore.FieldValue.arrayUnion(reqData.requesterId),
          [`participants.${reqData.requesterId}`]: { 
            name: reqData.requesterName || 'Traveler', 
            photo: reqData.requesterPhoto || '' 
          },
          lastMessage: `${reqData.requesterName} joined the group!`,
          lastMessageAt: new Date(),
          deletedBy: [], // Restore for everyone if it was hidden
          status: 'active',
          updatedAt: new Date()
        });

        // Add a system message to the chat
        await convDoc.ref.collection('messages').add({
          type: 'system',
          content: `${reqData.requesterName} has joined the chat!`,
          senderId: 'system',
          senderName: 'System',
          createdAt: new Date(),
        });
      }
    }

    // Notify the requester
    if (reqData) {
      await db.collection('notifications').add({
        userId: reqData.requesterId,
        type: action === 'accept' ? 'trip_update' : 'system',
        title: action === 'accept' ? 'Request Accepted!' : 'Request Declined',
        body: action === 'accept'
          ? `You've been accepted to join ${reqData.tripTitle}. You can now chat with your companions!`
          : `Your request to join ${reqData.tripTitle} was declined.`,
        tripId: reqData.tripId,
        requestId,
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Request PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
