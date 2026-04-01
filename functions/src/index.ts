import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

// Auth trigger: Create user document on signup
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  await db.collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || null,
    gender: 'prefer-not-to-say',
    age: 0,
    phone: '',
    homeCity: '',
    bio: '',
    emergencyContacts: [],
    role: 'user',
    isVerified: false,
    isOnline: false,
    lastSeen: null,
    profileCompleted: false,
    tripsPosted: 0,
    tripsJoined: 0,
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Auth trigger: Clean up on user delete
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const batch = db.batch();
  batch.delete(db.collection('users').doc(user.uid));

  const trips = await db.collection('trips').where('createdBy', '==', user.uid).get();
  trips.forEach((doc) => batch.update(doc.ref, { status: 'cancelled' }));

  await batch.commit();
});

// Firestore trigger: Notify on trip request
export const onTripRequestCreate = functions.firestore
  .document('tripRequests/{requestId}')
  .onCreate(async (snap) => {
    const data = snap.data();
    await db.collection('notifications').add({
      userId: data.tripCreatorId,
      type: 'trip_request',
      title: 'New Trip Request',
      body: `${data.requesterName} wants to join your trip to ${data.tripTitle}`,
      link: `/trips/${data.tripId}`,
      read: false,
      data: { tripId: data.tripId, userId: data.requesterId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

// Firestore trigger: Handle trip request updates
export const onTripRequestUpdate = functions.firestore
  .document('tripRequests/{requestId}')
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status !== after.status) {
      if (after.status === 'accepted') {
        const tripDoc = await db.collection('trips').doc(after.tripId).get();
        const trip = tripDoc.data();

        await db.collection('trips').doc(after.tripId).update({
          currentCompanions: admin.firestore.FieldValue.increment(1),
          companions: admin.firestore.FieldValue.arrayUnion(after.requesterId),
        });

        await db.collection('conversations').add({
          participants: [after.tripCreatorId, after.requesterId],
          participantDetails: {
            [after.tripCreatorId]: { name: trip?.creatorName, photoURL: trip?.creatorPhoto },
            [after.requesterId]: { name: after.requesterName, photoURL: after.requesterPhoto },
          },
          tripId: after.tripId,
          tripTitle: after.tripTitle,
          lastMessage: '',
          lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
          lastMessageBy: '',
          unread: { [after.tripCreatorId]: 0, [after.requesterId]: 0 },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'active',
        });

        await db.collection('notifications').add({
          userId: after.requesterId,
          type: 'request_accepted',
          title: 'Request Accepted!',
          body: `Your request to join ${after.tripTitle} has been accepted.`,
          link: `/messages`,
          read: false,
          data: { tripId: after.tripId },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } else if (after.status === 'rejected') {
        await db.collection('notifications').add({
          userId: after.requesterId,
          type: 'request_rejected',
          title: 'Request Declined',
          body: `Your request to join ${after.tripTitle} was declined.`,
          link: `/trips/${after.tripId}`,
          read: false,
          data: { tripId: after.tripId },
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
  });

// Firestore trigger: On message create
export const onMessageCreate = functions.firestore
  .document('conversations/{conversationId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const msg = snap.data();
    const conversationId = context.params.conversationId;

    const convRef = db.collection('conversations').doc(conversationId);
    const convDoc = await convRef.get();
    const conv = convDoc.data();

    if (!conv) return;

    const otherUserId = conv.participants.find((p: string) => p !== msg.senderId);

    await convRef.update({
      lastMessage: msg.content.substring(0, 100),
      lastMessageAt: admin.firestore.FieldValue.serverTimestamp(),
      lastMessageBy: msg.senderId,
      [`unread.${otherUserId}`]: admin.firestore.FieldValue.increment(1),
    });

    await db.collection('notifications').add({
      userId: otherUserId,
      type: 'new_message',
      title: `New message from ${msg.senderName}`,
      body: msg.content.substring(0, 100),
      link: `/messages/${conversationId}`,
      read: false,
      data: { conversationId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

// Firestore trigger: On report create
export const onReportCreate = functions.firestore
  .document('reports/{reportId}')
  .onCreate(async (snap) => {
    const report = snap.data();
    const admins = await db.collection('users').where('role', '==', 'admin').get();

    const batch = db.batch();
    admins.forEach((adminDoc) => {
      const notifRef = db.collection('notifications').doc();
      batch.set(notifRef, {
        userId: adminDoc.id,
        type: 'admin_action',
        title: report.type === 'sos' ? '🚨 SOS Alert' : 'New Safety Report',
        body: report.type === 'sos' ? 'Active SOS incident requires attention' : report.description?.substring(0, 100),
        link: `/admin/reports`,
        read: false,
        data: { reportId: snap.id },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
  });

// Scheduled: Clean up expired trips
export const cleanupExpiredTrips = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const expiredTrips = await db
      .collection('trips')
      .where('status', '==', 'active')
      .where('departureDate', '<', now)
      .get();

    const batch = db.batch();
    expiredTrips.forEach((doc) => {
      batch.update(doc.ref, { status: 'expired' });
    });

    await batch.commit();
    console.log(`Marked ${expiredTrips.size} trips as expired`);
  });

// Scheduled: Clean up safety cache
export const cleanupSafetyCache = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now();
    const expired = await db
      .collection('safetyCache')
      .where('expiresAt', '<', now)
      .get();

    const batch = db.batch();
    expired.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Cleaned up ${expired.size} expired safety cache entries`);
  });
